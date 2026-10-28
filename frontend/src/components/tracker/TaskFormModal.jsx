import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Select } from '../Select';
import { Button } from '../Button';
import {
  PREPARATION_SUBJECTS,
  getTodayDateString,
  getOffsetDateString
} from '../../utils/trackerData';

export function TaskFormModal({
  isOpen,
  onClose,
  onSaveTask,
  taskToEdit = null
}) {
  const isEditMode = Boolean(taskToEdit);

  // Form State
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('dsa');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('45');
  const [description, setDescription] = useState('');

  // Form Validation Errors
  const [errors, setErrors] = useState({});

  // Populate or reset form whenever modal opens or taskToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title || '');
        setSubjectId(taskToEdit.subjectId || 'dsa');
        setTopic(taskToEdit.topic || '');
        setDifficulty(taskToEdit.difficulty || 'medium');
        setPriority(taskToEdit.priority || 'medium');
        setDueDate(taskToEdit.dueDate || getTodayDateString());
        setEstimatedMinutes(String(taskToEdit.estimatedMinutes || 45));
        setDescription(taskToEdit.description || '');
      } else {
        setTitle('');
        setSubjectId('dsa');
        setTopic('');
        setDifficulty('medium');
        setPriority('medium');
        setDueDate(getOffsetDateString(1));
        setEstimatedMinutes('45');
        setDescription('');
      }
      setErrors({});
    }
  }, [isOpen, taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Task title is required.';
    }

    const durationNum = parseInt(estimatedMinutes, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      newErrors.estimatedMinutes = 'Duration must be a positive number of minutes.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const savedTask = {
      ...(taskToEdit ? { id: taskToEdit.id, createdAt: taskToEdit.createdAt } : {}),
      title: title.trim(),
      subjectId,
      topic: topic.trim() || 'General Practice',
      difficulty,
      priority,
      dueDate: dueDate || getTodayDateString(),
      estimatedMinutes: durationNum,
      description: description.trim(),
      completed: taskToEdit ? taskToEdit.completed : false,
      status: taskToEdit ? taskToEdit.status : 'pending'
    };

    onSaveTask(savedTask);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Preparation Task' : 'Add Preparation Task'}
      description={
        isEditMode
          ? 'Update the parameters, priority, or notes for this technical preparation task.'
          : 'Log a new technical problem, system design topic, or behavioral question.'
      }
      size="md"
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditMode ? 'Save Changes' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Task Title */}
        <Input
          label="Problem or Task Title"
          id="task-form-title"
          placeholder="e.g. Solve LRU Cache with O(1) eviction policy"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
          }}
          error={errors.title}
          required
          autoFocus
        />

        {/* Subject Track & Topic */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: 'var(--space-3)' }}>
          <Select
            label="Subject Track"
            id="task-form-subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            options={PREPARATION_SUBJECTS.map((s) => ({
              value: s.id,
              label: s.name
            }))}
            required
          />

          <Input
            label="Topic / Sub-domain"
            id="task-form-topic"
            placeholder="e.g. Hash Maps & Lists"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            helperText="Specific algorithm or concept."
          />
        </div>

        {/* Difficulty, Priority, and Duration Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
          <Select
            label="Difficulty"
            id="task-form-difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' }
            ]}
          />

          <Select
            label="Priority"
            id="task-form-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' }
            ]}
          />

          <Input
            label="Est. Minutes"
            id="task-form-duration"
            type="number"
            min="5"
            max="360"
            value={estimatedMinutes}
            onChange={(e) => {
              setEstimatedMinutes(e.target.value);
              if (errors.estimatedMinutes) setErrors((prev) => ({ ...prev, estimatedMinutes: null }));
            }}
            error={errors.estimatedMinutes}
          />
        </div>

        {/* Due Date */}
        <Input
          label="Target Due Date"
          id="task-form-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          helperText="Target completion deadline."
        />

        {/* Optional Description / Notes */}
        <div className="app-input-group">
          <label htmlFor="task-form-desc" className="app-input-label">
            Notes & Key Takeaways (Optional)
          </label>
          <textarea
            id="task-form-desc"
            rows={3}
            placeholder="Add key algorithmic insights, edge cases, or problem references..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="app-input"
            style={{
              height: 'auto',
              minHeight: '80px',
              padding: 'var(--space-2) var(--space-3)',
              resize: 'vertical'
            }}
          />
        </div>
      </form>
    </Modal>
  );
}

export default TaskFormModal;
