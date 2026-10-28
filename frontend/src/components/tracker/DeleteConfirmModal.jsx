import React from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import Icon from '../Icon';

export function DeleteConfirmModal({
  isOpen,
  onClose,
  task,
  onConfirmDelete
}) {
  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Preparation Task"
      description="This action will permanently remove this item from your preparation queue."
      size="sm"
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            leftIcon={<Icon name="trash" size={14} />}
            onClick={() => onConfirmDelete(task.id)}
          >
            Delete Task
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: '1.5' }}>
          Are you sure you want to delete the preparation task:
        </p>

        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'var(--color-bg-surface-raised)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-sm)'
          }}
        >
          {task.title}
        </div>

        <p style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--font-size-xs)' }}>
          Preparation statistics and subject completion rates will be updated automatically.
        </p>
      </div>
    </Modal>
  );
}

export default DeleteConfirmModal;
