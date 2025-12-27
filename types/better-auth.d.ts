import "better-auth";

declare module "better-auth" {
  interface User {
    role: "user" | "moderator" | "admin";
    skills: string[];
  }
}
