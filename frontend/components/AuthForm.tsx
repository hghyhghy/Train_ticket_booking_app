"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Define props type
type AuthFormProps = {
  type: 'signup' | 'login';
  isLogin?: boolean;
  // other props
};

export default function AuthForm({ isLogin: initialIsLogin = true }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/login" : "/api/signup";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/");
    } else {
      alert("Authentication failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100  w-[50rem]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-black ">
        <h2 className="text-2xl font-bold text-center  text-black">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-lg"
                required
              />
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg mt-6 hover:bg-blue-600 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
