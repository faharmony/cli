// Axios is used for managing REST API calls
// Axios Documentation: https://github.com/axios/axios
import { getAuthToken, axios, CancelToken } from "@faharmony/service";

// Base API
// Axios instance initialized with common information like baseURL and headers.
export const apiInstance = axios.create({
  baseURL: `/services/service-name`,
});

// Interceptor to add current authentication bearer token
// Comment this if no bearer token is required.
apiInstance.interceptors.request.use(
  (config) => {
    // Read token from in-memory.
    config.headers.Authorization = `Bearer ${getAuthToken() || ""}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiInstance;

///////////////////////////

/**
 * Return functions for API call
 */
// Return whether request was successful or not.
export const returnStatus = (res: any): boolean =>
  res.status &&
  (res.status === 200 || res.status === 201 || res.status === 204);

// Returns JSON data if found, else undefined.
export const returnJSON = (res: any) =>
  returnStatus(res) ? res.data.result : console.warn(res.statusText);

// Returns Boolean: True if success
export const returnSuccess = (res: any): boolean =>
  returnStatus(res) ? res.data.result.success : console.warn(res.statusText);

// Display return data in console
export const displayResult = console.dir;

// Warning for API catch
export const returnWarning = console.error;

/**
 * TypeDefinitions for API props
 */

/**
 * Base interface for all API.
 * Extend it to create your own interfaces.
 */
export interface ICancelTokenProps {
  cancelToken?: CancelToken;
}
