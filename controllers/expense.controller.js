const Expense = require("../models/Expense");

// module.exports.getExpenses = async (req, res) => {
//   try {
//     const expenses = await Expense.find({});
//     res.status(200).send(expenses);
//   } catch (error) {
//     res.status(500).json({
//       status: "fail",
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

module.exports.getExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default page = 1
    const limit = parseInt(req.query.limit) || 10; // default limit = 10
    const skip = (page - 1) * limit;

    const totalExpenses = await Expense.countDocuments(); // total count
    const expenses = await Expense.find({})
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 }); // optional sorting by date (latest first)

    res.status(200).json({
      status: "success",
      total: totalExpenses,
      page,
      pages: Math.ceil(totalExpenses / limit),
      expenses,
    });
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
    const { expensesId } = req.params;

    const updatedExpense = await Expense.findByIdAndUpdate(
      expensesId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        status: "fail",
        message: "Expense not found!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Expense updated successfully!",
      data: updatedExpense,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports.deleteExpense = async (req, res) => {
  try {
    const { expensesId } = req.params;
    const updateExpense = await Expense.findByIdAndDelete(expensesId);
    res.status(200).json({
      status: "success",
      message: "Expense deleted successfully",
      data: updateExpense,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};
