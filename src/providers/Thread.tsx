import { validate } from "uuid";
import { getApiKey } from "@/lib/api-key";
import { Thread } from "@langchain/langgraph-sdk";
import { useQueryState } from "nuqs";
import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { createClient } from "./client";
import { useAuth } from "./auth-provider";

interface ThreadContextType {
  getThreads: () => Promise<Thread[]>;
  threads: Thread[];
  setThreads: Dispatch<SetStateAction<Thread[]>>;
  threadsLoading: boolean;
  setThreadsLoading: Dispatch<SetStateAction<boolean>>;
}

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

function getThreadSearchMetadata(
  assistantId: string,
): { graph_id: string } | { assistant_id: string } {
  if (validate(assistantId)) {
    return { assistant_id: assistantId };
  } else {
    return { graph_id: assistantId };
  }
}

export function ThreadProvider({ children }: { children: ReactNode }) {
  const [apiUrl] = useQueryState("apiUrl");
  const [assistantId] = useQueryState("assistantId");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const { getAuthHeaders } = useAuth();

  const getThreads = useCallback(async (): Promise<Thread[]> => {
    if (!apiUrl || !assistantId) return [];
    
    // 获取认证头
    const headers = getAuthHeaders();
    const apiKey = getApiKey() ?? undefined;
    
    // 添加API密钥到请求头
    if (apiKey) {
      headers["X-Api-Key"] = apiKey;
    }
    
    try {
      const response = await fetch(`${apiUrl}/threads`, {
        headers,
        method: "GET"
      });

      if (!response.ok) {
        console.error("Error fetching threads:", response.statusText);
        return [];
      }

      const data = await response.json();
      return data.threads || [];
    } catch (error) {
      console.error("Error fetching threads:", error);
      return [];
    }
  }, [apiUrl, assistantId, getAuthHeaders]);

  const value = {
    getThreads,
    threads,
    setThreads,
    threadsLoading,
    setThreadsLoading,
  };

  return (
    <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>
  );
}

export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const { getAuthHeaders } = useAuth();

  const getThreads = useCallback(async (): Promise<Thread[]> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2024";
    
    // 获取认证头
    const headers = getAuthHeaders();
    
    try {
      const response = await fetch(`${apiUrl}/threads`, {
        headers
      });

      if (!response.ok) {
        console.error("Error fetching threads:", response.statusText);
        return [];
      }

      const data = await response.json();
      return data.threads || [];
    } catch (error) {
      console.error("Error fetching threads:", error);
      return [];
    }
  }, [getAuthHeaders]);

  return { threads, setThreads, getThreads, threadsLoading, setThreadsLoading };
}
