/**
 * List of all REST API used in this module.
 */
import apiInstance, {
  ICancelTokenProps,
  returnSuccess,
  returnWarning,
} from "./axios";

// The following API functions use an initialized instance of Axios
// @see axios.ts
// @param cancelToken is optional and can be used to interrupt api call.

/**
 * Get all files/folders in a directory
 * @returns Array of file objects
 */
export const sampleRestApi = ({ cancelToken }: ICancelTokenProps) =>
  apiInstance
    .get(`endpoint`, { cancelToken })
    .then(returnSuccess)
    .catch(returnWarning);
