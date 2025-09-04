"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  Flag,
  User,
  MessageSquare,
  Calendar,
  TrendingUp,
} from 'lucide-react';

interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  description?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  actionTaken?: string;
  evidence?: string[];
  reporterInfo: {
    name: string;
    trustScore: number;
    reportCount: number;
  };
  reportedUserInfo: {
    name: string;
    trustScore: number;
    reportCount: number;
    isVerified: boolean;
  };
}

interface ModerationStats {
  totalReports: number;
  pendingReports: number;
  criticalReports: number;
  averageResponseTime: number;
  suspensionsToday: number;
  patternsDetected: number;
}

export default function ModerationPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<ModerationStats>({
    totalReports: 0,
    pendingReports: 0,
    criticalReports: 0,
    averageResponseTime: 0,
    suspensionsToday: 0,
    patternsDetected: 0,
  });
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModerationData();
  }, [selectedSeverity, selectedStatus]);

  const loadModerationData = async () => {
    try {
      setLoading(true);
      
      // Load moderation statistics
      const statsResponse = await fetch('/api/admin/moderation/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load reports
      const reportsResponse = await fetch(`/api/admin/moderation/reports?severity=${selectedSeverity}&status=${selectedStatus}`);
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json();
        setReports(reportsData);
      }
    } catch (error) {
      console.error('Failed to load moderation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId: string, action: string, reason?: string) => {
    try {
      const response = await fetch(`/api/admin/moderation/reports/${reportId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, reason }),
      });

      if (response.ok) {
        // Reload data to reflect changes
        loadModerationData();
      }
    } catch (error) {
      console.error('Failed to take action on report:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Recently';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-500" />
            Trust & Safety Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage safety reports and user behavior
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            Last updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <p className="text-2xl font-bold">{stats.totalReports}</p>
            </div>
            <Flag className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingReports}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalReports}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Response</p>
              <p className="text-2xl font-bold">{stats.averageResponseTime}h</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Suspensions</p>
              <p className="text-2xl font-bold">{stats.suspensionsToday}</p>
            </div>
            <Ban className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Patterns</p>
              <p className="text-2xl font-bold">{stats.patternsDetected}</p>
            </div>
            <Eye className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 items-center">
        <div className="flex space-x-2">
          <Button
            variant={selectedStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('pending')}
          >
            Pending
          </Button>
          <Button
            variant={selectedStatus === 'reviewing' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('reviewing')}
          >
            Reviewing
          </Button>
          <Button
            variant={selectedStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('all')}
          >
            All Reports
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={selectedSeverity === 'critical' ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeverity('critical')}
          >
            Critical
          </Button>
          <Button
            variant={selectedSeverity === 'high' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeverity('high')}
          >
            High
          </Button>
          <Button
            variant={selectedSeverity === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeverity('all')}
          >
            All Severities
          </Button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Safety Reports</h2>
        
        {reports.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Reports Found</h3>
            <p className="text-muted-foreground">
              {selectedStatus === 'pending' 
                ? "No pending reports to review" 
                : "No reports match your current filters"
              }
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center space-x-3">
                      <Badge className={getSeverityColor(report.severity)}>
                        {report.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatTimeAgo(report.createdAt)}
                      </span>
                    </div>

                    {/* Report Details */}
                    <div>
                      <h3 className="font-medium">{report.reason}</h3>
                      {report.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {report.description}
                        </p>
                      )}
                    </div>

                    {/* User Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">Reporter</p>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{report.reporterInfo.name}</span>
                          <Badge variant="outline" className="text-xs">
                            Trust: {report.reporterInfo.trustScore}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ({report.reporterInfo.reportCount} reports)
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">Reported User</p>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{report.reportedUserInfo.name}</span>
                          {report.reportedUserInfo.isVerified && (
                            <Badge variant="default" className="text-xs">Verified</Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            Trust: {report.reportedUserInfo.trustScore}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ({report.reportedUserInfo.reportCount} reports)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Evidence */}
                    {report.evidence && report.evidence.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Evidence ({report.evidence.length} files)
                        </p>
                        <div className="flex space-x-2">
                          {report.evidence.map((_, index) => (
                            <Button key={index} variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View {index + 1}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-4">
                    {report.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleReportAction(report.id, 'start_review')}
                        >
                          Start Review
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              Take Action
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Moderation Action</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => handleReportAction(report.id, 'warning')}
                                >
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Send Warning
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => handleReportAction(report.id, 'suspend_24h')}
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  24 Hour Suspension
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => handleReportAction(report.id, 'suspend_7d')}
                                >
                                  <Calendar className="h-4 w-4 mr-2" />
                                  7 Day Suspension
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="w-full justify-start"
                                  onClick={() => handleReportAction(report.id, 'permanent_ban')}
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Permanent Ban
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => handleReportAction(report.id, 'dismiss')}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Dismiss Report
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}

                    {report.status === 'reviewing' && (
                      <Badge variant="outline" className="text-center">
                        Under Review
                      </Badge>
                    )}

                    {report.reviewedAt && (
                      <div className="text-xs text-muted-foreground">
                        <p>Reviewed: {formatTimeAgo(report.reviewedAt)}</p>
                        {report.actionTaken && (
                          <p>Action: {report.actionTaken}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
