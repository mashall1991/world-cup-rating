# World Cup Team Strength Analysis

This context defines the domain language for evaluating national teams in a World Cup setting. It exists to keep model dimensions tied to football meaning rather than vague rating labels.

## Language

**World Cup Competitive Strength**:
The expected ability of a national team to win matches and progress deep into the World Cup finals environment.
_Avoid_: Overall strength, paper strength, squad fame

**Current Competitive Environment Quality**:
The quality of a player's current club football context, combining league strength, club competitiveness, and the player's role stability.
_Avoid_: Club fame, club name, transfer value

**League Strength**:
The competitive level of the domestic league in which a player's current club participates.
_Avoid_: League fame, country of club

**Public Reproducible Indicator**:
A documented external metric that can be re-collected or recalculated consistently for a dated evaluation.
_Avoid_: Private opinion, undocumented ranking

**Club Competitiveness**:
The current competitive level of a player's club within domestic and continental football.
_Avoid_: Club size, historical prestige

**Club Role Stability**:
The reliability of a player's meaningful club involvement through starts, minutes, and tactical importance.
_Avoid_: Club registration, being at a big club

**Recent National Team Performance**:
The team's recent competitive results and underlying performance in national team matches.
_Avoid_: Historical prestige, national team reputation, legacy

**Competitive Match Window**:
The 24-month period before the World Cup starts used to evaluate recent national team performance, excluding friendlies from the score.
_Avoid_: All-time history, last tournament only

**Availability Adjustment**:
A final score modifier reflecting key-player injuries, suspensions, and return-from-injury uncertainty at a specific evaluation date.
_Avoid_: Injury strength, fitness dimension

**Coaching Context**:
The national team coaching situation, including tactical continuity, squad familiarity, and match-management signals.
_Avoid_: Coach fame, manager rating

**Strength Tier**:
A labeled band of World Cup Competitive Strength used to avoid over-interpreting small score differences.
_Avoid_: Rank only, exact team order

**Tournament Squad Version**:
A dated final or projected World Cup squad used as the evaluation population for a team.
_Avoid_: National team pool, all eligible players

**Squad Balance Adjustment**:
A post-dimension score adjustment for exploitable positional weaknesses or structural imbalance in the evaluated tournament squad.
_Avoid_: Formation preference, tactical taste

**Tournament Path Difficulty**:
The difficulty created by group draw, knockout bracket, travel, rest, and opponent sequence, modeled separately from team strength.
_Avoid_: Strength score, team quality

**Base Strength Score**:
The 0-100 weighted sum of the four top-level dimensions before balance and availability adjustments.
_Avoid_: Final score, raw ranking

**Age Contribution Score**:
The player-level 0-100 age score used inside **Squad Age Structure**, before expected appearance and positional sensitivity are applied.
_Avoid_: Age grade, age bucket

**Squad Age Structure**:
The distribution of squad ages as it affects physical peak, positional durability, and tournament maturity.
_Avoid_: Average age, young team, old team

**Prime Age Band**:
The age range beginning at 25 where players are expected to contribute near peak World Cup value before gradual age-distance penalties apply.
_Avoid_: Golden age, best age

**Squad Cohesion Experience**:
The degree to which selected players have meaningful prior shared playing experience in national team, club, or developmental contexts.
_Avoid_: Whether players know each other, chemistry, togetherness

**Tournament Match Load**:
The total match burden a team may face across the World Cup, including the recovery demands created by an expanded route to the final.
_Avoid_: Schedule difficulty, fatigue in general

**Expected Appearance Weight**:
The expected share of meaningful tournament minutes assigned to a squad member when aggregating player-level signals into a team score.
_Avoid_: Squad list weight, equal player weight

**Expected Starter**:
A squad member expected to play starter-level meaningful tournament minutes, weighted as 1.00 in player-level aggregation.
_Avoid_: Main player, first eleven

**Core Rotation Player**:
A squad member expected to play regular meaningful tournament minutes below starter level, weighted as 0.55 in player-level aggregation.
_Avoid_: Substitute, backup

**Fringe Substitute**:
A squad member expected to play limited meaningful tournament minutes, weighted as 0.20 in player-level aggregation.
_Avoid_: Bench player, reserve

## Relationships

- **World Cup Competitive Strength** is influenced by player quality, squad structure, team cohesion, and recent national team performance.
- **World Cup Competitive Strength** uses configurable top-level coefficients. The default set is **Squad Quality** 45%, **Recent Match Rating** 30%, **Positional Balance** 10%, **Squad Depth** 8%, **Cohesion Continuity** 4%, and **Age / Tournament Load** 3%.
- **World Cup Competitive Strength** is evaluated against a **Tournament Squad Version**, not the full national player pool.
- **Base Strength Score** normalizes each top-level dimension to 0-100 before applying weights.
- **Current Competitive Environment Quality** contributes to **World Cup Competitive Strength** through the players selected in a national team squad.
- **Current Competitive Environment Quality** is composed of **League Strength** at 35%, **Club Competitiveness** at 30%, and **Club Role Stability** at 35%.
- **League Strength** and **Club Competitiveness** should be derived from **Public Reproducible Indicator** inputs, without binding the domain model to a single data provider.
- **Club Competitiveness** uses explicit elite-club scores when available; generic league-tier offsets are conservative so big-league mid-table clubs do not rate like Champions League elite clubs.
- **Squad Quality** separates strong-league starter value from explicit elite-club starter share, so clubs such as Everton, Crystal Palace, West Ham, Villarreal, Monaco, and Tottenham can still improve environment quality without being counted as Champions League-level elite-club starters.
- **Club Role Stability** should use club minutes or start-share data when available. If unavailable, the `caps-proxy` fallback keeps national-team caps below 30% of the role signal and blends caps with age, club competitiveness, and league strength.
- **Recent National Team Performance** is measured over the **Competitive Match Window** using official match results at 50%, official match goal-difference and attacking/defensive performance at 33%, and strong-opponent performance at 17%; friendlies are excluded from the score.
- **Squad Age Structure** contributes to **World Cup Competitive Strength** by shaping physical capacity, decision maturity, and position-specific decline risk.
- **Prime Age Band** is used within **Squad Age Structure** as the starting point for peak contribution scoring, with gradual penalties as players move away from the band.
- **Age Contribution Score** uses a continuous curve: 25-28 scores 100, younger ages lose 4 points per year below 25 (5 for maturity-sensitive roles, halved in elite club contexts), 29-31 lose 3.5 points per year above 28, and 32 or older declines 5.5 points per year with position floors from 34.
- For players aged 34 or older, **Age Contribution Score** positional floors are goalkeeper at 75, center back and center forward at 68, central midfielder and defensive midfielder at 62, and fullback, wingback, winger, or high-pressing forward at 55.
- Young-player age penalties are position-sensitive but lighter than older-player penalties: goalkeeper, center back, and single defensive midfielder roles may receive extra maturity penalties, while winger, fullback, and forward roles usually do not.
- **Squad Cohesion Experience** contributes to **World Cup Competitive Strength** through player-pair shared experience weighted by each player's **Expected Appearance Weight**.
- **Squad Cohesion Experience** source weights are national team shared minutes at 1.00, club shared minutes at 0.85, and developmental or historical shared contexts at 0.25.
- **Tournament Match Load** increases the importance of **Squad Age Structure** because recovery speed and repeated-match durability become more important over an eight-match finalist path.
- **Tournament Stage Load** converts user-entered coefficients into effective coefficients by multiplying **Age / Tournament Load** from 1.00x in the group stage to 3.00x in the final, capped at 16% of the coefficient total and funded proportionally from the other top-level components.
- **Expected Appearance Weight** is used to aggregate player-level age signals into **Squad Age Structure**, so likely starters and core rotation players shape the score more than fringe squad members.
- **Expected Appearance Weight** has three outfield tiers: **Expected Starter** at 1.00, **Core Rotation Player** at 0.55, and **Fringe Substitute** at 0.20.
- **Squad Balance Adjustment** is retained as an input for exploitable positional weaknesses, but the current scoring model converts it into **Positional Balance** rather than applying it as a separate post-score modifier.
- **Availability Adjustment** modifies the final **World Cup Competitive Strength** score after the four top-level dimensions are calculated.
- **Coaching Context** is not a separate top-level dimension; it is interpreted through **Recent National Team Performance** and **Squad Cohesion Experience**.
- **World Cup Competitive Strength** is reported as a score, **Strength Tier**, and rank.
- **Strength Tier** bands are 90-100 champion favorite, 80-89 semifinal contender, 70-79 quarterfinal or dark-horse zone, 60-69 group qualification contender, 50-59 group-stage underdog, and below 50 clear underdog.
- **Tournament Path Difficulty** is not part of **World Cup Competitive Strength**; it is combined separately when estimating advancement or title probability.
- Final scoring order is **Base Strength Score**, then **Squad Balance Adjustment**, then **Availability Adjustment**.

## Example Dialogue

> **Dev:** "Does a team with more famous club players always have higher **World Cup Competitive Strength**?"
> **Domain expert:** "No - club level matters, but World Cup outcomes also depend on squad fit, age profile, and whether players already have shared playing experience."
>
> **Dev:** "Should a big-club bench player score the same as a big-club starter?"
> **Domain expert:** "No; **Club Role Stability** is part of **Current Competitive Environment Quality** because meaningful minutes are a major signal."
>
> **Dev:** "Should league strength depend on one vendor ranking?"
> **Domain expert:** "No; use **Public Reproducible Indicator** inputs so the model survives data-source changes."
>
> **Dev:** "Should past national team results dominate the model?"
> **Domain expert:** "No; **Recent National Team Performance** calibrates the squad model but should not outweigh current player environment."
>
> **Dev:** "How far back should recent form go?"
> **Domain expert:** "Use the **Competitive Match Window**: 24 months before the World Cup, excluding friendlies from the score."
>
> **Dev:** "Should injuries change the base strength model?"
> **Domain expert:** "No; use **Availability Adjustment** as a dated final modifier because injuries and suspensions change quickly."
>
> **Dev:** "Should a famous coach add a separate score bonus?"
> **Domain expert:** "No; **Coaching Context** should show up through recent national team performance and cohesion signals, not reputation."
>
> **Dev:** "Should we only publish a ranking?"
> **Domain expert:** "No; publish score, **Strength Tier**, and rank so small score gaps are not mistaken for large football differences."
>
> **Dev:** "Should the model include every eligible player?"
> **Domain expert:** "No; evaluate a dated **Tournament Squad Version** because World Cup strength depends on the actual or projected squad."
>
> **Dev:** "Should an elite squad be penalized for lacking a reliable defensive midfielder?"
> **Domain expert:** "Yes; use **Squad Balance Adjustment** for exploitable positional gaps without creating another top-level dimension."
>
> **Dev:** "Does a difficult group make a team weaker?"
> **Domain expert:** "No; model that as **Tournament Path Difficulty**, separate from **World Cup Competitive Strength**."
>
> **Dev:** "Can dimensions use different native scales?"
> **Domain expert:** "They can internally, but each must normalize to 0-100 before contributing to **Base Strength Score**."
>
> **Dev:** "Can we compare teams by average age?"
> **Domain expert:** "Average age is too blunt; use **Squad Age Structure** to distinguish prime-age balance from fragile age concentration."
>
> **Dev:** "Is every age from 25 to 29 peak?"
> **Domain expert:** "No; **Age Contribution Score** gives full credit to ages 25-28, with 29 treated as outside the full-score band."
>
> **Dev:** "Should a 35-year-old goalkeeper and 35-year-old wingback receive the same age penalty?"
> **Domain expert:** "No; apply position-sensitive floors inside **Age Contribution Score** because recovery and repeated sprint demands differ."
>
> **Dev:** "Should a 21-year-old winger and 21-year-old center back have the same age risk?"
> **Domain expert:** "No; young-player penalties are lighter overall but decision-heavy roles can receive extra maturity penalties."
>
> **Dev:** "If two players used to be at the same youth academy, is that the same as playing together for the national team?"
> **Domain expert:** "No; both belong to **Squad Cohesion Experience**, but national team shared minutes are the stronger World Cup signal."
>
> **Dev:** "Should club shared minutes matter less just because they are not national team minutes?"
> **Domain expert:** "Only slightly; club shared minutes are weighted at 0.85 because most player familiarity is built in club football, while national team minutes remain the closest context."
>
> **Dev:** "Should age matter more in an expanded World Cup?"
> **Domain expert:** "Yes; higher **Tournament Match Load** makes recovery and repeated-match durability a larger part of **Squad Age Structure**."
>
> **Dev:** "Should every named squad member affect the age score equally?"
> **Domain expert:** "No; use **Expected Appearance Weight** so players expected to play meaningful minutes drive **Squad Age Structure**."
>
> **Dev:** "Do we need exact minute projections?"
> **Domain expert:** "No; classify players as **Expected Starter**, **Core Rotation Player**, or **Fringe Substitute** to avoid false precision."

## Flagged Ambiguities

- "综合实力水平" was used broadly; resolved as **World Cup Competitive Strength**, meaning expected World Cup match-winning and progression ability rather than paper squad value.
- **World Cup Competitive Strength** top-level weights were converted to configurable coefficients. The default set is **Squad Quality** 45%, **Recent Match Rating** 30%, **Positional Balance** 10%, **Squad Depth** 8%, **Cohesion Continuity** 4%, and **Age / Tournament Load** 3%, because player club context remains the strongest stable signal, recent official performance is the direct team-level calibration signal, and current cohesion inputs are proxy-based until shared-minute data is available.
- **Tournament Stage Load** was resolved as a stage selector that raises the effective **Age / Tournament Load** coefficient in later rounds instead of changing the stored base coefficients.
- **Squad Quality** was resolved to penalize teams with a low explicit elite-club starter share instead of treating every high `environmentScore` starter as an elite-club starter.
- **Recent National Team Performance** was resolved to use a 24-month **Competitive Match Window** that excludes friendlies from the score.
- Injuries, suspensions, and return-from-injury uncertainty were resolved as **Availability Adjustment**, a dated final modifier applied after the base score.
- **Coaching Context** was resolved as a non-top-level factor interpreted through **Recent National Team Performance** and **Squad Cohesion Experience** rather than a separate coach reputation score.
- Model output was resolved as score, **Strength Tier**, and rank rather than rank alone.
- The evaluated population was resolved as the dated **Tournament Squad Version**, using the final World Cup squad when available and a projected squad before final squads are announced.
- Exploitable positional weaknesses were resolved as **Squad Balance Adjustment** in the source data and are now converted into the configurable **Positional Balance** component.
- Group draw, knockout bracket, travel, rest, and opponent sequence were resolved as **Tournament Path Difficulty**, separate from **World Cup Competitive Strength** and used only when estimating advancement probability.
- Each top-level dimension is normalized to 0-100 before calculating **Base Strength Score**; final scoring order is base score, then balance adjustment, then availability adjustment.
- Manual expert overrides were rejected; the model should remain reproducible from defined dimensions, adjustments, and dated inputs rather than discretionary score edits.
- League and club quality inputs were resolved as **Public Reproducible Indicator** based rather than tied to a single data provider.
- A separate top-level player ability dimension was rejected to avoid double counting; individual quality should be expressed through **Current Competitive Environment Quality**, **Club Role Stability**, and position-specific reproducible inputs where needed.
- "效力俱乐部" was used broadly; resolved as **Current Competitive Environment Quality**, meaning the player's active club context rather than club fame alone.
- **Current Competitive Environment Quality** was resolved as **League Strength** 35%, **Club Competitiveness** 30%, and **Club Role Stability** 35%.
- "年龄" was used broadly; resolved as **Squad Age Structure**, meaning age distribution and positional implications rather than average age alone.
- "黄金年龄设置为25岁" was resolved as **Prime Age Band** beginning at 25; **Age Contribution Score** gives full credit to ages 25-28 and gradually penalizes ages outside that range.
- Age penalties for players aged 34 or older were resolved as position-sensitive, with more lenient floors for goalkeepers and more severe floors for high-running wide or pressing roles.
- Young-player age penalties were resolved as mildly position-sensitive, with heavier maturity penalties for goalkeeper, center back, and single defensive midfielder roles than for winger, fullback, or forward roles.
- "队员之间是否一起踢过球" was resolved as **Squad Cohesion Experience**, calculated from player pairs and weighted by expected appearance, with national team shared minutes at 1.00, club shared minutes at 0.85, and developmental or historical shared contexts at 0.25.
- The initial dimension weights were resolved as **Current Competitive Environment Quality** 40%, **Squad Cohesion Experience** 30%, and **Squad Age Structure** 30%, reflecting the expanded World Cup finalist path of up to eight matches.
- Age penalties are applied at player level and aggregated by **Expected Appearance Weight**, rather than using equal weighting or simple squad average age.
- Outfield **Expected Appearance Weight** uses three tiers: **Expected Starter** 1.00, **Core Rotation Player** 0.55, and **Fringe Substitute** 0.20; backup goalkeepers are excluded from age scoring unless a meaningful rotation or injury-risk reason exists.
