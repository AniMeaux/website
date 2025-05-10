-- @param {String} $1:nameOrAlias
-- @param {Int} $2:take

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
LIMIT
	$2
