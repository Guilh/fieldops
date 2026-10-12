-- up
CREATE TABLE visit_status_events (
  appointment_id  TEXT NOT NULL REFERENCES appointments (id),
  from_status     TEXT NOT NULL,
  to_status       TEXT NOT NULL,
  changed_at      TIMESTAMPTZ NOT NULL
);

-- down
DROP TABLE visit_status_events;
