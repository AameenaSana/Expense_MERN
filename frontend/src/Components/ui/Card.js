import styled from 'styled-components'

export const Card = styled.section`
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 1.25rem;
    min-width: 0;
`;

export const CardHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
    h2{
        font-size: 1rem;
        font-weight: 600;
    }
    p{
        color: var(--text-muted);
        font-size: .85rem;
    }
`;
