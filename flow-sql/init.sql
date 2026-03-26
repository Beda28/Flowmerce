use FLOWMERCE;

CREATE TABLE IF NOT EXISTS users (
    uid char(36) NOT NULL PRIMARY KEY,
    id varchar(10) NOT NULL UNIQUE,
    pw varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS board (
    bid char(36) NOT NULL PRIMARY KEY,
    title varchar(50) NOT NULL,
    content varchar(1000) NOT NULL,
    writer char(36) NOT NULL,
    date datetime NOT NULL,
    viewcount int NOT NULL
);
