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
  const { name, department, category, genre } = req.body;

  const categoryString = JSON.stringify(category); // 👈 conversion ici

  db.run(
    "INSERT INTO players (name, department, category, genre) VALUES (?, ?, ?, ?)",
    [name, department, categoryString, genre],
    // 👈 on insère la version texte
    function (err) {
      if (err) return res.status(500).send(err);
      res.status(201).json({
        id: this.lastID,
        name,
        department,
        category, // on renvoie l'original (tableau) au front
        genre,
      });
    }
  );
});

// route pour récupérer seulementles joueurs disponibles après leur attribution à une paire
router.get("/disponibles", (req, res) => {
  const category = req.query.categorie;

  if (!category) {
    return res
      .status(400)
      .json({ error: "Catégorie manquante dans la requête" });
  }

  // Étape 1 : Récupère tous les IDs déjà assignés dans une paire mixte
  const assignedIdsQuery = `
    SELECT woman_id as id FROM paires_mixtes
    UNION
    SELECT man_id as id FROM paires_mixtes
  `;

  db.all(assignedIdsQuery, [], (err, rows) => {
    if (err) {
      console.error("Erreur SQL (assignedIdsQuery) :", err);
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération des paires" });
    }

    const assignedIds = rows.map((r) => r.id);

    // Étape 2 : Récupère tous les joueurs
    let query = `SELECT * FROM players`;
    let values = [];

    if (assignedIds.length > 0) {
      const placeholders = assignedIds.map(() => "?").join(",");
      query += ` WHERE id NOT IN (${placeholders})`;
      values = [...assignedIds];
    }

    db.all(query, values, (err2, rows2) => {
      if (err2) {
        console.error("Erreur SQL (joueurs disponibles) :", err2);
        return res
          .status(500)
          .json({ error: "Erreur lors de la récupération des joueurs" });
      }

      // Étape 3 : Filtre en JS sur la catégorie (plus fiable que SQL LIKE sur JSON)
      const players = rows2
        .map((row) => ({
          ...row,
          category: JSON.parse(row.category || "[]"),
        }))
        .filter((player) => player.category.includes(category));

      res.json(players);
    });
  });
});

module.exports = router;
