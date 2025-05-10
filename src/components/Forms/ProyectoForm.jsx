import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../FormStyles.css'; // Importa los estilos del formulario
import config from '../../config/config.json'; // Importa el archivo de configuración

const API_BASE_URL = config.API_BASE_URL; // Lee la variable desde el archivo

const ProyectoForm = () => {
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
                    const response = await axios.get(API_BASE_URL + `/proyectos/` + id);
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
        const relacionesDesdeBackend = [{"tipo":"ManyToOne","entidadRelacionada":"Empleado","nombreAtributo":"empleadoId"}];
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
        navigate(`/proyectos`);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            let response;
            if (id) {
                response = await axios.put(API_BASE_URL + `/proyectos/` + id, formData);
            } else {
                response = await axios.post(API_BASE_URL + `/proyectos`, formData);
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
            <h2>{id ? 'Editar Proyecto' : 'Agregar Nuevo Proyecto'}</h2>
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
						<label htmlFor="clienteId">
							Cliente:
						</label>
                            <input
                                type="number"
                                id="clienteId"
                                name="clienteId"
                                value={formData.clienteId || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
                                <label htmlFor="empleadoId">								
									Empleado:
								</label>
                                <select
                                    id="empleadoId"
                                    name="empleadoId"
                                    value={formData.empleadoId || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar Empleado</option>
                                    {relatedEntities['empleadoId'] && relatedEntities['empleadoId'].map(related => (
                                        <option key={related.id} value={related.id}>
                                            {related.nombre ? related.nombre : related.id}
                                        </option>
                                    ))}
                                </select>
                </div>
                <div className="form-group">
						<label htmlFor="fechaCreacion">
							Fechacreacion:
						</label>
                            <input
                                type="date"
                                id="fechaCreacion"
                                name="fechaCreacion"
                                value={formData.fechaCreacion || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="costo">
							Costo:
						</label>
                            <input
                                type="number"
                                id="costo"
                                name="costo"
                                value={formData.costo || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-actions">
                    <button type="submit" className="save">{id ? 'Guardar Cambios' : 'Crear Proyecto'}</button>
                    <button type="button" className="cancel" onClick={handleVolver}>Volver</button>
                </div>
            </form>
        </div>
    );
};

export default ProyectoForm;