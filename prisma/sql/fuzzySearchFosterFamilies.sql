-- @param {String} $1:displayName

WITH
	ranked_foster_families AS (
		SELECT
			id,
			match_sorter_rank (ARRAY["displayName"], $1) AS "matchRank"
		FROM
			"FosterFamily"
	)
SELECT
	*
FROM
	ranked_foster_families
WHERE
	"matchRank" < 6.7
ORDER BY
	"matchRank" ASC
