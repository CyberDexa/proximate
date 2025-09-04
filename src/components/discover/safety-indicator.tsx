'use client';

import { Shield, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function SafetyIndicator() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Safety Status */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm font-medium text-success">Safe Mode Active</span>
        </div>

        {/* Active Safety Features */}
        <div className="flex items-center gap-1">
          <Shield className="w-4 h-4 text-primary-blue" />
          <span className="text-xs text-dark-muted">Protected</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center gap-4 text-xs text-dark-muted">
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-success" />
          <span>89% verified</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 text-primary-blue" />
          <span>247 online</span>
        </div>
      </div>
    </div>
  );
}
