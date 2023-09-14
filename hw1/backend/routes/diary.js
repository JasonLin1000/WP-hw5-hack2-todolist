import { createDiary, getDiaries, updateDiary, deleteDiary} from "../controllers/diary.js";
import express from "express";

// Create an express router
const router = express.Router();

// Functions were wrapped in '../controllers' folder

// GET /api/diaries
router.get("/", getDiaries);
// POST /api/diaries
router.post("/", createDiary);
// PUT /api/diaries/:id
router.put("/:id", updateDiary);
// DELETE /api/diaries/:id
// Although this may not be used
router.delete("/:id", deleteDiary);

export default router;