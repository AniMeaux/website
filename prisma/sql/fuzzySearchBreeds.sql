-- @param {String} $1:name
-- @param $2:species
-- @param {Int} $3:take

WITH
	ranked_breeds AS (
		SELECT
			id,
			match_sorter_rank (ARRAY[name], $1) AS "matchRank"
		FROM
			"Breed"
		WHERE
			ARRAY_LENGTH($2::"Species"[], 1) IS NULL OR species = ANY($2::"Species"[])
	)
SELECT
	*
FROM
	ranked_breeds
WHERE
	"matchRank" < 6.7
ORDER BY
	"matchRank" ASC
LIMIT
	$3
