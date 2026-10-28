import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { LoadingIndicator } from '../components/LoadingIndicator';
import Icon from '../components/Icon';

// Notes Modular Components
import NotesStats from '../components/notes/NotesStats';
import NotesToolbar from '../components/notes/NotesToolbar';
import ContentCard from '../components/notes/ContentCard';
import NoteFormModal from '../components/notes/NoteFormModal';
import ResourceFormModal from '../components/notes/ResourceFormModal';
import ItemDetailModal from '../components/notes/ItemDetailModal';
import DeleteItemConfirmModal from '../components/notes/DeleteItemConfirmModal';

// Utilities & Calculations
import {
  calculateNotesMetrics,
  filterAndSortItems,
  getAllUniqueTags
} from '../utils/notesData';

// API Services
import noteService from '../services/noteService';
import resourceService from '../services/resourceService';

export function NotesPage() {
  // Live MongoDB collections state
  const [notes, setNotes] = useState([]);
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Active view tab: 'all' | 'notes' | 'resources' | 'favorites'
  const [viewTab, setViewTab] = useState('all');

  // Filter and sort state
  const [filters, setFilters] = useState({
    search: '',
    subject: 'all',
    resourceType: 'all',
    tag: 'all',
    sortBy: 'updatedAtDesc'
  });

  // Modal states
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);

  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState(null);

  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Transient feedback toast
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => {
      setFeedback((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  // Fetch both notes and resources in parallel from separate MongoDB collections
  const fetchLibrary = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [notesData, resourcesData] = await Promise.all([
        noteService.getNotes(),
        resourceService.getResources()
      ]);
      setNotes(Array.isArray(notesData) ? notesData : []);
      setResources(Array.isArray(resourcesData) ? resourcesData : []);
    } catch (err) {
      setLoadError(err.message || 'Failed to load notes and resources from database.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  // Combine notes and resources into unified frontend view model
  const items = useMemo(() => {
    const taggedNotes = notes.map((n) => ({ ...n, type: 'note' }));
    const taggedResources = resources.map((r) => ({ ...r, type: 'resource' }));
    return [...taggedNotes, ...taggedResources];
  }, [notes, resources]);

  // Derived metrics calculation
  const metrics = useMemo(() => {
    return calculateNotesMetrics(items);
  }, [items]);

  // Derived list of all available tags across items
  const uniqueTags = useMemo(() => {
    return getAllUniqueTags(items);
  }, [items]);

  // Filtered and sorted items for active view
  const displayedItems = useMemo(() => {
    return filterAndSortItems(items, { ...filters, viewTab });
  }, [items, filters, viewTab]);

  // Filter actions
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      subject: 'all',
      resourceType: 'all',
      tag: 'all',
      sortBy: 'updatedAtDesc'
    });
  };

  const handleSelectTag = (tag) => {
    setFilters((prev) => ({
      ...prev,
      tag
    }));
  };

  // Quick Toggles: Favorite & Pin with MongoDB persistence
  const handleToggleFavorite = async (itemId) => {
    const targetItem = items.find((it) => it.id === itemId);
    if (!targetItem) return;

    const newFavoriteState = !targetItem.favorite;

    try {
      if (targetItem.type === 'note') {
        const updated = await noteService.toggleFavorite(itemId, newFavoriteState);
        setNotes((prev) =>
          prev.map((n) => (n.id === itemId ? { ...updated, type: 'note' } : n))
        );
      } else {
        const updated = await resourceService.toggleFavorite(itemId, newFavoriteState);
        setResources((prev) =>
          prev.map((r) => (r.id === itemId ? { ...updated, type: 'resource' } : r))
        );
      }

      // Keep detail modal synced if open
      setSelectedItemForDetail((prev) =>
        prev && prev.id === itemId
          ? { ...prev, favorite: newFavoriteState }
          : prev
      );

      showFeedback(
        newFavoriteState
          ? `Added "${targetItem.title}" to Favorites.`
          : `Removed "${targetItem.title}" from Favorites.`
      );
    } catch (err) {
      showFeedback(`Failed to toggle favorite: ${err.message}`, 'error');
    }
  };

  const handleTogglePin = async (noteId) => {
    const targetNote = notes.find((n) => n.id === noteId);
    if (!targetNote) return;

    const newPinState = !targetNote.pinned;

    try {
      const updated = await noteService.togglePin(noteId, newPinState);
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...updated, type: 'note' } : n))
      );

      setSelectedItemForDetail((prev) =>
        prev && prev.id === noteId
          ? { ...prev, pinned: newPinState }
          : prev
      );

      showFeedback(
        newPinState
          ? `Pinned "${targetNote.title}" to top of notes.`
          : `Unpinned "${targetNote.title}".`
      );
    } catch (err) {
      showFeedback(`Failed to update pinned state: ${err.message}`, 'error');
    }
  };

  // Clipboard copy handler
  const handleCopy = (text, message = 'Copied to clipboard.') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showFeedback(message);
    }
  };

  // CRUD Operations: Notes
  const handleOpenCreateNote = () => {
    setNoteToEdit(null);
    setIsNoteFormOpen(true);
  };

  const handleOpenEditItem = (item) => {
    if (item.type === 'note') {
      setNoteToEdit(item);
      setIsNoteFormOpen(true);
    } else {
      setResourceToEdit(item);
      setIsResourceFormOpen(true);
    }
  };

  const handleSaveNote = async (notePayload) => {
    try {
      if (notePayload.id) {
        // Edit existing note in MongoDB
        const updated = await noteService.updateNote(notePayload.id, notePayload);
        setNotes((prev) =>
          prev.map((n) => (n.id === notePayload.id ? { ...updated, type: 'note' } : n))
        );
        setSelectedItemForDetail((prev) =>
          prev && prev.id === notePayload.id ? { ...updated, type: 'note' } : prev
        );
        showFeedback(`Updated note: "${updated.title}".`);
      } else {
        // Create new note in MongoDB
        const created = await noteService.createNote(notePayload);
        setNotes((prev) => [{ ...created, type: 'note' }, ...prev]);
        showFeedback(`Created revision note: "${created.title}".`);
      }
      setIsNoteFormOpen(false);
      setNoteToEdit(null);
    } catch (err) {
      showFeedback(`Failed to save note: ${err.message}`, 'error');
    }
  };

  // CRUD Operations: Resources
  const handleOpenCreateResource = () => {
    setResourceToEdit(null);
    setIsResourceFormOpen(true);
  };

  const handleSaveResource = async (resPayload) => {
    try {
      if (resPayload.id) {
        // Edit existing resource in MongoDB
        const updated = await resourceService.updateResource(resPayload.id, resPayload);
        setResources((prev) =>
          prev.map((r) => (r.id === resPayload.id ? { ...updated, type: 'resource' } : r))
        );
        setSelectedItemForDetail((prev) =>
          prev && prev.id === resPayload.id ? { ...updated, type: 'resource' } : prev
        );
        showFeedback(`Updated resource: "${updated.title}".`);
      } else {
        // Create new resource in MongoDB
        const created = await resourceService.createResource(resPayload);
        setResources((prev) => [{ ...created, type: 'resource' }, ...prev]);
        showFeedback(`Added learning resource: "${created.title}".`);
      }
      setIsResourceFormOpen(false);
      setResourceToEdit(null);
    } catch (err) {
      showFeedback(`Failed to save resource: ${err.message}`, 'error');
    }
  };

  // Delete Operation routed to correct collection
  const handleDeleteItem = async (itemId) => {
    const target = items.find((it) => it.id === itemId);
    if (!target) return;

    try {
      if (target.type === 'note') {
        await noteService.deleteNote(itemId);
        setNotes((prev) => prev.filter((n) => n.id !== itemId));
      } else {
        await resourceService.deleteResource(itemId);
        setResources((prev) => prev.filter((r) => r.id !== itemId));
      }

      if (selectedItemForDetail?.id === itemId) {
        setSelectedItemForDetail(null);
      }
      setItemToDelete(null);

      showFeedback(
        `Deleted ${target.type === 'note' ? 'note' : 'resource'}: "${target.title}".`
      );
    } catch (err) {
      showFeedback(`Failed to delete item: ${err.message}`, 'error');
    }
  };

  return (
    <div className="page-wrapper notes-container">
      {/* Transient Action Feedback Toast */}
      {feedback && (
        <div
          className="notes-feedback-toast"
          role="status"
          aria-live="polite"
          style={{
            border: feedback.type === 'error' ? '1px solid var(--color-error)' : '1px solid var(--color-border-strong)'
          }}
        >
          <Icon
            name={feedback.type === 'error' ? 'alert' : 'checkCircle'}
            size={16}
            color={feedback.type === 'error' ? 'var(--color-error)' : 'var(--color-primary)'}
          />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Page Header */}
      <SectionHeading
        title="Notes & Resources"
        subtitle="Organize revision cheat sheets, system design architectures, interview takeaways, and external learning links."
        badge={
          <Badge variant="primary" size="sm">
            Live Database: {metrics.totalItems} Items
          </Badge>
        }
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant="secondary"
              leftIcon={<Icon name="link" size={15} />}
              onClick={handleOpenCreateResource}
            >
              Add Resource
            </Button>
            <Button
              variant="primary"
              leftIcon={<Icon name="plus" size={15} />}
              onClick={handleOpenCreateNote}
            >
              New Note
            </Button>
          </div>
        }
      />

      {/* Summary Statistics */}
      <NotesStats metrics={metrics} />

      {/* Toolbar: Views, Search, Filters, and New Triggers */}
      <NotesToolbar
        viewTab={viewTab}
        onViewTabChange={setViewTab}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onOpenCreateNote={handleOpenCreateNote}
        onOpenCreateResource={handleOpenCreateResource}
        metrics={metrics}
        uniqueTags={uniqueTags}
      />

      {/* Content Grid or Loading / Error / Empty State */}
      {isLoading ? (
        <div style={{ padding: 'var(--space-12) 0' }}>
          <LoadingIndicator size="lg" text="Loading notes & learning resources from MongoDB..." />
        </div>
      ) : loadError ? (
        <div
          className="app-card"
          style={{
            padding: 'var(--space-8)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-3)'
          }}
        >
          <Icon name="alert" size={32} color="var(--color-error)" />
          <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Unable to Load Notes & Resources</h3>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', maxWidth: '460px' }}>
            {loadError}
          </p>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Icon name="spinner" size={14} />}
            onClick={fetchLibrary}
            style={{ marginTop: 'var(--space-2)' }}
          >
            Retry Connection
          </Button>
        </div>
      ) : displayedItems.length > 0 ? (
        <div className="notes-cards-grid" role="region" aria-label="Notes and resources grid">
          {displayedItems.map((item) => (
            <ContentCard
              key={`${item.type}-${item.id}`}
              item={item}
              onViewDetails={setSelectedItemForDetail}
              onEdit={handleOpenEditItem}
              onDelete={setItemToDelete}
              onToggleFavorite={handleToggleFavorite}
              onTogglePin={handleTogglePin}
              onCopy={handleCopy}
              onSelectTag={handleSelectTag}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={viewTab === 'favorites' ? 'star' : viewTab === 'resources' ? 'link' : 'notes'}
          title={
            viewTab === 'favorites'
              ? 'No favorite items yet'
              : items.length === 0
              ? 'Your database library is empty'
              : 'No matching notes or resources'
          }
          description={
            viewTab === 'favorites'
              ? 'Click the star icon on any revision note or learning resource to bookmark it here for quick access.'
              : items.length === 0
              ? 'Get started by creating your first revision note or adding a link to documentation or a tutorial.'
              : 'No notes or resources match your active search and filter criteria. Try adjusting your query or resetting filters.'
          }
          action={
            items.length > 0 ? (
              <Button variant="subtle" size="sm" onClick={handleClearFilters}>
                Reset All Filters
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Icon name="plus" size={14} />}
                onClick={handleOpenCreateNote}
              >
                Create First Note
              </Button>
            )
          }
        />
      )}

      {/* Modal: Create or Edit Note */}
      <NoteFormModal
        isOpen={isNoteFormOpen}
        onClose={() => {
          setIsNoteFormOpen(false);
          setNoteToEdit(null);
        }}
        onSaveNote={handleSaveNote}
        noteToEdit={noteToEdit}
      />

      {/* Modal: Create or Edit Resource */}
      <ResourceFormModal
        isOpen={isResourceFormOpen}
        onClose={() => {
          setIsResourceFormOpen(false);
          setResourceToEdit(null);
        }}
        onSaveResource={handleSaveResource}
        resourceToEdit={resourceToEdit}
      />

      {/* Modal: Full Item Details */}
      <ItemDetailModal
        isOpen={Boolean(selectedItemForDetail)}
        onClose={() => setSelectedItemForDetail(null)}
        item={selectedItemForDetail}
        onEdit={handleOpenEditItem}
        onDelete={setItemToDelete}
        onToggleFavorite={handleToggleFavorite}
        onTogglePin={handleTogglePin}
        onCopy={handleCopy}
      />

      {/* Modal: Deletion Confirmation */}
      <DeleteItemConfirmModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteItem}
        item={itemToDelete}
      />
    </div>
  );
}

export default NotesPage;
