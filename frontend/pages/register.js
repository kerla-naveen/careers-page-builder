import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { UilRocket, UilExclamationTriangle } from '@iconscout/react-unicons';

export default function RegisterPage() {
  const router = useRouter();
  const { user, register, isLoading: isAuthLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');

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

    if (!name || !email || !password || !companyName) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({ name, email, password, companyName });
    setIsSubmitting(false);

    if (result.success) {
      router.push(`/editor/${result.user.company.slug}`);
    } else {
      setErrorMessage(result.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 font-sans p-4 sm:p-8">
      <Head>
        <title>Recruiter Registration | Careers Page Builder</title>
      </Head>

      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-4">
            <UilRocket size={14} /> Recruiter Onboarding
          </span>
          <h1 className="font-outfit text-2xl sm:text-3xl font-bold m-0 mb-2 text-white">
            Create Your Account
          </h1>
          <p className="text-sm text-slate-400 m-0 leading-relaxed">
            Start building your company's high-converting careers page in seconds.
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
              Your Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-950 border border-white/15 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Technologies"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="w-full bg-slate-950 border border-white/15 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

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
              placeholder="At least 6 characters"
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
            {isSubmitting ? 'Creating Account & Careers Page...' : 'Create Account & Open Editor →'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-7 text-xs text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="text-indigo-400 font-medium no-underline hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
