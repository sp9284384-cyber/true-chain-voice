'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Category } from '@/lib/types';

const categories: { value: Category; label: string }[] = [
  { value: 'harassment', label: 'Harassment' },
  { value: 'corruption', label: 'Corruption' },
  { value: 'misconduct', label: 'Misconduct' },
  { value: 'other', label: 'Other' },
];

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="category-select" className="text-sm font-medium text-foreground">
        Category <span className="text-muted-foreground font-normal">(optional)</span>
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="category-select" className="w-full">
          <SelectValue placeholder="Select a category..." />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
