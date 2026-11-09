
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("eduhub_token")
      : null;

  const response = await fetch(
    `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    }
  );

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Server returned HTML or an invalid response. Check API URL: ${response.url}`
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}
