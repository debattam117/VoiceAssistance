import express from "express";
import { search } from "../Controller/searchController.js";

const router=express.Router();

router.post("/QueryAnything",search);

export default router;