const VARIANTS = {
  primary: "bg-indigo-600 hover:bg-indigo-500 text-white",
  secondary: "bg-gray-700 hover:bg-gray-600 text-gray-200",
  danger: "bg-red-600/80 hover:bg-red-500 text-white",
  ghost: "bg-transparnet hover:bg-gray-800 text-gray-300",
};

const SIZES = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-1.5
        rounded-lg font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        ${VARIANTS[variant]} ${SIZES[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
