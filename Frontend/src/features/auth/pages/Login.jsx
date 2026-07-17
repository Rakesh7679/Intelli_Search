import React, { useState } from 'react'
import {useNavigate} from 'react-router';
import { useAuth } from '../hook/useAuth';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router';

const Login = () => {

  const navigate = useNavigate();
  const {handaleLogin} = useAuth();

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      email: formData.email,
      password: formData.password
    }
    console.log('Form submitted:', payload)
    // Call the login function from the auth hook
    await handaleLogin(payload);
    // Navigate to the dashboard or home page after successful login
    navigate('/');
  }

  if(!loading && user){
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-cyan-950/30 backdrop-blur xl:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.24),_transparent_36%),linear-gradient(135deg,_rgba(15,23,42,0.92),_rgba(2,6,23,0.96))] p-8 sm:p-12">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
              IntelliSearch
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Sign in and pick up where your search left off.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
              Access your saved conversations, search history, and intelligent
              suggestions from one focused dashboard.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {['Fast access', 'Secure session', 'Smart search'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-medium text-slate-200">{item}</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">
                  Clean workflow, clear focus, no clutter.
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-950/70 p-6 sm:p-10">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-xl shadow-black/20 sm:p-8"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-white">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Sign in with your email and password.
              </p>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Email address
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </label>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-400">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/10 text-cyan-400 focus:ring-cyan-400"
                />
                Remember me
              </label>
              <button type="button" className="font-medium text-cyan-300 hover:text-cyan-200">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Sign In
            </button>

            <p className="mt-6 text-center text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <a href="/register" className="font-medium text-cyan-300 hover:text-cyan-200">
                Create one
              </a>
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Login
