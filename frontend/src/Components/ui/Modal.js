import React, { useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { IconButton } from './Button'
import Icon from './Icon'

function Modal({title, onClose, children, width = 480}) {
    const onCloseRef = useRef(onClose)
    onCloseRef.current = onClose
    const dialogRef = useRef(null)

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onCloseRef.current()
        }
        document.addEventListener('keydown', onKey)
        // Prevent the page behind the dialog from scrolling
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const previousFocus = document.activeElement
        // Focus the first field, or the dialog itself
        const target = dialogRef.current?.querySelector('[data-autofocus]') || dialogRef.current
        target?.focus()
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = previousOverflow
            previousFocus?.focus?.()
        }
    }, [])

    return (
        <Overlay onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <Dialog
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex={-1}
                style={{maxWidth: width}}
            >
                <header>
                    <h2 id="modal-title">{title}</h2>
                    <IconButton $variant="ghost" $size="sm" aria-label="Close" onClick={onClose}>
                        <Icon name="xmark" />
                    </IconButton>
                </header>
                {children}
            </Dialog>
        </Overlay>
    )
}

const fadeIn = keyframes`
    from{ opacity: 0; }
    to{ opacity: 1; }
`;

const rise = keyframes`
    from{ opacity: 0; transform: translateY(8px) scale(.98); }
    to{ opacity: 1; transform: none; }
`;

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(17, 24, 39, .45);
    animation: ${fadeIn} .15s ease-out;
`;

const Dialog = styled.div`
    width: 100%;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
    padding: 1.5rem;
    background: var(--surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    animation: ${rise} .18s ease-out;
    &:focus{
        outline: none;
    }
    > header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1.25rem;
        h2{
            font-size: 1.125rem;
            font-weight: 600;
        }
    }
`;

export default Modal
