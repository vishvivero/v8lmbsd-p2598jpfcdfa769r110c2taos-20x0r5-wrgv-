import React from 'react';
import { useVisitorMetrics } from '@/hooks/use-visitor-metrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VisitorMap } from './VisitorMap';
import { BlogMetricsChart } from './BlogMetricsChart';

export const AdminMetrics = () => {
  const { data: metrics, isLoading } = useVisitorMetrics();

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalVisitors || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.uniqueCountries || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.registeredUsers || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visitor Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <VisitorMap data={metrics?.visitorsByCountry || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blog Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <BlogMetricsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};