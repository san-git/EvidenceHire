"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CreateProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to create project.");
      }

      setName("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>New project name</span>
        <input
          className="input"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. 2026 Growth Hiring"
          required
        />
      </label>
      <button className="button primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create project"}
      </button>
      {error ? <p className="error">{error}</p> : null}
    </form>
  );
}
