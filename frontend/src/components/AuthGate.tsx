"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [checked, setChecked] = useState(false);

  // Check session on mount
  if (!checked && supabase) {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setChecked(true);
    });
  } else if (!supabase && !checked) {
    setChecked(true);
  }

  if (!checked) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !email) return;
    setLoading(true);
    await supabase.auth.signInWithOtp({ email });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Sign in to Contribute
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        We use passwordless login. Enter your email to receive a magic link.
      </p>

      {sent ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
          ✓ Check your inbox! Click the link in your email to sign in.
        </div>
      ) : (
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-700 disabled:opacity-50 transition text-sm"
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
        </form>
      )}
    </div>
  );
}
