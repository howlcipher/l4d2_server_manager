"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" themes={['light', 'dark']} enableSystem={true}>
        {mounted ? children : <div className="invisible">{children}</div>}
      </ThemeProvider>
    </SessionProvider>
  );
}
