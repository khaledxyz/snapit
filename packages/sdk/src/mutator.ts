let globalBaseURL = "";

export const setBaseURL = (url: string) => {
  globalBaseURL = url;
};

export const getBaseURL = () => globalBaseURL;

export interface ApiErrorBody {
  message?: string;
  statusCode?: number;
  error?: string;
}

export class ApiError extends Error {
  status: number;
  statusText: string;
  body: ApiErrorBody | null;

  constructor(status: number, statusText: string, body: ApiErrorBody | null) {
    // Use API error message if available, otherwise construct generic message
    super(body?.message || `API Error ${status}: ${statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

export const customFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const baseURL = globalBaseURL;
  const fullURL = url.startsWith("http") ? url : `${baseURL}${url}`;

  const response = await fetch(fullURL, options);

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  const body =
    [204, 205, 304].includes(response.status) || !isJson
      ? null
      : await response.json();

  // Throw error for non-2xx responses
  if (!response.ok) {
    throw new ApiError(response.status, response.statusText, body);
  }

  // Return the body directly, not wrapped
  return body as T;
};
