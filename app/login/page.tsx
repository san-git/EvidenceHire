"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (signInError) {
        throw signInError;
      }

      setStatus("Check your email for a magic link to continue.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page auth-page">
      <nav className="nav">
        <a className="logo" href="/">
          EvidenceHire
        </a>
        <div className="nav-actions">
          <a className="button ghost" href="/">
            Back to home
          </a>
        </div>
      </nav>

      <section className="section auth-panel">
        <div className="section-title">
          <h1>Sign in to EvidenceHire</h1>
          <p>Access your workspace and collaborate on evidence-first sourcing.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <label className="field">
            <span>Work email</span>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              required
            />
          </label>
          <button className="button primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send magic link"}
          </button>
        </form>

        {status ? <p className="status">{status}</p> : null}
        {error ? <p className="error">{error}</p> : null}
      </section>
    </main>
  );
}
