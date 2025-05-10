import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import HomePage from './components/home/HomePage';
import Layout from './components/Layout'; 

import UsuarioGrid from './components/Grids/UsuarioGrid';
import UsuarioForm from './components/Forms/UsuarioForm';
import EmpleadoGrid from './components/Grids/EmpleadoGrid';
import EmpleadoForm from './components/Forms/EmpleadoForm';
import ProyectoGrid from './components/Grids/ProyectoGrid';
import ProyectoForm from './components/Forms/ProyectoForm';
import ObjecionGrid from './components/Grids/ObjecionGrid';
import ObjecionForm from './components/Forms/ObjecionForm';

const App = () => {

      const isAuthenticated = () => {
        return localStorage.getItem('authToken') !== null;
    };

    const ProtectedRoute = ({ children }) => {
        return isAuthenticated() ? <Layout>{children}</Layout> : <Navigate to="/login" />;
    };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
		    <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
		  }
        />
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />		
        <Route
          path="/usuarios"
          element={
		    <ProtectedRoute>
                <UsuarioGrid />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/usuarios/add"
          element={
		    <ProtectedRoute>
                <UsuarioForm />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/usuarios/edit/:id"
          element={
		    <ProtectedRoute>
                <UsuarioForm />
            </ProtectedRoute>
		  }
        />
        <Route
          path="/empleados"
          element={
		    <ProtectedRoute>
                <EmpleadoGrid />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/empleados/add"
          element={
		    <ProtectedRoute>
                <EmpleadoForm />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/empleados/edit/:id"
          element={
		    <ProtectedRoute>
                <EmpleadoForm />
            </ProtectedRoute>
		  }
        />
        <Route
          path="/proyectos"
          element={
		    <ProtectedRoute>
                <ProyectoGrid />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/proyectos/add"
          element={
		    <ProtectedRoute>
                <ProyectoForm />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/proyectos/edit/:id"
          element={
		    <ProtectedRoute>
                <ProyectoForm />
            </ProtectedRoute>
		  }
        />
        <Route
          path="/objecions"
          element={
		    <ProtectedRoute>
                <ObjecionGrid />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/objecions/add"
          element={
		    <ProtectedRoute>
                <ObjecionForm />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/objecions/edit/:id"
          element={
		    <ProtectedRoute>
                <ObjecionForm />
            </ProtectedRoute>
		  }
        />
      </Routes>
    </div>
  );
};

export default App;