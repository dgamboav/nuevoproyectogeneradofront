import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../GridStyles.css'; // Importa los estilos de la grid
import config from '../../config/config.json'; // Importa el archivo de configuración

const API_BASE_URL = config.API_BASE_URL; // Lee la variable desde el archivo

const ObjecionGrid = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({});
	const [localFilters, setLocalFilters] = useState({});
	const [showFilters, setShowFilters] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('size', size);
            for (const key in filters) {
                if (filters[key]) {
                    params.append(key, filters[key]);
                }
            }

            const response = await axios.get(API_BASE_URL + `/objecions?`+ params.toString());
            setData(response.data.content);
            setTotalElements(response.data.page.totalElements);
            setTotalPages(response.data.page.totalPages);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [page, size, filters]);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este registro?')) {
            try {
                await axios.delete(API_BASE_URL + `/objecions/` + id);
                fetchData(); // Recargar datos
            } catch (err) {
                console.error('Error al eliminar:', err);
                alert('Error al eliminar.');
            }
        }
    };
	
	const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSizeChange = (newSize) => {
        setSize(newSize);
        setPage(0); // Reset to the first page when size changes
    };

    const handleLocalFilterChange = (event) => {
        const { name, value } = event.target;
        setLocalFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };
	
	
	const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleApplyFilters = () => {
        setFilters(localFilters); // Cuando se aplica el filtro, los valores locales se pasan al estado de filtros para la consulta
        setPage(0); // Reset to the first page when applying filters
    };

    const handleClearFilters = () => {
        setLocalFilters({}); // Limpiar los valores locales de los filtros
        setFilters({}); // Limpiar los filtros aplicados
        setPage(0); // Reset to the first page after clearing filters
    };

    if (loading) return <div>Cargando Objecion...</div>;
    if (error) return <div>Error al cargar Objecion: {error.message}</div>;

    return (
        <div className="grid-container">
			<div className="grid-header">
				<h2>Objecion</h2>
				<Link to="/Objecions/add" className="add-new-button" >Agregar Nuevo Objecion + </Link>
			</div>
			
			{/* Botón para mostrar/ocultar filtros */}
			<button className="toggle-filters-button" onClick={toggleFilters}>
				{showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
			</button>

			{/* Filtros de Búsqueda (condicionalmente renderizado) */}
			{showFilters && (
				<div className="grid-filters">
					<h3>Filtrar</h3>
						<div>
							<label htmlFor="id">
								Id:
							</label>
							<input
								type="number"
								id="id"
								name="id"
								value={localFilters['id'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="fechaCreacion">
								Fecha Creación:
							</label>
							<input
								type="date"
								id="fechaCreacion"
								name="fechaCreacion"
								value={localFilters['fechaCreacion'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="periodoConstitucional">
								Periodo Constitucional:
							</label>
							<input
								type="text"
								id="periodoConstitucional"
								name="periodoConstitucional"
								value={localFilters['periodoConstitucional'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="periodoLegislativo">
								Periodo Legislativo:
							</label>
							<input
								type="text"
								id="periodoLegislativo"
								name="periodoLegislativo"
								value={localFilters['periodoLegislativo'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="numeroProyecto">
								Numero de Proyecto:
							</label>
							<input
								type="number"
								id="numeroProyecto"
								name="numeroProyecto"
								value={localFilters['numeroProyecto'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="titulo">
								Titulo:
							</label>
							<input
								type="text"
								id="titulo"
								name="titulo"
								value={localFilters['titulo'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="prohija">
								Prohija:
							</label>
							<input
								type="text"
								id="prohija"
								name="prohija"
								value={localFilters['prohija'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="fechaDeLaNota">
								Fecha de la nota:
							</label>
							<input
								type="date"
								id="fechaDeLaNota"
								name="fechaDeLaNota"
								value={localFilters['fechaDeLaNota'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="alcance">
								Alcance:
							</label>
							<input
								type="text"
								id="alcance"
								name="alcance"
								value={localFilters['alcance'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="motivo">
								Motivo:
							</label>
							<input
								type="text"
								id="motivo"
								name="motivo"
								value={localFilters['motivo'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="informeDeGobierno">
								Informe de Gobierno:
							</label>
							<input
								type="text"
								id="informeDeGobierno"
								name="informeDeGobierno"
								value={localFilters['informeDeGobierno'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="informeDeTrabajo">
								Informe de Trabajo:
							</label>
							<input
								type="text"
								id="informeDeTrabajo"
								name="informeDeTrabajo"
								value={localFilters['informeDeTrabajo'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="segundoDebate">
								Segundo Debate:
							</label>
							<input
								type="text"
								id="segundoDebate"
								name="segundoDebate"
								value={localFilters['segundoDebate'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="tercerDebate">
								Tercer Debate:
							</label>
							<input
								type="text"
								id="tercerDebate"
								name="tercerDebate"
								value={localFilters['tercerDebate'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="insistencia">
								Insistencia:
							</label>
							<input
								type="text"
								id="insistencia"
								name="insistencia"
								value={localFilters['insistencia'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="pdfNroLey">
								PDF Numero de Ley:
							</label>
							<input
								type="text"
								id="pdfNroLey"
								name="pdfNroLey"
								value={localFilters['pdfNroLey'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="publicado">
								Publicado:
							</label>
							<input
								type="date"
								id="publicado"
								name="publicado"
								value={localFilters['publicado'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="gaceta">
								Gaceta:
							</label>
							<input
								type="text"
								id="gaceta"
								name="gaceta"
								value={localFilters['gaceta'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="comentario">
								Comentario:
							</label>
							<input
								type="text"
								id="comentario"
								name="comentario"
								value={localFilters['comentario'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
					<div className="filter-actions">
						<button onClick={handleApplyFilters}>Aplicar Filtros</button>
						<button onClick={handleClearFilters}>Limpiar Filtros</button>
					</div>
				</div>
			)}
			
            <table className="grid-table">
                <thead>
                    <tr>
							<th>ID</th>
							<th>Titulo</th>
							<th>Informe de Gobierno</th>
							<th>Informe de Trabajo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td>{item['id']}</td>
                            <td>{item['titulo']}</td>
                            <td>{item['informeDeGobierno']}</td>
                            <td>{item['informeDeTrabajo']}</td>
                            <td className="grid-actions">
                                <Link to={"/Objecions/edit/" + item.id }>Editar</Link>
                                <button className="delete" onClick={() => handleDelete(item.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
			
            <div className="grid-pagination">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                    Anterior
                </button>
                <span>Página {page + 1} de {totalPages}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1}>
                    Siguiente
                </button>
                <div>
                    <label htmlFor="size">Elementos por página:</label>
                    <select id="size" value={size} onChange={(e) => handleSizeChange(parseInt(e.target.value))}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
                <span>Total de elementos: {totalElements}</span>
            </div>
			
        </div>
    );
};

export default ObjecionGrid;