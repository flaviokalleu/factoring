import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, 
  X, 
  Home, 
  Clock, 
  UserPlus, 
  Users, 
  CreditCard, 
  UserCheck, 
  LogOut, 
  LogIn 
} from 'lucide-react';

function InnovativeNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Navigation menu items with icons
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/historico', label: 'Histórico', icon: Clock },
    { path: '/adicionar-cliente', label: 'Adicionar Cliente', icon: UserPlus },
    { path: '/lista-clientes', label: 'Lista de Clientes', icon: Users },
    { path: '/cobranca', label: 'Cobrança', icon: CreditCard },
    { path: '/lista-negra', label: 'Lista Negra', icon: UserCheck },
    { path: '/lista-afiliados', label: 'Lista de Afiliados', icon: Users }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logout handler
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav 
        className={`
          fixed top-0 left-0 w-full z-50 transition-all duration-300
          ${location.pathname === '/cobranca' ? 'bg-slate-900/90' : isScrolled ? 'bg-slate-900/90 shadow-2xl' : 'bg-transparent'}
          backdrop-blur-md
        `}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo Area */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600"
            >
              Dashboard
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-2 
                  px-3 py-2 rounded-lg transition-all duration-300
                  ${location.pathname === item.path 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : 'text-neutral-300 hover:bg-slate-800 hover:text-cyan-400'}
                `}
              >
                <item.icon size={20} />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-neutral-300 hidden md:block">
                  {user.username}
                </span>
                <button 
                  onClick={handleLogout}
                  className="
                    bg-gradient-to-r from-red-500 to-pink-600 
                    text-white px-4 py-2 rounded-lg 
                    hover:from-red-600 hover:to-pink-700 
                    transition-all flex items-center space-x-2
                  "
                >
                  <LogOut size={20} />
                  <span className="hidden md:block text-sm">Sair</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="
                  bg-gradient-to-r from-cyan-500 to-blue-600 
                  text-white px-4 py-2 rounded-lg 
                  hover:from-cyan-600 hover:to-blue-700 
                  transition-all flex items-center space-x-2
                "
              >
                <LogIn size={20} />
                <span className="text-sm">Login</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMenu}
              className="lg:hidden text-neutral-300 hover:text-cyan-400"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`
          fixed inset-0 z-40 bg-slate-900 
          transform transition-transform duration-300 
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:hidden overflow-y-auto pt-24
        `}
      >
        <div className="container mx-auto px-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={toggleMenu}
              className={`
                flex items-center space-x-4 
                py-4 border-b border-slate-700
                transition-all duration-300
                ${location.pathname === item.path 
                  ? 'text-cyan-400' 
                  : 'text-neutral-300 hover:text-cyan-400'}
              `}
            >
              <item.icon size={24} />
              <span className="text-xl">{item.label}</span>
            </Link>
          ))}

          {user && (
            <div className="mt-6 space-y-4">
              <div className="text-neutral-400 text-lg">
                Olá, {user.username}
              </div>
              <button 
                onClick={handleLogout}
                className="
                  w-full bg-gradient-to-r from-red-500 to-pink-600 
                  text-white px-4 py-3 rounded-lg 
                  hover:from-red-600 hover:to-pink-700 
                  flex items-center justify-center space-x-2
                "
              >
                <LogOut size={24} />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default InnovativeNavbar;
