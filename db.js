const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./tournament.db");

db.serialize(() => {
  // Table des joueurs
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      department INTEGER,
      category TEXT
    )
  `);

  // Table des catégories
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // Table des matchs
  db.run(`
    CREATE TABLE IF NOT EXISTS matchs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player1_id INTEGER NOT NULL,
      player2_id INTEGER NOT NULL,
      date TEXT,
      heure TEXT,
      FOREIGN KEY (player1_id) REFERENCES players(id),
      FOREIGN KEY (player2_id) REFERENCES players(id)
    )
  `);

  // Données initiales pour les catégories (optionnel)
  const categories = [
    "Simple Hommes",
    "Simple Dames",
    "Double Hommes",
    "Double Dames",
    "Double Mixte",
  ];
  categories.forEach((name) => {
    db.run(`INSERT OR IGNORE INTO categories (name) VALUES (?)`, [name]);
  });
});

module.exports = db;
