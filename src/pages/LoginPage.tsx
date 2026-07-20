import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useToast } from '../lib/toast';
import { Candy, Loader2, Lock, Mail } from 'lucide-react';
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const toast = useToast();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email.trim(), password);
    setLoading(false);
    if (error) {
      toast({ message: error, type: 'error' });
    } else if (mode === 'signup') {
      toast({ message: 'Account created. You are signed in.', type: 'success' });
    } else {
      toast({ message: 'Welcome back!', type: 'success' });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-rose-600 via-rose-700 to-amber-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Candy className="w-6 h-6" />
            </div>
            <span className="font-display text-2xl font-semibold tracking-tight">Saatvik sweets & savouries</span>
          </div>
        </div>
        <div className="relative space-y-5">
          <h1 className="font-display text-5xl font-semibold leading-tight">
            Manage your sweet store, beautifully.
          </h1>
          <p className="text-rose-100 text-lg leading-relaxed max-w-md">
            Full control over products, categories, and orders — with secure Razorpay
            checkout built in for your customers.
          </p>
        </div>
        <div className="relative text-rose-100/80 text-sm">Admin Console · v1.0</div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-stone-50">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white">
              <Candy className="w-5 h-5" />
            </div>
            <span className="font-display text-xl font-semibold text-stone-800">Saatvik sweets & savouries</span>
          </div>

          <h2 className="font-display text-3xl font-semibold text-stone-900">
            {mode === 'signin' ? 'Sign in to admin' : 'Create admin account'}
          </h2>
          <p className="text-stone-500 mt-2 mb-8">
            {mode === 'signin'
              ? 'Enter your credentials to access the dashboard.'
              : 'Set up your admin credentials to get started.'}
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mithaimart.com"
                  className="input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-stone-500">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="font-semibold text-rose-600 hover:text-rose-700"
            >
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </div>

          {/* <div className="mt-8 pt-6 border-t border-stone-200 text-center">
            <button onClick={onGoStore} className="btn-ghost text-stone-500">
              <Store className="w-4 h-4" /> View storefront
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
