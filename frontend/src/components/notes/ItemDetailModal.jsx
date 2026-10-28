import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Badge } from '../Badge';
import { Button } from '../Button';
import Icon from '../Icon';
import {
  SUBJECT_MAP,
  RESOURCE_TYPE_CONFIG,
  formatDisplayDate
} from '../../utils/notesData';

export function ItemDetailModal({
  isOpen,
  onClose,
  item,
  onEdit,
  onDelete,
  onToggleFavorite,
  onTogglePin,
  onCopy
}) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const isNote = item.type === 'note';
  const subject = item.subjectId ? SUBJECT_MAP[item.subjectId] : null;
  const resourceTypeConfig = !isNote && item.resourceType ? RESOURCE_TYPE_CONFIG[item.resourceType] : null;

  const handleCopy = () => {
    const textToCopy = isNote ? item.content : item.url;
    if (onCopy) {
      onCopy(textToCopy, isNote ? 'Note content copied to clipboard.' : 'Resource URL copied to clipboard.');
    } else {
      navigator.clipboard?.writeText(textToCopy);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div className="notes-detail-header-badges">
            <Badge variant={isNote ? 'info' : 'success'} size="sm">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Icon name={isNote ? 'fileText' : 'link'} size={12} />
                {isNote ? 'Revision Note' : 'Resource Link'}
              </span>
            </Badge>

            {subject && (
              <Badge variant="neutral" size="sm">
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: subject.color,
                    display: 'inline-block',
                    marginRight: '4px'
                  }}
                  aria-hidden="true"
                />
                {subject.name}
              </Badge>
            )}

            {!isNote && item.resourceType && (
              <Badge variant={resourceTypeConfig?.variant || 'neutral'} size="sm">
                {item.resourceType}
              </Badge>
            )}

            {isNote && item.pinned && (
              <Badge variant="primary" size="sm">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <Icon name="pin" size={11} />
                  Pinned
                </span>
              </Badge>
            )}

            {item.favorite && (
              <Badge variant="warning" size="sm">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <Icon name="starFilled" size={11} />
                  Favorite
                </span>
              </Badge>
            )}
          </div>

          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.3 }}>
            {item.title}
          </h2>

          {item.topic && (
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Topic: {item.topic}
            </span>
          )}
        </div>
      }
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Icon name="trash" size={14} />}
            onClick={() => {
              onClose();
              onDelete(item);
            }}
          >
            Delete
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {/* Pin Toggle (Note only) */}
            {isNote && (
              <Button
                variant="subtle"
                size="sm"
                leftIcon={<Icon name="pin" size={14} />}
                onClick={() => onTogglePin(item.id)}
              >
                {item.pinned ? 'Unpin' : 'Pin'}
              </Button>
            )}

            {/* Favorite Toggle */}
            <Button
              variant="subtle"
              size="sm"
              leftIcon={<Icon name={item.favorite ? 'starFilled' : 'star'} size={14} color={item.favorite ? '#f59e0b' : 'currentColor'} />}
              onClick={() => onToggleFavorite(item.id)}
            >
              {item.favorite ? 'Favorited' : 'Favorite'}
            </Button>

            {/* Copy Button */}
            <Button
              variant="subtle"
              size="sm"
              leftIcon={<Icon name={copied ? 'check' : 'copy'} size={14} />}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : isNote ? 'Copy Note' : 'Copy Link'}
            </Button>

            {/* Edit Button */}
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Icon name="edit" size={14} />}
              onClick={() => {
                onClose();
                onEdit(item);
              }}
            >
              Edit
            </Button>

            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* If Resource: External Link Banner and Description */}
        {!isNote && (
          <div className="notes-detail-resource-banner">
            {item.description && (
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {item.description}
              </p>
            )}

            {item.url && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--color-bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
                  <Icon name="link" size={16} />
                  <span
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.url}
                  </span>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-btn app-btn--primary app-btn--sm"
                  style={{ textDecoration: 'none', flexShrink: 0 }}
                >
                  Open Resource ↗
                </a>
              </div>
            )}
          </div>
        )}

        {/* If Note: Formatted Content Body */}
        {isNote && (
          <div className="notes-detail-body">
            {item.content}
          </div>
        )}

        {/* Tags Row */}
        {item.tags && item.tags.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--color-text-subtle)' }}>
              Tags:
            </span>
            {item.tags.map((t) => (
              <span key={t} className="notes-tag-chip">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Timestamps */}
        <div className="notes-detail-timestamps">
          <span>Created: {formatDisplayDate(item.createdAt)}</span>
          {item.updatedAt && (
            <span>Last Updated: {formatDisplayDate(item.updatedAt)}</span>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ItemDetailModal;
