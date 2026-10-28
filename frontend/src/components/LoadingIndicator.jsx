import React from 'react';
import Icon from './Icon';

/**
 * Reusable Loading Spinner Indicator
 */
export function LoadingIndicator({
  size = 'md',
  text = 'Loading...',
  inline = false,
  className = '',
  ...props
}) {
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 32 : 24;

  if (inline) {
    return (
      <span className={`app-loading-inline app-loading--${size} ${className}`} role="status" {...props}>
        <Icon name="spinner" size={iconSize} />
        {text && <span className="app-loading__text">{text}</span>}
      </span>
    );
  }

  return (
    <div className={`app-loading-container app-loading--${size} ${className}`} role="status" {...props}>
      <div className="app-loading__spinner-wrap">
        <Icon name="spinner" size={iconSize} />
      </div>
      {text && <p className="app-loading__text">{text}</p>}
    </div>
  );
}

export default LoadingIndicator;
