import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../FormStyles.css'; // Importa los estilos del formulario
import config from '../../config/config.json'; // Importa el archivo de configuración

const API_BASE_URL = config.API_BASE_URL; // Lee la variable desde el archivo

const UsuarioForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
	const [relatedEntities, setRelatedEntities] = useState({});
	const [listaRelaciones, setListaRelaciones] = useState([]); 

    useEffect(() => {
        if (id) {
            const fetchEntity = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(API_BASE_URL + `/usuarios/` + id);
                    setFormData(response.data);
                } catch (err) {
                    setError(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchEntity();
        }
    }, [id]);
	
    const fetchRelated = useCallback(async (relation) => {
        try {
            const response = await axios.get(API_BASE_URL + "/" + relation.entidadRelacionada.toLowerCase() + `s/todosMinimo`);
            setRelatedEntities(prev => ({ ...prev, [relation.nombreAtributo]: response.data }));
        } catch (error) {
            console.error(`Error fetching:` + relation.entidadRelacionada.toLowerCase(), error);
        }
    }, []); 

	
    useEffect(() => {
        if (listaRelaciones) {
            listaRelaciones
                .filter(relation => relation.tipo === 'ManyToOne')
                .forEach(fetchRelated);
        }
    }, [listaRelaciones, fetchRelated]);


    useEffect(() => {
        const relacionesDesdeBackend = [];
        try {
                setListaRelaciones(relacionesDesdeBackend);
        } catch (e) {
            console.error("Error setting relaciones:", e);
            setListaRelaciones([]);
        }
    }, [setListaRelaciones]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
	
	const handleVolver = () => {
        navigate(`/usuarios`);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            let response;
            if (id) {
                response = await axios.put(API_BASE_URL + `/usuarios/` + id, formData);
            } else {
                response = await axios.post(API_BASE_URL + `/usuarios`, formData);
            }
            handleVolver(); // Redirigir a la grid después de guardar
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error.message}</div>;

return (
        <div className="form-container">
            <h2>{id ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
						<label htmlFor="id">
							Id:
						</label>
                            <input
                                type="number"
                                id="id"
                                name="id"
                                value={formData.id || ''}
                                onChange={handleChange}
																
                                readOnly
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="nombre">
							Nombre:
						</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="correo">
							Correo:
						</label>
                            <input
                                type="text"
                                id="correo"
                                name="correo"
                                value={formData.correo || ''}
                                onChange={handleChange}
								maxlength="255"								
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="contrasena">
							Contraseña:
						</label>
                            <input
                                type="password"
                                id="contrasena"
                                name="contrasena"
                                value={formData.contrasena || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-actions">
                    <button type="submit" className="save">{id ? 'Guardar Cambios' : 'Crear Usuario'}</button>
                    <button type="button" className="cancel" onClick={handleVolver}>Volver</button>
                </div>
            </form>
        </div>
    );
};

export default UsuarioForm;