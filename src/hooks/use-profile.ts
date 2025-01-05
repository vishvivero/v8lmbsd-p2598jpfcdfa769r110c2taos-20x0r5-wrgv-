import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";

export interface Profile {
  id: string;
  email: string | null;
  created_at: string;
  updated_at: string;
  monthly_payment: number | null;
  preferred_currency: string | null;
  is_admin: boolean | null;
  selected_strategy: string | null;
}

export function useProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log("No user ID available for profile fetch in useProfile");
        return null;
      }
      
      console.log("Fetching profile for user:", user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      console.log("Profile data fetched:", data);
      return data as Profile;
    },
    enabled: !!user?.id,
  });

  const createProfile = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("No user ID available");
      
      console.log("Creating profile for user:", user.id);
      const { data, error } = await supabase
        .from("profiles")
        .insert([{ id: user.id, email: user.email }])
        .select()
        .single();

      if (error) {
        console.error("Error creating profile:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: Error) => {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try signing out and signing back in.",
        variant: "destructive",
      });
    }
  });

  const updateProfile = useMutation({
    mutationFn: async (updatedProfile: Partial<Profile>) => {
      if (!user?.id) throw new Error("No user ID available");
      
      console.log("Updating profile:", updatedProfile);
      const { data, error } = await supabase
        .from("profiles")
        .update(updatedProfile)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  });

  return {
    profile,
    createProfile,
    updateProfile,
  };
}