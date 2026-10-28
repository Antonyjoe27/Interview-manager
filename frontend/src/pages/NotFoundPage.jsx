import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper" style={{ paddingTop: 'var(--space-8)' }}>
      <EmptyState
        icon="alert"
        title="Page Not Found"
        description="The section or route you requested does not exist or has been moved."
        action={
          <Button
            variant="primary"
            leftIcon={<Icon name="dashboard" size={16} />}
            onClick={() => navigate('/')}
          >
            Return to Dashboard
          </Button>
        }
      />
    </div>
  );
}

export default NotFoundPage;
