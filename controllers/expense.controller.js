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

// module.exports.getExpenses = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // default page = 1
//     const limit = parseInt(req.query.limit) || 10; // default limit = 10
//     const skip = (page - 1) * limit;

//     const totalExpenses = await Expense.countDocuments(); // total count
//     const expenses = await Expense.find({})
//       .skip(skip)
//       .limit(limit)
//       .sort({ date: -1 }); // optional sorting by date (latest first)

//     res.status(200).json({
//       status: "success",
//       total: totalExpenses,
//       page,
//       pages: Math.ceil(totalExpenses / limit),
//       expenses,
//     });
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
      search = "",
      fromDate,
      toDate,
      minAmount,
      maxAmount,
      name, // NEW: name filter
    } = req.query;

    const filter = {};

    if (search) {
      filter.description = { $regex: search, $options: "i" };
    }

    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = new Date(fromDate);
      if (toDate) filter.date.$lte = new Date(toDate);
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    if (name) {
      filter.name = name; // exact match (case-sensitive by default)
    }

    const total = await Expense.countDocuments(filter);
    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      page,
      pages: Math.ceil(total / limit),
      total,
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
