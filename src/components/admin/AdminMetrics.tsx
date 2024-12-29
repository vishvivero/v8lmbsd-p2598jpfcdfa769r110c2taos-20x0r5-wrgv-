import React from 'react';
import { useVisitorMetrics } from '@/hooks/use-visitor-metrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VisitorMap } from './VisitorMap';
import { BlogMetricsChart } from './BlogMetricsChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Eye, FileText, Activity } from 'lucide-react';

export const AdminMetrics = () => {
  const { data: metrics, isLoading } = useVisitorMetrics();

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading metrics...</div>;
  }

  const statsCards = [
    {
      title: "Unique Visitors",
      value: metrics?.uniqueVisitors || 0,
      icon: Users,
      description: "Total unique visitors"
    },
    {
      title: "Total Visits",
      value: metrics?.totalVisits || 0,
      icon: Eye,
      description: "Total page visits"
    },
    {
      title: "Total Debts",
      value: metrics?.totalDebts || 0,
      icon: FileText,
      description: "Active debt entries"
    },
    {
      title: "Active Users",
      value: metrics?.uniqueVisitors || 0,
      icon: Activity,
      description: "Currently active users"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Visitor Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics?.geoData || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="visited_at" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#34D399" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Visitor Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <VisitorMap geoData={metrics?.geoData || []} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for top pages - you can implement actual data later */}
              {[
                { path: '/planner', visits: 1200 },
                { path: '/blog', visits: 850 },
                { path: '/tools', visits: 645 },
                { path: '/about', visits: 432 },
              ].map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{page.path}</span>
                  <span className="text-sm font-medium">{page.visits}</span>
                </div>
              ))}
            </div>
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