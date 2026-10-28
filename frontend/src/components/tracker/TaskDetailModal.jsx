import React from 'react';
import { Modal } from '../Modal';
import { Badge } from '../Badge';
import { Button } from '../Button';
import Icon from '../Icon';
import {
  PREPARATION_SUBJECTS,
  DIFFICULTY_CONFIG,
  PRIORITY_CONFIG,
  formatDueDate,
  isTaskOverdue
} from '../../utils/trackerData';

export function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onToggleComplete,
  onOpenEdit
}) {
  if (!task) return null;

  const subject = PREPARATION_SUBJECTS.find((s) => s.id === task.subjectId);
  const diffInfo = DIFFICULTY_CONFIG[task.difficulty] || DIFFICULTY_CONFIG.medium;
  const prioInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const isOverdue = !task.completed && isTaskOverdue(task.dueDate);
  const formattedDate = formatDueDate(task.dueDate);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task.title}
      description={`Preparation Task • ${subject ? subject.name : 'Technical Track'}`}
      size="md"
      footer={
        <>
          <Button
            variant="subtle"
            leftIcon={<Icon name="edit" size={14} />}
            onClick={() => {
              onClose();
              onOpenEdit(task);
            }}
          >
            Edit Task
          </Button>
          <Button
            variant={task.completed ? 'secondary' : 'primary'}
            leftIcon={<Icon name="check" size={14} />}
            onClick={() => {
              onToggleComplete(task.id);
            }}
          >
            {task.completed ? 'Mark Pending' : 'Mark Completed'}
          </Button>
          <Button variant="subtle" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Properties Grid */}
        <div className="tracker-detail-grid">
          <div className="tracker-detail-field">
            <span className="tracker-detail-field-label">Subject Track</span>
            <div className="tracker-detail-field-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {subject && (
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: subject.color
                  }}
                />
              )}
              <span>{subject ? subject.name : task.subjectId}</span>
            </div>
          </div>

          <div className="tracker-detail-field">
            <span className="tracker-detail-field-label">Topic / Concept</span>
            <span className="tracker-detail-field-value">{task.topic || 'General'}</span>
          </div>

          <div className="tracker-detail-field">
            <span className="tracker-detail-field-label">Difficulty</span>
            <div>
              <Badge variant={diffInfo.variant} size="sm">
                {diffInfo.label}
              </Badge>
            </div>
          </div>

          <div className="tracker-detail-field">
            <span className="tracker-detail-field-label">Priority</span>
            <div>
              <Badge variant={prioInfo.variant} size="sm">
                {prioInfo.label}
              </Badge>
            </div>
          </div>

          <div className="tracker-detail-field">
            <span className="tracker-detail-field-label">Deadline</span>
            <div className="tracker-detail-field-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="clock" size={14} />
              <span>{formattedDate}</span>
              {isOverdue && (
                <Badge variant="error" size="sm">
                  Overdue
                </Badge>
              )}
            </div>
          </div>

          <div className="tracker-detail-field">
            <span className="tracker-detail-field-label">Duration & Status</span>
            <div className="tracker-detail-field-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>~{task.estimatedMinutes || 45} mins</span>
              <span>•</span>
              <Badge variant={task.completed ? 'success' : 'neutral'} dot size="sm">
                {task.completed ? 'Completed' : 'Pending'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Notes & Key Takeaways */}
        {task.description ? (
          <div className="tracker-detail-description-box">
            <span className="tracker-detail-field-label">Notes & Algorithmic Insights</span>
            <p className="tracker-detail-description-text">{task.description}</p>
          </div>
        ) : (
          <div className="tracker-detail-description-box" style={{ opacity: 0.6 }}>
            <span className="tracker-detail-field-label">Notes</span>
            <p className="tracker-detail-description-text">No additional notes provided for this task.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default TaskDetailModal;
