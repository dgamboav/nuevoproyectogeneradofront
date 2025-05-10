import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../FormStyles.css'; // Importa los estilos del formulario
import config from '../../config/config.json'; // Importa el archivo de configuración

const API_BASE_URL = config.API_BASE_URL; // Lee la variable desde el archivo

const ObjecionForm = () => {
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
                    const response = await axios.get(API_BASE_URL + `/objecions/` + id);
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
        navigate(`/objecions`);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            let response;
            if (id) {
                response = await axios.put(API_BASE_URL + `/objecions/` + id, formData);
            } else {
                response = await axios.post(API_BASE_URL + `/objecions`, formData);
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
            <h2>{id ? 'Editar Objecion' : 'Agregar Nuevo Objecion'}</h2>
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
						<label htmlFor="fechaCreacion">
							Fecha Creación:
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
						<label htmlFor="periodoConstitucional">
							Periodo Constitucional:
						</label>
                            <input
                                type="text"
                                id="periodoConstitucional"
                                name="periodoConstitucional"
                                value={formData.periodoConstitucional || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="periodoLegislativo">
							Periodo Legislativo:
						</label>
                            <input
                                type="text"
                                id="periodoLegislativo"
                                name="periodoLegislativo"
                                value={formData.periodoLegislativo || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="numeroProyecto">
							Numero de Proyecto:
						</label>
                            <input
                                type="number"
                                id="numeroProyecto"
                                name="numeroProyecto"
                                value={formData.numeroProyecto || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="titulo">
							Titulo:
						</label>
                            <input
                                type="text"
                                id="titulo"
                                name="titulo"
                                value={formData.titulo || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="prohija">
							Prohija:
						</label>
                            <input
                                type="text"
                                id="prohija"
                                name="prohija"
                                value={formData.prohija || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="fechaDeLaNota">
							Fecha de la nota:
						</label>
                            <input
                                type="date"
                                id="fechaDeLaNota"
                                name="fechaDeLaNota"
                                value={formData.fechaDeLaNota || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
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
                </div>
                <div className="form-group">
						<label htmlFor="motivo">
							Motivo:
						</label>
                            <input
                                type="text"
                                id="motivo"
                                name="motivo"
                                value={formData.motivo || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="informeDeGobierno">
							Informe de Gobierno:
						</label>
                            <input
                                type="text"
                                id="informeDeGobierno"
                                name="informeDeGobierno"
                                value={formData.informeDeGobierno || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="informeDeTrabajo">
							Informe de Trabajo:
						</label>
                            <input
                                type="text"
                                id="informeDeTrabajo"
                                name="informeDeTrabajo"
                                value={formData.informeDeTrabajo || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="segundoDebate">
							Segundo Debate:
						</label>
                            <input
                                type="text"
                                id="segundoDebate"
                                name="segundoDebate"
                                value={formData.segundoDebate || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="tercerDebate">
							Tercer Debate:
						</label>
                            <input
                                type="text"
                                id="tercerDebate"
                                name="tercerDebate"
                                value={formData.tercerDebate || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="insistencia">
							Insistencia:
						</label>
                            <input
                                type="text"
                                id="insistencia"
                                name="insistencia"
                                value={formData.insistencia || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="pdfNroLey">
							PDF Numero de Ley:
						</label>
                            <input
                                type="text"
                                id="pdfNroLey"
                                name="pdfNroLey"
                                value={formData.pdfNroLey || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="publicado">
							Publicado:
						</label>
                            <input
                                type="date"
                                id="publicado"
                                name="publicado"
                                value={formData.publicado || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="gaceta">
							Gaceta:
						</label>
                            <input
                                type="text"
                                id="gaceta"
                                name="gaceta"
                                value={formData.gaceta || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-group">
						<label htmlFor="comentario">
							Comentario:
						</label>
                            <input
                                type="text"
                                id="comentario"
                                name="comentario"
                                value={formData.comentario || ''}
                                onChange={handleChange}
																
                                
                                required
                            />
                </div>
                <div className="form-actions">
                    <button type="submit" className="save">{id ? 'Guardar Cambios' : 'Crear Objecion'}</button>
                    <button type="button" className="cancel" onClick={handleVolver}>Volver</button>
                </div>
            </form>
        </div>
    );
};

export default ObjecionForm;