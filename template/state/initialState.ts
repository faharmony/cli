/**
 * InitialState
 * ---
 * This file maintains the type definition
 * and the actual initialState of the Module.
 */

/** Type definition of the Module's state */
export interface IModuleState {
  loading: boolean;
}

/** Initial state of Module */
export default { loading: true } as IModuleState;
