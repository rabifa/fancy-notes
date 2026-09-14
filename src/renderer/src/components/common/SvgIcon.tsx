import React from 'react'

interface SvgIconProps {
  src: string
  alt?: string
  className?: string
  size?: number | string
  style?: React.CSSProperties
}

export const SvgIcon: React.FC<SvgIconProps> = ({
  src,
  alt = '',
  className = '',
  size = 16,
  style = {}
}) => {
  return (
    <span
      role="img"
      aria-label={alt}
      className={`svg-icon ${className}`.trim()}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        minWidth: typeof size === 'number' ? `${size}px` : size,
        minHeight: typeof size === 'number' ? `${size}px` : size,
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        backgroundColor: 'currentColor',
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style
      }}
    />
  )
}

export default SvgIcon
