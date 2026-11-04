import {createGlobalStyle} from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    :root{
        color-scheme: light;

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
        --primary-text: #4f46e5;

        --income: #059669;
        --income-soft: #d1fae5;
        --expense: #dc2626;
        --expense-soft: #fee2e2;
        --expense-text: #991b1b;
        --warning: #d97706;
        --warning-soft: #fef3c7;
        --warning-text: #92400e;
        --danger: #dc2626;

        --chart-income: #10b981;
        --chart-expense: #f87171;

        --radius: 12px;
        --radius-sm: 8px;
        --shadow: 0 1px 2px rgba(16, 24, 40, .04), 0 1px 3px rgba(16, 24, 40, .06);
        --shadow-lg: 0 24px 48px -12px rgba(16, 24, 40, .25);
    }

    /* Dark theme: deep navy surfaces, softened accents for contrast */
    :root[data-theme="dark"]{
        color-scheme: dark;

        --bg: #0b0f1a;
        --surface: #121826;
        --surface-2: #1a2131;
        --border: #232c3d;
        --border-strong: #334155;
        --text: #f1f5f9;
        --text-muted: #94a3b8;
        --text-subtle: #64748b;

        --primary: #6366f1;
        --primary-hover: #4f46e5;
        --primary-soft: rgba(99, 102, 241, .16);
        --primary-text: #a5b4fc;

        --income: #34d399;
        --income-soft: rgba(52, 211, 153, .14);
        --expense: #f87171;
        --expense-soft: rgba(248, 113, 113, .14);
        --expense-text: #fca5a5;
        --warning: #fbbf24;
        --warning-soft: rgba(251, 191, 36, .14);
        --warning-text: #fcd34d;
        --danger: #dc2626;

        --chart-income: #34d399;
        --chart-expense: #f87171;

        --shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 1px 3px rgba(0, 0, 0, .25);
        --shadow-lg: 0 24px 48px -12px rgba(0, 0, 0, .6);
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

    /* Theme switch: the new theme is revealed with a circle animated in JS,
       so turn off the default cross-fade */
    ::view-transition-old(root),
    ::view-transition-new(root){
        animation: none;
        mix-blend-mode: normal;
    }

    @media (prefers-reduced-motion: reduce){
        *, *::before, *::after{
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
