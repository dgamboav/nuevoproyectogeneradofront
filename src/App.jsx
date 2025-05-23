import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import HomePage from './components/home/HomePage';
import Layout from './components/Layout'; 

import UsuarioGrid from './components/Grids/UsuarioGrid';
import UsuarioForm from './components/Forms/UsuarioForm';
import EmpleadoGrid from './components/Grids/EmpleadoGrid';
import EmpleadoForm from './components/Forms/EmpleadoForm';
import EmpresaGrid from './components/Grids/EmpresaGrid';
import EmpresaForm from './components/Forms/EmpresaForm';
import ProcesoGrid from './components/Grids/ProcesoGrid';
import ProcesoForm from './components/Forms/ProcesoForm';
import AuditoriaGrid from './components/Grids/AuditoriaGrid';
import AuditoriaForm from './components/Forms/AuditoriaForm';
import NoconformidadGrid from './components/Grids/NoConformidadGrid';
import NoconformidadForm from './components/Forms/NoConformidadForm';
import ConformidadGrid from './components/Grids/ConformidadGrid';
import ConformidadForm from './components/Forms/ConformidadForm';
import AccioncorrectivaGrid from './components/Grids/AccionCorrectivaGrid';
import AccioncorrectivaForm from './components/Forms/AccionCorrectivaForm';
import ProcesoauditoriaGrid from './components/Grids/ProcesoAuditoriaGrid';
import ProcesoauditoriaForm from './components/Forms/ProcesoAuditoriaForm';

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
          path="/empresas"
          element={
		    <ProtectedRoute>
                <EmpresaGrid />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/empresas/add"
          element={
		    <ProtectedRoute>
                <EmpresaForm />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/empresas/edit/:id"
          element={
		    <ProtectedRoute>
                <EmpresaForm />
            </ProtectedRoute>
		  }
        />
        <Route
          path="/procesos"
          element={
		    <ProtectedRoute>
                <ProcesoGrid />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/procesos/add"
          element={
		    <ProtectedRoute>
                <ProcesoForm />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/procesos/edit/:id"
          element={
		    <ProtectedRoute>
                <ProcesoForm />
            </ProtectedRoute>
		  }
        />
        <Route
          path="/auditorias"
          element={
		    <ProtectedRoute>
                <AuditoriaGrid />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/auditorias/add"
          element={
		    <ProtectedRoute>
                <AuditoriaForm />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/auditorias/edit/:id"
          element={
		    <ProtectedRoute>
                <AuditoriaForm />
            </ProtectedRoute>
		  }
        />
        <Route
          path="/noconformidads"
          element={
		    <ProtectedRoute>
                <NoConformidadGrid />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/noconformidads/add"
          element={
		    <ProtectedRoute>
                <NoConformidadForm />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/noconformidads/edit/:id"
          element={
		    <ProtectedRoute>
                <NoConformidadForm />
            </ProtectedRoute>
		  }
        />
        <Route
          path="/conformidads"
          element={
		    <ProtectedRoute>
                <ConformidadGrid />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/conformidads/add"
          element={
		    <ProtectedRoute>
                <ConformidadForm />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/conformidads/edit/:id"
          element={
		    <ProtectedRoute>
                <ConformidadForm />
            </ProtectedRoute>
		  }
        />
        <Route
          path="/accioncorrectivas"
          element={
		    <ProtectedRoute>
                <AccionCorrectivaGrid />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/accioncorrectivas/add"
          element={
		    <ProtectedRoute>
                <AccionCorrectivaForm />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/accioncorrectivas/edit/:id"
          element={
		    <ProtectedRoute>
                <AccionCorrectivaForm />
            </ProtectedRoute>
		  }
        />
        <Route
          path="/procesoauditorias"
          element={
		    <ProtectedRoute>
                <ProcesoAuditoriaGrid />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/procesoauditorias/add"
          element={
		    <ProtectedRoute>
                <ProcesoAuditoriaForm />
            </ProtectedRoute>
		  }
        />		
		<Route
          path="/procesoauditorias/edit/:id"
          element={
		    <ProtectedRoute>
                <ProcesoAuditoriaForm />
            </ProtectedRoute>
		  }
        />
      </Routes>
    </div>
  );
};

export default App;
