const express = require("express");
const router = express.Router();
const { createLobby, joinLobby } = require("../controllers/lobbyControllers");

router.route("/create").post(createLobby);
router.route("/join/:lobbyId").post(joinLobby);

module.exports = router;
