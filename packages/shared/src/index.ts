import type { components } from "../generated/api.ts";

export type Appointment = components["schemas"]["Appointment"];
export type AppointmentStatus = components["schemas"]["AppointmentStatus"];
export type Invoice = components["schemas"]["Invoice"];

export { logger } from "./logger.ts";
