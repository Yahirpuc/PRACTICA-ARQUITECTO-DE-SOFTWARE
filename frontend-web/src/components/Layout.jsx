import React from 'react';

export default function Layout({ children }){
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {children}
    </main>
  );
}
