"use server";

import React from "react";

const Footer: React.FC = async () => {
  return (
    <footer className="bg-gray-100 text-center text-sm text-gray-500 py-4 border-t mt-auto">
      <div className="container mx-auto px-4">
        <span>
          © {new Date().getFullYear()} AutoFlash. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
