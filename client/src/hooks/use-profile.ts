import { useQuery } from "@tanstack/react-query";

interface UserProfile {
  id: string;
  userId: string;
  role: "admin" | "student" | "tutor";
  levelId?: string;
  createdAt?: string;
}

async function fetchProfile(): Promise<UserProfile | null> {
  const response = await fetch("/api/profile", {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export function useProfile() {
  const { data: profile, isLoading } = useQuery<UserProfile | null>({
    queryKey: ["/api/profile"],
    queryFn: fetchProfile,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    profile,
    isLoading,
    isAdmin: profile?.role === "admin",
    isStudent: profile?.role === "student",
    isTutor: profile?.role === "tutor",
  };
}
