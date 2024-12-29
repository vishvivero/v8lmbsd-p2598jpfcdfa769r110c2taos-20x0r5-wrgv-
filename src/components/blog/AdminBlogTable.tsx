import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { FileEdit } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  is_published: boolean;
  updated_at: string;
  profiles: { email: string };
}

interface AdminBlogTableProps {
  posts: BlogPost[] | null;
}

export const AdminBlogTable = ({ posts }: AdminBlogTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Title</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Last Updated</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {posts?.map((blog) => (
        <TableRow key={blog.id}>
          <TableCell>{blog.title}</TableCell>
          <TableCell>{blog.category}</TableCell>
          <TableCell>
            <Badge variant={blog.is_published ? "default" : "secondary"}>
              {blog.is_published ? "Published" : "Draft"}
            </Badge>
          </TableCell>
          <TableCell>
            {blog.updated_at
              ? new Date(blog.updated_at).toLocaleDateString()
              : "-"}
          </TableCell>
          <TableCell>
            <Link to={`/admin/edit/${blog.id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FileEdit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);