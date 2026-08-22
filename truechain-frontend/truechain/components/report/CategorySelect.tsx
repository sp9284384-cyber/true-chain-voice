import type { Category } from "@/lib/types";

const OPTIONS: { value: Category; label: string }[] = [
  { value: "harassment", label: "Harassment" },
  { value: "corruption", label: "Corruption" },
  { value: "misconduct", label: "Misconduct" },
  { value: "other", label: "Other" },
];

export default function CategorySelect({
  value,
  onChange,
}: {
  value: Category | "";
  onChange: (value: Category | "") => void;
}) {
  return (
    <div>
      <label htmlFor="category" className="field-label">
        Category <span className="text-text-faint">(optional)</span>
      </label>
      <select
        id="category"
        className="field-input appearance-none"
        value={value}
        onChange={(e) => onChange(e.target.value as Category | "")}
      >
        <option value="">Let the system decide</option>
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <p className="mt-1.5 text-xs text-text-faint">
        Our triage system reviews every report and may reassign this if it
        looks like a better fit elsewhere.
      </p>
    </div>
  );
}
