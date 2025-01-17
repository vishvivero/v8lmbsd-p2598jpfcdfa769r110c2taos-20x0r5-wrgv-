import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export const AuditLogs = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: async () => {
      console.log("Fetching audit logs...");
      const { data, error } = await supabase
        .from("admin_audit_logs")
        .select(`
          *,
          profiles:admin_id (
            email
          )
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching audit logs:", error);
        throw error;
      }

      console.log("Fetched audit logs:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
      </Car

dHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.created_at).toLocaleString()}
                </TableCell>
                <TableCell>{log.profiles?.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      log.action === "CREATE"
                        ? "default"
                        : log.action === "UPDATE"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell>{log.entity_type}</TableCell>
                <TableCell>
                  <pre className="text-xs">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};