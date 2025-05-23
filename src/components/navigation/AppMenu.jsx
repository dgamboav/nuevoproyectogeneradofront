import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AppMenu.css'; // Importa el archivo de estilos

const AppMenu = () => {
	const navigate = useNavigate();
    const menuItems = [
        { path: '/usuarios', label: 'Usuarios' },
    { path: '/empleados', label: 'Empleados' },
    { path: '/empresas', label: 'Empresas' },
    { path: '/procesos', label: 'Procesos' },
    { path: '/auditorias', label: 'Auditorias' },
    { path: '/noconformidads', label: 'NoConformidads' },
    { path: '/conformidads', label: 'Conformidads' },
    { path: '/accioncorrectivas', label: 'AccionCorrectivas' },
    { path: '/procesoauditorias', label: 'ProcesoAuditorias' },
	];
  
   const handleLogout = () => {
    // Aquí podrías implementar la lógica para limpiar la sesión del usuario
    // Por ejemplo, eliminar tokens de almacenamiento local o cookies
    console.log('Cerrando sesión');
    navigate('/login');
  };

  return (
    <nav className="app-menu">
		<h2>
			<Link to="/home" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
				Menu principal
			</Link>
         </h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
		  <li key="logout">
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </li>
      </ul>
    </nav>
  );
};

export default AppMenu;