import React from 'react';
import AppMenu from './navigation/AppMenu';
import './Layout.css'; // Importa el archivo de estilos del layout

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <AppMenu />
      <main className="content-area">
        {children}
      </main>
    </div>
  );
};

export default Layout;