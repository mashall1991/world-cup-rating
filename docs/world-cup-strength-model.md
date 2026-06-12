# World Cup Strength Model Specification

This document specifies how to calculate **World Cup Competitive Strength** for a dated **Tournament Squad Version**.

## Scope

The model evaluates team strength, not draw luck or advancement probability. **Tournament Path Difficulty** is calculated separately when group, bracket, travel, rest, and opponent sequence need to be considered.

The model does not allow manual expert score overrides. All scores must come from defined dimensions, dated inputs, and reproducible adjustment rules.

## Output

Each evaluated team produces:

- Final score from 0-100
- Strength Tier
- Rank among evaluated teams
- Base Strength Score before adjustments
- Squad Balance Adjustment
- Availability Adjustment
- Tournament Squad Version date and status

## Strength Tiers

| Score | Tier |
| --- | --- |
| 90-100 | Champion favorite |
| 80-89 | Semifinal contender |
| 70-79 | Quarterfinal or dark-horse zone |
| 60-69 | Group qualification contender |
| 50-59 | Group-stage underdog |
| Below 50 | Clear underdog |

## Top-Level Formula

All top-level dimensions are normalized to 0-100 before weighting.

```text
Base Strength Score =
  Squad Quality * 0.45 +
  Recent Match Rating * 0.30 +
  Positional Balance * 0.10 +
  Squad Depth * 0.08 +
  Cohesion Continuity * 0.04 +
  Age / Tournament Load * 0.03

Balanced Score = Base Strength Score

Final Score = Balanced Score * Availability Adjustment
```

The app stores these as configurable relative coefficients. The default coefficient set totals 100, but user-entered coefficients are normalized by their current total before calculating Base Strength Score.

The app also applies a **Tournament Stage Load** multiplier to the Age / Tournament Load coefficient. This reflects the expanded World Cup route: age and recovery matter modestly in the group stage, then matter more as teams accumulate matches and recovery windows tighten.

## Top-Level Coefficients

| Component | Default coefficient |
| --- | ---: |
| Squad Quality | 45% |
| Recent Match Rating | 30% |
| Positional Balance | 10% |
| Squad Depth | 8% |
| Cohesion Continuity | 4% |
| Age / Tournament Load | 3% |

Rationale: Squad Quality remains the most stable player-quality signal, so it carries the largest coefficient. Recent Match Rating is the direct team-level calibration signal and is weighted above proxy-only dimensions. Positional Balance and Squad Depth catch structural squad risks that an average player-quality score can hide. Cohesion Continuity is intentionally low while the current build uses caps and club/league pair proxies instead of real shared-minute data. Age / Tournament Load is kept meaningful but low because age effects are partly absorbed by Club Role Stability and tournament availability.

### Tournament Stage Load

The selected tournament stage converts the user-entered coefficients into effective coefficients. Age / Tournament Load is multiplied by the selected stage multiplier, capped at 16% of the coefficient total, and the increase is taken proportionally from the other components so the total stays stable.

| Stage | Age coefficient multiplier |
| --- | ---: |
| Group stage | 1.00 |
| Round of 32 | 1.35 |
| Round of 16 | 1.70 |
| Quarterfinal | 2.05 |
| Semifinal | 2.40 |
| Final | 3.00 |

### Component Mapping In The Current App

Until richer public inputs are wired in, the app maps the six components from existing reproducible fields:

| Component | Current implementation |
| --- | --- |
| Squad Quality | Starter-weighted Competitive Environment Quality, adjusted by explicit elite-club starter share and weak-starter share |
| Recent Match Rating | Recent National Team Performance |
| Positional Balance | Roster position coverage and Squad Balance Adjustment converted to a 0-100 score |
| Squad Depth | Environment score of core rotation and fringe players |
| Cohesion Continuity | Squad Cohesion Experience |
| Age / Tournament Load | Squad Age Structure |

Squad Quality intentionally separates **elite-club starter share** from generic club-environment score. A high score for playing regularly in a strong league should not be treated as the same signal as starting for a Champions League-level elite club. The current app recognizes a curated elite-club set for this adjustment, including Real Madrid, Manchester City, Bayern, Barcelona, Liverpool, Arsenal, Chelsea, Manchester United, Atletico Madrid, PSG, Inter, AC Milan, Juventus, and Borussia Dortmund. Strong-league clubs outside this set still contribute through player environment score, but they do not count toward the elite-club starter-share bonus.

## Required Inputs

### Squad Inputs

Each team must have a dated **Tournament Squad Version**:

- Team
- Evaluation date
- Squad status: projected or final
- Player name
- Age at tournament start
- Position group
- Expected Appearance Weight tier
- Current club
- Current league
- Club role data
- Availability status

### Expected Appearance Weight

| Tier | Weight |
| --- | ---: |
| Expected Starter | 1.00 |
| Core Rotation Player | 0.55 |
| Fringe Substitute | 0.20 |

Backup goalkeepers are excluded from age scoring unless there is a meaningful rotation or injury-risk reason to include them.

## Current Competitive Environment Quality

This dimension is calculated from player-level current club context, aggregated by **Expected Appearance Weight**.

| Subdimension | Weight |
| --- | ---: |
| League Strength | 35% |
| Club Competitiveness | 30% |
| Club Role Stability | 35% |

**League Strength** and **Club Competitiveness** should use **Public Reproducible Indicator** inputs rather than a single required data provider. Acceptable indicators include documented league coefficients, club Elo-style ratings, continental performance measures, or other reproducible public rankings.

**Club Competitiveness** distinguishes clubs inside the same league using a five-tier structure applied as an offset to League Strength:

| Club tier | Offset |
| --- | ---: |
| Continental elite | +6 |
| Continental qualification level | +1 |
| Upper mid-table | -5 |
| Mid-table (default for unlisted clubs) | -11 |
| Relegation zone level | -18 |

Clubs with an explicit elite rating keep their documented score instead of the tier offset. Tier offsets are deliberately conservative because a top-five-league mid-table club should not automatically rate close to a Champions League elite club.

**Club Role Stability** should reflect meaningful involvement through starts, minutes, and tactical importance. A big-club bench player should not score the same as a big-club starter. When club start-share data is available it maps to the score via these anchors (linear interpolation between anchors):

| Share of club league starts | Score |
| --- | ---: |
| >= 80% | 100 |
| 60% | 88 |
| 40% | 72 |
| 20% | 55 |
| 0% | 40 |

When no public start-share data is available, a conservative proxy is used and flagged as `roleSource = caps-proxy` so the substitution is visible. The proxy keeps national-team caps below 30% of the role signal and blends caps with age, club competitiveness, and league strength. When `data/public/club_roles.json` is present, club minutes or start-share data is used instead and flagged as `roleSource = club-minutes`.

## Squad Age Structure

Calculate an **Age Contribution Score** for each included player, apply position-sensitive adjustments, then aggregate by **Expected Appearance Weight**.

### Base Age Contribution Score

The age curve is continuous to avoid score cliffs between adjacent ages:

```text
25-28        : 100
Under 25     : 100 - (25 - age) * 4 per year (5 for GK/DF maturity-sensitive roles)
               Penalty halved for players already in an elite club context,
               floor 55
29-31        : 100 - (age - 28) * 3.5
32 and older : 89.5 - (age - 31) * 5.5
34 and older : position floors apply (below)
```

Reference values: 24 -> 96, 22 -> 88, 20 -> 80, 29 -> 96.5, 31 -> 89.5, 33 -> 78.

The elite-context exemption implements the rule that stable high-level club starters avoid extra young-player penalties, and prevents double-counting: a young player's club environment score already reflects proven level.

### Older-Player Position Floors

For players aged 34 or older:

| Position group | Floor |
| --- | ---: |
| Goalkeeper | 75 |
| Defender (position-group level) | 66 |
| Central midfielder, defensive midfielder | 62 |
| Forward (position-group level) | 66 |

When only GK/DF/MF/FW position groups are available from the squad source, the blended group floors above are used; finer floors (center back 68, wide roles 55) apply when detailed positions are known.

### Young-Player Position Adjustment

Young-player penalties are lighter than older-player penalties:

- Goalkeeper, center back, and single defensive midfielder roles may receive extra maturity penalties.
- Winger, fullback, and forward roles usually do not receive extra young-player penalties.
- Stable high-level club starters can avoid additional young-player penalties.

## Squad Cohesion Experience

This dimension is calculated from player pairs, weighted by each player's **Expected Appearance Weight**.

```text
Pair Weight = Player A Expected Appearance Weight * Player B Expected Appearance Weight
```

Shared experience source weights:

| Source | Weight |
| --- | ---: |
| National team shared minutes | 1.00 |
| Club shared minutes | 0.85 |
| Developmental or historical shared context | 0.25 |

National team shared minutes remain the closest World Cup context, but club shared minutes receive high weight because most player familiarity is built in club football.

### Proxy Implementation Notes

When real shared-minute data is unavailable, the build pipeline uses pair proxies. The source weights above apply to actual shared minutes; the proxies are combined with separate mix weights (national 75%, club 20%, historical 5%):

- National pair proxy: `min(capsA, capsB)` capped by the era-overlap bound -- the younger player's plausible senior years `(min(age) - 19) * ~9 matches/year`. This prevents cross-era veteran pairs and teenage newcomers from being scored as long-time partners.
- Club pair proxy: same club 100, same league 20, otherwise 0.
- Historical: derived placeholder (`national * 0.4`, no floor) until a public shared-youth-context dataset is wired in.

## Recent National Team Performance

Evaluate the 24-month **Competitive Match Window** before the World Cup starts.

| Subdimension | Weight |
| --- | ---: |
| Official match results | 50% |
| Official match goal difference and attacking/defensive performance | 33% |
| Strong-opponent performance | 17% |

Friendlies are visible as public match data but excluded from **Recent National Team Performance** scoring.

### Bias Corrections

- **Time decay**: matches are weighted with a 12-month half-life inside the window, so last month's result counts roughly four times a 24-month-old result.
- **Opponent-strength adjustment (iterative SOS, 4 rounds)**: every match's points are scaled by an opponent factor from 0.6 (weakest) to 1.4 (strongest). The factors are recomputed each round from the previous round's adjusted scores, so opponent-of-opponent strength propagates across confederations (a simplified Elo-style fixed point). This removes the bias where farming weak qualifier opponents scores the same as taking points in a strong confederation.
- **Goal-difference clamp**: per-match goal difference is clamped to +/-3 before averaging, so blowouts against minnows cannot inflate the attacking/defensive profile.
- **Small-sample shrinkage**: teams with fewer than 10 official matches in the window shrink toward the global mean to limit noise.
- **Strong-opponent set**: the top quartile by adjusted (not raw) points per match, among teams with at least 8 official matches. Teams without any strong-opponent match shrink toward 50 (`0.6 * official + 0.4 * 50`) instead of an arbitrary discount.

**Coaching Context** is not scored separately. It should appear through recent national team performance and cohesion signals.

## Adjustments

### Positional Balance

Positional Balance is a top-level component in the configurable scoring model. It starts from a conservative baseline, rewards complete roster coverage, and penalizes the weakest starter position group. The older `Squad Balance Adjustment` field is still accepted as an input but is converted into the Positional Balance component rather than applied as a separate post-score subtraction.

### Availability Adjustment

Apply after **Squad Balance Adjustment**.

Availability is a dated modifier for:

- Key-player injury
- Suspension
- Return-from-injury uncertainty
- Tournament-limiting fitness concern

The base model should remain stable; availability can change between squad announcement, first match, and knockout rounds.

## Calculation Order

1. Select the dated **Tournament Squad Version**.
2. Assign **Expected Appearance Weight** tiers.
3. Calculate player-level **Current Competitive Environment Quality**.
4. Calculate player-level **Age Contribution Score** and aggregate **Squad Age Structure**.
5. Calculate player-pair **Squad Cohesion Experience**.
6. Calculate **Recent National Team Performance** from the 24-month match window.
7. Normalize all four dimensions to 0-100.
8. Calculate **Base Strength Score**.
9. Apply **Squad Balance Adjustment**.
10. Apply **Availability Adjustment**.
11. Assign **Strength Tier** and rank.

## Explicit Non-Goals

- Do not include **Tournament Path Difficulty** in team strength.
- Do not add a standalone coach reputation score.
- Do not add a standalone player ability dimension.
- Do not use manual expert overrides.
- Do not evaluate the full national player pool when a tournament squad version is available.
