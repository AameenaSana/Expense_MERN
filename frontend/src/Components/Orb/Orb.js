import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useWindowSize } from '../../utils/useWindowSize';

// Styled components must be defined outside render; creating them inside
// the component makes styled-components generate a new class on every render.
const moveOrb = (width, height) => keyframes`
    0%{
        transform: translate(0, 0);
    }
    50%{
        transform: translate(${width}px, ${height / 2}px);
    }
    100%{
        transform: translate(0, 0);
    }
`

const OrbStyled = styled.div`
    width: 70vh;
    height: 70vh;
    position: absolute;
    border-radius: 50%;
    margin-left: -37vh;
    margin-top: -37vh;
    background: linear-gradient(180deg, #F56692 0%, #F2994A 100%);
    filter: blur(400px);
    animation: ${props => moveOrb(props.$width, props.$height)} 15s alternate linear infinite;
`;

function Orb() {
    const {width, height} = useWindowSize()

    return (
        <OrbStyled $width={width} $height={height}></OrbStyled>
    )
}

export default Orb
