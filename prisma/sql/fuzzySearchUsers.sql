-- @param {String} $1:displayName

WITH
	ranked_users AS (
		SELECT
			id,
			match_sorter_rank (ARRAY["displayName"], $1) AS "matchRank"
		FROM
			"User"
	)
SELECT
	*
FROM
	ranked_users
WHERE
	"matchRank" < 6.7
ORDER BY
	"matchRank" ASC
