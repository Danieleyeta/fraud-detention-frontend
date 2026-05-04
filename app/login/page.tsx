"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  IconShieldCheck,
  IconAlertTriangle,
  IconEye,
  IconEyeOff,
  IconLock,
  IconUser,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your credentials.");
      return;
    }
    setLoading(true);
    // Simulate auth — replace with real auth later
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 900);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Glow accent */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo / Branding */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <IconShieldCheck className="size-7" stroke={1.75} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              FraudShield Pro
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Fraud Detection &amp; Investigation Platform
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border bg-card shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Sign in to your account</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Authorised personnel only. All access is logged.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-email">Email address</Label>
              <div className="relative">
                <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="analyst@fraudshield.io"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <IconEyeOff className="size-4" />
                  ) : (
                    <IconEye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <IconAlertTriangle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              id="login-submit"
              type="submit"
              className="w-full mt-1"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  Authenticating…
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          This system is restricted to authorised users only. Unauthorised
          access is a criminal offence.
        </p>
      </div>
    </div>
  );
}
