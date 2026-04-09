"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registrazione completata!");
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 bg-white rounded-xl shadow w-80">
        <h1 className="text-2xl font-bold mb-4">Registrati</h1>

        <input
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-purple-600 text-white p-2 rounded"
        >
          Registrati
        </button>
      </div>
    </div>
  );
}