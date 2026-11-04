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
import { useTheme } from '../../context/themeContext'
import { formatCompactCurrency, formatCurrency } from '../../utils/format'

ChartJs.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip)

ChartJs.defaults.font.family = "'Inter', system-ui, sans-serif"

// Chart.js draws on a canvas and can't read CSS variables, so the palette
// is chosen from the theme here. The charts re-render when the theme changes.
const PALETTE = {
    light: {text: '#6b7280', grid: '#f0f1f4', surface: '#ffffff', income: '#10b981', expense: '#f87171'},
    dark: {text: '#94a3b8', grid: '#232c3d', surface: '#121826', income: '#34d399', expense: '#f87171'},
}

// Income vs expenses per month
export function TrendChart({labels, income, expense, currency}) {
    const {theme} = useTheme()
    const c = PALETTE[theme]
    const data = {
        labels,
        datasets: [
            {label: 'Income', data: income, backgroundColor: c.income, borderRadius: 4, maxBarThickness: 28},
            {label: 'Expenses', data: expense, backgroundColor: c.expense, borderRadius: 4, maxBarThickness: 28},
        ],
    }
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {mode: 'index', intersect: false},
        plugins: {
            legend: {position: 'bottom', labels: {usePointStyle: true, boxWidth: 8, padding: 16, color: c.text}},
            tooltip: {callbacks: {label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y, currency)}`}},
        },
        scales: {
            x: {grid: {display: false}, ticks: {color: c.text}},
            y: {
                beginAtZero: true,
                border: {display: false},
                grid: {color: c.grid},
                ticks: {color: c.text, callback: (v) => formatCompactCurrency(v, currency), maxTicksLimit: 6},
            },
        },
    }
    return <Bar data={data} options={options} aria-label="Income and expenses by month" role="img" />
}

// Share of spending per category
export function CategoryChart({items, currency}) {
    const {theme} = useTheme()
    const data = {
        labels: items.map((i) => i.label),
        datasets: [{
            data: items.map((i) => i.amount),
            backgroundColor: items.map((i) => i.color),
            borderWidth: 2,
            borderColor: PALETTE[theme].surface,
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
