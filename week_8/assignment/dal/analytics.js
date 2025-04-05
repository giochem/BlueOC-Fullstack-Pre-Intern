module.exports = function (pgPool) {
  if (!pgPool || !pgPool.pool) {
    throw Error("Missing DB connection!");
  }
  const pool = pgPool.pool;

  function borrowingHistory(callback) {
    let sql = `SELECT
                  b.title,
                  COUNT(bh.book_id) AS borrow_count,
				          b.book_id
              FROM
                  borrowing_history bh
              JOIN
                  books b ON bh.book_id = b.book_id
              WHERE
                  bh.borrowed_date >= CURRENT_DATE - INTERVAL '6 months'
              GROUP BY
                  b.title, b.book_id
              ORDER BY
                  borrow_count DESC
              LIMIT 5;`;
    pool.query(sql, function (error, books) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, books.rows);
    });
  }
  return { borrowingHistory };
};
