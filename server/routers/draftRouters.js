import express from "express";
import {
  createDraft,
  getDraft,
  getDrafts,
  updateDraft,
  deleteDraft,
} from "../controllers/draftControllers.js";
const draftRouter = express.Router();

draftRouter.post("/", createDraft);

draftRouter.get("/", getDrafts);

draftRouter.get("/:id", getDraft);

draftRouter.put("/:id", updateDraft);

draftRouter.delete("/:id", deleteDraft);

export default draftRouter;
