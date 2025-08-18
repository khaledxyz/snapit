const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

if (!API_BASE_URL) {
  console.warn(
    "Warning: NEXT_PUBLIC_API_URL is not set. API requests may fail.",
  );
}

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status?: number;
  errorBody?: unknown;
}

interface ApiOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

/**
 * Core fetch function that handles requests to the API
 */
async function fetchApi<T>(
  endpoint: string,
  method: string = "GET",
  body?: unknown,
  options: ApiOptions = {},
): Promise<ApiResponse<T>> {
  try {
    // Build URL with query parameters if provided
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    // Prepare headers
    const headers: Record<string, string> = {
      ...(options.headers || {}),
    };
    if (body) {
      headers["Content-Type"] = "application/json";
    }

    // Make the request
    const response = await fetch(url.toString(), {
      method,
      headers,
      credentials: "include",
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    // Handle error responses
    if (!response.ok) {
      let errorBody: unknown = undefined;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = await response.text();
      }
      return {
        error:
          errorBody && typeof errorBody === "object" && "message" in errorBody
            ? (errorBody as { message?: string }).message
            : `Error: ${response.status}`,
        status: response.status,
        errorBody,
      };
    }

    // Handle successful responses - check if response has JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return { data, status: response.status };
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      return { data: text as unknown as T, status: response.status };
    }
  } catch (error: unknown) {
    console.error("API request failed:", error);
    return { error: "Failed to complete request" };
  }
}

/**
 * API helper with methods for common HTTP verbs
 */
export const api = {
  get: <T>(endpoint: string, options?: ApiOptions) =>
    fetchApi<T>(endpoint, "GET", undefined, options),

  post: <T>(endpoint: string, data?: unknown, options?: ApiOptions) =>
    fetchApi<T>(endpoint, "POST", data, options),

  put: <T>(endpoint: string, data?: unknown, options?: ApiOptions) =>
    fetchApi<T>(endpoint, "PUT", data, options),

  patch: <T>(endpoint: string, data?: unknown, options?: ApiOptions) =>
    fetchApi<T>(endpoint, "PATCH", data, options),

  delete: <T>(endpoint: string, options?: ApiOptions) =>
    fetchApi<T>(endpoint, "DELETE", undefined, options),
};
