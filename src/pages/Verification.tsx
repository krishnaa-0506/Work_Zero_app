import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Shield, CheckCircle, Clock, X, Upload, Camera, FileText, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface VerificationItem {
  id: string;
  type: 'identity' | 'skills' | 'background' | 'document';
  title: string;
  description: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
  documents?: File[];
  submittedAt?: Date;
  reviewedAt?: Date;
  feedback?: string;
}

const Verification = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();

  const [verificationItems, setVerificationItems] = useState<VerificationItem[]>([
    {
      id: '1',
      type: 'identity',
      title: 'Identity Verification',
      description: 'Verify your identity with Aadhaar card and selfie',
      status: 'approved',
      submittedAt: new Date(Date.now() - 86400000), // 1 day ago
      reviewedAt: new Date(Date.now() - 43200000), // 12 hours ago
    },
    {
      id: '2',
      type: 'skills',
      title: 'Skills Verification',
      description: 'Verify your professional skills through tests or certificates',
      status: 'pending',
    },
    {
      id: '3',
      type: 'background',
      title: 'Background Check',
      description: 'Police verification and background screening',
      status: 'pending',
    },
    {
      id: '4',
      type: 'document',
      title: 'Document Verification',
      description: 'Upload and verify educational certificates and work documents',
      status: 'in-review',
      submittedAt: new Date(Date.now() - 3600000), // 1 hour ago
    },
  ]);

  const [selectedItem, setSelectedItem] = useState<VerificationItem | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'in-review':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'rejected':
        return <X className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success text-success-foreground';
      case 'in-review':
        return 'bg-warning text-warning-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const calculateProgress = () => {
    const approved = verificationItems.filter(item => item.status === 'approved').length;
    return (approved / verificationItems.length) * 100;
  };

  const handleFileUpload = async (files: FileList | null, itemId: string) => {
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    
    // Simulate file upload
    setTimeout(() => {
      setVerificationItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { 
                ...item, 
                status: 'in-review', 
                documents: Array.from(files),
                submittedAt: new Date()
              }
            : item
        )
      );
      setUploadingFiles(false);
      toast.success("Documents uploaded successfully");
      if (isSupported) {
        speak("Documents uploaded for verification");
      }
    }, 2000);
  };

  const startSkillsTest = (itemId: string) => {
    // Simulate skills test
    toast.success("Skills test started");
    if (isSupported) {
      speak("Skills verification test has been started");
    }
    
    setTimeout(() => {
      setVerificationItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { 
                ...item, 
                status: 'approved',
                submittedAt: new Date(),
                reviewedAt: new Date()
              }
            : item
        )
      );
      toast.success("Skills test completed successfully");
    }, 5000);
  };

  const requestBackgroundCheck = (itemId: string) => {
    setVerificationItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status: 'in-review',
              submittedAt: new Date()
            }
          : item
      )
    );
    toast.success("Background check requested");
    if (isSupported) {
      speak("Background verification has been requested");
    }
  };

  const readVerificationStatus = () => {
    if (isSupported) {
      const approved = verificationItems.filter(item => item.status === 'approved').length;
      const pending = verificationItems.filter(item => item.status === 'pending').length;
      const inReview = verificationItems.filter(item => item.status === 'in-review').length;
      
      const message = `Verification status: ${approved} approved, ${inReview} in review, ${pending} pending. Overall progress is ${Math.round(calculateProgress())} percent.`;
      speak(message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={() => navigate('/worker/profile')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Verification</h1>
            <p className="text-white/80">Complete verification to build trust</p>
          </div>
        </div>

        {isSupported && (
          <Button
            onClick={readVerificationStatus}
            variant="secondary"
            size="sm"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Read Status
          </Button>
        )}
      </div>

      <div className="px-6 -mt-4 pb-6 space-y-6">
        {/* Progress Overview */}
        <Card className="shadow-medium">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Verification Progress</h3>
                <p className="text-muted-foreground">
                  {verificationItems.filter(item => item.status === 'approved').length} of {verificationItems.length} completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {Math.round(calculateProgress())}%
                </div>
              </div>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </CardContent>
        </Card>

        {/* Verification Items */}
        <div className="space-y-4">
          {verificationItems.map((item) => (
            <Card key={item.id} className="shadow-medium">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace('-', ' ')}
                      </Badge>
                    </div>

                    {item.submittedAt && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Submitted: {item.submittedAt.toLocaleDateString()}
                        {item.reviewedAt && ` • Reviewed: ${item.reviewedAt.toLocaleDateString()}`}
                      </p>
                    )}

                    {item.feedback && (
                      <div className="bg-muted rounded-lg p-3 mb-3">
                        <p className="text-sm">{item.feedback}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 mt-3">
                      {item.status === 'pending' && (
                        <>
                          {item.type === 'skills' && (
                            <Button
                              onClick={() => startSkillsTest(item.id)}
                              size="sm"
                              variant="outline"
                            >
                              Start Skills Test
                            </Button>
                          )}
                          {item.type === 'background' && (
                            <Button
                              onClick={() => requestBackgroundCheck(item.id)}
                              size="sm"
                              variant="outline"
                            >
                              Request Background Check
                            </Button>
                          )}
                          {item.type === 'document' && (
                            <div>
                              <input
                                type="file"
                                multiple
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileUpload(e.target.files, item.id)}
                                className="hidden"
                                id={`file-upload-${item.id}`}
                              />
                              <Button
                                onClick={() => document.getElementById(`file-upload-${item.id}`)?.click()}
                                size="sm"
                                variant="outline"
                                disabled={uploadingFiles}
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                {uploadingFiles ? 'Uploading...' : 'Upload Documents'}
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                      
                      {item.status === 'rejected' && (
                        <Button
                          onClick={() => setSelectedItem(item)}
                          size="sm"
                          variant="outline"
                        >
                          Resubmit
                        </Button>
                      )}
                      
                      {item.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Verified
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits of Verification */}
        <Card className="shadow-medium border-success/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-success">
              <Shield className="w-5 h-5" />
              <span>Benefits of Verification</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Get more job opportunities</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Build trust with employers</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Higher chances of getting hired</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Access to premium job listings</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Faster payment processing</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you're having trouble with verification or need assistance, our support team is here to help.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Verification Guide
              </Button>
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Verification;