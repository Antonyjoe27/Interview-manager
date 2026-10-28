import React from 'react';
import Icon from './Icon';

/**
 * Reusable Button Component
 * Supports variants: 'primary', 'secondary', 'subtle', 'danger'
 * Supports sizes: 'sm', 'md', 'lg'
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  ...props
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`app-btn app-btn--${variant} app-btn--${size} ${isLoading ? 'app-btn--loading' : ''} ${className}`}
      {...props}
    >
      {isLoading && (
        <span className="app-btn__spinner">
          <Icon name="spinner" size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
        </span>
      )}
      {!isLoading && leftIcon && <span className="app-btn__icon-left">{leftIcon}</span>}
      <span className="app-btn__text">{children}</span>
      {!isLoading && rightIcon && <span className="app-btn__icon-right">{rightIcon}</span>}
    </button>
  );
}

export default Button;
