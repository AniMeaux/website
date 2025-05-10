-- @param {String} $1:name

WITH
	ranked_colors AS (
		SELECT
			id,
			match_sorter_rank (ARRAY[name], $1) AS "matchRank"
		FROM
			"Color"
	)
SELECT
	*
FROM
	ranked_colors
WHERE
	"matchRank" < 6.7
ORDER BY
	"matchRank" ASC
