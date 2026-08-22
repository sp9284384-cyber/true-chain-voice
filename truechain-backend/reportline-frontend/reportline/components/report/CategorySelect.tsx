import type { Category } from "@/lib/types";

const OPTIONS: { value: Category; label: string }[] = [
  { value: "harassment", label: "Harassment" },
  { value: "corruption", label: "Corruption" },
  { value: "misconduct", label: "Misconduct" },
  { value: "other", label: "Other" },
];

interface Props {
  value: Category | "";
  onChange: (value: Category | "") => void;
}

export function CategorySelect({ value, onChange }: Props) {
  return (
    <div>
      <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-ink">
        Category <span className="font-normal text-ink-muted">(optional)</span>
      </label>
      <select
        id="category"
        value={value}
        onChange={(e) => onChange(e.target.value as Category | "")}
        className="w-full rounded-card border border-line bg-surface px-3.5 py-2.5 text-ink focus-visible:outline-none"
      >
        <option value="">Let the system decide</option>
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <p className="mt-1.5 text-xs text-ink-muted">
        This is a starting point only — our review process assigns the final category.
      </p>
    </div>
  );
}
