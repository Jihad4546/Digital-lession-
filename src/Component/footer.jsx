"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                D
              </div>

              <div>
                <h2 className="text-white font-bold text-xl">
                  Digital Life Lessons
                </h2>
                <p className="text-slate-500 text-sm">
                  Learn • Grow • Succeed
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-7">
              Digital Life Lessons is an online learning platform where users
              can explore public lessons, create their own learning content, and
              improve digital skills.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-slate-400">
              <Link
                href="/"
                className="hover:text-pink-500 transition"
              >
                Home
              </Link>

              <Link
                href="/public-lessons"
                className="hover:text-pink-500 transition"
              >
                Public Lessons
              </Link>

              <Link
                href="/pricing"
                className="hover:text-pink-500 transition"
              >
                Pricing
              </Link>

              <Link
                href="/dashboard"
                className="hover:text-pink-500 transition"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Contact Info
            </h3>

            <div className="space-y-4 text-slate-400">

              <div className="flex items-center gap-3">
                <FaEnvelope className="text-pink-500" />
                <span>support@digitallifelessons.com</span>
              </div>

              <div className="flex items-center gap-3">
                <FaPhone className="text-pink-500" />
                <span>+880 1234-567890</span>
              </div>

              <p>
                Dhaka, Bangladesh
              </p>
            </div>
          </div>

          {/* Terms & Social */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Legal & Social
            </h3>

            <div className="flex flex-col gap-3 mb-6">
              <Link
                href="/terms"
                className="text-slate-400 hover:text-pink-500 transition"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/privacy"
                className="text-slate-400 hover:text-pink-500 transition"
              >
                Privacy Policy
              </Link>
            </div>

            <div className="flex items-center gap-4">

              <a
                href="#"
                className="h-11 w-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-pink-500 hover:text-white transition-all duration-300"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="h-11 w-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-pink-500 hover:text-white transition-all duration-300"
              >
                <FaXTwitter />
              </a>

              <a
                href="#"
                className="h-11 w-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-pink-500 hover:text-white transition-all duration-300"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="#"
                className="h-11 w-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-pink-500 hover:text-white transition-all duration-300"
              >
                <FaGithub />
              </a>

            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-slate-500 text-sm text-center">
            © {new Date().getFullYear()} Digital Life Lessons. All Rights
            Reserved.
          </p>

          <p className="text-slate-500 text-sm">
            Built with ❤️ using Next.js & HeroUI
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;