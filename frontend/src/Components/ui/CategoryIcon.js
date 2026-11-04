import React from 'react'
import styled from 'styled-components'
import Icon from './Icon'
import { getCategory } from '../../utils/categories'

function CategoryIcon({type, category, size = 40}) {
    const meta = getCategory(type, category)
    return (
        <Badge style={{width: size, height: size, color: meta.color, background: `${meta.color}14`}}>
            <Icon name={meta.icon} brand={meta.brand} />
        </Badge>
    )
}

const Badge = styled.span`
    display: grid;
    place-items: center;
    flex-shrink: 0;
    border-radius: 10px;
    font-size: 1rem;
`;

export default CategoryIcon
