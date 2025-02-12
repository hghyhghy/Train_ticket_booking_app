"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  type: "login" | "signup";
  isLogin?: boolean;
};

export default function AuthForm({ isLogin: initialIsLogin = true }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "" }); 
  const [error, setError] = useState(""); // Error state
  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const endpoint = isLogin ? `${API_BASE_URL}/auth/login` : `${API_BASE_URL}/auth/signup`;

    // Construct request body
    const body = isLogin
      ? { username: formData.username, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const responseBody = await response.json(); // Parse response

      if (response.ok) {
        sessionStorage.setItem("isLoggedIn", "true"); // Store login state
        router.push("/trains"); // Redirect to blogs page
      } else {
        setError(responseBody.message || "Invalid credentials, please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("An error occurred. Please check your network connection and try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 w-[50rem]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-black">
        <h2 className="text-2xl font-bold text-center text-black">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>} {/* Show error message */}

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
                required={!isLogin}
              />
            </div>
          )}

          {isLogin ? (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-lg"
                required
              />
            </div>
          ) : (
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
          )}

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
