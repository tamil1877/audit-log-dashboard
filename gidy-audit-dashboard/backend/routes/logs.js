import express from "express";
import { bulkUpload, getLogs, getFacets } from "../controllers/logsController.js";

const router = express.Router();

router.post("/bulk", bulkUpload);
router.get("/facets", getFacets);
router.get("/", getLogs);

export default router;
