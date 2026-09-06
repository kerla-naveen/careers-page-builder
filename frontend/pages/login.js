import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, isLoading: isAuthLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!isAuthLoading && user && user.company) {
      router.replace(`/editor/${user.company.slug}`);
    }
  }, [user, isAuthLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both Email and Password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login({ email, password });
    setIsSubmitting(false);

    if (result.success && result.user?.company) {
      router.push(`/editor/${result.user.company.slug}`);
    } else if (result.success && !result.user?.company) {
      setErrorMessage('Your recruiter account is not associated with a company page.');
    } else {
      setErrorMessage(result.error || 'Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#18181B] flex flex-col justify-between items-center font-sans p-4 sm:p-6 antialiased selection:bg-blue-100 selection:text-blue-900">
      <Head>
        <title>Sign In | Career Page Builder</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Top Branding Bar */}
      <header className="w-full max-w-5xl py-6 flex justify-center">
        <Link href="/" className="inline-flex items-center gap-2.5 no-underline hover:opacity-90 transition-opacity">
          <div className="w-7 h-7 rounded-md bg-[#18181B] text-white flex items-center justify-center font-bold text-xs">
            ✦
          </div>
          <span className="font-outfit font-bold text-base tracking-tight text-[#18181B]">
            Career Page Builder
          </span>
        </Link>
      </header>

      {/* Centered Auth Card */}
      <main className="w-full max-w-[400px] my-auto">
        <div className="bg-white border border-[#E4E4E7] rounded-xl p-6 sm:p-8 shadow-xs">
          {/* Title & Subtitle */}
          <div className="text-center mb-6">
            <h1 className="font-outfit text-2xl font-bold text-[#18181B] tracking-tight mb-1.5">
              Welcome back
            </h1>
            <p className="font-inter text-xs text-[#71717A] leading-relaxed">
              Sign in to manage your careers page
            </p>
          </div>

          {/* Inline Error Alert */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-lg text-xs mb-5 flex items-start gap-2 font-medium">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#18181B] mb-1.5">
                Work Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white border border-[#E4E4E7] rounded-lg px-3.5 py-2.5 text-[#18181B] text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-[#A1A1AA]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-[#18181B]">
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white border border-[#E4E4E7] rounded-lg px-3.5 py-2.5 text-[#18181B] text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-[#A1A1AA]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm mt-2"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Toggle Link */}
          <div className="text-center mt-6 pt-5 border-t border-[#E4E4E7] text-xs text-[#71717A]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 font-semibold no-underline hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 text-center text-xs text-[#71717A]">
        © {new Date().getFullYear()} Career Page Builder. All rights reserved.
      </footer>
    </div>
  );
}
