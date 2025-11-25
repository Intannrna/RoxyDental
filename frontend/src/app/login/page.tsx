"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<"dokter" | "perawat">();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

 const slides = [
  "/images/logo1.jpg",
  "/images/logo2.jpg",
  "/images/logo3.jpg",
];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
    if (!role) return alert("Pilih role terlebih dahulu");
    if (!username || !password) return alert("Username & password wajib diisi");

    router.push(
      role === "dokter"
        ? "/dashboard/dokter/utama"
        : "/dashboard/perawat/main"
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* LEFT SIDE - Hero Section (Hidden on mobile, shown on desktop) */}
      <div
        className="hidden lg:flex relative flex-col justify-center items-center lg:w-3/5 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #FFDDE6 0%, #FFCAD4 40%, #FFB4C8 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 w-[85%] max-w-3xl">
          {/* Title */}
          <div className="text-left w-full mb-8">
            <h1 className="text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-2">
              Selamat Datang
            </h1>
            <h2 className="text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-2">
              di <span className="text-pink-600 drop-shadow-sm">POLADC</span>
            </h2>
          </div>

          {/* SLIDESHOW */}
          <div className="relative rounded-3xl shadow-2xl bg-white/40 backdrop-blur-sm p-4">
            <div 
              className="relative overflow-hidden w-full rounded-2xl bg-gray-100"
              style={{ 
                paddingBottom: '56.25%'
              }}
            >
              {slides.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Clinic slide ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                    currentSlide === index 
                      ? "opacity-100 scale-100" 
                      : "opacity-0 scale-105"
                  }`}
                />
              ))}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Indicator dots */}
            <div className="flex justify-center mt-5 gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="transition-all duration-300 rounded-full hover:scale-110"
                  style={{
                    width: currentSlide === index ? '28px' : '10px',
                    height: '10px',
                    backgroundColor: currentSlide === index ? "#FF5E8A" : "#FFB4C8",
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="flex flex-col w-full lg:w-2/5 bg-white min-h-screen">
        <div className="flex flex-col justify-center items-center flex-1 px-6 sm:px-8 md:px-12 py-8 sm:py-10">
          <div className="w-full max-w-md">
            {/* Mobile Header with gradient background */}
            <div className="lg:hidden mb-8 -mx-6 sm:-mx-8 md:-mx-12 -mt-8 sm:-mt-10 px-6 sm:px-8 md:px-12 py-8 rounded-b-3xl"
              style={{
                background: "linear-gradient(135deg, #FFDDE6 0%, #FFB4C8 100%)",
              }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-2">
                Selamat Datang di
              </h1>
              <h2 className="text-3xl sm:text-4xl font-bold text-pink-600 text-center">
                POLADC
              </h2>
            </div>

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div
                className="rounded-full flex items-center justify-center shadow-lg mb-4 transform hover:scale-105 transition-transform"
                style={{
                  width: '80px',
                  height: '80px',
                  background: "linear-gradient(135deg, #FF7AA2 0%, #FF5E8A 100%)",
                  color: "white",
                  fontSize: '36px',
                  fontWeight: "bold",
                }}
              >
                P
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-pink-500 mb-1">
                POLADC
              </h2>
              <p className="text-gray-500 font-medium text-sm sm:text-base">
                Login ke Akun Kamu
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Pilih Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "dokter", label: "Dokter" },
                  { value: "perawat", label: "Perawat" }
                ].map((r) => (
                  <button
                    key={r.value}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all border-2 text-sm sm:text-base ${
                      role === r.value
                        ? "text-white bg-pink-500 border-pink-500 shadow-lg scale-105"
                        : "text-gray-700 bg-white border-gray-300 hover:border-pink-300 hover:bg-pink-50"
                    }`}
                    onClick={() => setRole(r.value as any)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-sm text-gray-900 mb-2">
                  Username
                </label>
                <input
                  className="w-full border-2 rounded-xl px-4 py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold text-sm text-gray-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border-2 rounded-xl px-4 py-3 pr-20 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-pink-50 text-pink-600 font-semibold text-xs sm:text-sm hover:bg-pink-100 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3.5 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-pink-700 transform hover:scale-[1.02] transition-all active:scale-[0.98] mt-2"
              >
                Sign In
              </button>
            </div>

            {/* Links */}
            <div className="mt-6 space-y-3 text-center">

             <p
                className="text-pink-600 font-bold underline cursor-pointer text-sm sm:text-base hover:text-pink-700"
                onClick={() => router.push("/forgot-password")}
              >
                Lupa Password?
              </p>

              <div className="h-6">
                {role === "perawat" && (
                  <p className="text-gray-600 text-sm sm:text-base">
                    Belum punya akun?{" "}
                    <span
                      className="text-pink-600 font-bold underline cursor-pointer hover:text-pink-700"
                      onClick={() => router.push("/register/role")}
                    >
                      Daftar Sekarang
                    </span>
                  </p>
                )}
              </div>

             

              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 text-gray-500 font-medium hover:text-pink-600 transition-colors text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Beranda
              </button>
            </div>

            {/* Footer */}
            <p className="text-gray-400 text-xs sm:text-sm text-center mt-8">
              © 2025 POLADC — All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}