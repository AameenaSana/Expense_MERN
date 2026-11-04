const ExpenseSchema = require("../models/ExpenseModel")
const { addTransaction, getTransactions, updateTransaction, deleteTransaction } = require("./transactionHelpers")

exports.addExpense = addTransaction(ExpenseSchema, 'Expense')
exports.getExpense = getTransactions(ExpenseSchema)
exports.updateExpense = updateTransaction(ExpenseSchema, 'Expense')
exports.deleteExpense = deleteTransaction(ExpenseSchema, 'Expense')
