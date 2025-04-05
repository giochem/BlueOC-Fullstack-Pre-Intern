const express = require("express");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/book");
const analytics = require("./routes/analytics");
const middlewares = require("./middleware")();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/users", middlewares.authenticateToken, userRoutes);
app.use("/auth", authRoutes);
app.use("/api/books", middlewares.authenticateToken, bookRoutes);
app.use("/api/analytics", middlewares.authenticateToken, analytics);
app.listen(PORT, function () {
  console.log("Listening to port " + PORT);
});
