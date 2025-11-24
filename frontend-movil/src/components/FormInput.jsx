import React from 'react';

export default function FormInput({ label, icon: Icon, ...props }) {
  return (
    <label className="block relative">
      {label && <span className="text-sm text-gray-500">{label}</span>}
      <div className="mt-1 relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="text-gray-400 w-5 h-5" />
          </div>
        )}
        <input
          className={`block w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
            Icon ? 'pl-10' : ''
          }`}
          {...props}
        />
      </div>
    </label>
  );
}
