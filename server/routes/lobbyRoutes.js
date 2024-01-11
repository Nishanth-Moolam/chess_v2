const express = require("express");
const router = express.Router();
const {
  createLobby,
  joinLobby,
  leaveLobby,
} = require("../controllers/lobbyControllers");

router.route("/create").post(createLobby);
router.route("/join/:lobbyId").post(joinLobby);
router.route("/leave/:lobbyId").post(leaveLobby);

module.exports = router;
