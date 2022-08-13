// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { bookRouter } from "./bookinfo";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("book.", bookRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
