import { createTRPCRouter } from "./trpc";
import { messagingRouter } from "./routers/messaging";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  messaging: messagingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
