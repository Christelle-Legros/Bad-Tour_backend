const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.all("SELECT * FROM players", [], (err, rows) => {
    if (err) return res.status(500).send(err);

    const players = rows.map((row) => ({
      ...row,
      category: JSON.parse(row.category || "[]"), // 👈 conversion ici
    }));

    res.json(players);
  });
});

router.post("/", (req, res) => {
  const { name, department, category } = req.body;

  const categoryString = JSON.stringify(category); // 👈 conversion ici

  db.run(
    "INSERT INTO players (name, department, category) VALUES (?, ?, ?)",
    [name, department, categoryString], // 👈 on insère la version texte
    function (err) {
      if (err) return res.status(500).send(err);
      res.status(201).json({
        id: this.lastID,
        name,
        department,
        category, // on renvoie l'original (tableau) au front
      });
    }
  );
});

module.exports = router;
