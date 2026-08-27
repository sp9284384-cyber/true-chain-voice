'use client';

import { useState } from 'react';
import { updateReportStatus } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, RefreshCw } from 'lucide-react';

interface StatusUpdateFormProps {
  reportId: number;
  token: string;
  currentStatus: string;
  onUpdated: () => void;
}

const statusOptions = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'investigating', label: 'Investigating' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
] as const;

function formatStatusLabel(value: string): string {
  const option = statusOptions.find((o) => o.value === value);
  return option ? option.label : value;
}

export function StatusUpdateForm({
  reportId,
  token,
  currentStatus,
  onUpdated,
}: StatusUpdateFormProps) {
  const { toast } = useToast();
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [updatedBy, setUpdatedBy] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newStatus === currentStatus) return;

    setSubmitting(true);
    try {
      await updateReportStatus(token, reportId, {
        new_status: newStatus,
        updated_by: updatedBy.trim() || undefined,
      });
      toast({
        title: 'Status updated',
        description: `Report #${reportId} moved to ${formatStatusLabel(newStatus)}.`,
      });
      onUpdated();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status.';
      toast({
        title: 'Update failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isUnchanged = newStatus === currentStatus;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status-select">Update Status</Label>
        <Select value={newStatus} onValueChange={setNewStatus}>
          <SelectTrigger id="status-select" className="w-full">
            <SelectValue placeholder="Select new status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Current status: <span className="text-foreground font-medium">{formatStatusLabel(currentStatus)}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="updated-by">Updated By <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Input
          id="updated-by"
          type="text"
          placeholder="Your name or badge number"
          value={updatedBy}
          onChange={(e) => setUpdatedBy(e.target.value)}
          disabled={submitting}
        />
      </div>

      <Button type="submit" disabled={isUnchanged || submitting} className="w-full sm:w-auto">
        {submitting ? (
          <>
            <Loader2 className="animate-spin" />
            Updating…
          </>
        ) : (
          <>
            <RefreshCw />
            Update Status
          </>
        )}
      </Button>
    </form>
  );
}
