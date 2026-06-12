# Team Data Format

The HTML app is ready for saved data. It reads team data in this order:

1. `window.WORLD_CUP_STRENGTH_TEAMS`
2. `localStorage["worldCupStrengthTeams"]`
3. Built-in sample data

Use either a JSON array of teams or store that same array in the global variable/localStorage.

```json
[
  {
    "id": "fra",
    "name": "法国",
    "nameEn": "France",
    "flag": "🇫🇷",
    "confederation": "UEFA",
    "squadVersion": {
      "date": "2026-05-25",
      "status": "预测名单"
    },
    "dimensions": {
      "environment": 92,
      "cohesion": 84,
      "age": 88,
      "performance": 86
    },
    "environmentBreakdown": {
      "leagueStrength": 91,
      "clubCompetitiveness": 93,
      "roleStability": 92
    },
    "cohesionBreakdown": {
      "nationalTeam": 86,
      "club": 78,
      "historical": 58
    },
    "performanceBreakdown": {
      "officialResults": 87,
      "officialGoalProfile": 86,
      "strongOpponent": 84,
      "friendlies": 81
    },
    "ageProfile": {
      "weightedAgeScore": 88,
      "primeShare": 58,
      "riskPositions": "结构均衡"
    },
    "squadBalanceAdjustment": -1,
    "availabilityAdjustment": 1,
    "players": [
      {
        "name": "姆巴佩",
        "nameEn": "Kylian Mbappe",
        "age": 27,
        "position": "边锋",
        "tier": "预计主力 · 1",
        "appearanceWeight": 1,
        "club": "皇家马德里",
        "clubEn": "Real Madrid",
        "environmentScore": 96,
        "availability": "可用"
      }
    ]
  }
]
```

Top-level dimension keys map to the model specification:

| Key | Meaning |
| --- | --- |
| `environment` | Current Competitive Environment Quality |
| `cohesion` | Squad Cohesion Experience |
| `age` | Squad Age Structure |
| `performance` | Recent National Team Performance |

The app recalculates `baseScore`, `balancedScore`, `finalScore`, rank, and Strength Tier from these inputs.

## Public Data Snapshot

`scripts/fetch_public_data.py` saves public source snapshots under `data/public/`:

| File | Purpose |
| --- | --- |
| `worldcup_2026.json` | 2026 World Cup schedule structure from `openfootball/worldcup.json`. |
| `recent_international_results.json` | 24-month international match window and team aggregates from `martj42/international_results`. |
| `club_roles.json` | Optional player club-minute or start-share inputs consumed by `scripts/build_squad_model_data.py`. |
| `club_roles_manifest.json` | Metadata for the optional club-role snapshot. |
| `public_data_manifest.json` | Source, fetch, and storage decision metadata. |
| `public_data.js` | Browser-loadable wrapper used by `index.html` when opened directly from disk. |

`index.html` loads `data/public/public_data.js` before `app.js`. When the snapshot is available, `app.js` recalculates each matched team's **Recent National Team Performance** from the public match window and then recalculates the final team score. Squad, age, cohesion, and club-environment inputs still come from the team records because the public match results do not contain tournament squad or club role data.

Run `scripts/fetch_club_roles.py` to generate `club_roles.json` from Transfermarkt-style player performance CSVs. The default public source is `salimt/football-datasets`, whose `player_performances.csv` is stored with Git LFS; install `git-lfs` first, or pass local `--profiles-csv` and `--performances-csv` paths. If `club_roles.json` is absent, the build falls back to a conservative `caps-proxy` role signal.
