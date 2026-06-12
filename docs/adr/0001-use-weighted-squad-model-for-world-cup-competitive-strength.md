# Use Weighted Squad Model for World Cup Competitive Strength

We will evaluate **World Cup Competitive Strength** with a reproducible weighted squad model rather than a black-box expert rating, transfer-value ranking, or recent-results-only model. The base score uses four top-level dimensions: **Current Competitive Environment Quality** at 36%, **Squad Cohesion Experience** at 27%, **Squad Age Structure** at 27%, and **Recent National Team Performance** at 10%; **Squad Balance Adjustment** and **Availability Adjustment** are applied afterward, while **Tournament Path Difficulty** remains separate from team strength.

## Considered Options

- Transfer-value or club-name model: rejected because it overstates reputation and understates role stability, age structure, and national team fit.
- Recent-results-only model: rejected because it can lag squad changes and misses current club context for selected players.
- Manual expert override model: rejected because discretionary score edits reduce reproducibility.

## Consequences

The model requires dated squad versions, player-level expected appearance weights, dimension normalization to 0-100, and explicit adjustment rules. Small score differences should be interpreted through **Strength Tier** rather than rank alone.
