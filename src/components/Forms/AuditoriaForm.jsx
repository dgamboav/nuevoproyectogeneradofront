import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../FormStyles.css'; // Importa los estilos del formulario
import config from '../../config/config.json'; // Importa el archivo de configuración
import { format } from 'date-fns'; // O tu librería de fechas preferida

const API_BASE_URL = config.API_BASE_URL; // Lee la variable desde el archivo

const AuditoriaForm = () => {
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
                    const response = await axios.get(API_BASE_URL + `/auditorias/` + id);
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
        const relacionesDesdeBackend = [{"tipo":"ManyToOne","entidadRelacionada":"Usuario","nombreAtributo":"auditorLiderId"}];
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
        navigate(`/auditorias`);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();		
		let hasErrors = false;
		const errors = {};
		const dataToSend = { ...formData }; // Crear una copia de los datos
		
		if (!formData['fechaInicio']) {
		  errors['fechaInicio'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (formData['fechaInicio']) {
		  try {
			const formattedDate = format(new Date(formData['fechaInicio']), 'yyyy-MM-dd');
			dataToSend['fechaInicio'] = formattedDate;
		  } catch (error) {
			errors['fechaInicio'] = 'Formato de fecha inválido.';
			hasErrors = true;
		  }
		}
		if (!formData['fechaFin']) {
		  errors['fechaFin'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (formData['fechaFin']) {
		  try {
			const formattedDate = format(new Date(formData['fechaFin']), 'yyyy-MM-dd');
			dataToSend['fechaFin'] = formattedDate;
		  } catch (error) {
			errors['fechaFin'] = 'Formato de fecha inválido.';
			hasErrors = true;
		  }
		}
		if (!formData['tipoAuditoria']) {
		  errors['tipoAuditoria'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (!formData['auditorLiderId']) {
		  errors['auditorLiderId'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (!formData['objetivo']) {
		  errors['objetivo'] = 'Este campo es requerido.';
		  hasErrors = true;
		}
		if (!formData['alcance']) {
		  errors['alcance'] = 'Este campo es requerido.';
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
		
		setFieldErrors(errors);
		
		if (!hasErrors) {
			setLoading(true);
			try {
				let response;
				if (id) {
					response = await axios.put(API_BASE_URL + `/auditorias/` + id, dataToSend);
				} else {
					response = await axios.post(API_BASE_URL + `/auditorias`, dataToSend);
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
            <h2>{id ? 'Editar Auditoria' : 'Agregar Nuevo Auditoria'}</h2>
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
						<label htmlFor="fechaInicio">
							Fechainicio:
						</label>
                            <input
                                type="date"
                                id="fechaInicio"
                                name="fechaInicio"
                                value={formData.fechaInicio || ''}
                                onChange={handleChange}
																
                                
                                required
								
                            />
							{fieldErrors['fechaInicio'] && <p className="error-message">{fieldErrors['fechaInicio']}</p>}
                </div>
                <div className="form-group">
						<label htmlFor="fechaFin">
							Fechafin:
						</label>
                            <input
                                type="date"
                                id="fechaFin"
                                name="fechaFin"
                                value={formData.fechaFin || ''}
                                onChange={handleChange}
																
                                
                                required
								
                            />
							{fieldErrors['fechaFin'] && <p className="error-message">{fieldErrors['fechaFin']}</p>}
                </div>
                <div className="form-group">
						<label htmlFor="tipoAuditoria">
							Tipoauditoria:
						</label>
                            <input
                                type="text"
                                id="tipoAuditoria"
                                name="tipoAuditoria"
                                value={formData.tipoAuditoria || ''}
                                onChange={handleChange}
																
                                
                                required
								
                            />
							{fieldErrors['tipoAuditoria'] && <p className="error-message">{fieldErrors['tipoAuditoria']}</p>}
                </div>
                <div className="form-group">
                                <label htmlFor="auditorLiderId">								
									Auditor Líder:
								</label>
                                <select
                                    id="auditorLiderId"
                                    name="auditorLiderId"
                                    value={formData.auditorLiderId || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar Usuario</option>
                                    {relatedEntities['auditorLiderId'] && relatedEntities['auditorLiderId'].map(related => (
                                        <option key={related.id} value={related.id}>
                                            {related.nombre ? related.nombre : related.id}
                                        </option>
                                    ))}
                                </select>
                </div>
                <div className="form-group">
						<label htmlFor="objetivo">
							Objetivo:
						</label>
                            <input
                                type="text"
                                id="objetivo"
                                name="objetivo"
                                value={formData.objetivo || ''}
                                onChange={handleChange}
																
                                
                                required
								
                            />
							{fieldErrors['objetivo'] && <p className="error-message">{fieldErrors['objetivo']}</p>}
                </div>
                <div className="form-group">
						<label htmlFor="alcance">
							Alcance:
						</label>
                            <input
                                type="text"
                                id="alcance"
                                name="alcance"
                                value={formData.alcance || ''}
                                onChange={handleChange}
																
                                
                                required
								
                            />
							{fieldErrors['alcance'] && <p className="error-message">{fieldErrors['alcance']}</p>}
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
                <div className="form-actions">
                    <button type="submit" className="save">{id ? 'Guardar Cambios' : 'Crear Auditoria'}</button>
                    <button type="button" className="cancel" onClick={handleVolver}>Volver</button>
                </div>
            </form>
        </div>
    );
};

export default AuditoriaForm;