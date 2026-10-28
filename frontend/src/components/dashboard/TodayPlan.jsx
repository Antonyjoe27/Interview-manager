import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { EmptyState } from '../EmptyState';
import Icon from '../Icon';
import { PREPARATION_SUBJECTS } from '../../utils/dashboardData';

const priorityBadges = {
  high: { variant: 'error', label: 'High Priority' },
  medium: { variant: 'warning', label: 'Medium' },
  low: { variant: 'neutral', label: 'Low' }
};

export function TodayPlan({
  tasks,
  onToggleTask,
  onOpenAddTask
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const getSubjectName = (subjectId) => {
    const found = PREPARATION_SUBJECTS.find((s) => s.id === subjectId);
    return found ? found.shortName : subjectId.toUpperCase();
  };

  const getSubjectColor = (subjectId) => {
    const found = PREPARATION_SUBJECTS.find((s) => s.id === subjectId);
    return found ? found.color : 'var(--color-primary)';
  };

  return (
    <Card bordered>
      <CardHeader>
        <div>
          <CardTitle>Today's Preparation Plan</CardTitle>
          <CardDescription>
            High-yield technical problems and theoretical topics targeted for today
          </CardDescription>
        </div>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Icon name="plus" size={14} />}
          onClick={onOpenAddTask}
        >
          Add Task
        </Button>
      </CardHeader>

      <CardContent>
        {/* Filter Tabs */}
        <div className="dashboard-tasks-header">
          <div className="dashboard-filter-tabs" role="tablist" aria-label="Task status filters">
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              className={`dashboard-filter-tab ${filter === 'all' ? 'dashboard-filter-tab--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Tasks ({tasks.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'pending'}
              className={`dashboard-filter-tab ${filter === 'pending' ? 'dashboard-filter-tab--active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({tasks.filter((t) => !t.completed).length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'completed'}
              className={`dashboard-filter-tab ${filter === 'completed' ? 'dashboard-filter-tab--active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({tasks.filter((t) => t.completed).length})
            </button>
          </div>
        </div>

        {/* Task List or Empty State */}
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon="tracker"
            title={filter === 'completed' ? 'No completed tasks yet' : 'No tasks in this view'}
            description={
              filter === 'completed'
                ? 'Check off tasks above as you solve problems or review topics.'
                : 'All caught up! Add a new interview preparation task to get started.'
            }
            action={
              filter !== 'all' ? (
                <Button variant="subtle" size="sm" onClick={() => setFilter('all')}>
                  Show All Tasks
                </Button>
              ) : (
                <Button variant="primary" size="sm" leftIcon={<Icon name="plus" size={14} />} onClick={onOpenAddTask}>
                  Create Preparation Task
                </Button>
              )
            }
          />
        ) : (
          <div className="dashboard-tasks-list" role="list" aria-label="Preparation tasks">
            {filteredTasks.map((task) => {
              const priorityInfo = priorityBadges[task.priority] || priorityBadges.medium;
              const subjectColor = getSubjectColor(task.subjectId);

              return (
                <div
                  key={task.id}
                  role="listitem"
                  className={`dashboard-task-item ${task.completed ? 'dashboard-task-item--completed' : ''}`}
                  onClick={() => onToggleTask(task.id)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      onToggleTask(task.id);
                    }
                  }}
                  aria-label={`${task.title}, ${task.completed ? 'completed' : 'pending'}. Press space to toggle.`}
                >
                  {/* Interactive Checkbox Control */}
                  <div
                    className={`dashboard-task-checkbox ${task.completed ? 'dashboard-task-checkbox--checked' : ''}`}
                    aria-hidden="true"
                  >
                    {task.completed && <Icon name="check" size={12} strokeWidth={3} />}
                  </div>

                  {/* Task Content */}
                  <div className="dashboard-task-content">
                    <span className="dashboard-task-title">{task.title}</span>

                    <div className="dashboard-task-meta">
                      {/* Subject Tag */}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: subjectColor,
                          fontWeight: 'var(--font-weight-medium)'
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: subjectColor
                          }}
                        />
                        {getSubjectName(task.subjectId)}
                      </span>

                      {/* Priority Badge */}
                      <Badge variant={priorityInfo.variant} size="sm">
                        {priorityInfo.label}
                      </Badge>

                      {/* Due Time / Date */}
                      {(task.dueDate || task.dueTime) && (
                        <span className="dashboard-task-due">
                          <Icon name="clock" size={12} />
                          {task.dueDate || task.dueTime}
                        </span>
                      )}

                      {/* Estimated time */}
                      {task.estimatedMinutes && (
                        <span>~{task.estimatedMinutes}m</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TodayPlan;
