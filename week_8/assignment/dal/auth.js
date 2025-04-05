module.exports = function (pgPool) {
  if (!pgPool || !pgPool.pool) {
    throw Error("Missing DB connection!");
  }
  const pool = pgPool.pool;

  function loginUser(username, password, callback) {
    console.log("login attempt: ", { username });

    const params = [username];
    let sql = `
            select  username,
                    password,
                    role
            from    users
            where   username=$${1}
        `;

    console.log("sql: ", sql);
    console.log("params: ", params);

    pool.query(sql, params, function (error, result) {
      if (error) {
        throw error;
      }

      const user = result.rows[0];

      if (!user) {
        return callback(null, null);
      }

      return callback(null, {
        username: user.username,
        password: user.password,
        role: user.role,
      });
    });
  }

  return { loginUser };
};
