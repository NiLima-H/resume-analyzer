import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkTo,
  children,
}: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <section className="auth-brand">
        <Link to="/" className="auth-logo">
          Resume Analyzer
        </Link>

        <div className="auth-brand-content">
          <p className="auth-eyebrow">
            AI-powered career assistant
          </p>

          <h1>
            Build a stronger resume for every application.
          </h1>

          <p>
            Compare your resume with a job description,
            discover missing skills and receive practical
            improvements.
          </p>
        </div>
      </section>

      <section className="auth-form-section">
        <div className="auth-card">
          <header className="auth-header">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </header>

          {children}

          <p className="auth-footer">
            {footerText}{" "}
            <Link to={footerLinkTo}>
              {footerLinkText}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}