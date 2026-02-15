"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = useAuthStore((state) => state.signIn);
  const router = useRouter();

  const handleLogin = async () => {
    await signIn(email, password);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg text-white text-2xl font-bold mb-3">
            +
          </div>
          <h1 className="text-2xl font-bold">My Hyppocampe</h1>
        </div>

        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="password"
          placeholder="Votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}
