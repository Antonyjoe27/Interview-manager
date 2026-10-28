import React from 'react';
import Icon from './Icon';

/**
 * Reusable Empty State Component
 */
export function EmptyState({
  icon = 'sparkles',
  title = 'No items found',
  description = 'Get started by creating your first entry.',
  action,
  className = '',
  ...props
}) {
  return (
    <div className={`app-empty-state ${className}`} {...props}>
      <div className="app-empty-state__icon-wrap">
        {typeof icon === 'string' ? <Icon name={icon} size={28} /> : icon}
      </div>
      <h3 className="app-empty-state__title">{title}</h3>
      {description && <p className="app-empty-state__description">{description}</p>}
      {action && <div className="app-empty-state__action">{action}</div>}
    </div>
  );
}

export default EmptyState;
