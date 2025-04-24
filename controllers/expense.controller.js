const Expense = require("../models/Expense");

module.exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({});
    res.status(200).send(expenses);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.addExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(200).send(expense);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findByIdAndUpdate(expenseId, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findByIdAndDelete(expenseId);
    res.status(200).json({
      status: "success",
      message: "Expense deleted successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};
