-- DROP SCHEMA public cascade;

CREATE SCHEMA IF NOT EXISTS public;

--------------------------------------------------------------------------------

CREATE TABLE meta_data
(
	key          VARCHAR PRIMARY KEY,
    name         VARCHAR NOT NULL,
	value        TEXT 
);


CREATE TABLE config (
    config_id       SERIAL PRIMARY KEY,
    key             VARCHAR(200) UNIQUE NOT NULL,
    value           VARCHAR, -- JSON
    variable        VARCHAR,
    "default"       BOOLEAN NOT NULL,
    last_modified   TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);
