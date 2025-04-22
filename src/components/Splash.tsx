"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const images = [
  "/assets/flashcards.jpg",
  "/assets/flashcards.jpg",
  "/assets/flashcards.jpg",
];

const Splash: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => setCurrent(index);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gray-50">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-5xl font-extrabold mb-6 text-gray-900">
          Welcome to AutoFlash!
        </h1>
        <p className="text-lg text-gray-700">
          Auto Flash is a web application that can turn your notes into flash
          cards, helping you study more effectively. It uses machine learning
          algorithms to analyze your notes and create flashcards tailored to
          your learning style.
        </p>
        <Link
          href="/login"
          className="inline-block mt-6 bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-400 transition"
        >
          Get Started
        </Link>
      </header>

      <div className="relative w-full max-w-4xl overflow-hidden rounded-xl shadow-lg">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((src, index) => (
            <div key={index} className="min-w-full h-[300px] relative">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Carousel controls */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                current === index ? "bg-white" : "bg-gray-400"
              } transition`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-90 p-2 rounded-full shadow"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-90 p-2 rounded-full shadow"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Splash;
