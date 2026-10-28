import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card';
import { Badge } from '../Badge';
import Icon from '../Icon';

export function PreparationProgress({ subjectsProgress }) {
  const navigate = useNavigate();

  return (
    <Card bordered>
      <CardHeader>
        <div>
          <CardTitle>Preparation Progress by Subject</CardTitle>
          <CardDescription>
            Subject mastery derived from active preparation task completion
          </CardDescription>
        </div>
        <Badge variant="primary" size="sm">5 Core Subjects</Badge>
      </CardHeader>

      <CardContent>
        <div className="dashboard-progress-list" role="region" aria-label="Subject preparation progress">
          {subjectsProgress.map((subj) => (
            <div key={subj.id} className="dashboard-progress-item">
              <div className="dashboard-progress-item__header">
                <div className="dashboard-progress-item__subject">
                  <div
                    className="dashboard-progress-item__icon"
                    style={{
                      backgroundColor: `${subj.color}22`,
                      color: subj.color
                    }}
                  >
                    <Icon name={subj.icon || 'cpu'} size={16} />
                  </div>
                  <span className="dashboard-progress-item__name">{subj.name}</span>
                </div>

                <div className="dashboard-progress-item__metrics">
                  <span className="dashboard-progress-item__counts">
                    {subj.completed} / {subj.total} tasks
                  </span>
                  <span className="dashboard-progress-item__percentage">
                    {subj.percentage}%
                  </span>
                </div>
              </div>

              <div
                className="dashboard-progress-bar"
                role="progressbar"
                aria-valuenow={subj.percentage}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`${subj.name} progress`}
              >
                <div
                  className="dashboard-progress-bar__fill"
                  style={{
                    width: `${subj.percentage}%`,
                    backgroundColor: subj.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <button
          type="button"
          onClick={() => navigate('/tracker')}
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
          <span>Open Full Preparation Tracker</span>
          <Icon name="arrowRight" size={14} />
        </button>
      </CardFooter>
    </Card>
  );
}

export default PreparationProgress;
