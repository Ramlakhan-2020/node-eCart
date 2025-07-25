import React from 'react';
import Header from './signInHeader/Header';

export default function ProtectedLayout({ children }) {
    return (
      <>
        <Header />
        <main className="pt-20">{children}</main>
      </>
    );
  }