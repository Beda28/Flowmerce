use FLOWMERCE;

CREATE TABLE IF NOT EXISTS users (
    uid char(36) NOT NULL PRIMARY KEY,
    id varchar(10) NOT NULL UNIQUE,
    pw varchar(255) NOT NULL,
    intro varchar(200),
    balance int NOT NULL DEFAULT 0,
    role varchar(10) NOT NULL DEFAULT 'user'
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
    seller_uid char(36) NOT NULL,
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
    date datetime NOT NULL,
    status varchar(20) NOT NULL DEFAULT 'pending',
    status_updated_at datetime,
    status_updated_by char(36)
);

CREATE TABLE IF NOT EXISTS chat_rooms (
    room_id char(36) NOT NULL PRIMARY KEY,
    pid char(36) NOT NULL,
    buyer_uid char(36) NOT NULL,
    seller_uid char(36) NOT NULL,
    created_at datetime NOT NULL
);
