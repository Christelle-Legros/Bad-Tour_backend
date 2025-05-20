const express = require("express");
const cors = require("cors");
const db = require("./db");
const playerRoutes = require("./routes/players");
const pairesMixtesRoutes = require("./routes/pairesmixtes");

const app = express();
app.use(cors());
app.use(express.json());

// connecte chaque route front/back
app.use("/api/players", playerRoutes);
app.use("/api/paires-mixtes", pairesMixtesRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
