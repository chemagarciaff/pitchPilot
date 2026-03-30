const API_URL = "http://localhost:4000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Ha ocurrido un error");
  }

  return data;
}

export const api = {
  login: (email, password) =>
    request("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request("/api/me"),

  getScenarios: () => request("/api/scenarios"),

  createSimulation: (scenarioId) =>
    request("/api/simulations", {
      method: "POST",
      body: JSON.stringify({ scenarioId }),
    }),

  getSimulation: (id) => request(`/api/simulations/${id}`),

  sendMessage: (id, content) =>
    request(`/api/simulations/${id}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  endSimulation: (id) =>
    request(`/api/simulations/${id}/end`, {
      method: "POST",
    }),

  getFeedback: (id) => request(`/api/simulations/${id}/feedback`),

  getUserHistory: (userId) =>
    request(`/api/simulations/user/${userId}/history`),
};