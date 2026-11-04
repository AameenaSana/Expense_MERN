import React from 'react'

// Font Awesome icon. `name` is the icon name without the "fa-" prefix.
function Icon({name, brand = false, className = ''}) {
    return <i className={`${brand ? 'fa-brands' : 'fa-solid'} fa-${name} ${className}`.trim()} aria-hidden="true" />
}

export default Icon
