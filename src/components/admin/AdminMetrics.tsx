import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useVisitorMetrics } from "@/hooks/use-visitor-metrics";
import { Users, Globe, CreditCard, Map } from "lucide-react";
import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const AdminMetrics = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { data: metrics, isLoading, error } = useVisitorMetrics();

  const { data: blogMetrics } = useQuery({
    queryKey: ["blogMetrics"],
    queryFn: async () => {
      const { data: blogs, error } = await supabase
        .from("blogs")
        .select("category, created_at")
        .order("created_at");
      
      if (error) {
        console.error("Error fetching blog metrics:", error);
        throw error;
      }

      if (!blogs) return [];

      const categoryCount = blogs.reduce((acc: Record<string, number>, blog) => {
        acc[blog.category] = (acc[blog.category] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(categoryCount).map(([name, value]) => ({
        name,
        value
      }));
    },
  });

  useEffect(() => {
    if (!mapContainer.current || !metrics?.geoData) return;

    try {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHNxOWdtYmowMDJqMmtvOWd4ZXBqbXd4In0.7ULiLvKsAT7K5yGkqMFtRA';
      
      if (!map.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [0, 20],
          zoom: 1.5
        });
      }

      // Clear existing markers
      const markers = document.getElementsByClassName('mapboxgl-marker');
      while(markers[0]) {
        markers[0].remove();
      }

      console.log("Adding markers for locations:", metrics.geoData);

      // Add markers for each visitor location
      metrics.geoData.forEach((location: any) => {
        if (location.latitude && location.longitude) {
          console.log("Adding marker for location:", location);
          new mapboxgl.Marker()
            .setLngLat([location.longitude, location.latitude])
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `<h3>${location.city || 'Unknown City'}</h3><p>${location.country || 'Unknown Country'}</p>`
              )
            )
            .addTo(map.current!);
        }
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [metrics?.geoData]);

  if (error) {
    console.error("Error loading metrics:", error);
    return <div>Error loading metrics. Please try again later.</div>;
  }

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalVisits || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.uniqueVisitors || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalUsers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalDebts || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Posts by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blogMetrics || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Visitor Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={mapContainer} className="h-[400px] w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
};