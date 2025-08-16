const api_url = "http://localhost:3001";

const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  

  const response = await fetch(`${api_url}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ops, algo de errado não está certo.");
  }

  return response.json();

  export const api = {
    get: (endpoint) =>fetchApi(endpoint),
    post: (endpoint, body) => fetchApi(endpoint, {method: 'POST', body: JSON.stringify(body)}),
    put: (endpoint, body) => fetchApi(endpoint, {method: 'PUT', body: JSON.stringify(body)}),
    delete: (endpoint) => fetchApi(endpoint, {method: 'DELETE'})
  }
};
