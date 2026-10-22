import { Router } from "express";
import type { NetworkService } from "./network.service.js";

export function networkRoutes(network: NetworkService) {
  const router = Router();

  router.get("/kpis", async (_req, res) => {
    res.json(await network.getKpis());
  });

  router.get("/dealers", async (_req, res) => {
    res.json(await network.getDealers());
  });

  return router;
}
