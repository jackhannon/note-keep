import express, { IRouter } from "express";
import { getNotes, getNote, getQuery, postNote, patchNote, deleteNote, getLabels, postLabel, patchLabel, deleteLabel} from "../controllers/noteController.js";
const router: IRouter = express.Router()


// Labels
router.get("/label", getLabels);
router.post("/label", postLabel);
router.patch("/label/:id", patchLabel);
router.delete("/label/:id", deleteLabel);

// Getting notes
router.get("/:labelId", getNotes);
router.get("/note/:labelId/:id", getNote);
router.get("/search/query", getQuery);

// Mutating the notes
router.post("/newnote", postNote);
router.patch("/:id", patchNote);
router.delete("/:id", deleteNote);

export default router