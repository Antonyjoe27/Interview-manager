import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Select } from '../Select';
import { Button } from '../Button';
import {
  APPLICATION_STATUS_CONFIG,
  APPLICATION_STATUSES,
  WORK_MODES,
  JOB_TYPES,
  APPLICATION_SOURCES,
  getTodayDateString,
  isValidEmail,
  isValidUrl
} from '../../utils/applicationData';

export function ApplicationFormModal({
  isOpen,
  onClose,
  onSaveApplication,
  applicationToEdit = null
}) {
  const isEditMode = Boolean(applicationToEdit);

  // Form Fields
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Applied');
  const [applicationDate, setApplicationDate] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('Remote');
  const [jobType, setJobType] = useState('Full-time');
  const [jobUrl, setJobUrl] = useState('');
  const [source, setSource] = useState('Company Website');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [deadline, setDeadline] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');

  // Validation
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (applicationToEdit) {
        setCompany(applicationToEdit.company || '');
        setRole(applicationToEdit.role || '');
        setStatus(applicationToEdit.status || 'Applied');
        setApplicationDate(applicationToEdit.applicationDate || getTodayDateString());
        setLocation(applicationToEdit.location || '');
        setWorkMode(applicationToEdit.workMode || 'Remote');
        setJobType(applicationToEdit.jobType || 'Full-time');
        setJobUrl(applicationToEdit.jobUrl || '');
        setSource(applicationToEdit.source || 'Company Website');
        setContactName(applicationToEdit.contactName || '');
        setContactEmail(applicationToEdit.contactEmail || '');
        setSalaryRange(applicationToEdit.salaryRange || '');
        setDeadline(applicationToEdit.deadline || '');
        setFollowUpDate(applicationToEdit.followUpDate || '');
        setNotes(applicationToEdit.notes || '');
      } else {
        setCompany('');
        setRole('');
        setStatus('Applied');
        setApplicationDate(getTodayDateString());
        setLocation('');
        setWorkMode('Remote');
        setJobType('Full-time');
        setJobUrl('');
        setSource('Company Website');
        setContactName('');
        setContactEmail('');
        setSalaryRange('');
        setDeadline('');
        setFollowUpDate('');
        setNotes('');
      }
      setErrors({});
    }
  }, [isOpen, applicationToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!company.trim()) {
      newErrors.company = 'Company name is required.';
    }
    if (!role.trim()) {
      newErrors.role = 'Role / position title is required.';
    }
    if (!applicationDate) {
      newErrors.applicationDate = 'Application date is required.';
    }
    if (contactEmail.trim() && !isValidEmail(contactEmail.trim())) {
      newErrors.contactEmail = 'Please provide a valid email address.';
    }
    if (jobUrl.trim() && !isValidUrl(jobUrl.trim())) {
      newErrors.jobUrl = 'Please provide a valid URL (starting with http:// or https://).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSaveApplication({
      ...(applicationToEdit ? { id: applicationToEdit.id } : {}),
      company: company.trim(),
      role: role.trim(),
      status,
      applicationDate,
      location: location.trim(),
      workMode,
      jobType,
      jobUrl: jobUrl.trim(),
      source,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      salaryRange: salaryRange.trim(),
      deadline: deadline || '',
      followUpDate: followUpDate || '',
      notes: notes.trim()
    });

    onClose();
  };

  const statusOptions = APPLICATION_STATUSES.map((key) => ({
    value: key,
    label: APPLICATION_STATUS_CONFIG[key].label
  }));

  const workModeOptions = WORK_MODES.map((wm) => ({
    value: wm,
    label: wm
  }));

  const jobTypeOptions = JOB_TYPES.map((jt) => ({
    value: jt,
    label: jt
  }));

  const sourceOptions = APPLICATION_SOURCES.map((src) => ({
    value: src,
    label: src
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Job Application' : 'Add New Job Application'}
      description={
        isEditMode
          ? 'Update company details, interview stage, or next actions.'
          : 'Track a new opportunity in your job application pipeline.'
      }
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', width: '100%' }}>
          <Button variant="subtle" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} type="button">
            {isEditMode ? 'Save Changes' : 'Create Application'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Row 1: Company & Role */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Input
            label="Company Name"
            name="company"
            placeholder="e.g. Google, Stripe, Meta"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            error={errors.company}
            required
            autoFocus
          />
          <Input
            label="Job Role / Title"
            name="role"
            placeholder="e.g. Senior Software Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            error={errors.role}
            required
          />
        </div>

        {/* Row 2: Status & Application Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Select
            label="Pipeline Stage"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={statusOptions}
            required
          />
          <Input
            label="Application Date"
            name="applicationDate"
            type="date"
            value={applicationDate}
            onChange={(e) => setApplicationDate(e.target.value)}
            error={errors.applicationDate}
            required
          />
        </div>

        {/* Row 3: Work Mode & Job Type */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Select
            label="Work Mode"
            name="workMode"
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value)}
            options={workModeOptions}
          />
          <Select
            label="Job Type"
            name="jobType"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            options={jobTypeOptions}
          />
        </div>

        {/* Row 4: Location & Salary Range */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Input
            label="Location"
            name="location"
            placeholder="e.g. San Francisco, CA or Remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            label="Salary / Compensation"
            name="salaryRange"
            placeholder="e.g. $180,000 - $210,000 + Equity"
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
          />
        </div>

        {/* Row 5: Source & Job URL */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Select
            label="Application Source"
            name="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            options={sourceOptions}
          />
          <Input
            label="Job Posting URL"
            name="jobUrl"
            type="url"
            placeholder="https://company.com/careers/..."
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            error={errors.jobUrl}
          />
        </div>

        {/* Row 6: Recruiter Name & Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Input
            label="Recruiter / Contact Name"
            name="contactName"
            placeholder="e.g. Sarah Jenkins"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
          <Input
            label="Recruiter / Contact Email"
            name="contactEmail"
            type="email"
            placeholder="recruiter@company.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            error={errors.contactEmail}
          />
        </div>

        {/* Row 7: Follow-up Date & Application Deadline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Input
            label="Follow-up Date"
            name="followUpDate"
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            helperText="Date to follow up with recruiter or hiring manager"
          />
          <Input
            label="Application / Offer Deadline"
            name="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            helperText="Offer expiration or application closing date"
          />
        </div>

        {/* Row 8: Notes */}
        <div className="app-input-group">
          <label htmlFor="application-notes" className="app-input-label">
            Notes & Next Steps
          </label>
          <div className="app-input-wrapper">
            <textarea
              id="application-notes"
              name="notes"
              className="app-input"
              rows={3}
              placeholder="Record interview rounds, referral contacts, questions asked, or preparation topics..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ padding: '8px 12px', minHeight: '80px', resize: 'vertical' }}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ApplicationFormModal;
