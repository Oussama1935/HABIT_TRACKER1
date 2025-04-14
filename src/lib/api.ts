//project\src\lib\api.ts
const API_URL = 'http://localhost:5000/api';

let token = localStorage.getItem('token');

export const setToken = (newToken: string) => {
  token = newToken;
  localStorage.setItem('token', newToken);
};

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const auth = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    setToken(data.token);
    return data;
  },

  async register(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    setToken(data.token);
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    token = null;
  },
};

export const projects = {
  async getAll() {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await response.json();
    return data;
  },

  async create(project: { name: string; description: string }) {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(project),
    });
    const data = await response.json();
    return data;
  },
};

export const habits = {
  async getAll(projectId: string) {
    const response = await fetch(`${API_URL}/projects/${projectId}/habits`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await response.json();
    return data;
  },

  async create(habit: {
    name: string;
    description: string;
    project_id: string;
    streak: number;
    completed_today: boolean;
  }) {
    const response = await fetch(`${API_URL}/projects/${habit.project_id}/habits`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(habit),
    });
    const data = await response.json();
    return data;
  },

  async toggle(id: string) {
    const response = await fetch(`${API_URL}/habits/${id}/toggle`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    const data = await response.json();
    return data;
  },

  async delete(id: string) {
    await fetch(`${API_URL}/habits/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  async getStats(projectId: string) {
    const response = await fetch(`${API_URL}/projects/${projectId}/stats`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await response.json();
    return data;
  },
};

export default {
  auth,
  projects,
  habits,
};
