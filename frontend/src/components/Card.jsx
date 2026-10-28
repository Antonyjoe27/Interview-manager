import React from 'react';

/**
 * Reusable Card Components
 */
export function Card({
  children,
  hoverable = false,
  bordered = true,
  className = '',
  onClick,
  ...props
}) {
  return (
    <div
      className={`app-card ${hoverable ? 'app-card--hoverable' : ''} ${bordered ? 'app-card--bordered' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`app-card__header ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, as: Tag = 'h3', className = '', ...props }) {
  return (
    <Tag className={`app-card__title ${className}`} {...props}>
      {children}
    </Tag>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`app-card__description ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`app-card__content ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`app-card__footer ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;
