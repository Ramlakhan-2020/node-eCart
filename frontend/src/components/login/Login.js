import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userCart } from '../context/CardContext';

export default function Login() {
  const [signInForm, setSignInForm] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { getcartCount, joinUserRoom } = userCart();

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInForm({ ...signInForm, [name]: value });
    setErrorMessage(''); // Clear error when user starts typing
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3003/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: signInForm.email,
          password: signInForm.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await getcartCount(); // Fetch cart count after login
        await joinUserRoom(); // Connect and join socket room after login
        navigate('/product');
        console.log('User Login Successfully', data);
      } else if (response.status === 401) {
        // Token expired: try refresh
        const refresh = await fetch(
          'http://localhost:3003/api/auth/refresh-token',
          {
            method: 'POST',
            credentials: 'include',
          }
        );

        if (refresh.ok) {
          console.log('Token refreshed. Retrying login...');
          await handleSignInSubmit(e); // Retry login
        } else {
          setErrorMessage('Session expired. Please log in again.');
        }
      } else if (response.status === 400 || response.status === 403) {
        setErrorMessage('Invalid email or password.');
      } else {
        setErrorMessage('Login failed. Please try again.');
      }

      setSignInForm({});
    } catch (err) {
      console.log('Something went wrong during login', err);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://t4.ftcdn.net/jpg/02/32/16/07/360_F_232160763_FuTBWDd981tvYEJFXpFZtolm8l4ct0Nz.jpg')",
    }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <form className="space-y-4" onSubmit={handleSignInSubmit}>
          <input
            onChange={handleSignInChange}
            value={signInForm.email || ''}
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            onChange={handleSignInChange}
            value={signInForm.password || ''}
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Error Message */}
          {errorMessage && (
            <span className="block text-red-600 text-sm">{errorMessage}</span>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
