
// --- Mock User Database ---
// In a real app, this would be a database.
const DEMO_USERS = {
  'admin@oceanhazard.com': {
    id: 'demo_admin',
    email: 'admin@oceanhazard.com',
    fullName: 'Admin User',
    role: 'admin',
  },
  'analyst@oceanhazard.com': {
    id: 'demo_analyst',
    email: 'analyst@oceanhazard.com',
    fullName: 'Analyst User',
    role: 'analyst',
  },
  'official@oceanhazard.com': {
    id: 'demo_official',
    email: 'official@oceanhazard.com',
    fullName: 'Official User',
    role: 'official',
  },
  'citizen@oceanhazard.com': {
    id: 'demo_citizen',
    email: 'citizen@oceanhazard.com',
    fullName: 'Citizen User',
    role: 'citizen',
  }
};

const DEMO_PASSWORD = 'demo123';

console.log("APP RUNNING IN MOCK AUTHENTICATION MODE.");
console.log("All users share the same password: 'demo123'");

// --- Mock Authentication Functions ---

export const register = async (email, fullName, role) => {
  if (!email || !fullName || !role) {
    throw new Error('Email, full name, and role are required.');
  }

  if (DEMO_USERS[email]) {
    throw new Error('User with this email already exists.');
  }

  const newUser = {
    id: `user_${Date.now()}`,
    email,
    fullName,
    role,
  };

  DEMO_USERS[email] = newUser;

  console.log("New user registered (mock):", newUser);
  return { message: 'User created successfully', user: newUser };
};

export const login = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = DEMO_USERS[email];

  if (!user || password !== DEMO_PASSWORD) {
    throw new Error('Invalid credentials');
  }

  const token = `mock_token_for_${user.id}`;

  console.log(`Successful mock login for: ${email}`);
  return { token, user };
};

export const getProfile = async () => {
  const user = DEMO_USERS['citizen@oceanhazard.com']; // default to citizen
  return { user };
};

export const updateProfile = async (fullName) => {
    const userToUpdate = DEMO_USERS['citizen@oceanhazard.com'];
    userToUpdate.fullName = fullName;
    console.log("Updated mock user profile:", userToUpdate);
    return { user: userToUpdate };
};
