import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const register = async (email, fullName, password, role) => {
  return axios.post(`${API_URL}/auth/register`, {
    email,
    fullName,
    password,
    role,
  });
};

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  return axios.get(`${API_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const authService = {
  register,
  login,
  logout,
  getProfile,
};

export default authService;
