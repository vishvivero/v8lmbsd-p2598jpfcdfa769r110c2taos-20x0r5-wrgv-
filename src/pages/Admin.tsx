import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) {
        setError(error.message);
        throw error;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  if (loadingProfile) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {profile?.email}</p>
      <nav>
        <ul>
          <li>
            <Link to="/admin/blogs">Manage Blogs</Link>
          </li>
          <li>
            <Link to="/admin/categories">Manage Categories</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="blogs/*" element={<div>Blog Management</div>} />
        <Route path="categories/*" element={<div>Category Management</div>} />
      </Routes>
    </div>
  );
};

export default Admin;
