import React from 'react'
import styled from 'styled-components'
import Icon from './Icon'

function EmptyState({icon = 'inbox', title, message, action}) {
    return (
        <Wrap>
            <span className="icon"><Icon name={icon} /></span>
            <h3>{title}</h3>
            {message && <p>{message}</p>}
            {action}
        </Wrap>
    )
}

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: .5rem;
    padding: 2rem 1rem;
    .icon{
        display: grid;
        place-items: center;
        width: 44px;
        height: 44px;
        margin-bottom: .25rem;
        border-radius: 50%;
        background: var(--surface-2);
        border: 1px solid var(--border);
        color: var(--text-subtle);
    }
    h3{
        font-size: .95rem;
        font-weight: 600;
    }
    p{
        max-width: 320px;
        color: var(--text-muted);
        font-size: .875rem;
    }
    button{
        margin-top: .5rem;
    }
`;

export default EmptyState
