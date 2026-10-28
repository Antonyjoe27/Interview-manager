import React, { useState } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Badge } from '../components/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { Modal } from '../components/Modal';
import { Icon } from '../components/Icon';

export function ComponentShowcasePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimulateAction = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <SectionHeading
        title="Design System & UI Components"
        subtitle="Interactive showcase of all reusable UI components, tokens, and interaction states built in Phase 2."
        badge={<Badge variant="primary" dot>Live Showcase</Badge>}
        actions={
          <Button
            variant="primary"
            leftIcon={<Icon name="sparkles" size={16} />}
            onClick={() => setIsModalOpen(true)}
          >
            Launch Modal Dialog
          </Button>
        }
      />

      {/* 1. Buttons Showcase */}
      <Card bordered>
        <CardHeader>
          <div>
            <CardTitle>Buttons & Interactive States</CardTitle>
            <CardDescription>Primary, secondary, subtle, danger variants with size and state permutations.</CardDescription>
          </div>
          <Badge variant="neutral">Button Component</Badge>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Variants (Size MD)</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
                <Button variant="subtle">Subtle Action</Button>
                <Button variant="danger">Danger Action</Button>
                <Button variant="primary" disabled>Disabled State</Button>
              </div>
            </div>

            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Sizes & Icon Slots</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Button size="sm" variant="secondary" leftIcon={<Icon name="plus" size={14} />}>Small Button</Button>
                <Button size="md" variant="primary" leftIcon={<Icon name="tracker" size={16} />}>Medium Button</Button>
                <Button size="lg" variant="secondary" rightIcon={<Icon name="arrowRight" size={18} />}>Large Button</Button>
                <Button
                  variant="primary"
                  isLoading={isSubmitting}
                  onClick={handleSimulateAction}
                >
                  {isSubmitting ? 'Processing...' : 'Click to Test Loading'}
                </Button>
              </div>
            </div>

            <div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Icon Buttons</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <IconButton name="bell" aria-label="Notifications" variant="subtle" badge={true} />
                <IconButton name="search" aria-label="Search" variant="default" />
                <IconButton name="settings" aria-label="Settings" variant="primary" />
                <IconButton name="plus" aria-label="Add Item" variant="default" size="sm" />
                <IconButton name="calendar" aria-label="Schedule" variant="default" size="lg" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Badges Showcase */}
      <Card bordered>
        <CardHeader>
          <div>
            <CardTitle>Status Badges & Tokens</CardTitle>
            <CardDescription>Semantic status indicators with and without status dots.</CardDescription>
          </div>
          <Badge variant="neutral">Badge Component</Badge>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center' }}>
            <Badge variant="primary" dot>Primary Active</Badge>
            <Badge variant="success" dot>Mastered / Solved</Badge>
            <Badge variant="warning" dot>Needs Review</Badge>
            <Badge variant="error" dot>Failed / Blocked</Badge>
            <Badge variant="info" dot>In Progress</Badge>
            <Badge variant="neutral" dot>Backlog</Badge>
            <Badge variant="success" size="sm">Small Badge</Badge>
            <Badge variant="primary" size="md">Medium Badge</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 3. Form Inputs & Selects */}
      <Card bordered>
        <CardHeader>
          <div>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>Accessible inputs and dropdowns with labels, icons, helper text, and error states.</CardDescription>
          </div>
          <Badge variant="neutral">Form Controls</Badge>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
            <Input
              label="Standard Text Input"
              id="showcase-input-1"
              placeholder="e.g. Binary Search Tree"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="Enter a topic or algorithm keyword."
            />

            <Input
              label="Input with Left Icon"
              id="showcase-input-2"
              placeholder="Search interview questions..."
              leftIcon={<Icon name="search" size={16} />}
              helperText="Press Enter to filter topics."
            />

            <Input
              label="Input with Error State"
              id="showcase-input-3"
              defaultValue="Invalid URL syntax"
              error="Please enter a valid HTTPS repository link."
              required
            />

            <Select
              label="Topic Category Select"
              id="showcase-select-1"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              options={[
                { value: 'dsa', label: 'Data Structures & Algorithms' },
                { value: 'sys-design', label: 'System Design (HLD & LLD)' },
                { value: 'behavioral', label: 'Behavioral & Leadership' },
                { value: 'concurrency', label: 'Concurrency & Multithreading' }
              ]}
              helperText="Select a focus track."
            />

            <Select
              label="Select with Error State"
              id="showcase-select-2"
              options={[{ value: '1', label: 'Option 1' }]}
              error="Selection is required to proceed."
              required
            />

            <Input
              label="Disabled Input"
              id="showcase-input-disabled"
              value="Read-only system metric"
              disabled
              helperText="This field is currently locked."
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Empty State and Loading Indicator Showcase */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        <EmptyState
          icon="sparkles"
          title="Empty State Component"
          description="Clear illustration, actionable description, and slot for secondary actions."
          action={<Button variant="secondary" size="sm">Create First Topic</Button>}
        />

        <Card bordered>
          <CardHeader>
            <CardTitle>Loading Indicator</CardTitle>
            <CardDescription>Container and inline animated spinner states.</CardDescription>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <LoadingIndicator size="md" text="Syncing preparation metrics..." />
            <div style={{ marginTop: 'var(--space-4)' }}>
              <LoadingIndicator inline size="sm" text="Inline status loading" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="UI Dialog Foundation"
        description="Accessible modal component with focus trapping, backdrop blur, and escape key listener."
        size="md"
        footer={
          <>
            <Button variant="subtle" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Confirm Action
            </Button>
          </>
        }
      >
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: '1.6' }}>
          This modal dialog foundation handles scroll-locking, accessible focus management, and smooth scale transitions. It will be reused in future phases for question logging, interview stage creation, and note editing.
        </p>
      </Modal>
    </div>
  );
}

export default ComponentShowcasePage;
