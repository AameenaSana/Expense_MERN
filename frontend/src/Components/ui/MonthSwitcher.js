import React from 'react'
import styled from 'styled-components'
import { Button, IconButton } from './Button'
import Icon from './Icon'
import { currentMonthKey, monthLabel, shiftMonth } from '../../utils/format'

function MonthSwitcher({value, onChange}) {
    const isCurrent = value === currentMonthKey()

    return (
        <Wrap>
            <IconButton $variant="secondary" $size="sm" aria-label="Previous month" onClick={() => onChange(shiftMonth(value, -1))}>
                <Icon name="chevron-left" />
            </IconButton>
            <span className="label" aria-live="polite">{monthLabel(value)}</span>
            <IconButton $variant="secondary" $size="sm" aria-label="Next month" onClick={() => onChange(shiftMonth(value, 1))}>
                <Icon name="chevron-right" />
            </IconButton>
            {!isCurrent && (
                <Button $variant="ghost" $size="sm" onClick={() => onChange(currentMonthKey())}>
                    This month
                </Button>
            )}
        </Wrap>
    )
}

const Wrap = styled.div`
    display: flex;
    align-items: center;
    gap: .5rem;
    flex-wrap: wrap;
    .label{
        min-width: 140px;
        text-align: center;
        font-weight: 600;
    }
`;

export default MonthSwitcher
