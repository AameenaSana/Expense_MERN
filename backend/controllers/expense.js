const ExpenseSchema = require("../models/ExpenseModel")
const { addTransaction, getTransactions, deleteTransaction } = require("./transactionHelpers")

exports.addExpense = addTransaction(ExpenseSchema, 'Expense')
exports.getExpense = getTransactions(ExpenseSchema)
exports.deleteExpense = deleteTransaction(ExpenseSchema, 'Expense')
