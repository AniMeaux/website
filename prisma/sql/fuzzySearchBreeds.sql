-- @param {String} $1:name

WITH
	ranked_breeds AS (
		SELECT
			id,
			match_sorter_rank (ARRAY[name], $1) AS "matchRank"
		FROM
			"Breed"
	)
SELECT
	*
FROM
	ranked_breeds
WHERE
	"matchRank" < 6.7
ORDER BY
	"matchRank" ASC
