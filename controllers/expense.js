const Expense = require('../models/expense');

exports.createExpense = (req, res) => {
  console.log("Received post request for expense...");

  const expenseInfo = new Expense({
    creator: req.authInfo.userId,
    id: req.body.id,
    title: req.body.title,
    category: req.body.category,
    currency: req.body.currency,
    amount: req.body.amount,
    date: req.body.date,
    description: req.body.description,
    label: req.body.label,
    rank: 0,
    version: 1,
    locked: false,
    personal: true
  });

  expenseInfo.save().then(result => {
    res.status(201).send(result);
  });
}

exports.getExpenses = (req, res) => {
  console.log("Received get request for expenses...")

  const user = req.authInfo.userId;
  let retrievedExpenses;

  Expense.find({creator: user})
    .then(expenses => {
      retrievedExpenses = expenses;
      return Expense.count({creator: user});
    })
    .then(count => {
      res.status(200).json({
        total: count,
        expenses: retrievedExpenses
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Retrieving expenses failed!"
      });
    });
}

exports.updateExpense = (req, res) => {
  console.log("Received put request for expenses...");

  Expense.findOne({_id: req.params.id})
    .then(expense => {
      if (expense) {
        expense.title = req.body.title;
        expense.category = req.body.category;
        expense.currency = req.body.currency;
        expense.amount = req.body.amount;
        expense.date = req.body.date;
        expense.description = req.body.description;
        expense.label = req.body.label;
        expense.version++;

        Expense.updateOne({_id: req.params.id}, expense)
          .then(result => {
            res.status(200).send(expense);
          });
      } else {
        res.status(404).json({message: 'Expense not found!'});
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Updating expense failed!"
      });
    });
}

exports.deleteExpense = (req, res) => {
  console.log("Received delete request for expenses...");

  Expense.findOne({_id: req.params.id})
    .then(expense => {
      if (expense) {
        Expense.deleteOne({_id: req.params.id, creator: req.authInfo.userId})
          .then(result => {
            if (result.n > 0) {
              res.status(200).json({ message: "Deleted successfully!"});
            } else {
              res.status(401).json({ message: "Not authorized!"});
            }
          });
      } else {
        res.status(404).json({message: 'Expense not found!'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting expense failed!"
      });
    });
}