"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import "./Splash.css";

const Splash: React.FC = () => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 text-center">
      <header className="mb-5">
        <h1 className="display-4 fw-bold">Welcome to AutoFlash!</h1>
        <p className="lead max-width-50 mx-auto">
          Auto Flash is a web application that can turn your notes into flash
          cards, helping you study more effectively. It uses machine learning
          algorithms to analyze your notes and create flashcards that are
          tailored to your learning style. With Auto Flash, you can easily
          create flashcards
        </p>
        <a
          href="/login"
          className="btn btn-lg btn-light fw-bold border-white bg-white mt-3"
        >
          Get Started
        </a>
      </header>

      <div
        id="carouselExampleIndicators"
        className="carousel slide w-100"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner rounded shadow">
          <div className="carousel-item active">
            <Image
              src="/assets/flashcards.jpg"
              className="d-block w-100"
              alt="Slide 1"
              width={1200}
              height={600}
            />
          </div>
          <div className="carousel-item">
            <Image
              src="/assets/flashcards.jpg"
              className="d-block w-100"
              alt="Slide 2"
              width={1200}
              height={600}
            />
          </div>
          <div className="carousel-item">
            <Image
              src="/assets/flashcards.jpg"
              className="d-block w-100"
              alt="Slide 3"
              width={1200}
              height={600}
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Splash;
