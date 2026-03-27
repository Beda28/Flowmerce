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

CREATE TABLE IF NOT EXISTS product (
    pid char(36) NOT NULL PRIMARY KEY,
    name varchar(100) NOT NULL,
    description varchar(500) NOT NULL,
    category json NOT NULL,
    image varchar(255),
    price int NOT NULL,
    date datetime NOT NULL,
    stock int NOT NULL
);

CREATE TABLE IF NOT EXISTS cart (
    cart_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    uid char(36) NOT NULL,
    pid char(36) NOT NULL,
    quantity int NOT NULL,
    date datetime NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    order_id char(36) NOT NULL PRIMARY KEY,
    uid char(36) NOT NULL,
    pid char(36) NOT NULL,
    quantity int NOT NULL,
    total_price int NOT NULL,
    date datetime NOT NULL
);
