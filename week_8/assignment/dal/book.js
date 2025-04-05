module.exports = function (pgPool) {
  if (!pgPool || !pgPool.pool) {
    throw Error("Missing DB connection!");
  }
  const pool = pgPool.pool;

  function getBooks(options, limit = 10, offset = 0, callback) {
    console.log("options: ", options);
    const { title, genre } = options;

    let sql = `
          select  b.book_id,
                  b.title,
                  b.author,
                  b.genre,
                  b.published_year,
                  b.created_date
          from    books b
      `;
    const params = [];

    if (title) {
      sql += ` and b."title" ilike $${params.length + 1}`;
      params.push(`%${title}%`);
    }
    if (genre) {
      sql += ` and b.genre = $${params.length + 1}`;
      params.push(genre);
    }

    sql += `
          limit ${limit}
          offset ${offset}
      `;

    console.log("sql: ", sql);
    console.log("params: ", params);

    pool.query(sql, params, function (error, books) {
      if (error) {
        return callback(error, null);
      }
      console.log("books: ", books.rows);
      return callback(null, books.rows);
    });
  }

  function postBook(newBook, callback) {
    console.log("new book", newBook);
    const { title, author, genre, publishedYear } = newBook;

    const params = [title, author, genre, publishedYear];
    let sql = `
          insert into books(title, author, genre, published_year) 
          values($${1}, $${2}, $${3}, $${4})
      `;

    console.log("sql: ", sql);
    console.log("params: ", params);

    pool.query(sql, params, function (error, books) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, books.rows);
    });
  }

  function getBookByID(bookID, callback) {
    const params = [bookID];

    let sql = `
          select  b.book_id,
                  b.title,
                  b.author,
                  b.genre,
                  b.published_year,
                  b.created_date 
          from    books b 
          where   book_id = $${1}
      `;

    console.log("sql: ", sql);
    console.log("params: ", params);

    pool.query(sql, params, function (error, books) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, books.rows);
    });
  }
  function deleteBook(bookId, callback) {
    const params = [bookId];
    let sql = `delete from books where book_id=$${1}`;
    console.log("sql: ", sql);
    console.log("params: ", params);

    pool.query(sql, params, function (error, books) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, books.rows);
    });
  }
  return { getBooks, postBook, getBookByID, deleteBook };
};
