import React, { forwardRef } from 'react';
import Icon from './Icon';

/**
 * Reusable Select/Dropdown Component
 */
export const Select = forwardRef(function Select(
  {
    label,
    id,
    name,
    value,
    defaultValue,
    onChange,
    options = [],
    error,
    helperText,
    disabled = false,
    required = false,
    placeholder = 'Select an option',
    className = '',
    ...props
  },
  ref
) {
  const selectId = id || name;

  return (
    <div className={`app-input-group ${error ? 'app-input-group--error' : ''} ${disabled ? 'app-input-group--disabled' : ''} ${className}`}>
      {label && (
        <label htmlFor={selectId} className="app-input-label">
          {label}
          {required && <span className="app-input-required">*</span>}
        </label>
      )}

      <div className="app-select-wrapper">
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="app-select"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="app-select-arrow" aria-hidden="true">
          <Icon name="chevronDown" size={16} />
        </span>
      </div>

      {error ? (
        <p id={`${selectId}-error`} className="app-input-message app-input-message--error" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${selectId}-helper`} className="app-input-message">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Select;
