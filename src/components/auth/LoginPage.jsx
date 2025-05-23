import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Importa el archivo de estilos
import config from '../../config/config.json'; // Importa tu archivo de configuración

const API_BASE_URL = config.API_BASE_URL;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
        const { token } = response.data;
        // Guardar el token en el localStorage
        localStorage.setItem('authToken', token);
        // Redirigir a la página principal
        navigate('/home'); 
    } catch (error) {
        if (error.response && error.response.status === 401) {
            setError('Credenciales inválidas');
        } else {
            setError('Error al iniciar sesión');
            console.error('Error de login:', error);
        }
    }
};
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Bienvenido a Unity</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          <div className="forgot-password">
            <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
          </div>
        </form>
      </div>
      <div className="login-background">
        {/* Aquí irá tu imagen o GIF de fondo */}
      </div>
    </div>
  );
};

export default LoginPage;
