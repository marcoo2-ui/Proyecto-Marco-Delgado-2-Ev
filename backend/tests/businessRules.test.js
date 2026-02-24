const test = require('node:test');
const assert = require('node:assert/strict');
const validateBusinessRules = require('../src/utils/businessRules');

test('valid event passes business rules', () => {
  const errors = validateBusinessRules({
    titulo: 'Festival',
    descripcion: 'Festival de música en el parque',
    precio: 20,
    fecha: new Date(Date.now() + 86400000).toISOString()
  });

  assert.equal(errors.length, 0);
});

test('invalid price and past date fail business rules', () => {
  const errors = validateBusinessRules({
    titulo: 'Evento',
    descripcion: 'Descripción larga para validar.',
    precio: -5,
    fecha: new Date(Date.now() - 86400000).toISOString()
  });

  assert.ok(errors.some((error) => error.includes('precio')));
  assert.ok(errors.some((error) => error.includes('fecha')));
});
