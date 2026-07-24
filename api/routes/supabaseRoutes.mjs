import { Router } from "express";
import { supabaseAdmin } from "../database/supabaseAdmin.mjs";

const router = Router();

router.get("/connection", async (_req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from("pg_tables")
      .select("*")
      .limit(1);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      status: "connected",
      database: "Supabase PostgreSQL",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;