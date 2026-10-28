import React from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import Icon from '../Icon';

export function DeleteApplicationConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  application
}) {
  if (!application) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Job Application"
      description="Confirm removal from your application pipeline."
      size="sm"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', width: '100%' }}>
          <Button variant="subtle" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm(application.id);
              onClose();
            }}
            type="button"
            leftIcon={<Icon name="trash" size={14} />}
          >
            Delete Application
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          Are you sure you want to delete the application for{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>{application.role}</strong> at{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>{application.company}</strong>?
        </p>

        <div
          style={{
            padding: 'var(--space-3)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-xs)',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}
        >
          <Icon name="alertCircle" size={16} />
          <span>This action cannot be undone. Logged notes and deadlines will be removed.</span>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteApplicationConfirmModal;
