import React, { useState } from 'react'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Register form submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-cyan-950/30 backdrop-blur xl:grid-cols-[0.95fr_1.05fr]">
        <section className="order-2 flex items-center justify-center bg-slate-950/70 p-6 sm:p-10 xl:order-1">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-xl shadow-black/20 sm:p-8"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-white">Create account</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Set up your profile to start searching smarter.
              </p>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Full name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </label>

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
                  placeholder="Create a strong password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Confirm password
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </label>
            </div>

            <label className="mt-5 flex items-start gap-3 text-sm text-slate-400">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-cyan-400 focus:ring-cyan-400"
              />
              I agree to the terms and privacy policy.
            </label>

            <button
              type="submit"
              className="mt-6 w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Sign Up
            </button>

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <a href="/" className="font-medium text-cyan-300 hover:text-cyan-200">
                Sign in
              </a>
            </p>
          </form>
        </section>

        <section className="order-1 flex flex-col justify-between bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.24),_transparent_36%),linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(2,6,23,0.92))] p-8 sm:p-12 xl:order-2">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
              IntelliSearch
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Build your account and unlock personalized search.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
              Keep your queries, saved responses, and AI-assisted workflow in one
              place with a polished onboarding flow.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {['Quick onboarding', 'Secure profile', 'Saved history'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-medium text-slate-200">{item}</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">
                  A smooth start for your workspace.
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Register
