import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
//import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import { Providers } from "@/redux/provider";
import AuthProvider from "./context/Authprovider";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DataBook.ai",
  description: "DataBook.ai AI + SQL in your browser",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>

        <Providers>

          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider><UserProvider>{children}</UserProvider></AuthProvider>
          </ThemeProvider>
        </Providers>

      </body>
    </html>
  );
}
