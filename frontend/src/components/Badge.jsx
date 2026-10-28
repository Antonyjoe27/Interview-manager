import React from 'react';

/**
 * Reusable Status Badge Component
 * Variants: 'success', 'warning', 'error', 'info', 'neutral', 'primary'
 * Sizes: 'sm', 'md'
 */
export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) {
  return (
    <span className={`app-badge app-badge--${variant} app-badge--${size} ${className}`} {...props}>
      {dot && <span className="app-badge__dot" aria-hidden="true" />}
      <span className="app-badge__content">{children}</span>
    </span>
  );
}

export const StatusBadge = Badge;

export default Badge;
