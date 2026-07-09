-- database/seed.sql
-- Carga datos iniciales para probar North Barber.

USE north_barber_db;

-- Usuario administrador inicial.
INSERT INTO users (name, email, password, role)
SELECT
  'Admin North Barber',
  'admin@northbarber.com',
  '$2b$10$folasMS/JRQYqRsNdfIzPutF3YQ1nBZt4LTxrrQ59rv.FM1hVe5Gi',
  'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@northbarber.com'
);

-- Barberos iniciales.
INSERT INTO barbers (
  name,
  specialty,
  bio,
  email,
  phone,
  image_url,
  is_active
)
SELECT
  'Liam Carter',
  'Cortes clásicos y barba',
  'Especialista en cortes clasicos, fades y arreglo de barba.',
  NULL,
  NULL,
  NULL,
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM barbers WHERE name = 'Liam Carter'
);

INSERT INTO barbers (
  name,
  specialty,
  bio,
  email,
  phone,
  image_url,
  is_active
)
SELECT
  'Noah Bennett',
  'Estilos modernos y degradados',
  'Barbero enfocado en estilos modernos, degradados y perfilado.',
  NULL,
  NULL,
  NULL,
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM barbers WHERE name = 'Noah Bennett'
);

-- Servicios iniciales.
INSERT INTO services (name, description, duration_minutes, price)
SELECT
  'Classic Haircut',
  'Corte clasico con terminacion profesional.',
  30,
  12000.00
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Classic Haircut'
);

INSERT INTO services (name, description, duration_minutes, price)
SELECT
  'Fade Cut',
  'Corte degradado con detalle y terminacion prolija.',
  45,
  15000.00
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Fade Cut'
);

INSERT INTO services (name, description, duration_minutes, price)
SELECT
  'Beard Trim',
  'Perfilado, rebaje y arreglo completo de barba.',
  25,
  9000.00
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Beard Trim'
);

INSERT INTO services (name, description, duration_minutes, price)
SELECT
  'Haircut + Beard',
  'Servicio completo de corte de cabello y barba.',
  60,
  20000.00
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Haircut + Beard'
);

-- Horarios iniciales del negocio.
INSERT INTO business_hours (
  day_of_week,
  open_time,
  close_time,
  is_open,
  has_break,
  break_start_time,
  break_end_time
)
SELECT
  0,
  '10:00:00',
  '18:00:00',
  FALSE,
  FALSE,
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1
  FROM business_hours
  WHERE day_of_week = 0
);

INSERT INTO business_hours (
  day_of_week,
  open_time,
  close_time,
  is_open,
  has_break,
  break_start_time,
  break_end_time
)
SELECT
  1,
  '09:00:00',
  '19:00:00',
  TRUE,
  TRUE,
  '13:00:00',
  '14:00:00'
WHERE NOT EXISTS (
  SELECT 1
  FROM business_hours
  WHERE day_of_week = 1
);

INSERT INTO business_hours (
  day_of_week,
  open_time,
  close_time,
  is_open,
  has_break,
  break_start_time,
  break_end_time
)
SELECT
  2,
  '09:00:00',
  '19:00:00',
  TRUE,
  TRUE,
  '13:00:00',
  '14:00:00'
WHERE NOT EXISTS (
  SELECT 1
  FROM business_hours
  WHERE day_of_week = 2
);

INSERT INTO business_hours (
  day_of_week,
  open_time,
  close_time,
  is_open,
  has_break,
  break_start_time,
  break_end_time
)
SELECT
  3,
  '09:00:00',
  '19:00:00',
  TRUE,
  TRUE,
  '13:00:00',
  '14:00:00'
WHERE NOT EXISTS (
  SELECT 1
  FROM business_hours
  WHERE day_of_week = 3
);

INSERT INTO business_hours (
  day_of_week,
  open_time,
  close_time,
  is_open,
  has_break,
  break_start_time,
  break_end_time
)
SELECT
  4,
  '09:00:00',
  '19:00:00',
  TRUE,
  TRUE,
  '13:00:00',
  '14:00:00'
WHERE NOT EXISTS (
  SELECT 1
  FROM business_hours
  WHERE day_of_week = 4
);

INSERT INTO business_hours (
  day_of_week,
  open_time,
  close_time,
  is_open,
  has_break,
  break_start_time,
  break_end_time
)
SELECT
  5,
  '09:00:00',
  '20:00:00',
  TRUE,
  TRUE,
  '13:30:00',
  '14:30:00'
WHERE NOT EXISTS (
  SELECT 1
  FROM business_hours
  WHERE day_of_week = 5
);

INSERT INTO business_hours (
  day_of_week,
  open_time,
  close_time,
  is_open,
  has_break,
  break_start_time,
  break_end_time
)
SELECT
  6,
  '10:00:00',
  '16:00:00',
  TRUE,
  FALSE,
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1
  FROM business_hours
  WHERE day_of_week = 6
);