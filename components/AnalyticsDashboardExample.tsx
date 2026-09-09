import React from 'react';
import UserActivityMetrics from './UserActivityMetrics';
import NewUserGrowth from './NewUserGrowth';

interface BusinessMetricsData {
  dauMauRatio: {
    dau: number;
    wau: number;
    mau: number;
  };
  totalBreakthroughs: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  platformHealthScore: number;
  userGrowthData: Array<{
    date: string;
    dau: number;
    wau: number;
    mau: number;
  }>;
  loyaltyPointsData: Array<{
    rule: string;
    points: number;
  }>;
  // ... other metrics
}

interface AnalyticsDashboardExampleProps {
  data: BusinessMetricsData;
}

const AnalyticsDashboardExample: React.FC<AnalyticsDashboardExampleProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Last updated:</span>
          <span className="text-sm font-medium text-gray-700">
            {new Date().toLocaleString()}
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Metrics (DAU/WAU/MAU) */}
        <UserActivityMetrics dauMauRatio={data.dauMauRatio} />
        
        {/* New User Growth (replaces Total Breakthroughs) */}
        <NewUserGrowth totalBreakthroughs={data.totalBreakthroughs} />
      </div>

      {/* Other Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Health Score */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {data.platformHealthScore}%
            </div>
            <p className="text-sm text-gray-500">Overall system health</p>
          </div>
        </div>

        {/* Loyalty Points */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loyalty Points</h3>
          <div className="space-y-2">
            {data.loyaltyPointsData.slice(0, 3).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{item.rule}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {item.points.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Users</span>
              <span className="text-sm font-semibold text-gray-900">
                {data.dauMauRatio.mau.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Today</span>
              <span className="text-sm font-semibold text-blue-600">
                {data.dauMauRatio.dau.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New This Week</span>
              <span className="text-sm font-semibold text-green-600">
                {data.totalBreakthroughs.weekly.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trend</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>Chart component would go here</p>
          <p className="text-sm ml-2">({data.userGrowthData.length} data points)</p>
        </div>
      </div>
    </div>
  );
};

// Example usage with API data:
const ExampleUsage: React.FC = () => {
  // This would come from your API call
  const mockData: BusinessMetricsData = {
    dauMauRatio: {
      dau: 1247,
      wau: 5632,
      mau: 18945
    },
    totalBreakthroughs: {
      daily: 89,
      weekly: 456,
      monthly: 1823
    },
    platformHealthScore: 94.2,
    userGrowthData: [
      { date: "Jan", dau: 450, wau: 1200, mau: 3500 },
      { date: "Feb", dau: 480, wau: 1350, mau: 3800 },
      { date: "Mar", dau: 520, wau: 1420, mau: 4100 }
    ],
    loyaltyPointsData: [
      { rule: "Chat Messages", points: 12500 },
      { rule: "Emotional Responses", points: 11500 },
      { rule: "Breakthroughs", points: 8900 }
    ]
  };

  return <AnalyticsDashboardExample data={mockData} />;
};

export default AnalyticsDashboardExample;
