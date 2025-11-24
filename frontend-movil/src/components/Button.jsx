import React from 'react';

export default function Button({ children, variant = 'primary', onClick, type = 'button' }){
  let cls = 'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition';
  if (variant === 'primary') cls += ' bg-indigo-600 text-white hover:bg-indigo-700';
  else if (variant === 'outline') cls += ' border border-gray-200 text-gray-700 bg-white hover:bg-gray-50';
  else if (variant === 'ghost') cls += ' text-indigo-600 bg-transparent hover:bg-indigo-50';
  else cls += ' bg-gray-100';

  return (
    <button type={type} className={cls} onClick={onClick}>{children}</button>
  );
}
