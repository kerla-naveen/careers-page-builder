import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { UilLockAlt, UilExclamationTriangle } from '@iconscout/react-unicons';

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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 font-sans p-4 sm:p-8">
      <Head>
        <title>Recruiter Sign In | Careers Page Builder</title>
      </Head>

      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-4">
            <UilLockAlt size={14} /> Recruiter Portal
          </span>
          <h1 className="font-outfit text-2xl sm:text-3xl font-bold m-0 mb-2 text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-400 m-0 leading-relaxed">
            Sign in to access your company's careers page editor.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3.5 rounded-xl text-xs mb-6 flex items-center gap-2">
            <UilExclamationTriangle size={16} /> {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Work Email Address
            </label>
            <input
              type="email"
              placeholder="sarah@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-950 border border-white/15 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="mb-7">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-950 border border-white/15 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg border-none bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-500/30 hover:from-indigo-600 hover:to-indigo-700 transition-all"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Editor →'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-7 text-xs text-slate-500">
          Don't have a recruiter account yet?{' '}
          <Link href="/register" className="text-indigo-400 font-medium no-underline hover:underline">
            Register your company
          </Link>
        </div>
      </div>
    </div>
  );
}
