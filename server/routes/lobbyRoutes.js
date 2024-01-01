const express = require("express");
const router = express.Router();
const { createLobby } = require("../controllers/lobbyControllers");

router.route("/create").post(createLobby);

module.exports = router;
