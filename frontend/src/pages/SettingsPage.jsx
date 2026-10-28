import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';

export function SettingsPage() {
  return (
    <div className="page-wrapper">
      <SectionHeading
        title="Settings"
        subtitle="Manage your profile, target roles, interview goals, and preferences."
        badge={<Badge variant="neutral">Planned Feature</Badge>}
      />

      <EmptyState
        icon="settings"
        title="Application Settings Placeholder"
        description="Target role preferences, database connection parameters, notification preferences, and export features will be implemented in a later phase."
      />
    </div>
  );
}

export default SettingsPage;
