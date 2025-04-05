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

    pool.query(sql, params, function (error, result) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, result.rows);
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

    pool.query(sql, params, function (error, result) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, result.rows);
    });
  }
  function deleteBook(bookId, callback) {
    const params = [bookId];
    let sql = `delete from books where book_id=$${1}`;
    console.log("sql: ", sql);
    console.log("params: ", params);

    pool.query(sql, params, function (error, result) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, result.rows);
    });
  }
  function borrowingBook(info, callback) {
    const { userId, bookId, borrowedDate, returnedDate } = info;

    const params = [userId, bookId, borrowedDate, returnedDate];
    let sql = `
                insert into 
                borrowing_history(user_id,book_id,borrowed_date,returned_date)
                values($${1},$${2},$${3},$${4})`;

    console.log("sql: ", sql);
    console.log("params: ", params);
    pool.query(sql, params, function (error, result) {
      if (error) {
        console.log(error);
        return callback(error, null);
      }
      return callback(null, result.rows);
    });
  }
  return { getBooks, postBook, getBookByID, deleteBook, borrowingBook };
};
