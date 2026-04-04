import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { FiMenu, FiX, FiLogOut, FiUser, FiHome, FiFileText, FiBarChart2 } from "react-icons/fi";
import logo from "../../assets/logo.png";

const navLinks = [
  { to: "/", label: "Home", icon: FiHome },
  { to: "/apply", label: "Apply", icon: FiFileText, auth: true },
  { to: "/compare", label: "Compare", icon: FiBarChart2 },
  { to: "/profile", label: "Profile", icon: FiUser, auth: true },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleLinks = navLinks.filter((l) => !l.auth || user);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ✅ UPDATED LOGO */}
          <Link to="/" className="flex items-center group">
            <img
              src={logo}
              alt="LoanWise"
              className="h-50 w-auto object-contain transition-all duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon className="text-sm" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">
                  Hi, <span className="text-white font-medium">{user.name?.split(" ")[0]}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-400 hover:text-white p-2"
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/5 mt-2 pt-4 space-y-1">
            {visibleLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon />
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-white/5 pt-3 mt-3">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
                >
                  <FiLogOut /> Logout
                </button>
              ) : (
                <div className="space-y-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm text-gray-300 hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm text-cyan-400"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}