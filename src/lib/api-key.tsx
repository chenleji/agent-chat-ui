import { getCookie } from "./cookies";

export function getApiKey(): string | null {
  try {
    if (typeof window === "undefined") return null;
    return getCookie("lg:chat:apiKey") ?? null;
  } catch {
    // no-op
  }

  return null;
}
