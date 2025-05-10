-- @param {String} $1:name

WITH
	ranked_locations AS (
		WITH
			locations AS (
				SELECT
					"pickUpLocation" as name
				FROM
					"Animal"
				WHERE
					"pickUpLocation" IS NOT NULL
				GROUP BY
					"pickUpLocation"
			)
		SELECT
			name,
			match_sorter_rank (ARRAY[name], $1) AS "matchRank"
		FROM
			locations
	)
SELECT
	*
FROM
	ranked_locations
WHERE
	"matchRank" < 6.7
ORDER BY
	"matchRank" ASC
