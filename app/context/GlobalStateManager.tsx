"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { User } from "@/lib/userType";
import { useSession, signOut } from "next-auth/react";

interface GlobalState {
  User: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const userContext = createContext<GlobalState | undefined>(undefined);

interface userContextProviderProps {
  User: User | null;
  children: ReactNode;
  refreshUser: () => Promise<void>;
}

export const ContextProvider = ({
  User: initialUser,
  children,
}: Partial<userContextProviderProps>) => {
  const [User, setUser] = useState<User | null>(initialUser || null);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(status === "loading");

  // Handle Token Refresh Failure globally
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/sign-in" });
    }
  }, [session]);

  // Sync session state to global user state
  useEffect(() => {
    setLoading(status === "loading");
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || null,
        provider: session.user.provider || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [session, status]);

  const values: GlobalState = {
    User,
    setUser,
    loading,
    setLoading,
  };

  return <userContext.Provider value={values}>{children}</userContext.Provider>;
};

export const useGlobalContextApiState = () => {
  const useGlobalComp = useContext(userContext);
  if (!useGlobalComp) {
    throw new Error(
      "useGlobalContextApiState must be used within a ContextProvider",
    );
  }
  return useGlobalComp;
};
