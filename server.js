const express = require("express");
const cors = require("cors");
const db = require("./db");
const playerRoutes = require("./routes/players");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/players", playerRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
