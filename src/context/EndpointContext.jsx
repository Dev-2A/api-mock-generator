import { createContext, useContext, useReducer, useCallback } from "react";
import { endpointReducer, initialState, ACTIONS } from "./endpointReducer";

const EndpointContext = createContext(null);

export function EndpointProvider({ children }) {
  const [state, dispatch] = useReducer(endpointReducer, initialState);

  // --- 액션 헬퍼 ---
  const addEndpoint = useCallback(
    (overrides = {}) => dispatch({ type: ACTIONS.ADD, payload: overrides }),
    [],
  );

  const updateEndpoint = useCallback(
    (id, changes) =>
      dispatch({ type: ACTIONS.UPDATE, payload: { id, changes } }),
    [],
  );

  const removeEndpoint = useCallback(
    (id) => dispatch({ type: ACTIONS.REMOVE, payload: { id } }),
    [],
  );

  const duplicateEndpoint = useCallback(
    (id) => dispatch({ type: ACTIONS.DUPLICATE, payload: { id } }),
    [],
  );

  const clearAll = useCallback(() => dispatch({ type: ACTIONS.CLEAR_ALL }), []);

  const importEndpoints = useCallback(
    (endpoints) => dispatch({ type: ACTIONS.IMPORT, payload: { endpoints } }),
    [],
  );

  const value = {
    endpoints: state.endpoints,
    addEndpoint,
    updateEndpoint,
    removeEndpoint,
    duplicateEndpoint,
    clearAll,
    importEndpoints,
  };

  return (
    <EndpointContext.Provider value={value}>
      {children}
    </EndpointContext.Provider>
  );
}

/**
 * 커스텀 훅
 */
export function useEndpoints() {
  const context = useContext(EndpointContext);
  if (!context) {
    throw new Error(
      "useEndpoints는 EndpointProvider 내부에서 사용해야 합니다.",
    );
  }
  return context;
}
