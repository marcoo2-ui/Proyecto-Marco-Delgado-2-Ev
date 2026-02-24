import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import EventsList from './pages/EventsList';
import EventDetail from './pages/EventDetail';
import EventForm from './pages/EventForm';

const App = () => (
  <div>
    <Navbar />
    <main className="container py-4">
      <div className="bg-white border rounded-4 shadow-sm p-4 mb-4">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-2">
          <div>
            <h1 className="h4 fw-bold mb-1">Panel de gestión de eventos</h1>
            <p className="text-muted mb-0">Controla, filtra y actualiza todos los eventos en un solo lugar.</p>
          </div>
          <span className="badge text-bg-primary px-3 py-2">Última actualización en tiempo real</span>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/eventos" replace />} />
        <Route path="/eventos" element={<EventsList />} />
        <Route path="/eventos/nuevo" element={<EventForm />} />
        <Route path="/eventos/:id/editar" element={<EventForm />} />
        <Route path="/eventos/:id" element={<EventDetail />} />
        <Route path="*" element={<Navigate to="/eventos" replace />} />
      </Routes>
    </main>
    <footer className="py-4 border-top bg-white">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
        <span className="text-muted">Eventos 360 · Proyecto Integrador MEAN</span>
        <span className="text-muted">Angular + React + MongoDB Atlas</span>
      </div>
    </footer>
  </div>
);

export default App;
