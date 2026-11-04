import React from 'react'
import {
    Chart as ChartJs,
    ArcElement,
    BarElement,
    CategoryScale,
    Legend,
    LinearScale,
    Tooltip,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { formatCompactCurrency, formatCurrency } from '../../utils/format'

ChartJs.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip)

ChartJs.defaults.font.family = "'Inter', system-ui, sans-serif"
ChartJs.defaults.color = '#6b7280'

// Income vs expenses per month
export function TrendChart({labels, income, expense, currency}) {
    const data = {
        labels,
        datasets: [
            {label: 'Income', data: income, backgroundColor: '#10b981', borderRadius: 4, maxBarThickness: 28},
            {label: 'Expenses', data: expense, backgroundColor: '#f87171', borderRadius: 4, maxBarThickness: 28},
        ],
    }
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {mode: 'index', intersect: false},
        plugins: {
            legend: {position: 'bottom', labels: {usePointStyle: true, boxWidth: 8, padding: 16}},
            tooltip: {callbacks: {label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y, currency)}`}},
        },
        scales: {
            x: {grid: {display: false}},
            y: {
                beginAtZero: true,
                border: {display: false},
                grid: {color: '#f0f1f4'},
                ticks: {callback: (v) => formatCompactCurrency(v, currency), maxTicksLimit: 6},
            },
        },
    }
    return <Bar data={data} options={options} aria-label="Income and expenses by month" role="img" />
}

// Share of spending per category
export function CategoryChart({items, currency}) {
    const data = {
        labels: items.map((i) => i.label),
        datasets: [{
            data: items.map((i) => i.amount),
            backgroundColor: items.map((i) => i.color),
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 4,
        }],
    }
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {display: false},
            tooltip: {callbacks: {label: (ctx) => ` ${ctx.label}: ${formatCurrency(ctx.parsed, currency)}`}},
        },
    }
    return <Doughnut data={data} options={options} aria-label="Spending by category" role="img" />
}
