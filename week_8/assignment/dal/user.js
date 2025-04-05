const { param } = require("../routes/user");

module.exports = function (pgPool) {
  if (!pgPool || !pgPool.pool) {
    throw Error("Missing DB connection!");
  }
  const pool = pgPool.pool;

  function postUser(newUser, callback) {
    console.log("new user: ", newUser);
    const { username, name, password, role } = newUser;

    const params = [username, name, password, role || "user"];
    let sql = `
          insert into users(username, name, password, role)
          values($${1}, $${2}, $${3}, $${4})
          returning user_id, username, name, role
      `;

    console.log("sql: ", sql);
    console.log("params: ", params);

    pool.query(sql, params, function (error, result) {
      if (error) {
        return callback(error, null);
      }
      console.log("user: ", result.rows);
      return callback(null, result.rows);
    });
  }
  function getUserByUsername(username, callback) {
    let params = [username];
    let sql = `select user_id, username, name, role from users where username=$${1}`;

    console.log("sql: ", sql);
    console.log("params: ", params);
    pool.query(sql, params, function (error, result) {
      if (error) {
        return callback(error, null);
      }
      console.log("result: ", result.rows);
      return callback(null, result.rows);
    });
  }
  function getUsers(callback) {
    let sql = `
          select  user_id,
                  username,
                  name,
                  role
          from    users
      `;
    const params = [];

    console.log("sql: ", sql);
    console.log("params: ", params);

    pool.query(sql, params, function (error, result) {
      if (error) {
        return callback(error, null);
      }
      console.log("users: ", result.rows);
      return callback(null, result.rows);
    });
  }

  function getUserById(userId, callback) {
    const params = [userId];

    let sql = `
          select  user_id,
                  username,
                  name,
                  role
          from    users
          where   user_id = $${1}
      `;

    console.log("sql: ", sql);
    console.log("params: ", params);

    pool.query(sql, params, function (error, result) {
      if (error) {
        return callback(error, null);
      }
      console.log("user: ", result.rows);
      return callback(null, result.rows);
    });
  }

  function updateUser(userId, updatedUser, callback) {
    console.log("updated user: ", updatedUser);
    const { username, name, password, role } = updatedUser;

    let sql = `
          update  users
          set
      `;
    const params = [];
    let hasUpdate = false;

    if (username) {
      sql += ` username = $${params.length + 1}`;
      params.push(username);
      hasUpdate = true;
    }
    if (name) {
      sql += `${hasUpdate ? "," : ""} name = $${params.length + 1}`;
      params.push(name);
      hasUpdate = true;
    }
    if (password) {
      sql += `${hasUpdate ? "," : ""} password = $${params.length + 1}`;
      params.push(password);
      hasUpdate = true;
    }
    if (role) {
      sql += `${hasUpdate ? "," : ""} role = $${params.length + 1}`;
      params.push(role);
      hasUpdate = true;
    }

    sql += `
          where   user_id = $${params.length + 1}
      `;
    params.push(userId);

    console.log("sql: ", sql);
    console.log("params: ", params);

    pool.query(sql, params, function (error, result) {
      if (error) {
        return callback(error, null);
      }
      console.log("updated user: ", result.rows);
      return callback(null, result.rows);
    });
  }

  function deleteUser(userId, callback) {
    const params = [userId];

    let sql = `
          delete from users
          where   user_id = $${1}
      `;

    console.log("sql: ", sql);
    console.log("params: ", params);

    pool.query(sql, params, function (error, result) {
      if (error) {
        return callback(error, null);
      }
      console.log("delete result: ", result.rows);
      return callback(null, result.rows);
    });
  }

  return {
    postUser,
    getUserByUsername,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
  };
};
