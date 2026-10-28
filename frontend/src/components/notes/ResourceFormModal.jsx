import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Select } from '../Select';
import { Button } from '../Button';
import Icon from '../Icon';
import {
  EXTENDED_SUBJECTS,
  RESOURCE_TYPES,
  isValidUrl,
  parseTags
} from '../../utils/notesData';

export function ResourceFormModal({
  isOpen,
  onClose,
  onSaveResource,
  resourceToEdit = null
}) {
  const isEditMode = Boolean(resourceToEdit);

  // Form Fields
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('dsa');
  const [topic, setTopic] = useState('');
  const [resourceType, setResourceType] = useState('Documentation');
  const [tagsInput, setTagsInput] = useState('');
  const [favorite, setFavorite] = useState(false);

  // Validation
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (resourceToEdit) {
        setTitle(resourceToEdit.title || '');
        setUrl(resourceToEdit.url || '');
        setDescription(resourceToEdit.description || '');
        setSubjectId(resourceToEdit.subjectId || '');
        setTopic(resourceToEdit.topic || '');
        setResourceType(resourceToEdit.resourceType || 'Documentation');
        setTagsInput(Array.isArray(resourceToEdit.tags) ? resourceToEdit.tags.join(', ') : '');
        setFavorite(Boolean(resourceToEdit.favorite));
      } else {
        setTitle('');
        setUrl('');
        setDescription('');
        setSubjectId('dsa');
        setTopic('');
        setResourceType('Documentation');
        setTagsInput('');
        setFavorite(false);
      }
      setErrors({});
    }
  }, [isOpen, resourceToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Resource title is required.';
    }
    if (!url.trim()) {
      newErrors.url = 'Valid HTTP or HTTPS resource URL is required.';
    } else if (!isValidUrl(url.trim())) {
      newErrors.url = 'Invalid URL format. Must start with http:// or https://';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSaveResource({
      ...(resourceToEdit ? { id: resourceToEdit.id, createdAt: resourceToEdit.createdAt } : {}),
      type: 'resource',
      title: title.trim(),
      url: url.trim(),
      description: description.trim(),
      subjectId: subjectId || '',
      topic: topic.trim(),
      resourceType,
      tags: parseTags(tagsInput),
      favorite
    });

    onClose();
  };

  const subjectOptions = [
    { value: '', label: 'General / No Subject' },
    ...EXTENDED_SUBJECTS.map((s) => ({ value: s.id, label: s.name }))
  ];

  const resourceTypeOptions = RESOURCE_TYPES.map((t) => ({ value: t, label: t }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Learning Resource' : 'Add Learning Resource'}
      description={
        isEditMode
          ? 'Update the link, description, or categorization of this reference.'
          : 'Save an external tutorial, documentation guide, video, or practice roadmap.'
      }
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', width: '100%' }}>
          <Button variant="subtle" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} type="button">
            {isEditMode ? 'Save Changes' : 'Save Resource'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Title */}
        <Input
          label="Resource Title"
          name="title"
          placeholder="e.g. NeetCode 150 Practice Roadmap, Use The Index Luke"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
          }}
          error={errors.title}
          required
          autoFocus
        />

        {/* URL */}
        <Input
          label="Resource URL"
          name="url"
          type="url"
          placeholder="https://example.com/guide/..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (errors.url) setErrors((prev) => ({ ...prev, url: null }));
          }}
          error={errors.url}
          helperText="Direct web address to the documentation, article, or practice sheet"
          required
        />

        {/* Row: Resource Type & Subject */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Select
            label="Resource Type"
            name="resourceType"
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            options={resourceTypeOptions}
            required
          />
          <Select
            label="Subject"
            name="subjectId"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            options={subjectOptions}
          />
        </div>

        {/* Topic */}
        <Input
          label="Topic / Subtopic"
          name="topic"
          placeholder="e.g. Indexing Internals, Sockets, Dynamic Programming"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        {/* Description */}
        <div className="app-input-group">
          <label htmlFor="resource-desc-input" className="app-input-label">
            Description / Overview
          </label>
          <div className="app-input-wrapper">
            <textarea
              id="resource-desc-input"
              name="description"
              className="app-input"
              rows={3}
              placeholder="Brief summary of what this resource covers and why it is useful for interview prep..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                fontSize: 'var(--font-size-sm)',
                lineHeight: 1.5,
                minHeight: '80px',
                padding: '10px 12px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* Tags */}
        <Input
          label="Tags"
          name="tags"
          placeholder="Comma-separated, e.g. SQL, Postgres, B-Tree, Interview"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          helperText="Categorize this link for quick multi-subject filtering"
        />

        {/* Favorite Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingTop: 'var(--space-2)',
            borderTop: '1px solid var(--color-border-subtle)'
          }}
        >
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)'
            }}
          >
            <input
              type="checkbox"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#f59e0b' }}
            />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Icon name={favorite ? 'starFilled' : 'star'} size={14} color={favorite ? '#f59e0b' : 'currentColor'} />
              Mark as Favorite Resource
            </span>
          </label>
        </div>
      </form>
    </Modal>
  );
}

export default ResourceFormModal;
