import React from 'react';

/**
 * Reusable Section Heading Component
 */
export function SectionHeading({
  title,
  subtitle,
  badge,
  actions,
  className = '',
  ...props
}) {
  return (
    <header className={`app-section-heading ${className}`} {...props}>
      <div className="app-section-heading__text">
        <div className="app-section-heading__title-row">
          <h1 className="app-section-heading__title">{title}</h1>
          {badge && <div className="app-section-heading__badge">{badge}</div>}
        </div>
        {subtitle && <p className="app-section-heading__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="app-section-heading__actions">{actions}</div>}
    </header>
  );
}

export default SectionHeading;
