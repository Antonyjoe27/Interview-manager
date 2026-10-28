import React from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import Icon from '../Icon';

export function DeleteItemConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  item
}) {
  if (!item) return null;

  const isNote = item.type === 'note';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isNote ? 'Delete Revision Note' : 'Delete Learning Resource'}
      description={`Confirm permanent removal of this ${isNote ? 'note' : 'resource'} from your library.`}
      size="sm"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', width: '100%' }}>
          <Button variant="subtle" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm(item.id);
              onClose();
            }}
            type="button"
            leftIcon={<Icon name="trash" size={14} />}
          >
            {isNote ? 'Delete Note' : 'Delete Resource'}
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          Are you sure you want to delete{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>"{item.title}"</strong>?
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
          <Icon name="alert" size={16} />
          <span>
            This action cannot be undone. Any recorded code snippets, tags, or links will be removed.
          </span>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteItemConfirmModal;
