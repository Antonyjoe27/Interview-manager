import React from 'react';
import Icon from './Icon';

/**
 * Reusable Icon Button
 * Provides accessible button controls for toolbars and headers
 */
export function IconButton({
  icon,
  name,
  'aria-label': ariaLabel,
  variant = 'subtle',
  size = 'md',
  badge,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const iconElement = icon || (name ? <Icon name={name} size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} /> : null);

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={`app-icon-btn app-icon-btn--${variant} app-icon-btn--${size} ${className}`}
      {...props}
    >
      {iconElement}
      {badge && <span className="app-icon-btn__badge">{badge}</span>}
    </button>
  );
}

export default IconButton;
