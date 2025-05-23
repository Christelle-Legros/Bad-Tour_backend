const express = require("express");
const router = express.Router();
const db = require("../db");

// Enregistrer une paire
router.post("/", (req, res) => {
  const { woman_id, man_id } = req.body;

  if (!woman_id || !man_id) {
    return res.status(400).send("woman_id et man_id sont requis.");
  }

  const query = `INSERT INTO paires_mixtes (woman_id, man_id) VALUES (?, ?)`;

  db.run(query, [woman_id, man_id], function (err) {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .send("Erreur lors de l'enregistrement de la paire.");
    }
    res.status(201).json({ id: this.lastID });
  });
});

// 📥 Récupérer toutes les paires enregistrées = api/paires-mixtes
router.get("/", (req, res) => {
  const query = `
    SELECT
  pm.id,
  pm.woman_id,
  pm.man_id,
  f.name AS woman_name,
  f.department AS woman_department,
  m.name AS man_name,
  m.department AS man_department
FROM paires_mixtes pm
JOIN players f ON pm.woman_id = f.id
JOIN players m ON pm.man_id = m.id
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Erreur lors de la récupération des paires.");
    }
    res.json(rows);
  });
});

module.exports = router;
