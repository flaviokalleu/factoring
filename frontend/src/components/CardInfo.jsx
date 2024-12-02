import React from 'react';
import { FaArrowUp, FaArrowDown, FaDollarSign } from 'react-icons/fa';

const CardInfo = ({ icon, title, value, iconColor }) => {
  return (
    <div className="bg-gray-800 dark:bg-gray-700 p-6 rounded-lg shadow-md flex items-center">
      {icon && <div className={`${iconColor} text-3xl mr-5`}>{icon}</div>}
      <div>
        <h2 className="font-semibold text-white">{title}</h2>
        <p className="text-lg text-white">{value}</p>
      </div>
    </div>
  );
};

export default CardInfo;
