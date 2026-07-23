import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function LoginView({ onLogin }: { onLogin: (role: "admin" | "rd" | "prod" | "exec") => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    setLoading(true);
    setTimeout(() => {
      if (username === "system_admin" && password === "system_admin") {
        onLogin("admin");
      } else if (username === "research_dev" && password === "research_dev") {
        onLogin("rd");
      } else if (username === "prod_head" && password === "prod_head") {
        onLogin("prod");
      } else if (username === "executive" && password === "executive") {
        onLogin("exec");
      } else {
        setError(true);
        setLoading(false);
      }
    }, 800);
  }

  const inputBase = "w-full bg-muted border rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors";
  const inputClass = error ? `${inputBase} border-red-500/60 focus:border-red-500/80` : `${inputBase} border-border focus:border-foreground/30`;

  return (
    <div className="min-h-screen w-screen bg-background flex flex-col items-center justify-center px-4" style={{ fontFamily: "var(--font-display)" }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center mb-4">
            <span className="text-sm font-bold text-background font-mono tracking-wider">TC</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground tracking-widest uppercase">TILAO CORP</h1>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Username</label>
            <input
              type="text"
              autoComplete="username"
              placeholder="system_admin"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(false); }}
              className={inputClass}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false); }}
                className={`${inputClass} pr-10`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1.5">
              <AlertCircle size={12} /> Invalid username or password.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 py-2.5 rounded text-sm font-medium transition-opacity mt-2"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> Signing in…</> : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center space-y-1">
          <p className="text-[11px] text-muted-foreground font-mono">v2.4.1 · Build 20260722</p>
          <p className="text-[11px] text-muted-foreground">© 2026 TILAO CORP. All rights reserved.</p>
        </div>
      </div>

      {/* Prototype credentials hint */}
      <div className="fixed bottom-5 right-5 bg-card border border-border rounded-lg p-3 shadow-lg">
        <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">Prototype Accounts</div>
        <div className="space-y-1.5 font-mono text-[10px]">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground w-24">system_admin</span>
            <span className="text-foreground">system_admin</span>
            <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-sans">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground w-24">research_dev</span>
            <span className="text-foreground">research_dev</span>
            <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-sans">R&D</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground w-24">prod_head</span>
            <span className="text-foreground">prod_head</span>
            <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-sans">Production</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground w-24">executive</span>
            <span className="text-foreground">executive</span>
            <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-sans">EA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
