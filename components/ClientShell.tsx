"use client";
import React, { ReactNode } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ErrorBoundary from "@/components/ErrorBoundary";

interface ClientShellProps {
  children: ReactNode;
}

const ClientShell: React.FC<ClientShellProps> = ({ children }) => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8" tabIndex={-1} id="main-content">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  </div>
);

export default ClientShell;
