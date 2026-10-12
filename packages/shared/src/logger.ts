// The one logger every service uses. Fields are logged as JSON so the log
// pipeline can index them. Never log customer names, phone numbers or email
// addresses.

type Fields = Record<string, string | number | boolean>;

function write(level: "info" | "warn" | "error", message: string, fields: Fields) {
  process.stdout.write(JSON.stringify({ level, message, ...fields }) + "\n");
}

export const logger = {
  info: (message: string, fields: Fields = {}) => write("info", message, fields),
  warn: (message: string, fields: Fields = {}) => write("warn", message, fields),
  error: (message: string, fields: Fields = {}) => write("error", message, fields),
};
