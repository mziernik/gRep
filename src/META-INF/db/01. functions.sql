CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE EXTENSION IF NOT EXISTS "hstore";


CREATE OR REPLACE FUNCTION notNullArgs(arg anyarray) 
RETURNS INTEGER AS $$
-- Zwraca ilość wartości nie NULL-owych z tablicy
DECLARE
	cnt INTEGER = 0;
	str TEXT;
BEGIN
	FOREACH str IN ARRAY arg LOOP
		IF NOT str IS NULL THEN
			cnt := cnt + 1;
		END IF;
	END LOOP;

	RETURN cnt; 
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION oneNotNull(arg anyarray) 
RETURNS BOOLEAN AS $$
/**
	 Funkcja zwaraca wartość pozytywną jeśli dokładnie jeden z elementów tablicy jest różny od null-a.
	 Przykładowe zastosowanie: CREATE TABLE -> dyrektywa CHECK
*/
DECLARE
	cnt INTEGER = 0;
	str TEXT;
BEGIN
	FOREACH str IN ARRAY arg LOOP
		IF NOT str IS NULL THEN
			cnt := cnt + 1;
		END IF;
	END LOOP;

	RETURN cnt = 1; 
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION xor(arg TEXT[]) 
RETURNS BOOLEAN AS $$
/**
	 Funkcja zwaraca wartość pozytywną jeśli wszystkie elementy tablicy 
        są rózne od null-a albo każdy z nich jest nullem.
	 Przykładowe zastosowanie: CREATE TABLE -> dyrektywa CHECK
*/
DECLARE
	cnt INTEGER = 0;
	str TEXT;
BEGIN
	FOREACH str IN ARRAY arg LOOP
		IF NOT str IS NULL THEN
			cnt := cnt + 1;
		END IF;
	END LOOP;

	RETURN cnt = 0 OR cnt = array_length(arg, 1); 
END;
$$ LANGUAGE plpgsql;


/**
    Funkcja speawdza czy wszystkie elmenty tablicy występują w danej kolumnie
*/

CREATE OR REPLACE FUNCTION array_reference(arr anyarray, tableName TEXT, columnName TEXT) 
RETURNS BOOLEAN AS $$
DECLARE
	result boolean;
BEGIN
	IF coalesce(array_length(arr, 1), 0) = 0 THEN
		RETURN TRUE;
	END IF;

	EXECUTE 'SELECT coalesce(array_agg(' || columnName || ') @> ''{' 
                || array_to_string(arr, ',') || '}'', FALSE) FROM ' || tableName  INTO result;
	RETURN result;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION same_length(arr1 anyarray, arr2 anyarray) 
RETURNS BOOLEAN AS $$
BEGIN
	RETURN (SELECT count(1) FROM ( 
		SELECT DISTINCT UNNEST(
			ARRAY[array_length(arr1, 1), array_length(arr2, 1)]) AS cnt  
		) AS x WHERE NOT cnt ISNULL
	  ) <= 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION same_length(arr1 anyarray, arr2 anyarray, arr3 anyarray) 
RETURNS BOOLEAN AS $$
BEGIN
	RETURN (SELECT count(1) FROM ( 
		SELECT DISTINCT UNNEST(
			ARRAY[array_length(arr1, 1), array_length(arr2, 1), array_length(arr3, 1)]) AS cnt  
		) AS x WHERE NOT cnt ISNULL
	  ) <= 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION same_length(arr1 anyarray, arr2 anyarray, arr3 anyarray, arr4 anyarray) 
RETURNS BOOLEAN AS $$
BEGIN
	RETURN (SELECT count(1) FROM ( 
		SELECT DISTINCT UNNEST(
			ARRAY[array_length(arr1, 1), array_length(arr2, 1), array_length(arr3, 1), array_length(arr4, 1)]) AS cnt  
		) AS x WHERE NOT cnt ISNULL
	  ) <= 1;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION getUserId(arg VARCHAR) 
RETURNS INTEGER AS $$
BEGIN
	RETURN (SELECT id FROM users.users WHERE username ILIKE (arg)) ; 
END;
$$ LANGUAGE plpgsql;