import {createGlobalStyle} from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    :root{
        --bg: #f5f6fa;
        --surface: #ffffff;
        --surface-2: #f8f9fb;
        --border: #e5e7eb;
        --border-strong: #d1d5db;
        --text: #111827;
        --text-muted: #6b7280;
        --text-subtle: #9ca3af;

        --primary: #4f46e5;
        --primary-hover: #4338ca;
        --primary-soft: #eef2ff;

        --income: #059669;
        --income-soft: #d1fae5;
        --expense: #dc2626;
        --expense-soft: #fee2e2;
        --warning: #d97706;
        --warning-soft: #fef3c7;

        --radius: 12px;
        --radius-sm: 8px;
        --shadow: 0 1px 2px rgba(16, 24, 40, .04), 0 1px 3px rgba(16, 24, 40, .06);
        --shadow-lg: 0 24px 48px -12px rgba(16, 24, 40, .25);
    }

    *, *::before, *::after{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html, body, #root{
        min-height: 100%;
    }

    body{
        font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        font-size: 15px;
        line-height: 1.5;
        color: var(--text);
        background: var(--bg);
        -webkit-font-smoothing: antialiased;
    }

    h1, h2, h3, h4{
        color: var(--text);
        line-height: 1.25;
    }

    button, input, select, textarea{
        font: inherit;
        color: inherit;
    }

    button{
        cursor: pointer;
    }

    ul, ol{
        list-style: none;
    }

    :focus-visible{
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }

    .num{
        font-variant-numeric: tabular-nums;
    }

    .sr-only{
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
    }

    @media (prefers-reduced-motion: reduce){
        *, *::before, *::after{
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
