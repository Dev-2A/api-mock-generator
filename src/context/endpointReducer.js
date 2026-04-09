import { v4 as uuidv4 } from "uuid";
import { DEFAULT_RESPONSE, DEFAULT_DELAY } from "../constants/http";

/**
 * 엔드포인트 하나의 기본 형태
 */
export function createEndpoint(overrides = {}) {
  return {
    id: uuidv4(),
    method: "GET",
    path: "/api/example",
    statusCode: 200,
    responseBody: DEFAULT_RESPONSE,
    delay: DEFAULT_DELAY,
    description: "",
    createdAt: Date.now(),
    ...overrides,
  };
}

/**
 * 액션 타입
 */
export const ACTIONS = {
  ADD: "ADD_ENDPOINT",
  UPDATE: "UPDATE_ENDPOINT",
  REMOVE: "REMOVE_ENDPOINT",
  DUPLICATE: "DUPLICATE_ENDPOINT",
  CLEAR_ALL: "CLEAR_ALL_ENDPOINTS",
  IMPORT: "IMPORT_ENDPOINTS",
};

/**
 * 리듀서
 */
export function endpointReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD:
      return {
        ...state,
        endpoints: [...state.endpoints, createEndpoint(action.payload)],
      };

    case ACTIONS.UPDATE:
      return {
        ...state,
        endpoints: state.endpoints.map((ep) =>
          ep.id === action.payload.id
            ? { ...ep, ...action.payload.changes }
            : ep,
        ),
      };

    case ACTIONS.REMOVE:
      return {
        ...state,
        endpoints: state.endpoints.filter((ep) => ep.id !== action.payload.id),
      };

    case ACTIONS.DUPLICATE: {
      const original = state.endpoints.find(
        (ep) => ep.id === action.payload.id,
      );
      if (!original) return state;
      const duplicated = createEndpoint({
        ...original,
        id: undefined, // createEndpoint이 새 ID 부여
        description: original.description
          ? `${original.description} (복사본)`
          : "(복사본)",
        createdAt: undefined,
      });
      const index = state.endpoints.findIndex(
        (ep) => ep.id === action.payload.id,
      );
      const newEndpoints = [...state.endpoints];
      newEndpoints.splice(index + 1, 0, duplicated);
      return { ...state, endpoints: newEndpoints };
    }

    case ACTIONS.CLEAR_ALL:
      return { ...state, endpoints: [] };

    case ACTIONS.IMPORT:
      return { ...state, endpoints: action.payload.endpoints };

    default:
      return state;
  }
}

/**
 * 초기 상태
 */
export const initialState = {
  endpoints: [],
};
