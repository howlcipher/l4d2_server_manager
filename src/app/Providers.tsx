"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" themes={['light', 'dark']} enableSystem={true}>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
