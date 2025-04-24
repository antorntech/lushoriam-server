const express = require("express");
const app = express.Router();

const expenseController = require("../../controllers/expense.controller");

const { auth } = require("../../middleware/auth");

app.get("/", auth, expenseController.getExpenses);
app.post("/add", auth, expenseController.addExpense);
app.put("/update/:expensesId", auth, expenseController.updateExpense);
app.delete("/delete/:expensesId", auth, expenseController.deleteExpense);

module.exports = app;
