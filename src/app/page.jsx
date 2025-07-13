"use client"
import Image from "next/image";
import supabase from "./lib/supabaseClient";
import { useState } from "react";

export default function Home() {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Login gagal: ' + error.message);
    } else {
      alert('Login berhasil!');
      console.log(data);
      localStorage.setItem('user_id', user.id);

    }
  };

  return (
    <div className="">
      <div class="container">
        <div class="logo ">
            <img src="images/logo.png" className="mx-auto" alt="Logo"/>
        </div>
        <form id="loginForm">
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} id="email" placeholder="email" required className="text-white"/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} id="password" placeholder="Password" className="text-white" required/>
            <button type="submit" onClick={handleLogin}>Masuk</button>
        </form>
    </div>

    </div>
  );
}
