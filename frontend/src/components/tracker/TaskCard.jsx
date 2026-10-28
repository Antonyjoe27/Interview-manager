import React from 'react';
import { Badge } from '../Badge';
import { IconButton } from '../IconButton';
import Icon from '../Icon';
import {
  PREPARATION_SUBJECTS,
  DIFFICULTY_CONFIG,
  PRIORITY_CONFIG,
  formatDueDate,
  isTaskOverdue
} from '../../utils/trackerData';

export function TaskCard({
  task,
  onToggleComplete,
  onViewDetails,
  onEditTask,
  onDeleteTask
}) {
  const subject = PREPARATION_SUBJECTS.find((s) => s.id === task.subjectId);
  const diffInfo = DIFFICULTY_CONFIG[task.difficulty] || DIFFICULTY_CONFIG.medium;
  const prioInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const isOverdue = !task.completed && isTaskOverdue(task.dueDate);
  const formattedDate = formatDueDate(task.dueDate);

  return (
    <article
      className={`tracker-task-card ${task.completed ? 'tracker-task-card--completed' : ''}`}
      aria-label={`${task.title}, ${task.completed ? 'Completed' : 'Pending'}`}
    >
      {/* Checkbox Toggle Control */}
      <div
        className={`tracker-checkbox ${task.completed ? 'tracker-checkbox--checked' : ''}`}
        onClick={() => onToggleComplete(task.id)}
        role="checkbox"
        aria-checked={task.completed}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onToggleComplete(task.id);
          }
        }}
        title={task.completed ? 'Mark as pending' : 'Mark as complete'}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'pending' : 'complete'}`}
      >
        {task.completed && <Icon name="check" size={13} strokeWidth={3} />}
      </div>

      {/* Task Content Body */}
      <div className="tracker-task-body">
        <div className="tracker-task-title-row">
          <span
            className="tracker-task-title"
            onClick={() => onViewDetails(task)}
            title="Click to view task details"
          >
            {task.title}
          </span>
        </div>

        <div className="tracker-task-meta-row">
          {/* Subject with Color Dot */}
          {subject && (
            <span
              className="tracker-task-subject-tag"
              style={{ color: subject.color }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: subject.color
                }}
              />
              {subject.shortName}
            </span>
          )}

          {/* Topic */}
          {task.topic && (
            <>
              <span>•</span>
              <span className="tracker-task-topic">{task.topic}</span>
            </>
          )}

          {/* Difficulty Badge */}
          <Badge variant={diffInfo.variant} size="sm">
            {diffInfo.label}
          </Badge>

          {/* Priority Badge */}
          <Badge variant={prioInfo.variant} size="sm">
            {prioInfo.shortLabel}
          </Badge>

          {/* Due Date Indicator */}
          {task.dueDate && (
            <span
              className={`tracker-task-due ${isOverdue ? 'tracker-task-due--overdue' : ''}`}
            >
              <Icon name="clock" size={12} />
              <span>{formattedDate}</span>
              {isOverdue && <span style={{ fontSize: 'var(--font-size-2xs)' }}>(Overdue)</span>}
            </span>
          )}

          {/* Estimated Duration */}
          {task.estimatedMinutes && (
            <span className="tracker-task-duration">
              ~{task.estimatedMinutes}m
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="tracker-task-actions">
        <IconButton
          name="eye"
          aria-label={`View details for "${task.title}"`}
          title="View details"
          variant="subtle"
          size="sm"
          onClick={() => onViewDetails(task)}
        />
        <IconButton
          name="edit"
          aria-label={`Edit "${task.title}"`}
          title="Edit task"
          variant="subtle"
          size="sm"
          onClick={() => onEditTask(task)}
        />
        <IconButton
          name="trash"
          aria-label={`Delete "${task.title}"`}
          title="Delete task"
          variant="subtle"
          size="sm"
          onClick={() => onDeleteTask(task)}
        />
      </div>
    </article>
  );
}

export default TaskCard;
