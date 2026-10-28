import React, { useEffect } from 'react';
import IconButton from './IconButton';

/**
 * Reusable Accessible Modal / Dialog Component
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className = '',
  closeOnBackdrop = true,
  closeOnEscape = true
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  return (
    <div className="app-modal-root" role="presentation">
      <div
        className="app-modal-backdrop"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      <div
        className="app-modal-wrapper"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        <div className={`app-modal app-modal--${size} ${className}`} onClick={(e) => e.stopPropagation()}>
          <div className="app-modal__header">
            <div className="app-modal__titles">
              {title && (
                <h2 id="modal-title" className="app-modal__title">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="app-modal__description">
                  {description}
                </p>
              )}
            </div>
            <IconButton
              name="x"
              aria-label="Close dialog"
              variant="subtle"
              size="sm"
              onClick={onClose}
              className="app-modal__close"
            />
          </div>

          <div className="app-modal__body">{children}</div>

          {footer && <div className="app-modal__footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export default Modal;
