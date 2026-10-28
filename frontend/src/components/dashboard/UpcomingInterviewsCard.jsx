import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { EmptyState } from '../EmptyState';
import Icon from '../Icon';

export function UpcomingInterviewsCard({
  interviews,
  onOpenScheduleModal
}) {
  const navigate = useNavigate();

  return (
    <Card bordered>
      <CardHeader>
        <div>
          <CardTitle>Upcoming Interviews</CardTitle>
          <CardDescription>
            Confirmed rounds and technical interview screenings
          </CardDescription>
        </div>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Icon name="plus" size={14} />}
          onClick={onOpenScheduleModal}
        >
          Schedule
        </Button>
      </CardHeader>

      <CardContent>
        {interviews.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="No upcoming interviews"
            description="You don't have any interviews scheduled right now. Add an upcoming round to track preparation deadlines."
            action={
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Icon name="plus" size={14} />}
                onClick={onOpenScheduleModal}
              >
                Schedule New Interview
              </Button>
            }
          />
        ) : (
          <div className="dashboard-interviews-list" role="list" aria-label="Upcoming interviews">
            {interviews.map((interview) => (
              <div key={interview.id} className="dashboard-interview-item" role="listitem">
                {/* Company Monogram Avatar */}
                <div className="dashboard-interview-company-avatar" aria-hidden="true">
                  {interview.company.slice(0, 2).toUpperCase()}
                </div>

                <div className="dashboard-interview-info">
                  <div className="dashboard-interview-header-row">
                    <span className="dashboard-interview-company">{interview.company}</span>
                    <Badge variant={interview.badgeVariant || 'primary'} size="sm">
                      {interview.status}
                    </Badge>
                  </div>

                  <span className="dashboard-interview-role">{interview.role}</span>
                  <span className="dashboard-interview-stage">{interview.stage}</span>

                  <div className="dashboard-interview-meta">
                    <span className="dashboard-interview-date">
                      <Icon name="calendar" size={12} />
                      {interview.date} • {interview.time}
                    </span>
                    {interview.format && (
                      <span style={{ color: 'var(--color-text-subtle)' }}>
                        ({interview.format})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <button
          type="button"
          onClick={() => navigate('/schedule')}
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <span>View Interview Schedule & Calendar</span>
          <Icon name="arrowRight" size={14} />
        </button>
      </CardFooter>
    </Card>
  );
}

export default UpcomingInterviewsCard;
