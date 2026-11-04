const IncomeSchema = require("../models/IncomeModel")
const { addTransaction, getTransactions, deleteTransaction } = require("./transactionHelpers")

exports.addIncome = addTransaction(IncomeSchema, 'Income')
exports.getIncomes = getTransactions(IncomeSchema)
exports.deleteIncome = deleteTransaction(IncomeSchema, 'Income')
