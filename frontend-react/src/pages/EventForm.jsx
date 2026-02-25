import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createEvent, fetchEvent, updateEvent } from '../api/eventsApi';

const initialForm = {
  titulo: '',
  descripcion: '',
  categoria: '',
  ubicacion: '',
  precio: 0,
  fecha: '',
  esPublico: true
};

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [messageDetails, setMessageDetails] = useState([]);

  const isEdit = Boolean(id);

  useEffect(() => {
    if (!isEdit) return;

    const loadEvent = async () => {
      setLoading(true);
      try {
        const response = await fetchEvent(id);
        setForm({
          ...response.data,
          fecha: response.data.fecha?.slice(0, 10)
        });
      } catch (error) {
        setMessage(error.message);
        setMessageType('danger');
        setMessageDetails(error.errors || []);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, isEdit]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateEvent(id, form);
      } else {
        await createEvent(form);
      }
      navigate('/eventos');
    } catch (error) {
      setMessage(error.message);
      setMessageType('danger');
      setMessageDetails(error.errors || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link className="btn btn-link mb-3" to="/eventos">
        ← Volver
      </Link>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h4 mb-3">{isEdit ? 'Editar evento' : 'Crear evento'}</h2>

          {message && (
            <div className={`alert alert-${messageType}`}>
              <div>{message}</div>
              {messageDetails.length > 0 && (
                <ul className="mb-0 mt-2">
                  {messageDetails.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label">Título</label>
              <input className="form-control" name="titulo" value={form.titulo} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Categoría</label>
              <input className="form-control" name="categoria" value={form.categoria} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                name="descripcion"
                rows="3"
                value={form.descripcion}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="col-md-6">
              <label className="form-label">Ubicación</label>
              <input className="form-control" name="ubicacion" value={form.ubicacion} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <label className="form-label">Precio (€)</label>
              <input
                type="number"
                className="form-control"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                min="0"
                max="10000"
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Fecha</label>
              <input type="date" className="form-control" name="fecha" value={form.fecha} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">¿Es público?</label>
              <select className="form-select" name="esPublico" value={form.esPublico ? 'true' : 'false'} onChange={handleChange}>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="col-12">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
