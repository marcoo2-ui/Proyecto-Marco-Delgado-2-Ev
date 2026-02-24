const BASE_URL = 'https://backend-zeta-ten-49.vercel.app/api/v1';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || 'Error al comunicar con la API';
    throw new Error(message);
  }
  return response.json();
};

export const fetchEvents = async ({ page = 1, limit = 6, categoria = '', q = '' }) => {
  const params = new URLSearchParams({ page, limit });
  if (categoria) params.set('categoria', categoria);
  if (q) params.set('q', q);

  const response = await fetch(`${BASE_URL}/eventos/get/all?${params.toString()}`);
  return handleResponse(response);
};

export const fetchEvent = async (id) => {
  const response = await fetch(`${BASE_URL}/eventos/get/${id}`);
  return handleResponse(response);
};

export const createEvent = async (payload) => {
  const response = await fetch(`${BASE_URL}/eventos/post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
};

export const updateEvent = async (id, payload) => {
  const response = await fetch(`${BASE_URL}/eventos/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
};

export const deleteEvent = async (id) => {
  const response = await fetch(`${BASE_URL}/eventos/delete/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
};
