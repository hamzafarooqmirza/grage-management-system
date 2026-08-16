"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Car, Lock, Mail } from "lucide-react";
import { signIn, type AuthActionState } from "@/lib/supabase/actions";
import { FieldGroup, TextInput } from "@/components/ui/Field";

const initialState: AuthActionState = {};

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form className="space-y-5" action={formAction}>
      <input type="hidden" name="next" value={next} />

      <FieldGroup label="Email" htmlFor="email" required>
        <TextInput
          id="email"
          name="email"
          type="email"
          icon={Mail}
          required
          autoComplete="email"
          placeholder="you@garage.com"
        />
      </FieldGroup>

      <FieldGroup label="Password" htmlFor="password" required>
        <TextInput
          id="password"
          name="password"
          type="password"
          icon={Lock}
          required
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </FieldGroup>

      {state.error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-accent-600/30 transition-colors hover:bg-accent-700 disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-600 text-white shadow-sm shadow-accent-600/40">
            <Car size={22} />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white">My Garage CRM</p>
            <p className="text-sm text-slate-400">Sign in to your workshop console</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-2xl shadow-slate-950/25">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-5 text-center text-sm text-slate-400">
          No account yet?{" "}
          <Link href="/signup" className="font-medium text-white hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
