const express = require("express");
const router = express.Router();
const { createBoard, updateBoard } = require("../controllers/boardControllers");

router.route("/create").post(createBoard);
router.route("/update/:lobbyId").post(updateBoard);
router.route("/:lobbyId").get(getBoard);

module.exports = router;
