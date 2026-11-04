import styled, { css } from 'styled-components'

const variants = {
    primary: css`
        background: var(--primary);
        border-color: var(--primary);
        color: #fff;
        &:hover:not(:disabled){
            background: var(--primary-hover);
            border-color: var(--primary-hover);
        }
    `,
    secondary: css`
        background: var(--surface);
        border-color: var(--border);
        color: var(--text);
        &:hover:not(:disabled){
            background: var(--surface-2);
            border-color: var(--border-strong);
        }
    `,
    ghost: css`
        background: transparent;
        border-color: transparent;
        color: var(--text-muted);
        &:hover:not(:disabled){
            background: var(--surface-2);
            color: var(--text);
        }
    `,
    danger: css`
        background: var(--expense);
        border-color: var(--expense);
        color: #fff;
        &:hover:not(:disabled){
            filter: brightness(.92);
        }
    `,
}

// Defaults to type="button" so buttons inside forms never submit by accident
export const Button = styled.button.attrs((props) => ({type: props.type || 'button'}))`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    height: ${(p) => (p.$size === 'sm' ? '32px' : '40px')};
    padding: 0 ${(p) => (p.$size === 'sm' ? '.75rem' : '1rem')};
    border: 1px solid;
    border-radius: var(--radius-sm);
    font-size: ${(p) => (p.$size === 'sm' ? '.85rem' : '.9rem')};
    font-weight: 500;
    white-space: nowrap;
    transition: background .15s, border-color .15s, color .15s, filter .15s;
    ${(p) => variants[p.$variant || 'primary']}
    &:disabled{
        opacity: .55;
        cursor: not-allowed;
    }
`;

export const IconButton = styled(Button)`
    width: ${(p) => (p.$size === 'sm' ? '32px' : '40px')};
    padding: 0;
    flex-shrink: 0;
`;
