SELECT 
beers.id as beer_id,
beers.name as beer_name,
(SELECT row_to_json(r)::json->'json_object_agg' as review_text_json FROM
	(SELECT json_object_agg(j.word, ARRAY[j.nentry, j.ndoc]) FROM 
	(SELECT word, nentry, ndoc FROM 
	ts_stat('SELECT reviews.review_text_vector as review_text_vector 
		FROM reviews 
		WHERE char_length(review_text_vector::text) > 0 
		AND beer_id ='|| beers.id) 
	ORDER BY nentry DESC, ndoc DESC, word) as j) as r)
FROM beers
WHERE beers.id IN (55633)
GROUP BY beers.id;

\copy (SELECT 
beers.id as beer_id,
beers.name as beer_name,
(SELECT row_to_json(r)::json->'json_object_agg' as review_text_json FROM
	(SELECT json_object_agg(j.word, ARRAY[j.nentry, j.ndoc]) FROM 
	(SELECT word, nentry, ndoc FROM 
	ts_stat('SELECT reviews.review_text_vector as review_text_vector 
		FROM reviews 
		WHERE char_length(review_text) > 14
		AND beer_id ='|| beers.id) 
	ORDER BY nentry DESC, ndoc DESC, word) as j) as r)
FROM beers
GROUP BY beers.id, beer_name) to 'C:\Users\rajan\Desktop\get_craft_beer\notebooks\beer_reviews_json.csv' DELIMITER ',' CSV HEADER;



CREATE TEMP TABLE tmp_x (beer_id int, beer_name text, review_text_json jsonb);

\copy tmp_x FROM 'C:\Users\rajan\Desktop\get_craft_beer\notebooks\beer_review_json_clean.csv' (FORMAT csv, HEADER TRUE);

UPDATE beers
SET    review_text_json = tmp_x.review_text_json
FROM   tmp_x
WHERE  beers.id = tmp_x.beer_id;

DROP TABLE tmp_x; -- else it is dropped at end of session automatically