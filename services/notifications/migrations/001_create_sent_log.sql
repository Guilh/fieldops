-- up
CREATE TABLE sent_log (
  notification_id  TEXT PRIMARY KEY,
  channel          TEXT NOT NULL,
  sent_at          TIMESTAMPTZ NOT NULL
);

-- down
DROP TABLE sent_log;
