import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../FormStyles.css'; // Importa los estilos del formulario
import config from '../../config/config.json'; // Importa el archivo de configuración
import { format } from 'date-fns'; // O tu librería de fechas preferida

const API_BASE_URL = config.API_BASE_URL; // Lee la variable desde el archivo

const UsuarioForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
	const [generalError, setGeneralError] = useState(null);
	const [fieldErrors, setFieldErrors] = useState({});
	const [relatedEntities, setRelatedEntities] = useState({});
	const [listaRelaciones, setListaRelaciones] = useState([]); 
	
	const CORREO_PATTERN = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

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
		let isValid = true;
		const errors = {};
		if (name === 'correo') {
		const regex = new RegExp(CORREO_PATTERN);
		isValid = regex.test(value);
		if (!isValid) {
			errors['correo'] = 'Formato inválido.';
		} else {
			errors['correo'] = '';
		}
		}
		setFieldErrors(errors);
		
        setFormData({ ...formData, [name]: value });
    };
	
	const handleVolver = () => {
        navigate(`/usuarios`);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();		
		let hasErrors = false;
		const errors = {};
		const dataToSend = { ...formData }; // Crear una copia de los datos
		
		if (!formData['nombre']) {
		  errors['nombre'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (!formData['correo']) {
		  errors['correo'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (formData['correo'] && !new RegExp(CORREO_PATTERN).test(formData['correo'])) {
		  errors['correo'] = 'Formato inválido.';
		  hasErrors = true;
		}
		if (!formData['contrasena']) {
		  errors['contrasena'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		
		setFieldErrors(errors);
		
		if (!hasErrors) {
			setLoading(true);
			try {
				let response;
				if (id) {
					response = await axios.put(API_BASE_URL + `/usuarios/` + id, dataToSend);
				} else {
					response = await axios.post(API_BASE_URL + `/usuarios`, dataToSend);
				}
				handleVolver(); // Redirigir a la grid después de guardar
			} catch (err) {
				setGeneralError(err);
			} finally {
				setLoading(false);
			}
		}
    };

    if (loading) return <div>Cargando...</div>;
    if (generalError) return <div>Error: {generalError.message}</div>;

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
							{fieldErrors['id'] && <p className="error-message">{fieldErrors['id']}</p>}
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
							{fieldErrors['nombre'] && <p className="error-message">{fieldErrors['nombre']}</p>}
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
								maxLength="255"								
                                
                                required
								pattern={CORREO_PATTERN}
                            />
							{fieldErrors['correo'] && <p className="error-message">{fieldErrors['correo']}</p>}
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
							{fieldErrors['contrasena'] && <p className="error-message">{fieldErrors['contrasena']}</p>}
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