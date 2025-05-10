-- @param {String} $1:displayName
-- @param $2:groups
-- @param $3:isDisabled
-- @param {Int} $4:take

WITH
	ranked_users AS (
		SELECT
			id,
			match_sorter_rank (ARRAY["displayName"], $1) AS "matchRank"
		FROM
			"User"
		WHERE
			(ARRAY_LENGTH($2::"UserGroup"[], 1) IS NULL OR groups && $2::"UserGroup"[])
			AND (ARRAY_LENGTH($3::boolean[], 1) IS NULL OR "isDisabled" = ANY($3::boolean[]))
	)
SELECT
	*
FROM
	ranked_users
WHERE
	"matchRank" < 6.7
ORDER BY
	"matchRank" ASC
LIMIT
	$4
