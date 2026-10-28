import React from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import Icon from '../Icon';
import { formatInterviewDateDisplay, formatTimeDisplay } from '../../utils/scheduleData';

export function DeleteInterviewConfirmModal({
  isOpen,
  onClose,
  interview,
  onConfirmDelete
}) {
  if (!interview) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Scheduled Interview"
      description="This action will remove this round from your schedule and calendar."
      size="sm"
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            leftIcon={<Icon name="trash" size={14} />}
            onClick={() => onConfirmDelete(interview.id)}
          >
            Delete Interview
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: '1.5' }}>
          Are you sure you want to remove the interview with:
        </p>

        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'var(--color-bg-surface-raised)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>
            {interview.company} • {interview.role}
          </span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {interview.stage} on {formatInterviewDateDisplay(interview.date)} at {formatTimeDisplay(interview.time)}
          </span>
        </div>

        <p style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--font-size-2xs)' }}>
          Summary metrics will recalculate immediately.
        </p>
      </div>
    </Modal>
  );
}

export default DeleteInterviewConfirmModal;
