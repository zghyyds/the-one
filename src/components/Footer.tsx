"use client";
import React from "react";
import { manrope } from "@/configs/fonts";

export const Footer = () => {
  return (
    <footer
      className={`${manrope.variable} h-[80px] w-full border-t border-gray-800 flex items-center`}
    >
      <div className="max-w-[1536px] w-full mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-gray-400 text-sm">
          © 2024 The1. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-gray-400 hover:text-white text-sm">
            Terms
          </a>
          <a href="#" className="text-gray-400 hover:text-white text-sm">
            Privacy
          </a>
          <a href="#" className="text-gray-400 hover:text-white text-sm">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};
