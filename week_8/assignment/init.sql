CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR UNIQUE,
    author VARCHAR,
    genre VARCHAR,
    published_year SMALLINT,
    created_date date DEFAULT CURRENT_DATE
);
create table users (
    user_id serial primary key,
    username varchar UNIQUE,
    name varchar,
    password varchar,
    role varchar(10)
);
CREATE TABLE borrowing_history (
    borrowing_id SERIAL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    book_id INT,
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    borrowed_date DATE DEFAULT CURRENT_DATE,
    returned_date DATE DEFAULT CURRENT_DATE
);
CREATE INDEX idx_borrowing_history_user_id ON borrowing_history (user_id);
DROP TABLE books;
select *
from books;