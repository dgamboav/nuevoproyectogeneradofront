import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../GridStyles.css'; // Importa los estilos de la grid
import config from '../../config/config.json'; // Importa el archivo de configuración

const API_BASE_URL = config.API_BASE_URL; // Lee la variable desde el archivo

const ProcesoGrid = () => {

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

            const response = await axios.get(API_BASE_URL + `/procesos?`+ params.toString());
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
                await axios.delete(API_BASE_URL + `/procesos/` + id);
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

    if (loading) return <div>Cargando Proceso...</div>;
    if (error) return <div>Error al cargar Proceso: {error.message}</div>;

    return (
        <div className="grid-container">
			<div className="grid-header">
				<h2>Proceso</h2>
				<Link to="/Procesos/add" className="add-new-button" >Agregar Nuevo Proceso + </Link>
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
							<label htmlFor="nombre">
								Nombre:
							</label>
							<input
								type="text"
								id="nombre"
								name="nombre"
								value={localFilters['nombre'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="descripcion">
								Descripcion:
							</label>
							<input
								type="text"
								id="descripcion"
								name="descripcion"
								value={localFilters['descripcion'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="codigoProceso">
								Codigoproceso:
							</label>
							<input
								type="text"
								id="codigoProceso"
								name="codigoProceso"
								value={localFilters['codigoProceso'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="responsableId">
								Responsable del Proceso:
							</label>
							<input
								type="number"
								id="responsableId"
								name="responsableId"
								value={localFilters['responsableId'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="createdAt">
								Createdat:
							</label>
							<input
								type="date"
								id="createdAt"
								name="createdAt"
								value={localFilters['createdAt'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="updatedAt">
								Updatedat:
							</label>
							<input
								type="date"
								id="updatedAt"
								name="updatedAt"
								value={localFilters['updatedAt'] || ''}
								onChange={handleLocalFilterChange}							
							/>
						</div>
						<div>
							<label htmlFor="empresaId">
								Empresa:
							</label>
							<input
								type="number"
								id="empresaId"
								name="empresaId"
								value={localFilters['empresaId'] || ''}
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
							<th>Nombre</th>
							<th>Descripción</th>
							<th>Código de Proceso</th>
							<th>ID Responsable</th>
							<th>Creado En</th>
							<th>Actualizado En</th>
							<th>ID Empresa</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td>{item['id']}</td>
                            <td>{item['nombre']}</td>
                            <td>{item['descripcion']}</td>
                            <td>{item['codigoProceso']}</td>
                            <td>{item['responsableId']}</td>
                            <td>{item['createdAt']}</td>
                            <td>{item['updatedAt']}</td>
                            <td>{item['empresaId']}</td>
                            <td className="grid-actions">
                                <Link to={"/Procesos/edit/" + item.id }>Editar</Link>
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

export default ProcesoGrid;