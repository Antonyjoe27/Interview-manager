import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Select } from '../Select';
import { Button } from '../Button';
import Icon from '../Icon';
import {
  EXTENDED_SUBJECTS,
  parseTags
} from '../../utils/notesData';

export function NoteFormModal({
  isOpen,
  onClose,
  onSaveNote,
  noteToEdit = null
}) {
  const isEditMode = Boolean(noteToEdit);

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState('dsa');
  const [topic, setTopic] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [pinned, setPinned] = useState(false);

  // Field-specific validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (noteToEdit) {
        setTitle(noteToEdit.title || '');
        setContent(noteToEdit.content || '');
        setSubjectId(noteToEdit.subjectId || '');
        setTopic(noteToEdit.topic || '');
        setTagsInput(Array.isArray(noteToEdit.tags) ? noteToEdit.tags.join(', ') : '');
        setFavorite(Boolean(noteToEdit.favorite));
        setPinned(Boolean(noteToEdit.pinned));
      } else {
        setTitle('');
        setContent('');
        setSubjectId('dsa');
        setTopic('');
        setTagsInput('');
        setFavorite(false);
        setPinned(false);
      }
      setErrors({});
    }
  }, [isOpen, noteToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Note title is required.';
    }
    if (!content.trim()) {
      newErrors.content = 'Note content or revision summary is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSaveNote({
      ...(noteToEdit ? { id: noteToEdit.id, createdAt: noteToEdit.createdAt } : {}),
      type: 'note',
      title: title.trim(),
      content: content.trim(),
      subjectId: subjectId || '',
      topic: topic.trim(),
      tags: parseTags(tagsInput),
      favorite,
      pinned
    });

    onClose();
  };

  const subjectOptions = [
    { value: '', label: 'General / No Subject' },
    ...EXTENDED_SUBJECTS.map((s) => ({ value: s.id, label: s.name }))
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Revision Note' : 'Create Revision Note'}
      description={
        isEditMode
          ? 'Update your technical explanations, algorithms, or architectural insights.'
          : 'Write down key interview revision points, algorithms, or frameworks.'
      }
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', width: '100%' }}>
          <Button variant="subtle" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} type="button">
            {isEditMode ? 'Save Changes' : 'Create Note'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Title */}
        <Input
          label="Note Title"
          name="title"
          placeholder="e.g. LRU Cache Implementation, ACID Properties, TCP Lifecycle"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
          }}
          error={errors.title}
          required
          autoFocus
        />

        {/* Row: Subject & Topic */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Select
            label="Subject"
            name="subjectId"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            options={subjectOptions}
          />
          <Input
            label="Topic / Subtopic"
            name="topic"
            placeholder="e.g. Hash Table, Memory Management, Transactions"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {/* Content Body */}
        <div className={`app-input-group ${errors.content ? 'app-input-group--error' : ''}`}>
          <label htmlFor="note-content-input" className="app-input-label">
            Note Content <span className="app-input-required">*</span>
          </label>
          <div className="app-input-wrapper">
            <textarea
              id="note-content-input"
              name="content"
              className="app-input"
              rows={8}
              placeholder="Record code explanations, algorithmic invariants, design trade-offs, or interview flashcards..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors((prev) => ({ ...prev, content: null }));
              }}
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: 'var(--font-size-xs)',
                lineHeight: 1.55,
                minHeight: '160px',
                padding: '10px 12px',
                resize: 'vertical'
              }}
              required
            />
          </div>
          {errors.content && (
            <span className="app-input-error" role="alert">
              {errors.content}
            </span>
          )}
        </div>

        {/* Tags */}
        <Input
          label="Tags"
          name="tags"
          placeholder="Comma-separated, e.g. DSA, LeetCode, Pointers, Revision"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          helperText="Helps you quickly filter related notes across subjects"
        />

        {/* Toggles: Pin and Favorite */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-6)',
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
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
            />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="pin" size={14} />
              Pin note to top of list
            </span>
          </label>

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
              Mark as Favorite
            </span>
          </label>
        </div>
      </form>
    </Modal>
  );
}

export default NoteFormModal;
