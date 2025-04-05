CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR,
    author VARCHAR,
    genre VARCHAR,
    published_year SMALLINT,
    created_date date DEFAULT CURRENT_DATE
);
create table users (
    user_id serial primary key,
    username varchar unique,
    name varchar,
    password varchar,
    role varchar(10)
);
CREATE TABLE borrowing_history (
    borrowing_id SERIAL PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    book_id INT,
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    borrowed_date DATE DEFAULT CURRENT_DATE,
    returned_date DATE DEFAULT CURRENT_DATE
);
DROP TABLE books;
select *
from books;