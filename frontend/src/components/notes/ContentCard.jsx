import React, { useState } from 'react';
import { Badge } from '../Badge';
import { IconButton } from '../IconButton';
import Icon from '../Icon';
import {
  SUBJECT_MAP,
  RESOURCE_TYPE_CONFIG,
  formatDisplayDate
} from '../../utils/notesData';

export function ContentCard({
  item,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleFavorite,
  onTogglePin,
  onCopy,
  onSelectTag
}) {
  const [copied, setCopied] = useState(false);
  const isNote = item.type === 'note';
  const subject = item.subjectId ? SUBJECT_MAP[item.subjectId] : null;
  const resourceTypeConfig = !isNote && item.resourceType ? RESOURCE_TYPE_CONFIG[item.resourceType] : null;

  const handleCopy = (e) => {
    e.stopPropagation();
    const textToCopy = isNote ? item.content : item.url;
    if (onCopy) {
      onCopy(textToCopy, isNote ? 'Note content copied to clipboard.' : 'Resource link copied to clipboard.');
    } else {
      navigator.clipboard?.writeText(textToCopy);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Strip excessive markdown formatting symbols for readable card snippet
  const cleanSnippet = (text = '') => {
    return text
      .replace(/^#{1,6}\s+/gm, '') // headings
      .replace(/\*\*(.*?)\*\*/g, '$1') // bold
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // code blocks
      .trim();
  };

  return (
    <div
      className={`notes-card ${isNote && item.pinned ? 'notes-card--pinned' : ''}`}
      onClick={() => onViewDetails(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails(item);
        }
      }}
      aria-label={`${isNote ? 'Note' : 'Resource'}: ${item.title}`}
    >
      {/* Card Header: Type Badge, Subject Badge, Quick Favorites/Pin */}
      <div className="notes-card-header">
        <div className="notes-card-badges">
          {/* Item Type Badge */}
          <Badge variant={isNote ? 'info' : 'success'} size="sm">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Icon name={isNote ? 'fileText' : 'link'} size={12} />
              {isNote ? 'Note' : 'Resource'}
            </span>
          </Badge>

          {/* Subject Badge */}
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
              {subject.shortName}
            </Badge>
          )}

          {/* Resource Type Badge (if Resource) */}
          {!isNote && item.resourceType && (
            <Badge variant={resourceTypeConfig?.variant || 'neutral'} size="sm">
              {item.resourceType}
            </Badge>
          )}

          {/* Topic */}
          {item.topic && (
            <span
              style={{
                fontSize: 'var(--font-size-2xs)',
                color: 'var(--color-text-subtle)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '120px'
              }}
              title={item.topic}
            >
              {item.topic}
            </span>
          )}
        </div>

        {/* Quick Toggles: Pin (Note only) & Favorite */}
        <div className="notes-card-actions-quick" onClick={(e) => e.stopPropagation()}>
          {isNote && (
            <button
              type="button"
              className={`notes-quick-btn ${item.pinned ? 'notes-quick-btn--active-pin' : ''}`}
              onClick={() => onTogglePin(item.id)}
              title={item.pinned ? 'Unpin note' : 'Pin note to top'}
              aria-label={item.pinned ? 'Unpin note' : 'Pin note'}
            >
              <Icon name="pin" size={15} />
            </button>
          )}

          <button
            type="button"
            className={`notes-quick-btn ${item.favorite ? 'notes-quick-btn--active-favorite' : ''}`}
            onClick={() => onToggleFavorite(item.id)}
            title={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={item.favorite ? 'Starred favorite' : 'Add favorite'}
          >
            <Icon name={item.favorite ? 'starFilled' : 'star'} size={15} />
          </button>
        </div>
      </div>

      {/* Card Title */}
      <h3 className="notes-card-title" title={item.title}>
        {isNote && item.pinned && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: 'var(--color-primary)',
              marginRight: '6px'
            }}
            title="Pinned"
          >
            <Icon name="pin" size={13} />
          </span>
        )}
        {item.title}
      </h3>

      {/* Card Body / Preview */}
      {isNote ? (
        <div className="notes-card-preview" title="Click to view full note">
          {cleanSnippet(item.content)}
        </div>
      ) : (
        <div className="notes-card-resource-box">
          {item.description && (
            <p className="notes-card-resource-desc">{item.description}</p>
          )}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="notes-card-url-link"
              onClick={(e) => e.stopPropagation()}
              title={`Open ${item.url}`}
            >
              <Icon name="externalLink" size={13} />
              <span>{item.url}</span>
            </a>
          )}
        </div>
      )}

      {/* Tags Chips */}
      {item.tags && item.tags.length > 0 && (
        <div className="notes-card-tags" onClick={(e) => e.stopPropagation()}>
          {item.tags.map((t) => (
            <span
              key={t}
              className="notes-tag-chip"
              onClick={() => onSelectTag && onSelectTag(t)}
              title={`Filter by #${t}`}
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Card Footer: Timestamps & Action Buttons */}
      <div className="notes-card-footer" onClick={(e) => e.stopPropagation()}>
        <span className="notes-card-date">
          Updated {formatDisplayDate(item.updatedAt || item.createdAt)}
        </span>

        <div className="notes-card-actions">
          {/* Quick Copy Button */}
          <IconButton
            name={copied ? 'check' : 'copy'}
            size="sm"
            aria-label={isNote ? 'Copy note content' : 'Copy resource URL'}
            title={copied ? 'Copied!' : isNote ? 'Copy note' : 'Copy link'}
            onClick={handleCopy}
          />

          {/* View Details */}
          <IconButton
            name="eye"
            size="sm"
            aria-label={`View details for ${item.title}`}
            title="View details"
            onClick={() => onViewDetails(item)}
          />

          {/* Edit */}
          <IconButton
            name="edit"
            size="sm"
            aria-label={`Edit ${item.title}`}
            title="Edit"
            onClick={() => onEdit(item)}
          />

          {/* Delete */}
          <IconButton
            name="trash"
            size="sm"
            aria-label={`Delete ${item.title}`}
            title="Delete"
            onClick={() => onDelete(item)}
          />
        </div>
      </div>
    </div>
  );
}

export default ContentCard;
