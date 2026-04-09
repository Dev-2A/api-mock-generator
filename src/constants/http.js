export const HTTP_METHODS = [
  { value: "GET", label: "GET", color: "text-green-400" },
  { value: "POST", label: "POST", color: "text-blue-400" },
  { value: "PUT", label: "PUT", color: "text-yellow-400" },
  { value: "PATCH", label: "PATCH", color: "text-orange-400" },
  { value: "DELETE", label: "DELETE", color: "text-red-400" },
];

export const STATUS_CODES = [
  { value: "200", label: "200 OK" },
  { value: "201", label: "201 Created" },
  { value: "204", label: "204 No Content" },
  { value: "400", label: "400 Bad Request" },
  { value: "401", label: "401 Unauthorized" },
  { value: "403", label: "403 Forbidden" },
  { value: "404", label: "404 Not Found" },
  { value: "500", label: "500 Internal Server Error" },
];

export const DEFAULT_RESPONSE = JSON.stringify(
  { mesage: "Hello from mock server!" },
  null,
  2,
);

export const DEFAULT_DELAY = 0;
