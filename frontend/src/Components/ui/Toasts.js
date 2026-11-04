import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import Icon from './Icon'

function Toasts() {
    const {toasts, dismissToast} = useGlobalContext()

    return (
        <Region role="status" aria-live="polite">
            {toasts.map((toast) => (
                <Toast key={toast.id} className={toast.kind}>
                    <Icon name={toast.kind === 'error' ? 'circle-exclamation' : 'circle-check'} />
                    <span>{toast.message}</span>
                    <button aria-label="Dismiss" onClick={() => dismissToast(toast.id)}>
                        <Icon name="xmark" />
                    </button>
                </Toast>
            ))}
        </Region>
    )
}

const slideIn = keyframes`
    from{ opacity: 0; transform: translateY(8px); }
    to{ opacity: 1; transform: none; }
`;

const Region = styled.div`
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 60;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    width: min(360px, calc(100vw - 2rem));
`;

const Toast = styled.div`
    display: flex;
    align-items: center;
    gap: .75rem;
    padding: .75rem 1rem;
    background: #111827;
    color: #fff;
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-lg);
    font-size: .875rem;
    animation: ${slideIn} .18s ease-out;
    > i{
        color: #34d399;
    }
    &.error > i{
        color: #f87171;
    }
    span{
        flex: 1;
    }
    button{
        background: none;
        border: none;
        color: #9ca3af;
        padding: .25rem;
        &:hover{
            color: #fff;
        }
    }
`;

export default Toasts
