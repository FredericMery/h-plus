import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";

export const metadata = {
  title: "H+ – Mémorises ce qui compte",
  description: "H+ est votre espace personnel intelligent pour mémoriser, organiser et agir sur ce qui compte.",
  applicationName: "H+",
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};

export const viewport = {
  themeColor: "#4f46e5"
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
