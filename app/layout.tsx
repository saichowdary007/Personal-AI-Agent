import '@/styles/globals.css';
import '@/styles/themes.css';
import { ReactNode } from 'react';
import ClientShell from '@/components/ClientShell';
// import { useI18n } from '@/hooks/useI18n'; // To be implemented

export const metadata = {
  title: 'Personal AI Assistant',
  description: 'Modern AI assistant UI built with Next.js, TypeScript, and Tailwind CSS',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
