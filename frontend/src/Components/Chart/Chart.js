import React from 'react'
import {Chart as ChartJs,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'

import {Line} from 'react-chartjs-2'
import styled from 'styled-components'
import moment from 'moment'
import { useGlobalContext } from '../../context/globalContext'
import { dateFormat } from '../../utils/dateFormat'

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
)

// Sum amounts per calendar day, keyed by a sortable YYYY-MM-DD string
const totalsByDay = (items) => {
    const totals = {}
    items.forEach(({date, amount}) => {
        const key = moment(date).format('YYYY-MM-DD')
        totals[key] = (totals[key] || 0) + amount
    })
    return totals
}

function Chart() {
    const {incomes, expenses} = useGlobalContext()

    // Income and expense dates differ, so build one shared, chronological x-axis
    // and line each dataset up against it (previously expenses were plotted
    // against income dates).
    const incomeTotals = totalsByDay(incomes)
    const expenseTotals = totalsByDay(expenses)
    const days = [...new Set([...Object.keys(incomeTotals), ...Object.keys(expenseTotals)])].sort()

    const data = {
        labels: days.map((day) => dateFormat(day)),
        datasets: [
            {
                label: 'Income',
                data: days.map((day) => incomeTotals[day] ?? null),
                backgroundColor: 'green',
                borderColor: 'green',
                spanGaps: true,
                tension: .2
            },
            {
                label: 'Expenses',
                data: days.map((day) => expenseTotals[day] ?? null),
                backgroundColor: 'red',
                borderColor: 'red',
                spanGaps: true,
                tension: .2
            }
        ]
    }


    return (
        <ChartStyled >
            <Line data={data} />
        </ChartStyled>
    )
}

const ChartStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    height: 100%;
`;

export default Chart
