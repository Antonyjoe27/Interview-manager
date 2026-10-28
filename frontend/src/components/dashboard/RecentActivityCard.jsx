import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../Card';
import Icon from '../Icon';

export function RecentActivityCard({ activities }) {
  return (
    <Card bordered>
      <CardHeader>
        <div>
          <CardTitle>Recent Preparation Activity</CardTitle>
          <CardDescription>
            Chronological audit of completed tasks, notes, and milestones
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <div className="dashboard-activity-list" role="feed" aria-label="Recent activity log">
          {activities.map((act) => (
            <article key={act.id} className="dashboard-activity-item">
              <div className="dashboard-activity-icon" aria-hidden="true">
                <Icon name={act.icon || 'check'} size={15} />
              </div>
              <div className="dashboard-activity-content">
                <span className="dashboard-activity-title">{act.title}</span>
                <div className="dashboard-activity-meta">
                  <span>{act.category}</span>
                  <span>•</span>
                  <span>{act.timestamp}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentActivityCard;
