import React from 'react'
import styled from 'styled-components'
import Icon from '../ui/Icon'

// `change` is a percentage vs the previous period (or null).
// `upIsGood` decides whether an increase is shown as positive or negative.
function StatCard({label, value, icon, tone, change, changeLabel, footnote, upIsGood = true}) {
    let changeEl = null
    if (change !== null && change !== undefined && Number.isFinite(change)) {
        const up = change > 0
        const good = change === 0 ? null : up === upIsGood
        changeEl = (
            <span className={`change ${good === null ? '' : good ? 'good' : 'bad'}`}>
                <Icon name={up ? 'arrow-up' : change < 0 ? 'arrow-down' : 'minus'} />
                {Math.abs(Math.round(change))}%
                <span className="vs">{changeLabel}</span>
            </span>
        )
    }

    return (
        <Card>
            <div className="top">
                <span className="label">{label}</span>
                <span className={`icon ${tone}`}><Icon name={icon} /></span>
            </div>
            <span className="value num">{value}</span>
            <div className="foot">
                {changeEl || <span className="footnote">{footnote}</span>}
            </div>
        </Card>
    )
}

const Card = styled.div`
    display: flex;
    flex-direction: column;
    gap: .5rem;
    min-width: 0;
    padding: 1.25rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);

    .top{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .label{
        color: var(--text-muted);
        font-size: .875rem;
        font-weight: 500;
    }
    .icon{
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        font-size: .875rem;
        &.income{ background: var(--income-soft); color: var(--income); }
        &.expense{ background: var(--expense-soft); color: var(--expense); }
        &.primary{ background: var(--primary-soft); color: var(--primary); }
        &.neutral{ background: var(--surface-2); color: var(--text-muted); }
    }
    .value{
        font-size: 1.6rem;
        font-weight: 700;
        letter-spacing: -.02em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .foot{
        font-size: .8rem;
        color: var(--text-muted);
        min-height: 1.2em;
    }
    .change{
        display: inline-flex;
        align-items: center;
        gap: .25rem;
        font-weight: 600;
        &.good{ color: var(--income); }
        &.bad{ color: var(--expense); }
        .vs{
            color: var(--text-muted);
            font-weight: 400;
            margin-left: .25rem;
        }
    }
`;

export default StatCard
