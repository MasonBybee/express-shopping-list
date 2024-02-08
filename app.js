const express = require("express");
const items = require("./fakeDb");
const shoppingListRoutes = require("./shoppingListRoutes");

const app = express();
app.use(express.json());
app.use("/items", shoppingListRoutes);

// 404 handler
app.use(function (req, res, next) {
  return new ExpressError("Not Found", 404);
});

// general error handler

app.use((err, req, res, nex) => {
  res.status(err.status || 500);
  return res.json({
    error: err.message,
  });
});

module.exports = app;
