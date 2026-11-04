import React from 'react'
import { flushSync } from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { useTheme } from '../../context/themeContext'

// A small sky: the sun rolls across and becomes a moon, clouds drift away
// and stars come out. The page then switches theme with a circular reveal
// that grows from wherever the toggle was clicked.
function ThemeToggle() {
    const {theme, setTheme} = useTheme()
    const dark = theme === 'dark'

    const toggle = (e) => {
        const next = dark ? 'light' : 'dark'
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

        if (!document.startViewTransition || reduceMotion) {
            setTheme(next)
            return
        }

        // Reveal from the click point (or the toggle's centre for keyboard use)
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.detail > 0 ? e.clientX : rect.left + rect.width / 2
        const y = e.detail > 0 ? e.clientY : rect.top + rect.height / 2
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

        const transition = document.startViewTransition(() => {
            flushSync(() => setTheme(next))
        })
        transition.ready
            .then(() => {
                document.documentElement.animate(
                    {clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]},
                    {duration: 650, easing: 'cubic-bezier(.4, 0, .2, 1)', pseudoElement: '::view-transition-new(root)'}
                )
            })
            .catch(() => {})
    }

    return (
        <Switch
            type="button"
            role="switch"
            aria-checked={dark}
            aria-label="Dark mode"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={dark ? 'dark' : 'light'}
            onClick={toggle}
        >
            <span className="sky day" />
            <span className="sky night" />
            <span className="star s1" />
            <span className="star s2" />
            <span className="star s3" />
            <span className="cloud c1" />
            <span className="cloud c2" />
            <span className="orb">
                <span className="crater k1" />
                <span className="crater k2" />
                <span className="crater k3" />
            </span>
        </Switch>
    )
}

const twinkle = keyframes`
    0%, 100%{ opacity: 1; transform: scale(1); }
    50%{ opacity: .35; transform: scale(.6); }
`;

const drift = keyframes`
    0%, 100%{ transform: translateX(0); }
    50%{ transform: translateX(-2px); }
`;

const bounce = 'cubic-bezier(.68, -0.4, .27, 1.4)'

const Switch = styled.button`
    position: relative;
    flex-shrink: 0;
    width: 60px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 999px;
    overflow: hidden;
    isolation: isolate;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, .25);
    transition: box-shadow .2s;

    &:hover{
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, .25), 0 0 0 3px var(--primary-soft);
    }

    .sky{
        position: absolute;
        inset: 0;
        transition: opacity .5s ease;
    }
    .day{
        background: linear-gradient(180deg, #7dd3fc 0%, #38bdf8 100%);
    }
    .night{
        background: linear-gradient(180deg, #1e1b4b 0%, #3730a3 100%);
        opacity: 0;
    }
    &.dark .day{ opacity: 0; }
    &.dark .night{ opacity: 1; }

    /* Stars come out at night */
    .star{
        position: absolute;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: #fff;
        opacity: 0;
        transform: translateY(-6px);
        transition: opacity .4s ease, transform .5s ${bounce};
    }
    .s1{ top: 7px; left: 10px; }
    .s2{ top: 17px; left: 20px; width: 2px; height: 2px; }
    .s3{ top: 9px; left: 27px; width: 2px; height: 2px; }
    &.dark .star{
        opacity: 1;
        transform: none;
        animation: ${twinkle} 2.4s ease-in-out infinite;
    }
    &.dark .s2{ animation-delay: .8s; }
    &.dark .s3{ animation-delay: 1.6s; }

    /* Clouds drift away at night */
    .cloud{
        position: absolute;
        background: #fff;
        border-radius: 999px;
        transition: opacity .35s ease, transform .5s ${bounce};
        animation: ${drift} 4s ease-in-out infinite;
    }
    .cloud::before{
        content: '';
        position: absolute;
        background: inherit;
        border-radius: 50%;
    }
    .c1{
        width: 16px;
        height: 6px;
        right: 8px;
        bottom: 8px;
    }
    .c1::before{
        width: 8px;
        height: 8px;
        left: 3px;
        top: -4px;
    }
    .c2{
        width: 10px;
        height: 4px;
        right: 18px;
        top: 8px;
        opacity: .85;
        animation-delay: 1s;
    }
    .c2::before{
        width: 5px;
        height: 5px;
        left: 2px;
        top: -3px;
    }
    &.dark .cloud{
        opacity: 0;
        transform: translateY(10px);
    }

    /* The sun rolls across and becomes the moon */
    .orb{
        position: absolute;
        top: 4px;
        left: 4px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #fde047;
        box-shadow: 0 0 0 3px rgba(253, 224, 71, .3), 0 0 14px rgba(253, 224, 71, .9);
        transform: translateX(0) rotate(0deg);
        transition: transform .55s ${bounce}, background .4s ease, box-shadow .4s ease;
    }
    &.dark .orb{
        background: #e2e8f0;
        box-shadow: 0 0 0 3px rgba(226, 232, 240, .12), 0 0 12px rgba(199, 210, 254, .55);
        transform: translateX(28px) rotate(270deg);
    }

    .crater{
        position: absolute;
        border-radius: 50%;
        background: #cbd5e1;
        opacity: 0;
        transition: opacity .3s ease .15s;
    }
    .k1{ width: 7px; height: 7px; top: 5px; left: 11px; }
    .k2{ width: 4px; height: 4px; top: 14px; left: 6px; }
    .k3{ width: 3px; height: 3px; top: 16px; left: 14px; }
    &.dark .crater{ opacity: 1; }
`;

export default ThemeToggle
