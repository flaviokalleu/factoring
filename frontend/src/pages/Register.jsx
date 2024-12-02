import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import InputMask from 'react-input-mask';
import { AtSign, User, Lock, Smartphone, Building2, CreditCard, Globe, CheckCircle2, Zap, Star, Award } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', firstName: '', lastName: '', email: '', 
    whatsapp: '', empresa: '', cpf: '', subdomain: '', 
    senha: '', confirmSenha: ''
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => {
      const updatedData = { ...prev, [id]: value };

      // Quando o campo 'empresa' for alterado, preencher automaticamente o 'subdomain'
      if (id === 'empresa') {
        updatedData.subdomain = value.toLowerCase().replace(/\s+/g, '-');
      }

      return updatedData;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.senha !== formData.confirmSenha) {
      newErrors.confirmSenha = 'As senhas não coincidem';
    }
    if (!selectedPlan) {
      newErrors.plan = 'Selecione um plano';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        ...formData,
        planoId: selectedPlan,
      });

      if (response.status === 201) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/plans');
        setPlans(response.data);
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
      }
    };
    fetchPlans();
  }, []);

  const planIcons = {
    Básico: <Zap className="absolute top-4 right-4 text-blue-400" size={24} />,
    Pro: <Star className="absolute top-4 right-4 text-yellow-400" size={24} />,
    Premium: <Award className="absolute top-4 right-4 text-purple-400" size={24} />
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 opacity-50 pointer-events-none"></div>
        
        <div className="p-12 relative z-10">
          <h2 className="text-5xl font-thin text-white text-center mb-12 tracking-wider">
            Criar Conta
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {[ 
                { id: 'username', label: 'Nome de Usuário', icon: User },
                { id: 'firstName', label: 'Primeiro Nome', icon: User },
                { id: 'lastName', label: 'Sobrenome', icon: User },
                { id: 'email', label: 'Email', icon: AtSign }
              ].map(({ id, label, icon: Icon }) => (
                <div key={id} className="relative">
                  <label className="text-gray-300 mb-3 block text-sm font-medium">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      id={id}
                      type="text"
                      value={formData[id]}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-700/40 text-white rounded-2xl border border-gray-600/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 shadow-lg"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[ 
                { 
                  id: 'whatsapp', 
                  label: 'WhatsApp', 
                  icon: Smartphone, 
                  mask: '(99) 9 9999-9999'
                },
                { id: 'empresa', label: 'Empresa', icon: Building2 },
                { 
                  id: 'cpf', 
                  label: 'CPF', 
                  icon: CreditCard, 
                  mask: '999.999.999-99'
                }
              ].map(({ id, label, icon: Icon, mask }) => (
                <div key={id} className="relative">
                  <label className="text-gray-300 mb-3 block text-sm font-medium">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    {mask ? (
                      <InputMask
                        mask={mask}
                        id={id}
                        type="text"
                        value={formData[id]}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-700/40 text-white rounded-2xl border border-gray-600/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 shadow-lg"
                      />
                    ) : (
                      <input
                        id={id}
                        type="text"
                        value={formData[id]}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-700/40 text-white rounded-2xl border border-gray-600/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 shadow-lg"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[ 
                { id: 'senha', label: 'Senha', type: 'password' },
                { id: 'confirmSenha', label: 'Confirmar Senha', type: 'password' }
              ].map(({ id, label, type }) => (
                <div key={id} className="relative">
                  <label className="text-gray-300 mb-3 block text-sm font-medium">{label}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      id={id}
                      type={type}
                      value={formData[id]}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-700/40 text-white rounded-2xl border border-gray-600/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 shadow-lg"
                    />
                  </div>
                  {errors[id] && <p className="text-red-500 text-sm mt-2">{errors[id]}</p>}
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h3 className="text-3xl text-white mb-8 text-center font-light tracking-wide">Escolha seu Plano</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-8 rounded-3xl border-2 cursor-pointer relative overflow-hidden transition-all duration-300 group ${
                      selectedPlan === plan.id 
                        ? 'bg-indigo-900/50 border-indigo-500 shadow-2xl' 
                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:shadow-xl'
                    }`}
                  >
                    {planIcons[plan.name] || null}
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-2xl font-semibold text-white">{plan.name}</h4>
                        {selectedPlan === plan.id && <CheckCircle2 className="text-indigo-500" size={28} />}
                      </div>
                      <p className="text-gray-400 mb-6 min-h-[60px]">{plan.description}</p>
                      <p className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                        {plan.price}
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-black/20 opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
                  </motion.div>
                ))}
              </div>
              {errors.plan && <p className="text-red-500 text-sm mt-4 text-center">{errors.plan}</p>}
            </div>

            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl"
              >
                Criar Conta
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
