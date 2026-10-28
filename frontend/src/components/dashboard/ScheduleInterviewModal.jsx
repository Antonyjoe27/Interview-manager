import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Select } from '../Select';
import { Button } from '../Button';

export function ScheduleInterviewModal({ isOpen, onClose, onScheduleInterview }) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [stage, setStage] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [format, setFormat] = useState('Online');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      setError('Company name and role are required.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newInterview = {
      company: company.trim(),
      role: role.trim(),
      stage: stage.trim() || 'Technical Screening',
      date: date.trim() || todayStr,
      time: time.trim() || '14:00',
      format,
      status: 'Scheduled'
    };

    onScheduleInterview(newInterview);
    setCompany('');
    setRole('');
    setStage('');
    setDate('');
    setTime('');
    setFormat('Online');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Interview Round"
      description="Record an upcoming technical or behavioral interview round to align your study schedule."
      size="md"
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Interview
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {error && (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: 'var(--color-danger-bg)',
              border: '1px solid var(--color-danger-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-danger-text)',
              fontSize: 'var(--font-size-xs)'
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <Input
            label="Company Name"
            id="interview-company-input"
            placeholder="e.g. Netflix, Amazon, Meta"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              if (error) setError('');
            }}
            required
            autoFocus
          />

          <Input
            label="Target Role"
            id="interview-role-input"
            placeholder="e.g. Senior Backend Engineer"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              if (error) setError('');
            }}
            required
          />
        </div>

        <Input
          label="Interview Stage or Focus"
          id="interview-stage-input"
          placeholder="e.g. Round 2: Distributed Systems & Concurrency"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          helperText="Specify whether this is a phone screen, system design, DSA, or hiring manager round."
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <Input
            label="Date"
            id="interview-date-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Input
            label="Time"
            id="interview-time-input"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <Select
          label="Meeting Format"
          id="interview-format-select"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          options={[
            { value: 'Online', label: 'Online / Video Call' },
            { value: 'Phone', label: 'Phone Call' },
            { value: 'In-person', label: 'In-person / On-site' }
          ]}
        />
      </form>
    </Modal>
  );
}

export default ScheduleInterviewModal;
