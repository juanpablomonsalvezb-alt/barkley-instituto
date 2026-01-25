// Use Google Auth by default, fallback to Replit Auth if Google is not configured
export { setupAuth, isAuthenticated, getSession } from "./googleAuth";
export { authStorage, type IAuthStorage } from "./storage";
export { registerAuthRoutes } from "./routes";
