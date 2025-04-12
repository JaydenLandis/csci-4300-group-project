"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-light text-center text-lg-start mt-auto py-3 border-top">
      <div className="container text-center">
        <span className="text-muted">
          © {new Date().getFullYear()} AutoFlash. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
