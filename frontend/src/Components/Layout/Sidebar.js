import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { CURRENCIES } from '../../utils/categories'
import Icon from '../ui/Icon'
import { Select } from '../ui/Field'
import ThemeToggle from '../ui/ThemeToggle'

export const NAV_ITEMS = [
    {id: 'dashboard', label: 'Dashboard', icon: 'chart-pie'},
    {id: 'transactions', label: 'Transactions', icon: 'list-ul'},
    {id: 'budgets', label: 'Budgets', icon: 'bullseye'},
]

function Sidebar({page, onNavigate}) {
    const {currency, setCurrency} = useGlobalContext()

    return (
        <Nav aria-label="Main">
            <div className="brand">
                <span className="logo"><Icon name="wallet" /></span>
                <span className="brand-name">Expense Tracker</span>
            </div>

            <ul className="links">
                {NAV_ITEMS.map((item) => (
                    <li key={item.id}>
                        <button
                            className={page === item.id ? 'active' : ''}
                            aria-current={page === item.id ? 'page' : undefined}
                            onClick={() => onNavigate(item.id)}
                        >
                            <Icon name={item.icon} />
                            <span>{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>

            <div className="settings">
                <div className="theme-row">
                    <span className="setting-label">Theme</span>
                    <ThemeToggle />
                </div>
                <div className="currency">
                    <label htmlFor="currency" className="setting-label">Currency</label>
                    <Select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        {CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code}>{c.code} · {c.label}</option>
                        ))}
                    </Select>
                </div>
            </div>
        </Nav>
    )
}

const Nav = styled.nav`
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 248px;
    height: 100vh;
    flex-shrink: 0;
    padding: 1.5rem 1rem;
    background: var(--surface);
    border-right: 1px solid var(--border);

    .brand{
        display: flex;
        align-items: center;
        gap: .75rem;
        padding: 0 .5rem;
        font-weight: 700;
        font-size: 1.05rem;
        white-space: nowrap;
        .logo{
            display: grid;
            place-items: center;
            flex-shrink: 0;
            width: 36px;
            height: 36px;
            border-radius: 10px;
            background: var(--primary);
            color: #fff;
        }
    }

    .links{
        display: flex;
        flex-direction: column;
        gap: .25rem;
        flex: 1;
        button{
            display: flex;
            align-items: center;
            gap: .75rem;
            width: 100%;
            padding: .625rem .75rem;
            border: none;
            border-radius: var(--radius-sm);
            background: none;
            color: var(--text-muted);
            font-weight: 500;
            text-align: left;
            transition: background .15s, color .15s;
            i{
                width: 18px;
                text-align: center;
            }
            &:hover{
                background: var(--surface-2);
                color: var(--text);
            }
            &.active{
                background: var(--primary-soft);
                color: var(--primary-text);
            }
        }
    }

    .settings{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0 .5rem;
    }
    .theme-row{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .currency{
        display: flex;
        flex-direction: column;
        gap: .375rem;
    }
    .setting-label{
        font-size: .75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: .04em;
        color: var(--text-subtle);
    }

    @media (max-width: 900px){
        z-index: 20;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        gap: .75rem 1rem;
        width: 100%;
        height: auto;
        padding: .75rem 1rem;
        border-right: none;
        border-bottom: 1px solid var(--border);
        .brand{
            padding: 0;
            flex: 1;
        }
        .settings{
            flex-direction: row;
            align-items: center;
            gap: .75rem;
            padding: 0;
        }
        .setting-label{
            display: none;
        }
        .currency select{
            height: 36px;
            width: auto;
        }
        .links{
            order: 3;
            flex-basis: 100%;
            flex-direction: row;
            overflow-x: auto;
            button{
                width: auto;
                white-space: nowrap;
                padding: .5rem .75rem;
            }
        }
    }

    @media (max-width: 440px){
        .brand-name{
            display: none;
        }
    }
`;

export default Sidebar
