"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const noteController_js_1 = require("../controllers/noteController.js");
const router = express_1.default.Router();
// Labels
router.get("/label", noteController_js_1.getLabels);
router.post("/label", noteController_js_1.postLabel);
router.patch("/label/:id", noteController_js_1.patchLabel);
router.delete("/label/:id", noteController_js_1.deleteLabel);
// Getting notes
router.get("/:labelId", noteController_js_1.getQuery);
// Mutating the notes
router.post("/newnote", noteController_js_1.postNote);
router.patch("/:id", noteController_js_1.patchNote);
router.delete("/:id", noteController_js_1.deleteNote);
exports.default = router;
