const IncomeSchema = require("../models/IncomeModel")
const { addTransaction, getTransactions, updateTransaction, deleteTransaction } = require("./transactionHelpers")

exports.addIncome = addTransaction(IncomeSchema, 'Income')
exports.getIncomes = getTransactions(IncomeSchema)
exports.updateIncome = updateTransaction(IncomeSchema, 'Income')
exports.deleteIncome = deleteTransaction(IncomeSchema, 'Income')
