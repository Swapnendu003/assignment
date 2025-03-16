'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { login, register, LoginCredentials, RegisterCredentials } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
{/* Test Commit*/}
  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      await login(credentials);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    try {
      await register(credentials);
      await login({ email: credentials.email, password: credentials.password });
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {isLogin ? 'Admin Login' : 'Create Account'}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {isLogin 
            ? 'Sign in to access the admin dashboard' 
            : 'Register to create an admin account'}
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <AuthForm 
          mode={isLogin ? 'login' : 'register'} 
          onLogin={handleLogin} 
          onRegister={handleRegister}
          loading={loading} 
        />
        
        <div className="mt-6 text-center">
          <button
            onClick={toggleAuthMode}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            {isLogin 
              ? "Don't have an account? Create new" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}