'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { submitReport, uploadEvidence } from '@/lib/api';
import { CategorySelect } from './CategorySelect';
import { FileUpload } from './FileUpload';
import { PrivacyNotice } from '@/components/shared/PrivacyNotice';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export function ReportForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = content.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Submit the report
      const reportRes = await submitReport({
        content: content.trim(),
        ...(category ? { category } : {}),
      });

      // Upload evidence if a file was attached
      if (file) {
        try {
          await uploadEvidence(reportRes.report_id, file);
        } catch {
          // Evidence upload is best-effort — don't block the user
          toast({
            title: 'Evidence upload failed',
            description:
              'Your report was submitted, but the file could not be attached. You may retry later.',
            variant: 'destructive',
          });
        }
      }

      // Redirect to confirmation page with token and reportId
      router.push(
        `/report/confirmation?token=${encodeURIComponent(reportRes.session_token)}&reportId=${reportRes.report_id}`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit report.';
      toast({
        title: 'Submission failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <LoadingSpinner size="lg" label="Encrypting and submitting your report..." />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PrivacyNotice />

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="report-content" className="text-sm font-medium text-foreground">
          Report Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="report-content"
          placeholder="Describe what happened. Be as detailed as possible..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
          className="resize-y"
        />
        <p className="text-xs text-muted-foreground">
          {content.length} characters
        </p>
      </div>

      {/* Category */}
      <CategorySelect value={category} onChange={setCategory} />

      {/* File Upload */}
      <FileUpload file={file} onFileChange={setFile} />

      {/* Submit */}
      <Button
        type="submit"
        disabled={!isFormValid}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Send className="mr-2 size-4" />
        Submit Report Anonymously
      </Button>
    </form>
  );
}
