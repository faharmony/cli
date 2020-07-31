/**
 * Services
 * ---
 *
 * This directory contains services.
 * A service is a method for the module to connect
 * to external sources in order to fetch/send data.
 * This could be REST API, GraphQL, or something else.
 *
 * Service functions are difficult to move to Harmony
 * so repetition might occur in modules.
 *
 * The best practice is to group services by their
 * functionality rather than there method.
 *
 * 2 files are provided to get started -
 * config.ts, api.ts
 */

export * from "./api";
