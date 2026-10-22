// Local entry point: Vercel uses src/index.ts instead.
import app from "./index.js";

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`red-pulse-api listening on http://localhost:${port}`);
});
