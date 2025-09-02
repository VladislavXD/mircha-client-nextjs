import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      provider?: string
      googleId?: string
    } & DefaultSession["user"]
    accessToken?: string
  }

  interface User extends DefaultUser {
    provider?: string
    googleId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    provider?: string
    googleId?: string
    accessToken?: string
  }
}
