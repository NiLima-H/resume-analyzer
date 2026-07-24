import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";


import analysisRoutes from "./routes/analysisRoutes.mjs";
import healthRoutes from "./routes/healthroutes.mjs";
import supabaseRoutes from "./routes/supabaseRoutes.mjs";

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/health", healthRoutes);
app.use("/api/supabase", supabaseRoutes);
app.use("/api", analysisRoutes);

app.use((error, _request, response, _next) => {
  console.error(error);

  response.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
  });
}

export default app;