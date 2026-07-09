import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/((?!register|api/auth|login|_next/static|_next/image|favicon.ico).*)"],
};
