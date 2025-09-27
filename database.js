const sqlite3 = require('sqlite3').verbose();

// Connect to a persistent database file
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Enable foreign key support
    db.run('PRAGMA foreign_keys = ON;', (err) => {
      if (err) {
        console.error("Could not enable foreign keys:", err);
      }
    });
    createTables();
  }
});

const createTables = () => {
  const tables = `
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      fullName TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('citizen', 'official', 'analyst', 'admin')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS HazardReports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reporterId INTEGER,
        hazardType TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'verified', 'resolved')),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (reporterId) REFERENCES Users(id)
    );

    CREATE TABLE IF NOT EXISTS Donations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'USD',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES Users(id)
    );

    CREATE TABLE IF NOT EXISTS Volunteers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER UNIQUE,
        skills TEXT,
        availability TEXT,
        FOREIGN KEY (userId) REFERENCES Users(id)
    );
  `;

  db.exec(tables, (err) => {
    if (err) {
      console.error('Error creating tables', err.message);
    } else {
      console.log('Tables created or already exist.');
      // Seed the database with initial demo users if they don't exist
      seedDatabase(); 
    }
  });
};

const seedDatabase = () => {
  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  const demoPassword = 'demo123';

  const demoUsers = [
      { email: 'admin@oceanhazard.com', fullName: 'Admin User', role: 'admin' },
      { email: 'analyst@oceanhazard.com', fullName: 'Analyst User', role: 'analyst' },
      { email: 'official@oceanhazard.com', fullName: 'Official User', role: 'official' },
      { email: 'citizen@oceanhazard.com', fullName: 'Citizen User', role: 'citizen' },
  ];

  bcrypt.hash(demoPassword, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password', err);
      return;
    }

    const insert = db.prepare("INSERT OR IGNORE INTO Users (email, fullName, password, role) VALUES (?, ?, ?, ?)");
    demoUsers.forEach(user => {
        insert.run(user.email, user.fullName, hashedPassword, user.role);
    });
    insert.finalize(err => {
        if (!err) console.log("Demo users have been seeded successfully.");
    });
  });
};

module.exports = db;
