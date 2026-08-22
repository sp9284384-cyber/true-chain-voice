import { Loader } from "./icons";

export default function LoadingSpinner({
  label = "Loading…",
  size = "md",
}: {
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-9 w-9" }[size];
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-text-muted">
      <Loader className={dims} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
