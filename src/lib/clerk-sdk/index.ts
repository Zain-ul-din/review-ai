import { createClerkClient } from "@clerk/backend";
export const clerkBackendClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});
