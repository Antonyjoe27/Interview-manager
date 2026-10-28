import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../Card';
import { Badge } from '../Badge';
import { WEEKLY_ACTIVITY } from '../../utils/dashboardData';

export function WeeklyActivityCard() {
  const totalHours = WEEKLY_ACTIVITY.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1);
  const totalProblems = WEEKLY_ACTIVITY.reduce((acc, curr) => acc + curr.problemsSolved, 0);
  const maxHours = Math.max(...WEEKLY_ACTIVITY.map((d) => d.hours), 6);

  return (
    <Card bordered>
      <CardHeader>
        <div>
          <CardTitle>Weekly Preparation Velocity</CardTitle>
          <CardDescription>
            Daily focus hours and solved technical problems over the past 7 days
          </CardDescription>
        </div>
        <Badge variant="success" dot>{totalHours} hrs logged</Badge>
      </CardHeader>

      <CardContent>
        <div className="dashboard-weekly-chart-wrap">
          {/* Header Metric Summary */}
          <div className="dashboard-weekly-header-metrics">
            <span>
              <strong style={{ color: 'var(--color-text-primary)' }}>{totalProblems}</strong> problems solved this week
            </span>
            <span>
              Daily average: <strong style={{ color: 'var(--color-text-primary)' }}>{(totalHours / 7).toFixed(1)} hrs</strong>
            </span>
          </div>

          {/* Pure CSS Bar Chart */}
          <div
            className="dashboard-weekly-chart"
            role="img"
            aria-label={`Weekly activity chart: Total ${totalHours} hours, ${totalProblems} problems solved`}
          >
            {WEEKLY_ACTIVITY.map((item) => {
              const heightPercent = Math.round((item.hours / maxHours) * 100);

              return (
                <div key={item.day} className="dashboard-weekly-bar-group">
                  <div
                    className="dashboard-weekly-bar-track"
                    title={`${item.day}: ${item.hours} hrs, ${item.problemsSolved} problems`}
                  >
                    <div
                      className="dashboard-weekly-bar-fill"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="dashboard-weekly-day">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WeeklyActivityCard;
