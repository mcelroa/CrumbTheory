import axios from "axios";
import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/auth";

export default function LoginPage() {
   const { isLoggedIn, login } = useAuth();
   const from = (useLocation().state as { from?: string } | null)?.from ?? "/admin/orders";
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState<string | null>(null);
   const [submitting, setSubmitting] = useState(false);

   if (isLoggedIn) {
      return <Navigate to={from} replace />;
   }

   async function submit(e: FormEvent) {
      e.preventDefault();
      setSubmitting(true);
      setError(null);
      try {
         await login(username, password);
      } catch (err) {
         setError(
            axios.isAxiosError(err) && err.response?.status === 401
               ? "That username and password don't match."
               : "Couldn't log in right now. Please try again.",
         );
         setSubmitting(false);
      }
   }

   const inputClass =
      "w-full rounded-xl border border-line bg-paper px-4 py-2.5 outline-none transition focus:border-crust focus:ring-2 focus:ring-crust/20";

   return (
      <div className="flex min-h-screen items-center justify-center px-4">
         <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-line bg-paper p-8">
            <p className="font-display text-2xl font-semibold">
               Crumb<span className="text-crust">Theory</span>
            </p>
            <h1 className="mt-1 font-sans text-sm font-medium text-muted">Admin login</h1>

            {error && (
               <p role="alert" className="mt-6 rounded-xl bg-crust/10 p-3 text-sm text-crust-dark">
                  {error}
               </p>
            )}

            <label className="mt-6 block">
               <span className="mb-1.5 block text-sm font-medium">Username</span>
               <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  className={inputClass}
               />
            </label>
            <label className="mt-4 block">
               <span className="mb-1.5 block text-sm font-medium">Password</span>
               <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className={inputClass}
               />
            </label>

            <button
               type="submit"
               disabled={submitting}
               className="mt-6 w-full rounded-full bg-crust py-3 font-semibold text-white transition hover:bg-crust-dark disabled:opacity-60"
            >
               {submitting ? "Logging in…" : "Log in"}
            </button>
            <Link to="/" className="mt-4 block text-center text-sm text-muted hover:text-ink">
               ← Back to the shop
            </Link>
         </form>
      </div>
   );
}
