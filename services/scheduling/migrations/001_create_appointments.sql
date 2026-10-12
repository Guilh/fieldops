-- up
CREATE TABLE appointments (
  id                  TEXT PRIMARY KEY,
  technician_id       TEXT NOT NULL,
  customer_id         TEXT NOT NULL,
  starts_at           TIMESTAMPTZ NOT NULL,
  ends_at             TIMESTAMPTZ NOT NULL,
  status              TEXT NOT NULL,
  customer_time_zone  TEXT NOT NULL
);
CREATE INDEX appointments_technician_starts ON appointments (technician_id, starts_at);

-- down
DROP TABLE appointments;
