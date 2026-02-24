import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteEvent, fetchEvents } from '../api/eventsApi';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await fetchEvents({ page, limit: 6, categoria, q: search });
      setEvents(response.data);
      setTotalPages(response.meta.totalPages || 1);
  setTotal(response.meta.total || 0);
    } catch (error) {
      setMessage(error.message);
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [page]);

  const handleFilter = () => {
    setPage(1);
    loadEvents();
  };

  const clearFilter = () => {
    setSearch('');
    setCategoria('');
    setPage(1);
    loadEvents();
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await deleteEvent(id);
      setMessage(response.message);
      setMessageType('success');
      await loadEvents();
    } catch (error) {
      setMessage(error.message);
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Eventos</h1>
          <p className="text-muted mb-0">Gestiona y filtra los eventos registrados.</p>
        </div>
        <Link className="btn btn-primary" to="/eventos/nuevo">
          Crear evento
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Total de eventos</p>
              <h3 className="fw-bold mb-0">{total}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Filtros activos</p>
              <h3 className="fw-bold mb-0">{search || categoria ? 'Sí' : 'No'}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Páginas</p>
              <h3 className="fw-bold mb-0">{totalPages}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-5">
              <label className="form-label">Buscar por título</label>
              <input className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Categoría</label>
              <input className="form-control" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
            </div>
            <div className="col-md-3 d-flex align-items-end gap-2">
              <button className="btn btn-outline-primary w-100" onClick={handleFilter}>
                Filtrar
              </button>
              <button className="btn btn-outline-secondary w-100" onClick={clearFilter}>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {message && <div className={`alert alert-${messageType}`}>{message}</div>}

      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status"></div>
          <div className="mt-2">Cargando eventos...</div>
        </div>
      )}

      {!loading && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Fecha</th>
                <th>Precio</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evento) => (
                <tr key={evento._id}>
                  <td>{evento.titulo}</td>
                  <td>{evento.categoria}</td>
                  <td>{new Date(evento.fecha).toLocaleDateString()}</td>
                  <td>€ {evento.precio.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${evento.esPublico ? 'bg-success' : 'bg-secondary'}`}>
                      {evento.esPublico ? 'Público' : 'Privado'}
                    </span>
                  </td>
                  <td className="text-end">
                    <Link className="btn btn-sm btn-outline-primary me-2" to={`/eventos/${evento._id}`}>
                      Ver
                    </Link>
                    <Link className="btn btn-sm btn-outline-secondary me-2" to={`/eventos/${evento._id}/editar`}>
                      Editar
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(evento._id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No hay eventos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <nav className="d-flex justify-content-between align-items-center">
        <button className="btn btn-outline-secondary" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page <= 1}>
          Anterior
        </button>
        <span className="text-muted">Página {page} de {totalPages}</span>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page >= totalPages}
        >
          Siguiente
        </button>
      </nav>
    </div>
  );
};

export default EventsList;
