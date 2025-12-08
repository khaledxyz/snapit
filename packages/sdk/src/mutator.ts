let globalBaseURL = "";

export const setBaseURL = (url: string) => {
  globalBaseURL = url;
};

export const getBaseURL = () => globalBaseURL;

export const customFetch = async <T>(
  url: string,
  options?: RequestInit
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

  return {
    data: body,
    status: response.status,
    headers: response.headers,
  } as T;
};
