import styled, { css } from 'styled-components'

export const Field = styled.label`
    display: flex;
    flex-direction: column;
    gap: .375rem;
    min-width: 0;
    font-size: .85rem;
    font-weight: 500;
    color: var(--text);
`;

const control = css`
    width: 100%;
    height: 40px;
    padding: 0 .75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface);
    font-size: .9rem;
    font-weight: 400;
    transition: border-color .15s, box-shadow .15s;
    &::placeholder{
        color: var(--text-subtle);
    }
    &:focus{
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px var(--primary-soft);
    }
    &[aria-invalid="true"]{
        border-color: var(--expense);
    }
    &[aria-invalid="true"]:focus{
        box-shadow: 0 0 0 3px var(--expense-soft);
    }
`;

export const Input = styled.input`
    ${control}
`;

export const Select = styled.select`
    ${control}
    padding-right: 2rem;
    cursor: pointer;
`;

export const Textarea = styled.textarea`
    ${control}
    height: auto;
    min-height: 84px;
    padding: .6rem .75rem;
    resize: vertical;
`;

export const FieldError = styled.span`
    color: var(--expense);
    font-size: .8rem;
    font-weight: 400;
`;

export const FieldHint = styled.span`
    color: var(--text-subtle);
    font-size: .8rem;
    font-weight: 400;
`;
