/**
 * Reducers
 * ---
 * This file maintains all the reducers (modifiers)
 * for the Module's state. The name of reducer will
 * become the name of the action.
 *
 * A case reducer can choose to mutate the passed-in
 * state value directly instead of returning a new state.
 * This does not actually cause the store state to be
 * mutated directly; instead, thanks to immer, the
 * mutations are translated to copy operations that
 * result in a new state.
 */
import { CaseReducer, PayloadAction } from "@faharmony/state";
import { IModuleState } from "./initialState";

// Generic types for ease-of-use
type Reducer = CaseReducer<IModuleState>;
type ReducerWithPayload<T extends any> = CaseReducer<
  IModuleState,
  PayloadAction<T>
>;

// -------------------
// Edit reducers below

/** Reducer without required payload.
 * @example dispatch(toggleLoading()) */
export const toggleLoading: Reducer = (state) => {
  state.loading = !state.loading;
};

/** Reducer with required payload.
 * @example dispatch(setLoading(true)) */
export const setLoading: ReducerWithPayload<boolean> = (state, { payload }) => {
  state.loading = payload;
};
