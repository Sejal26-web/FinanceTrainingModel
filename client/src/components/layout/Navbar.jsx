import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import { FiMenu, FiX, FiLogOut, FiUser, FiHome, FiFileText, FiBarChart2, FiSun, FiMoon } from "react-icons/fi";
import logo from "../../assets/logo.png";

const navLinks = [
  { to: "/", label: "Home", icon: FiHome },
  { to: "/apply", label: "Apply", icon: FiFileText, auth: true },
  { to: "/compare", label: "Compare", icon: FiBarChart2 },
  { to: "/profile", label: "Profile", icon: FiUser, auth: true },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
    <nav className="sticky top-0 z-50 glass-card border-b rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
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
                      ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                      : "t-text-muted hover:t-text hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <link.icon className="text-sm" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg t-text-muted hover:t-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="t-text-muted text-sm">
                  Hi, <span className="t-text font-medium">{user.name?.split(" ")[0]}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm t-text-secondary hover:t-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg t-text-muted"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="t-text-muted hover:t-text p-2"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t t-border mt-2 pt-4 space-y-1">
            {visibleLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                      : "t-text-muted hover:t-text hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <link.icon />
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t t-border pt-3 mt-3">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors w-full"
                >
                  <FiLogOut /> Logout
                </button>
              ) : (
                <div className="space-y-1">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm t-text-secondary hover:t-text">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm text-cyan-600">
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