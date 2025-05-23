import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../FormStyles.css'; // Importa los estilos del formulario
import config from '../../config/config.json'; // Importa el archivo de configuración
import { format } from 'date-fns'; // O tu librería de fechas preferida

const API_BASE_URL = config.API_BASE_URL; // Lee la variable desde el archivo

const NoConformidadForm = () => {
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
                    const response = await axios.get(API_BASE_URL + `/noconformidads/` + id);
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
        const relacionesDesdeBackend = [{"tipo":"ManyToOne","entidadRelacionada":"Auditoria","nombreAtributo":"auditoriaId"},{"tipo":"ManyToOne","entidadRelacionada":"Proceso","nombreAtributo":"procesoId"},{"tipo":"ManyToOne","entidadRelacionada":"Usuario","nombreAtributo":"responsableId"}];
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
        navigate(`/noconformidads`);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();		
		let hasErrors = false;
		const errors = {};
		const dataToSend = { ...formData }; // Crear una copia de los datos
		
		if (!formData['descripcion']) {
		  errors['descripcion'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (!formData['causaRaiz']) {
		  errors['causaRaiz'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (!formData['clasificacion']) {
		  errors['clasificacion'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (!formData['fechaDeteccion']) {
		  errors['fechaDeteccion'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (formData['fechaDeteccion']) {
		  try {
			const formattedDate = format(new Date(formData['fechaDeteccion']), 'yyyy-MM-dd');
			dataToSend['fechaDeteccion'] = formattedDate;
		  } catch (error) {
			errors['fechaDeteccion'] = 'Formato de fecha inválido.';
			hasErrors = true;
		  }
		}
		if (!formData['responsableId']) {
		  errors['responsableId'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (!formData['estado']) {
		  errors['estado'] = 'Este campo es requerido.';
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
		if (!formData['auditoriaId']) {
		  errors['auditoriaId'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (!formData['procesoId']) {
		  errors['procesoId'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		
		setFieldErrors(errors);
		
		if (!hasErrors) {
			setLoading(true);
			try {
				let response;
				if (id) {
					response = await axios.put(API_BASE_URL + `/noconformidads/` + id, dataToSend);
				} else {
					response = await axios.post(API_BASE_URL + `/noconformidads`, dataToSend);
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
            <h2>{id ? 'Editar NoConformidad' : 'Agregar Nuevo NoConformidad'}</h2>
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
						<label htmlFor="causaRaiz">
							Causaraiz:
						</label>
                            <input
                                type="text"
                                id="causaRaiz"
                                name="causaRaiz"
                                value={formData.causaRaiz || ''}
                                onChange={handleChange}
																
                                
                                required
								
                            />
							{fieldErrors['causaRaiz'] && <p className="error-message">{fieldErrors['causaRaiz']}</p>}
                </div>
                <div className="form-group">
						<label htmlFor="clasificacion">
							Clasificacion:
						</label>
                            <input
                                type="text"
                                id="clasificacion"
                                name="clasificacion"
                                value={formData.clasificacion || ''}
                                onChange={handleChange}
																
                                
                                required
								
                            />
							{fieldErrors['clasificacion'] && <p className="error-message">{fieldErrors['clasificacion']}</p>}
                </div>
                <div className="form-group">
						<label htmlFor="fechaDeteccion">
							Fechadeteccion:
						</label>
                            <input
                                type="date"
                                id="fechaDeteccion"
                                name="fechaDeteccion"
                                value={formData.fechaDeteccion || ''}
                                onChange={handleChange}
																
                                
                                required
								
                            />
							{fieldErrors['fechaDeteccion'] && <p className="error-message">{fieldErrors['fechaDeteccion']}</p>}
                </div>
                <div className="form-group">
                                <label htmlFor="responsableId">								
									Responsable:
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
						<label htmlFor="estado">
							Estado:
						</label>
                            <input
                                type="text"
                                id="estado"
                                name="estado"
                                value={formData.estado || ''}
                                onChange={handleChange}
																
                                
                                required
								
                            />
							{fieldErrors['estado'] && <p className="error-message">{fieldErrors['estado']}</p>}
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
                                <label htmlFor="auditoriaId">								
									Auditoría:
								</label>
                                <select
                                    id="auditoriaId"
                                    name="auditoriaId"
                                    value={formData.auditoriaId || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar Auditoria</option>
                                    {relatedEntities['auditoriaId'] && relatedEntities['auditoriaId'].map(related => (
                                        <option key={related.id} value={related.id}>
                                            {related.nombre ? related.nombre : related.id}
                                        </option>
                                    ))}
                                </select>
                </div>
                <div className="form-group">
                                <label htmlFor="procesoId">								
									Proceso:
								</label>
                                <select
                                    id="procesoId"
                                    name="procesoId"
                                    value={formData.procesoId || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar Proceso</option>
                                    {relatedEntities['procesoId'] && relatedEntities['procesoId'].map(related => (
                                        <option key={related.id} value={related.id}>
                                            {related.nombre ? related.nombre : related.id}
                                        </option>
                                    ))}
                                </select>
                </div>
                <div className="form-actions">
                    <button type="submit" className="save">{id ? 'Guardar Cambios' : 'Crear NoConformidad'}</button>
                    <button type="button" className="cancel" onClick={handleVolver}>Volver</button>
                </div>
            </form>
        </div>
    );
};

export default NoConformidadForm;