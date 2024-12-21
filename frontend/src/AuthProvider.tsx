import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "./types";
import { getUserApi, login, register } from "./services/authService";

export type AuthContext = {
  authToken?: string | null;
  currentUser?: User | null;
  isLoggedIn: () => boolean;
  handleLogin: (userData: {
    username: string;
    password: string;
  }) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleRegister: (userData: {
    username: string;
    password: string;
    email: string;
  }) => Promise<{ message: string }>;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({ children }: AuthProviderProps) {
  const [authToken, setAuthToken] = useState<string | null>();
  const [currentUser, setCurrentUser] = useState<User | null>();

  useEffect(() => {
    async function getUser() {
      try {
        const storedToken = localStorage.getItem("authToken");

        if (!storedToken) {
          setAuthToken(null);
          setCurrentUser(null);
          return;
        }

        const { user } = await getUserApi(storedToken);

        setAuthToken(storedToken);
        setCurrentUser(user);
      } catch (error) {
        setAuthToken(null);
        setCurrentUser(null);
        throw error;
      }
    }

    getUser();
  }, []);

  async function handleLogin(userData: { username: string; password: string }) {
    try {
      const { authToken, user } = await login(userData);

      localStorage.setItem("authToken", authToken);
      setAuthToken(authToken);
      setCurrentUser(user);
    } catch (error) {
      setAuthToken(null);
      setCurrentUser(null);
      throw error;
    }
  }
  async function handleLogout() {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setCurrentUser(null);
  }
  function isLoggedIn() {
    return !!localStorage.getItem("authToken");
  }

  async function handleRegister(userData: {
    username: string;
    password: string;
    email: string;
  }) {
    return register(userData);
  }

  return (
    <AuthContext.Provider
      value={{
        authToken,
        currentUser,
        handleLogout,
        handleLogin,
        handleRegister,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside of AuthProvider");
  }
  return context;
}
