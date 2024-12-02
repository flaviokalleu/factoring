import React from 'react';

const ClienteSection = ({ title, clients, showValues }) => {
  return (
    <div className="bg-gray-800 dark:bg-gray-700 p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="space-y-4">
        {clients.map((client) => (
          <div key={client.id} className="flex justify-between">
            <div>
              <p className="font-semibold text-white">Nº {client.id}</p>
              {/* Ocultar valor usando 'blur-sm' quando showValues for false */}
              <p className="text-white">Cliente: {client.name}</p>
              <p className={showValues ? 'text-white' : 'text-white blur-sm'}>R$ {client.amount}</p>
             
            </div>
            <div className="flex items-center">
              <button className="text-blue-400 hover:text-blue-500">Notificar</button>
              <button className="ml-3 text-green-400 hover:text-green-500">Visualizar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClienteSection;
