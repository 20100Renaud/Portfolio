const API = "http://localhost:5000/api";

export const apiFetch = (url, options = {}) => {
  const isFormData = options.body instanceof FormData;

  return fetch(`http://localhost:5000/api${url}`, {
    credentials: "include",
    ...options,
    headers: isFormData
      ? options.headers
      : {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
  });
};
