import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../FormStyles.css'; // Importa los estilos del formulario
import config from '../../config/config.json'; // Importa el archivo de configuración
import { format } from 'date-fns'; // O tu librería de fechas preferida

const API_BASE_URL = config.API_BASE_URL; // Lee la variable desde el archivo

const ProcesoForm = () => {
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
                    const response = await axios.get(API_BASE_URL + `/procesos/` + id);
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
        const relacionesDesdeBackend = [{"tipo":"ManyToOne","entidadRelacionada":"Empresa","nombreAtributo":"empresaId"},{"tipo":"ManyToOne","entidadRelacionada":"Usuario","nombreAtributo":"responsableId"}];
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
        navigate(`/procesos`);
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
		if (!formData['descripcion']) {
		  errors['descripcion'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (!formData['codigoProceso']) {
		  errors['codigoProceso'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (!formData['responsableId']) {
		  errors['responsableId'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (!formData['createdAt']) {
		  errors['createdAt'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (formData['createdAt']) {
		  try {
			const formattedDate = format(new Date(formData['createdAt']), 'yyyy-MM-dd HH:mm:ss');
			dataToSend['createdAt'] = formattedDate;
		  } catch (error) {
			errors['createdAt'] = 'Formato de fecha inválido.';
			hasErrors = true;
		  }
		}
		if (!formData['updatedAt']) {
		  errors['updatedAt'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (formData['updatedAt']) {
		  try {
			const formattedDate = format(new Date(formData['updatedAt']), 'yyyy-MM-dd HH:mm:ss');
			dataToSend['updatedAt'] = formattedDate;
		  } catch (error) {
			errors['updatedAt'] = 'Formato de fecha inválido.';
			hasErrors = true;
		  }
		}
		if (!formData['empresaId']) {
		  errors['empresaId'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		
		setFieldErrors(errors);
		
		if (!hasErrors) {
			setLoading(true);
			try {
				let response;
				if (id) {
					response = await axios.put(API_BASE_URL + `/procesos/` + id, dataToSend);
				} else {
					response = await axios.post(API_BASE_URL + `/procesos`, dataToSend);
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
            <h2>{id ? 'Editar Proceso' : 'Agregar Nuevo Proceso'}</h2>
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
						<label htmlFor="descripcion">
							Descripcion:
						</label>
                            <input
                                type="text"
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion || ''}
                                onChange={handleChange}
																
                                
                                required
								
                            />
							{fieldErrors['descripcion'] && <p className="error-message">{fieldErrors['descripcion']}</p>}
                </div>
                <div className="form-group">
						<label htmlFor="codigoProceso">
							Codigoproceso:
						</label>
                            <input
                                type="text"
                                id="codigoProceso"
                                name="codigoProceso"
                                value={formData.codigoProceso || ''}
                                onChange={handleChange}
																
                                
                                required
								
                            />
							{fieldErrors['codigoProceso'] && <p className="error-message">{fieldErrors['codigoProceso']}</p>}
                </div>
                <div className="form-group">
                                <label htmlFor="responsableId">								
									Responsable del Proceso:
								</label>
                                <select
                                    id="responsableId"
                                    name="responsableId"
                                    value={formData.responsableId || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar Usuario</option>
                                    {relatedEntities['responsableId'] && relatedEntities['responsableId'].map(related => (
                                        <option key={related.id} value={related.id}>
                                            {related.nombre ? related.nombre : related.id}
                                        </option>
                                    ))}
                                </select>
                </div>
                <div className="form-group">
						<label htmlFor="createdAt">
							Createdat:
						</label>
                            <input
                                type="date"
                                id="createdAt"
                                name="createdAt"
                                value={formData.createdAt || ''}
                                onChange={handleChange}
																
                                
                                required
								
                            />
							{fieldErrors['createdAt'] && <p className="error-message">{fieldErrors['createdAt']}</p>}
                </div>
                <div className="form-group">
						<label htmlFor="updatedAt">
							Updatedat:
						</label>
                            <input
                                type="date"
                                id="updatedAt"
                                name="updatedAt"
                                value={formData.updatedAt || ''}
                                onChange={handleChange}
																
                                
                                required
								
                            />
							{fieldErrors['updatedAt'] && <p className="error-message">{fieldErrors['updatedAt']}</p>}
                </div>
                <div className="form-group">
                                <label htmlFor="empresaId">								
									Empresa:
								</label>
                                <select
                                    id="empresaId"
                                    name="empresaId"
                                    value={formData.empresaId || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar Empresa</option>
                                    {relatedEntities['empresaId'] && relatedEntities['empresaId'].map(related => (
                                        <option key={related.id} value={related.id}>
                                            {related.nombre ? related.nombre : related.id}
                                        </option>
                                    ))}
                                </select>
                </div>
                <div className="form-actions">
                    <button type="submit" className="save">{id ? 'Guardar Cambios' : 'Crear Proceso'}</button>
                    <button type="button" className="cancel" onClick={handleVolver}>Volver</button>
                </div>
            </form>
        </div>
    );
};

export default ProcesoForm;