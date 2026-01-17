"use client";

import { useState } from "react";
import { register } from "@/lib/actions/auth";

const RegisterForm = () => {
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await register(formData);
    setResult(res);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
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
          Register
        </button>
      </form>
      {result?.error && <p className="text-red-500 mt-4">{result.error}</p>}
      {result?.success && <p className="text-green-500 mt-4">{result.success}</p>}
    </>
  );
};

export default RegisterForm;
