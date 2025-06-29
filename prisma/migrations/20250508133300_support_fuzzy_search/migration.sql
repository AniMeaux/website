-- CreateExtension
-- Enable pg_trgm and unaccent for fuzzy search.
-- https://www.postgresql.org/docs/current/pgtrgm.html
-- https://www.postgresql.org/docs/current/unaccent.html
-- https://github.com/prisma/prisma/issues/16211#issuecomment-1364584082
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- CreateFunction
CREATE OR REPLACE FUNCTION match_sorter_rank_field(field text, query text)
RETURNS float AS $$
DECLARE
  normalized_field text := unaccent(LOWER(field));
  normalized_query text := unaccent(LOWER(query));
BEGIN
  -- Strictly equals.
  IF field = query THEN
    RETURN 1;
  -- Loosely equals.
  ELSIF normalized_field = normalized_query THEN
    RETURN 2;
  -- Starts with.
  ELSIF normalized_field LIKE normalized_query || '%' THEN
    RETURN 3;
  -- Word starts with.
  ELSIF EXISTS (
    SELECT 1 FROM regexp_split_to_table(field, '\W+') AS word
    WHERE unaccent(LOWER(word)) LIKE normalized_query || '%'
  ) THEN
    RETURN 4;
  -- Contains.
  ELSIF normalized_field LIKE '%' || normalized_query || '%' THEN
    RETURN 5;
  
  -- Some similarity.
  -- This combines both the rank (6) and a penalty based on how close the match
  -- is. A perfect match would return a score of 6 (if similarity is 1), and it
  -- decreases as the similarity gets lower.
  ELSE
    RETURN 6 + (1 - similarity(normalized_field, normalized_query));
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Based on match-sorter https://github.com/kentcdodds/match-sorter
CREATE OR REPLACE FUNCTION match_sorter_rank(fields text[], query text)
RETURNS float AS $$
DECLARE
  best float := 7;
  score float;
  field text;
BEGIN
  FOREACH field IN ARRAY fields LOOP
    score := match_sorter_rank_field(field, query);
    IF score < best THEN
      best := score;
    END IF;
  END LOOP;
  RETURN best;
END;
$$ LANGUAGE plpgsql IMMUTABLE;