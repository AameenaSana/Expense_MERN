// API tests. Run with `npm test` (needs a running MongoDB).
// Uses a separate database, which is wiped before and after the run.
const { test, before, after, describe } = require('node:test')
const assert = require('node:assert/strict')

process.env.MONGO_URL = process.env.MONGO_TEST_URL || 'mongodb://127.0.0.1:27017/expense-tracker-test'

const mongoose = require('mongoose')
const app = require('../app')
const { db } = require('../db/db')

let server
let base

const request = async (method, path, body) => {
    const res = await fetch(base + path, {
        method,
        headers: body !== undefined ? {'Content-Type': 'application/json'} : undefined,
        body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    })
    const text = await res.text()
    let json
    try { json = JSON.parse(text) } catch { json = text }
    return {status: res.status, body: json}
}

const validIncome = {
    title: 'Salary',
    amount: 5000,
    category: 'salary',
    description: 'November pay',
    date: '2026-11-01',
}

before(async () => {
    await db()
    // Safety: never wipe a database that isn't clearly a test database
    const name = mongoose.connection.name
    if (!/test/i.test(name)) throw new Error(`Refusing to run tests against database "${name}"`)
    await mongoose.connection.dropDatabase()
    server = app.listen(0)
    base = `http://127.0.0.1:${server.address().port}/api/v1`
})

after(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.disconnect()
    server.close()
})

describe('transactions', () => {
    test('adds and lists an income', async () => {
        const added = await request('POST', '/add-income', validIncome)
        assert.equal(added.status, 200)
        assert.equal(added.body.data.type, 'income')

        const list = await request('GET', '/get-incomes')
        assert.equal(list.status, 200)
        assert.equal(list.body.length, 1)
        assert.equal(list.body[0].amount, 5000)
    })

    test('note is optional and amounts are rounded to cents', async () => {
        const {description, ...rest} = validIncome
        const res = await request('POST', '/add-expense', {...rest, category: 'groceries', amount: '12.345'})
        assert.equal(res.status, 200)
        assert.equal(res.body.data.description, '')
        assert.equal(res.body.data.amount, 12.35)
    })

    test('rejects invalid input with 400 and a message', async () => {
        const cases = [
            [{...validIncome, amount: 'abc'}, /Amount must be a positive number/],
            [{...validIncome, amount: -5}, /Amount must be a positive number/],
            [{...validIncome, amount: ''}, /Amount must be a positive number/],
            [{...validIncome, title: '   '}, /Title is required/],
            [{...validIncome, title: 'x'.repeat(51)}, /Title must be at most 50/],
            [{...validIncome, date: 'not-a-date'}, /valid date/],
            [{...validIncome, category: ''}, /Category is required/],
            [{...validIncome, description: 'x'.repeat(201)}, /Note must be at most 200/],
        ]
        for (const [body, message] of cases) {
            const res = await request('POST', '/add-income', body)
            assert.equal(res.status, 400, JSON.stringify(body))
            assert.match(res.body.message, message)
        }
    })

    test('rejects malformed JSON with a JSON 400', async () => {
        const res = await request('POST', '/add-income', '{bad json')
        assert.equal(res.status, 400)
        assert.equal(res.body.message, 'Invalid request body')
    })

    test('updates an income', async () => {
        const {body: list} = await request('GET', '/get-incomes')
        const id = list[0]._id
        const res = await request('PUT', `/update-income/${id}`, {...validIncome, title: 'Bonus', amount: 750})
        assert.equal(res.status, 200)
        assert.equal(res.body.data.title, 'Bonus')
        assert.equal(res.body.data.amount, 750)
    })

    test('update validates input and ids', async () => {
        const {body: list} = await request('GET', '/get-incomes')
        assert.equal((await request('PUT', `/update-income/${list[0]._id}`, {...validIncome, amount: 0})).status, 400)
        assert.equal((await request('PUT', '/update-income/not-an-id', validIncome)).status, 400)
        assert.equal((await request('PUT', '/update-income/650000000000000000000000', validIncome)).status, 404)
    })

    test('deletes, with 400 for bad ids and 404 for missing ones', async () => {
        const {body: list} = await request('GET', '/get-incomes')
        assert.equal((await request('DELETE', `/delete-income/${list[0]._id}`)).status, 200)
        assert.equal((await request('DELETE', `/delete-income/${list[0]._id}`)).status, 404)
        assert.equal((await request('DELETE', '/delete-income/not-an-id')).status, 400)
    })
})

describe('budgets', () => {
    test('creates, replaces, lists and deletes a budget', async () => {
        assert.equal((await request('PUT', '/budgets/groceries', {amount: 300})).status, 200)
        const replaced = await request('PUT', '/budgets/groceries', {amount: 450})
        assert.equal(replaced.body.data.amount, 450)

        const list = await request('GET', '/budgets')
        assert.equal(list.body.length, 1)
        assert.equal(list.body[0].amount, 450)

        assert.equal((await request('DELETE', '/budgets/groceries')).status, 200)
        assert.equal((await request('DELETE', '/budgets/groceries')).status, 404)
    })

    test('rejects non-positive budgets', async () => {
        assert.equal((await request('PUT', '/budgets/rent', {amount: 0})).status, 400)
        assert.equal((await request('PUT', '/budgets/rent', {amount: 'abc'})).status, 400)
        assert.equal((await request('PUT', '/budgets/rent', {})).status, 400)
    })
})

test('unknown API routes return JSON 404', async () => {
    const res = await request('GET', '/does-not-exist')
    assert.equal(res.status, 404)
    assert.equal(res.body.message, 'Not Found')
})
