import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../FormStyles.css'; // Importa los estilos del formulario
import config from '../../config/config.json'; // Importa el archivo de configuración
import { format } from 'date-fns'; // O tu librería de fechas preferida

const API_BASE_URL = config.API_BASE_URL; // Lee la variable desde el archivo

const EmpleadoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
	const [generalError, setGeneralError] = useState(null);
	const [fieldErrors, setFieldErrors] = useState({});
	const [relatedEntities, setRelatedEntities] = useState({});
	const [listaRelaciones, setListaRelaciones] = useState([]); 
	

    useEffect(() => {
        if (id) {
            const fetchEntity = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(API_BASE_URL + `/empleados/` + id);
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
		setFieldErrors(errors);
		
        setFormData({ ...formData, [name]: value });
    };
	
	const handleVolver = () => {
        navigate(`/empleados`);
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
		if (!formData['departamento']) {
		  errors['departamento'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (!formData['salario']) {
		  errors['salario'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		
		setFieldErrors(errors);
		
		if (!hasErrors) {
			setLoading(true);
			try {
				let response;
				if (id) {
					response = await axios.put(API_BASE_URL + `/empleados/` + id, dataToSend);
				} else {
					response = await axios.post(API_BASE_URL + `/empleados`, dataToSend);
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
            <h2>{id ? 'Editar Empleado' : 'Agregar Nuevo Empleado'}</h2>
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
						<label htmlFor="departamento">
							Departamento:
						</label>
                            <input
                                type="text"
                                id="departamento"
                                name="departamento"
                                value={formData.departamento || ''}
                                onChange={handleChange}
																
                                
                                required
								
                            />
							{fieldErrors['departamento'] && <p className="error-message">{fieldErrors['departamento']}</p>}
                </div>
                <div className="form-group">
						<label htmlFor="salario">
							Salario:
						</label>
                            <input
                                type="number"
                                id="salario"
                                name="salario"
                                value={formData.salario || ''}
                                onChange={handleChange}
								maxLength="10"								
                                
                                required
								
                            />
							{fieldErrors['salario'] && <p className="error-message">{fieldErrors['salario']}</p>}
                </div>
                <div className="form-actions">
                    <button type="submit" className="save">{id ? 'Guardar Cambios' : 'Crear Empleado'}</button>
                    <button type="button" className="cancel" onClick={handleVolver}>Volver</button>
                </div>
            </form>
        </div>
    );
};

export default EmpleadoForm;