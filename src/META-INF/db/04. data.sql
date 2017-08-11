CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "hstore";

CREATE SCHEMA IF NOT EXISTS data;



/*
Tabela przechowuje klucze szyfrujące. Każde hasło tabeli accounts zaszyfrowane jest wygenerowanym guid-em. 
Guid ten natomiast zaszyfrowany na dwa sposoby:
	- jeśli zdefiniowany jest user_id wtedy hasło uznajemy za prywatne a guid szyfrowany jest dwoma kluczami (hasłami)
		- user_key: hasło logowania do usługi
		- service_key: hasło nadrzędne (zapasowe)
	- jeśli user_id jest null-em to guid zaszyfrowany jest jest kluczem usługi zaszytym w kodzie (service_key)
*/

CREATE TABLE data.crypt_key 
(
	id              SERIAL PRIMARY KEY,
        uid             UUID NOT NULL DEFAULT uuid_generate_v4(),
        created         TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
	user_id         INTEGER REFERENCES users.users (id),   	-- klucz prywatny (danego użytkownika)
	service_key 	VARCHAR NOT NULL,				-- klucz: guid zaszyfrowany haslem użytkownika usługi (np LDAP), postać BASE64
	user_key        VARCHAR 					-- klucz: guid zaszyfrowany haslem głównym użytkownika usługi, postać BASE64
                            CHECK ( notNullArgs(ARRAY[user_id::VARCHAR, user_key]) IN (0, 2)),
	md5         VARCHAR(32) NOT NULL			-- MD5 klucza jawnego (GUID-a)
);

----------------------------------- GRUPY --------------------------------------

CREATE TABLE data.category
(
    id              SERIAL PRIMARY KEY,
    uid             UUID NOT NULL DEFAULT uuid_generate_v4(),
    key             VARCHAR NOT NULL UNIQUE,
    created         TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(), 
    name            VARCHAR NOT NULL,
    description     VARCHAR,
    icon            INTEGER,
    categories      INTEGER[] NOT NULL DEFAULT '{}', -- lista dozwolonych grup (data.category.id)
    attributes      INTEGER[] -- dozwolone atrybuty, null - wszystkie
);

CREATE TABLE data.catalog
(
    id              SERIAL PRIMARY KEY,
    uid             UUID NOT NULL DEFAULT uuid_generate_v4(),
    category        INTEGER NOT NULL REFERENCES data.category (id),
    created         TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    index           INTEGER,
    name            VARCHAR NOT NULL,
    description     VARCHAR,
    abstract        BOOLEAN NOT NULL DEFAULT false, -- grupa nie może mieć potomnych grup
    parent          INTEGER REFERENCES data.catalog (id),
    attributes      INTEGER[] -- dozwolone atrybuty, null - wszystkie
);

--------------------------------- ATRYBUTY -------------------------------------

CREATE TABLE data.attribute_element
(
    id              SERIAL PRIMARY KEY,
    uid             UUID NOT NULL DEFAULT uuid_generate_v4(),
    created         TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    key             VARCHAR NOT NULL UNIQUE,
    type            VARCHAR NOT NULL,   -- DataType
    required        BOOLEAN NOT NULL DEFAULT false,
    def_val         VARCHAR,    
    name            VARCHAR NOT NULL UNIQUE,
    min             INTEGER,
    max             INTEGER,
    regex           VARCHAR,    -- 
    description     VARCHAR,
    foreign_elm     INTEGER REFERENCES data.attribute_element (id),
    encrypted       BOOLEAN NOT NULL DEFAULT false,
    enumerate       HSTORE
);

CREATE TABLE data.attribute
(
    id              SERIAL PRIMARY KEY,
    uid             UUID NOT NULL DEFAULT uuid_generate_v4(),
    created         TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    key             VARCHAR NOT NULL UNIQUE,
    parent          INTEGER REFERENCES data.attribute (id),
    name            VARCHAR NOT NULL,
    display_mask    VARCHAR,
    icon            VARCHAR,
    description     VARCHAR
);

/** Tabela łącząca */
CREATE TABLE data.attribute_elements
(
    id              SERIAL PRIMARY KEY,
    attr            INTEGER NOT NULL REFERENCES data.attribute (id),
    elm             INTEGER NOT NULL REFERENCES data.attribute_element (id),
    def_val         VARCHAR,
    required        BOOLEAN
);


/*
    Zbiór atrybutów wymaganych i opcjonalnych w danej definicji grupy
*/
CREATE TABLE data.category_attribute
(
    id              SERIAL PRIMARY KEY,
    uid             UUID NOT NULL DEFAULT uuid_generate_v4(),
    category        INTEGER NOT NULL REFERENCES data.category (id),
    attribute       INTEGER NOT NULL REFERENCES data.attribute (id),
    display_mask    VARCHAR,
    required        BOOLEAN NOT NULL DEFAULT false,
    multiple        BOOLEAN NOT NULL DEFAULT false,
    "unique"        BOOLEAN NOT NULL DEFAULT true,
    abstract        BOOLEAN  -- może wystąpić tylko w grupie abstrakcyjnej
);

----------------------------------- ZASOBY -------------------------------------

CREATE TABLE data.resource
(
    id              SERIAL PRIMARY KEY,
    uid             UUID NOT NULL DEFAULT uuid_generate_v4(),
    catalog         INTEGER NOT NULL REFERENCES data.catalog (id),
    type            CHAR NOT NULL 	
                        CHECK (type IN (
                            'D',	-- Dokument tekstowy
                            'F',  	-- Plik
                            'P' 	-- Zdjęcie
                        )), 
    created         TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(), 
    name            VARCHAR NOT NULL,
    description     VARCHAR,
    value           VARCHAR,
    format          VARCHAR 
                        CHECK (format IN (
                            'Text',
                            'Markdown', 
                            'DOC',
                            'PDF',
                            'HTML',
                            'CSS',
                            'JS',
                            'XML',
                            'JSON',
                            'Java'
                        )), 
   file            VARCHAR, -- ścieżka (nazwa) pliku (uid)
   size            INTEGER , 
   md5             VARCHAR(32),        
   crypt_key       INTEGER REFERENCES data.crypt_key (id), -- czy element ma być zaszyfrowany
   tags            VARCHAR(30)[] NOT NULL DEFAULT '{}'	-- tagi po których można znaleźć dany element
);



-------------------------- WARTOŚCI ATRYBUTÓW ----------------------------------

-- wartości atrybutów danej grupy
CREATE TABLE data.catalog_attribute
(
    id              SERIAL PRIMARY KEY,
    uid             UUID NOT NULL DEFAULT uuid_generate_v4(),
    index           INTEGER,
    created         TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(), 
    catalog         INTEGER NOT NULL REFERENCES data.catalog (id), 
    attribute       INTEGER NOT NULL REFERENCES data.attribute (id),
    notes           VARCHAR
);

CREATE TABLE data.catalog_attribute_values
(
     id              SERIAL PRIMARY KEY,
     attr            INT NOT NULL REFERENCES data.catalog_attribute (id),
     elm             INT NOT NULL REFERENCES data.attribute_elements (id),
     value           VARCHAR,
     crypt_ky        INTEGER REFERENCES data.crypt_key (id)
)