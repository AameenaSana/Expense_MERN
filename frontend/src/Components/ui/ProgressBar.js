import React from 'react'
import styled from 'styled-components'

// Colour shifts from green to amber (80%+) to red (over 100%)
export const progressTone = (ratio) => (ratio > 1 ? 'over' : ratio >= 0.8 ? 'near' : 'ok')

function ProgressBar({ratio, label}) {
    const tone = progressTone(ratio)
    return (
        <Track
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(Math.min(ratio, 1) * 100)}
        >
            <Fill className={tone} style={{width: `${Math.min(ratio, 1) * 100}%`}} />
        </Track>
    )
}

const Track = styled.div`
    height: 8px;
    border-radius: 999px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    overflow: hidden;
`;

const Fill = styled.div`
    height: 100%;
    border-radius: 999px;
    transition: width .3s ease;
    &.ok{ background: var(--income); }
    &.near{ background: var(--warning); }
    &.over{ background: var(--expense); }
`;

export default ProgressBar
