import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { getCategory } from '../../utils/categories'
import { formatCurrency, formatDate } from '../../utils/format'
import CategoryIcon from '../ui/CategoryIcon'
import { IconButton } from '../ui/Button'
import Icon from '../ui/Icon'

function TransactionRow({transaction, onEdit, onDelete}) {
    const {currency} = useGlobalContext()
    const {title, amount, date, category, description, type} = transaction
    const categoryLabel = getCategory(type, category).label

    return (
        <Row>
            <CategoryIcon type={type} category={category} />
            <div className="text">
                <span className="title">{title}</span>
                <span className="meta">
                    {categoryLabel} · {formatDate(date)}
                    {description ? <span className="note"> · {description}</span> : null}
                </span>
            </div>
            <span className={`amount num ${type}`}>
                {type === 'expense' ? '−' : '+'}{formatCurrency(amount, currency)}
            </span>
            {(onEdit || onDelete) && (
                <div className="actions">
                    {onEdit && (
                        <IconButton $variant="ghost" $size="sm" aria-label={`Edit ${title}`} title="Edit" onClick={() => onEdit(transaction)}>
                            <Icon name="pen" />
                        </IconButton>
                    )}
                    {onDelete && (
                        <IconButton $variant="ghost" $size="sm" aria-label={`Delete ${title}`} title="Delete" onClick={() => onDelete(transaction)}>
                            <Icon name="trash-can" />
                        </IconButton>
                    )}
                </div>
            )}
        </Row>
    )
}

const Row = styled.li`
    display: flex;
    align-items: center;
    gap: .875rem;
    padding: .75rem 0;
    border-bottom: 1px solid var(--border);
    &:last-child{
        border-bottom: none;
    }
    .text{
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
    }
    .title{
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .meta{
        color: var(--text-muted);
        font-size: .8rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .amount{
        font-weight: 600;
        white-space: nowrap;
        &.income{ color: var(--income); }
        &.expense{ color: var(--text); }
    }
    .actions{
        display: flex;
        gap: .125rem;
    }
    @media (max-width: 600px){
        .note{
            display: none;
        }
    }
`;

export const TransactionList = styled.ul`
    margin: -.75rem 0;
`;

export default TransactionRow
