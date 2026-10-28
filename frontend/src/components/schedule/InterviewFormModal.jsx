import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Select } from '../Select';
import { Button } from '../Button';
import {
  INTERVIEW_STAGES,
  INTERVIEW_FORMATS,
  INTERVIEW_STATUSES,
  getTodayDateString,
  getOffsetDateString
} from '../../utils/scheduleData';

export function InterviewFormModal({
  isOpen,
  onClose,
  onSaveInterview,
  interviewToEdit = null,
  initialDate = ''
}) {
  const isEditMode = Boolean(interviewToEdit);

  // Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [stage, setStage] = useState('Technical Round 1');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('14:00');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [format, setFormat] = useState('Online');
  const [locationOrLink, setLocationOrLink] = useState('');
  const [status, setStatus] = useState('Scheduled');
  const [notes, setNotes] = useState('');

  // Validation Errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (interviewToEdit) {
        setCompany(interviewToEdit.company || '');
        setRole(interviewToEdit.role || '');
        setStage(interviewToEdit.stage || 'Technical Round 1');
        setDate(interviewToEdit.date || getTodayDateString());
        setTime(interviewToEdit.time || '14:00');
        setDurationMinutes(String(interviewToEdit.durationMinutes || 60));
        setFormat(interviewToEdit.format || 'Online');
        setLocationOrLink(interviewToEdit.locationOrLink || '');
        setStatus(interviewToEdit.status || 'Scheduled');
        setNotes(interviewToEdit.notes || '');
      } else {
        setCompany('');
        setRole('');
        setStage('Technical Round 1');
        setDate(initialDate || getOffsetDateString(1));
        setTime('14:00');
        setDurationMinutes('60');
        setFormat('Online');
        setLocationOrLink('');
        setStatus('Scheduled');
        setNotes('');
      }
      setErrors({});
    }
  }, [isOpen, interviewToEdit, initialDate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    const newErrors = {};
    if (!company.trim()) {
      newErrors.company = 'Company name is required.';
    }
    if (!role.trim()) {
      newErrors.role = 'Job role is required.';
    }
    if (!date) {
      newErrors.date = 'Interview date is required.';
    }
    if (!time) {
      newErrors.time = 'Interview time is required.';
    }

    const durationNum = parseInt(durationMinutes, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      newErrors.durationMinutes = 'Duration must be a positive integer in minutes.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const savedInterview = {
      ...(interviewToEdit ? { id: interviewToEdit.id, createdAt: interviewToEdit.createdAt } : {}),
      company: company.trim(),
      role: role.trim(),
      stage,
      date,
      time,
      durationMinutes: durationNum,
      format,
      locationOrLink: locationOrLink.trim(),
      status,
      notes: notes.trim()
    };

    onSaveInterview(savedInterview);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit / Reschedule Interview' : 'Schedule New Interview'}
      description={
        isEditMode
          ? 'Modify interview details, stage, format, or adjust the date/time to reschedule.'
          : 'Record an upcoming technical, system design, or behavioral interview round.'
      }
      size="md"
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditMode ? 'Save Changes' : 'Schedule Interview'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Company & Role */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <Input
            label="Company Name"
            id="interview-form-company"
            placeholder="e.g. Stripe, Google, Meta"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              if (errors.company) setErrors((prev) => ({ ...prev, company: null }));
            }}
            error={errors.company}
            required
            autoFocus
          />

          <Input
            label="Target Job Role"
            id="interview-form-role"
            placeholder="e.g. Senior Software Engineer"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              if (errors.role) setErrors((prev) => ({ ...prev, role: null }));
            }}
            error={errors.role}
            required
          />
        </div>

        {/* Stage & Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-3)' }}>
          <Select
            label="Interview Stage"
            id="interview-form-stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            options={INTERVIEW_STAGES.map((s) => ({ value: s, label: s }))}
            required
          />

          <Select
            label="Status"
            id="interview-form-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={INTERVIEW_STATUSES.map((st) => ({ value: st, label: st }))}
            required
          />
        </div>

        {/* Date, Time, Duration */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.1fr 1fr', gap: 'var(--space-3)' }}>
          <Input
            label="Date (YYYY-MM-DD)"
            id="interview-form-date"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (errors.date) setErrors((prev) => ({ ...prev, date: null }));
            }}
            error={errors.date}
            required
          />

          <Input
            label="Time (HH:mm)"
            id="interview-form-time"
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              if (errors.time) setErrors((prev) => ({ ...prev, time: null }));
            }}
            error={errors.time}
            required
          />

          <Input
            label="Duration (mins)"
            id="interview-form-duration"
            type="number"
            min="15"
            max="480"
            step="15"
            value={durationMinutes}
            onChange={(e) => {
              setDurationMinutes(e.target.value);
              if (errors.durationMinutes) setErrors((prev) => ({ ...prev, durationMinutes: null }));
            }}
            error={errors.durationMinutes}
            required
          />
        </div>

        {/* Format & Meeting Link / Location */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 'var(--space-3)' }}>
          <Select
            label="Interview Format"
            id="interview-form-format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            options={INTERVIEW_FORMATS.map((f) => ({ value: f, label: f }))}
            required
          />

          <Input
            label="Meeting Link or Physical Location"
            id="interview-form-location"
            placeholder={
              format === 'Online'
                ? 'https://meet.google.com/xyz or Zoom URL'
                : format === 'Phone'
                ? '+1 (555) 000-0000'
                : 'Office Address or Building room'
            }
            value={locationOrLink}
            onChange={(e) => setLocationOrLink(e.target.value)}
            helperText="Optional virtual meeting link or phone number."
          />
        </div>

        {/* Notes */}
        <div className="app-input-group">
          <label htmlFor="interview-form-notes" className="app-input-label">
            Preparation Notes & Strategic Focus (Optional)
          </label>
          <textarea
            id="interview-form-notes"
            rows={3}
            placeholder="e.g. Emphasize distributed transactions, rate limiting algorithms, and STAR behavioral answers..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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

export default InterviewFormModal;
