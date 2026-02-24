import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchEvent } from '../api/eventsApi';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      try {
        const response = await fetchEvent(id);
        setEvent(response.data);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  return (
    <div>
      <Link className="btn btn-link mb-3" to="/eventos">
        ← Volver
      </Link>

      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status"></div>
          <div className="mt-2">Cargando evento...</div>
        </div>
      )}

      {message && <div className="alert alert-danger">{message}</div>}

      {event && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h4 mb-2">{event.titulo}</h2>
            <p className="text-muted">{event.descripcion}</p>

            <div className="row g-3">
              <div className="col-md-6">
                <strong>Categoría:</strong> {event.categoria}
              </div>
              <div className="col-md-6">
                <strong>Ubicación:</strong> {event.ubicacion}
              </div>
              <div className="col-md-6">
                <strong>Fecha:</strong> {new Date(event.fecha).toLocaleDateString()}
              </div>
              <div className="col-md-6">
                <strong>Precio:</strong> € {event.precio.toFixed(2)}
              </div>
              <div className="col-md-6">
                <strong>Estado:</strong>{' '}
                <span className={`badge ${event.esPublico ? 'bg-success' : 'bg-secondary'}`}>
                  {event.esPublico ? 'Público' : 'Privado'}
                </span>
              </div>
            </div>

            <div className="mt-4 d-flex gap-2">
              <Link className="btn btn-outline-secondary" to={`/eventos/${event._id}/editar`}>
                Editar
              </Link>
              <Link className="btn btn-primary" to="/eventos">
                Ver todos
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
