-- @param {String} $1:nameOrAlias

WITH
	ranked_animals AS (
		SELECT
			id,
			match_sorter_rank (ARRAY[name, alias], $1) AS "matchRank"
		FROM
			"Animal"
	)
SELECT
	*
FROM
	ranked_animals
WHERE
	"matchRank" < 6.7
ORDER BY
	"matchRank" ASC
