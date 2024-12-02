import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Cpu, 
  Rocket,
  Zap
} from 'lucide-react';

const EnhancedLoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [warpTransition, setWarpTransition] = useState(false);
  const [backgroundEffect, setBackgroundEffect] = useState(false);
  const [loginMethod, setLoginMethod] = useState('default');
  const backgroundRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setIsLoading(true);

    try {
      const success = await login(email, senha);

      if (success) {
        setLoginStatus('success');
        setTimeout(() => {
          setWarpTransition(true);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }, 1000);
      } else {
        setLoginStatus('error');
        setErro('Login falhou. Verifique suas credenciais.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setLoginStatus('error');
      setErro('Erro ao fazer login. Tente novamente.');
      setIsLoading(false);
    }
  };

  const handleAlternativeLogin = (method) => {
    setLoginMethod(method);
    setBackgroundEffect(true);
    setTimeout(() => {
      setBackgroundEffect(false);
    }, 2000);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (backgroundRef.current) {
        const { clientX, clientY } = e;
        backgroundRef.current.style.backgroundImage = `
          radial-gradient(
            circle 600px at ${clientX}px ${clientY}px, 
            rgba(29, 78, 216, 0.15), 
            transparent 50%
          )
        `;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={backgroundRef}
      className={`min-h-screen flex items-center justify-center bg-black relative overflow-hidden transition-all duration-[2000ms] ${warpTransition ? 'scale-150 brightness-200 blur-3xl' : ''} ${backgroundEffect ? 'bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30' : ''}`}
    >
      {warpTransition && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1.5, 3],
            }}
            transition={{ 
              duration: 2,
              times: [0, 0.2, 0.8, 1],
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-white/30 backdrop-blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              backgroundPosition: ['0% 50%', '100% 50%', '200% 50%', '300% 50%']
            }}
            transition={{ 
              duration: 2,
              times: [0, 0.2, 0.8, 1],
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(45deg, transparent, blue, purple, pink, transparent)',
              backgroundSize: '400% 400%',
            }}
          />
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md px-8 py-12 bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-800/50 relative z-10 transition-all duration-[2000ms] ${warpTransition ? 'opacity-0 scale-0' : ''}`}
      >
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-10 text-center tracking-tight flex items-center justify-center gap-4"
        >
          Entrar <Sparkles className="text-yellow-400" />
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <label htmlFor="email" className="block text-gray-300 text-sm mb-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50"
                placeholder="Digite seu email"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <label htmlFor="senha" className="block text-gray-300 text-sm mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="senha"
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                disabled={isLoading}
                className="w-full pl-12 pr-12 py-4 bg-gray-800/50 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50"
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {erro && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-center space-x-2 text-red-400 text-sm"
              >
                <AlertTriangle size={20} />
                <p>{erro}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300 transform disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Entrar"
            )}
          </motion.button>

          <div className="text-center text-gray-400 my-4">ou conecte-se com</div>

          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAlternativeLogin('google')}
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"
              title="Login com Google"
            >
              <Cpu className="text-white" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAlternativeLogin('github')}
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"
              title="Login com GitHub"
            >
              <Rocket className="text-white" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAlternativeLogin('lightning')}
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"
              title="Login Rápido"
            >
              <Zap className="text-yellow-400" />
            </motion.button>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <a 
              href="/register" 
              className="text-gray-400 hover:text-white text-sm transition-colors duration-300 inline-flex items-center gap-2"
            >
              Ainda não tem uma conta? 
              <span className="text-blue-500 hover:underline">Cadastre-se</span>
            </a>
          </motion.div>
        </form>
      </motion.div>

      {/* Star Trek Warp Sound (optional) */}
      {warpTransition && (
        <audio autoPlay>
          <source src="./warp-sound.mp3" type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
};

export default EnhancedLoginPage;