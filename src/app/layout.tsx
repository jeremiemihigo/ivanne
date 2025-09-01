import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAFI PHARMA PHARMACY",
  description:
    "Notre pharmacie vous accompagne chaque jour avec des médicaments, des conseils et des produits pour votre santé et votre bien-être.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full ">
              {children}
              <Toaster position="top-center" />
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
