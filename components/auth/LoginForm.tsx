"use client";

import { useState } from "react";
import { login } from "@/lib/actions/auth";

const LoginForm = () => {
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await login(formData);
    setResult(res);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <button type="submit" className="w-full bg-black text-white py-2 rounded-md">
          Login
        </button>
      </form>
      {result?.error && <p className="text-red-500 mt-4">{result.error}</p>}
      {result?.success && <p className="text-green-500 mt-4">{result.success}</p>}
    </>
  );
};

export default LoginForm;
