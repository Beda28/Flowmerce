use FLOWMERCE;

CREATE TABLE IF NOT EXISTS users (
    uid char(36) NOT NULL PRIMARY KEY,
    id varchar(10) NOT NULL UNIQUE,
    pw varchar(255) NOT NULL
);
