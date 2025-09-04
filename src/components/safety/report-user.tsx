"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertTriangle, Flag, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportUserProps {
  userId?: string;
  className?: string;
  triggerText?: string;
}

interface ReportCategory {
  id: string;
  label: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const REPORT_CATEGORIES: ReportCategory[] = [
  {
    id: 'inappropriate_behavior',
    label: 'Inappropriate Behavior',
    description: 'Disrespectful, rude, or offensive conduct',
    severity: 'medium',
  },
  {
    id: 'feels_unsafe',
    label: 'Feels Unsafe',
    description: 'This person makes me feel unsafe or uncomfortable',
    severity: 'high',
  },
  {
    id: 'fake_profile',
    label: 'Fake Profile',
    description: 'Using fake photos, false information, or catfishing',
    severity: 'medium',
  },
  {
    id: 'underage_suspicion',
    label: 'Underage Suspicion',
    description: 'I suspect this person may be under 18',
    severity: 'critical',
  },
  {
    id: 'illegal_activity',
    label: 'Illegal Activity',
    description: 'Promoting or engaging in illegal activities',
    severity: 'critical',
  },
  {
    id: 'harassment',
    label: 'Harassment',
    description: 'Persistent unwanted contact or messages',
    severity: 'high',
  },
  {
    id: 'scam_spam',
    label: 'Scam or Spam',
    description: 'Attempting to scam or sending spam messages',
    severity: 'medium',
  },
  {
    id: 'violence_threats',
    label: 'Violence or Threats',
    description: 'Threatening violence or making threatening statements',
    severity: 'critical',
  },
];

export function ReportUser({ userId, className, triggerText = "Report User" }: ReportUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState<File[]>([]);
  const [blockUser, setBlockUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleEvidenceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setEvidence(prev => [...prev, ...files].slice(0, 5)); // Max 5 files
  };

  const removeEvidence = (index: number) => {
    setEvidence(prev => prev.filter((_, i) => i !== index));
  };

  const getHighestSeverity = (): 'low' | 'medium' | 'high' | 'critical' => {
    const severities = selectedCategories.map(id => 
      REPORT_CATEGORIES.find(cat => cat.id === id)?.severity || 'low'
    );
    
    if (severities.includes('critical')) return 'critical';
    if (severities.includes('high')) return 'high';
    if (severities.includes('medium')) return 'medium';
    return 'low';
  };

  const submitReport = async () => {
    if (selectedCategories.length === 0) return;

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('userId', userId || '');
      formData.append('categories', JSON.stringify(selectedCategories));
      formData.append('description', description);
      formData.append('severity', getHighestSeverity());
      formData.append('blockUser', blockUser.toString());
      
      // Add evidence files
      evidence.forEach((file, index) => {
        formData.append(`evidence_${index}`, file);
      });

      const response = await fetch('/api/safety/report', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsSubmitted(true);
        
        // Reset form after short delay
        setTimeout(() => {
          setIsOpen(false);
          setSelectedCategories([]);
          setDescription('');
          setEvidence([]);
          setBlockUser(false);
          setIsSubmitted(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to submit report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'critical': return 'text-red-600 border-red-200 bg-red-50';
      case 'high': return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'medium': return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Flag className="h-4 w-4 mr-2" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Report Safety Concern</span>
          </DialogTitle>
        </DialogHeader>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Flag className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">Report Submitted</h3>
            <p className="text-muted-foreground">
              Thank you for helping keep our community safe. We'll review this report promptly.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Report Categories */}
            <div>
              <Label className="text-base font-medium">What happened?</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Select all that apply. Your report is confidential.
              </p>
              <div className="space-y-2">
                {REPORT_CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    className={cn(
                      "flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                      selectedCategories.includes(category.id) && getSeverityColor(category.severity)
                    )}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{category.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Additional Details (Optional)</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide any additional context that might be helpful..."
                className="mt-1 w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {description.length}/1000 characters
              </p>
            </div>

            {/* Evidence Upload */}
            <div>
              <Label>Evidence (Optional)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Screenshots or other evidence (max 5 files, 10MB each)
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleEvidenceUpload}
                  className="hidden"
                  id="evidence-upload"
                  disabled={evidence.length >= 5}
                />
                <label
                  htmlFor="evidence-upload"
                  className={cn(
                    "flex flex-col items-center justify-center cursor-pointer text-center",
                    evidence.length >= 5 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload files or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB each
                  </p>
                </label>
              </div>

              {evidence.length > 0 && (
                <div className="mt-3 space-y-2">
                  {evidence.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEvidence(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Block user option */}
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <Checkbox
                id="blockUser"
                checked={blockUser}
                onCheckedChange={(checked) => setBlockUser(checked as boolean)}
              />
              <Label htmlFor="blockUser" className="text-sm">
                Also block this user (they won't be able to contact you)
              </Label>
            </div>

            {/* Severity indicator */}
            {selectedCategories.length > 0 && (
              <div className={cn("p-3 rounded-lg border", getSeverityColor(getHighestSeverity()))}>
                <p className="text-sm font-medium">
                  Report Severity: {getHighestSeverity().charAt(0).toUpperCase() + getHighestSeverity().slice(1)}
                </p>
                <p className="text-xs">
                  {getHighestSeverity() === 'critical' && "This will be reviewed immediately by our safety team."}
                  {getHighestSeverity() === 'high' && "This will be reviewed within 2 hours."}
                  {getHighestSeverity() === 'medium' && "This will be reviewed within 24 hours."}
                  {getHighestSeverity() === 'low' && "This will be reviewed within 48 hours."}
                </p>
              </div>
            )}

            {/* Submit button */}
            <div className="flex space-x-3">
              <Button
                onClick={submitReport}
                disabled={selectedCategories.length === 0 || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="text-xs text-muted-foreground border-t pt-4">
              <p>
                Your report is confidential and will be reviewed by our safety team. 
                False reports may result in account restrictions. For immediate emergencies, 
                contact local law enforcement.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
