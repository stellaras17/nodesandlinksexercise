import { Router } from "express";
import { loadCSV } from "./utils/Generic";

const router = Router();

router.get("/activities", async (_req, res) => {
    try {
        const activities = await loadCSV("activity-properties.csv");
        return res.json(activities);
    } catch (err) {
        console.error("Error loading activities:", err);
        return res.status(500).json({ error: "Failed to load activities" });
    }
});

router.get("/adjacency", async (_req, res) => {
    try {
        const adjacency = await loadCSV("adjacency-matrix.csv", false);
        return res.json(adjacency);
    } catch (err) {
        console.error("Error loading adjacency matrix:", err);
        return res.status(500).json({ error: "Failed to load adjacency matrix" });
    }
});


export default router;
