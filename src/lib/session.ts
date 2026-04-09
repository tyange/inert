import { useSession } from "@tanstack/react-start/server";

type SessionData = {
  token?: string;
};

export function useAppSession() {
  return useSession<SessionData>({
    name: "inert-session",
    password: process.env.SESSION_SECRET!,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      httpOnly: true,
    },
  });
}
