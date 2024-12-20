import { Router } from "express";

const router = Router();

router.get("/default", (_, res) => {
  res.send("connected");
});

export default router;

