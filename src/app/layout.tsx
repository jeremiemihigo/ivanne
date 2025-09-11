// import { AppSidebar } from "@/components/app-sidebar";
// import { ThemeProvider } from "@/components/theme-provider";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { Toaster } from "@/components/ui/sonner";
// import type { Metadata } from "next";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "IVANNE PHARMACIE",
//   description:
//     "Notre pharmacie vous accompagne chaque jour avec des médicaments, des conseils et des produits pour votre santé et votre bien-être.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <SidebarProvider>
//             <AppSidebar />
//             <main className="w-full ">
//               {children}
//               <Toaster position="top-center" />
//             </main>
//           </SidebarProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alerte utilisateur",
  description: "Page d'alerte pour délai dépassé",
};

export default function RootLayout() {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          margin: 0,
          backgroundColor: "#fff2f2", // fond léger rouge
          fontFamily: "var(--font-geist-sans), sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: "#ff4d4f", // rouge vif
            color: "#ffffff",
            padding: "2rem 3rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            textAlign: "center",
            maxWidth: "500px",
          }}
        >
          <h1 style={{ marginBottom: "1rem" }}>⚠️ Alerte</h1>
          <p style={{ fontSize: "1.2rem", lineHeight: "1.5" }}>
            Vous avez dépassé votre délai de test.
          </p>
        </div>
      </body>
    </html>
  );
}
