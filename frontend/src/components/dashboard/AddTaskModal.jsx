import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Select } from '../Select';
import { Button } from '../Button';
import { PREPARATION_SUBJECTS } from '../../utils/dashboardData';

export function AddTaskModal({ isOpen, onClose, onAddTask }) {
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('dsa');
  const [priority, setPriority] = useState('high');
  const [dueTime, setDueTime] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('45');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    const newTask = {
      title: title.trim(),
      subjectId,
      priority,
      dueTime: dueTime.trim() || 'Today',
      estimatedMinutes: parseInt(estimatedMinutes, 10) || 45,
      completed: false
    };

    onAddTask(newTask);
    setTitle('');
    setDueTime('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Preparation Task"
      description="Create a targeted interview preparation problem or review topic."
      size="md"
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Task
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Input
          label="Task or Problem Title"
          id="task-title-input"
          placeholder="e.g. Implement Rate Limiter with Token Bucket algorithm"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          error={error}
          required
          autoFocus
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <Select
            label="Subject Track"
            id="task-subject-select"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            options={PREPARATION_SUBJECTS.map((s) => ({
              value: s.id,
              label: s.name
            }))}
            required
          />

          <Select
            label="Priority Level"
            id="task-priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { value: 'high', label: 'High Priority' },
              { value: 'medium', label: 'Medium Priority' },
              { value: 'low', label: 'Low Priority' }
            ]}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--space-3)' }}>
          <Input
            label="Target Due Time"
            id="task-due-input"
            placeholder="e.g. Today, 5:00 PM"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            helperText="When you plan to complete this."
          />

          <Input
            label="Est. Minutes"
            id="task-est-minutes"
            type="number"
            min="5"
            max="300"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(e.target.value)}
            helperText="Duration"
          />
        </div>
      </form>
    </Modal>
  );
}

export default AddTaskModal;
