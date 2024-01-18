import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
//import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import { Providers } from "@/redux/provider";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Duckbook.ai",
  description: "Duckbook.ai AI + SQL in your browser",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <body className={font.className}>
        <Providers><ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>{children}</UserProvider>
          {/* <SupabaseProvider>
            <UserProvider>{children}</UserProvider>
          </SupabaseProvider> */}
        </ThemeProvider></Providers>
        
      </body>
    </html>
    
  );
}
