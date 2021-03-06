﻿-- DROP SCHEMA public cascade;

CREATE SCHEMA IF NOT EXISTS public;

--------------------------------------------------------------------------------

CREATE TABLE repo_history
(
    id          SERIAL PRIMARY KEY,
    date        TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    name        VARCHAR NOT NULL,
    repository  VARCHAR NOT NULL,
    primary_key VARCHAR NOT NULL,
    action      VARCHAR NOT NULL,
    changes     HSTORE NOT NULL,
    address     VARCHAR,
    username    VARCHAR,
    session     VARCHAR,
    extra       HSTORE
);

CREATE TABLE repo_state
(
    key             VARCHAR PRIMARY KEY,
    name            VARCHAR NOT NULL,
    "group"         VARCHAR,
    "desc"          VARCHAR,
    broadcast       BOOLEAN NOT NULL,
    on_demand       BOOLEAN NOT NULL,
    icon            VARCHAR,
    info            HSTORE,
    "limit"         INTEGER,
    crude           CHAR[] NOT NULL,
    last_modified   TIMESTAMP WITHOUT TIME ZONE,
    last_modified_by  VARCHAR,
    last_mod_by_id  INT,  
    revision        INT NOT NULL,
    min_interval    INTEGER
);


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
