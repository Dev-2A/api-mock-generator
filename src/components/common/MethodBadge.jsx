const METHOD_STYLES = {
  GET: "bg-green-500/15 text-green-400 border-green-500/30",
  POST: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  PUT: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  PATCH: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  DELETE: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function MethodBadge({ method }) {
  return (
    <span
      className={`
        inline-flex items-center justify-center
        text-xs font-bold tracking-wider
        px-2.5 py-1 rounded-md border
        min-w-15
        ${METHOD_STYLES[method] || "bg-gray-500/15 text-gray-400 border-gray-500/30"}
      `}
    >
      {method}
    </span>
  );
}
