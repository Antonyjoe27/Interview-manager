import React, { forwardRef } from 'react';

/**
 * Reusable Text Input Component
 */
export const Input = forwardRef(function Input(
  {
    label,
    id,
    name,
    type = 'text',
    placeholder,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    error,
    helperText,
    leftIcon,
    rightElement,
    disabled = false,
    required = false,
    className = '',
    ...props
  },
  ref
) {
  const inputId = id || name;

  return (
    <div className={`app-input-group ${error ? 'app-input-group--error' : ''} ${disabled ? 'app-input-group--disabled' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="app-input-label">
          {label}
          {required && <span className="app-input-required">*</span>}
        </label>
      )}

      <div className="app-input-wrapper">
        {leftIcon && <span className="app-input-affix app-input-affix--left">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`app-input ${leftIcon ? 'app-input--has-left' : ''} ${rightElement ? 'app-input--has-right' : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {rightElement && <span className="app-input-affix app-input-affix--right">{rightElement}</span>}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="app-input-message app-input-message--error" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="app-input-message">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
