import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Lock, Database, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-gray-400 mt-2">Last updated: September 4, 2025</p>
          </div>
        </div>

        {/* Privacy First Banner */}
        <Card className="bg-purple-950/20 border-purple-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Shield className="w-5 h-5" />
              Privacy by Design
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-300">
              Your privacy is our highest priority. We collect only what's necessary for safety 
              and functionality, store it securely, and give you complete control over your data.
            </p>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-400" />
              1. Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-950/20 border border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Required Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Account Creation</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Email address (for account access)</li>
                      <li>Phone number (for verification)</li>
                      <li>Date of birth (age verification)</li>
                      <li>Government ID (temporary, for age verification)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Profile Information</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>First name only</li>
                      <li>Photos (with automatic EXIF removal)</li>
                      <li>Basic preferences and intentions</li>
                      <li>General location (city-level)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-950/20 border border-amber-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">Optional Information</h3>
                <p className="text-gray-300 mb-3">You choose what to share:</p>
                <ul className="space-y-1 list-disc list-inside text-gray-300">
                  <li>Bio and personality information</li>
                  <li>Detailed preferences and boundaries</li>
                  <li>Private photo albums (shared only after mutual consent)</li>
                  <li>Emergency contact information (encrypted)</li>
                  <li>Health status information (encrypted, optional)</li>
                </ul>
              </div>

              <div className="bg-red-950/20 border border-red-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4">Automatic Data Collection</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Technical Data</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Device type and operating system</li>
                      <li>App version and settings</li>
                      <li>Crash reports and error logs</li>
                      <li>Performance metrics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Usage Data</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Feature usage patterns</li>
                      <li>Safety tool activations</li>
                      <li>Message frequency (not content)</li>
                      <li>Match success rates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-green-400" />
              2. How We Use Your Information
            </h2>

            <div className="space-y-6">
              <div className="bg-green-950/20 border border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Core Platform Functions</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-300">
                  <li><strong>Matching Algorithm:</strong> Connect you with compatible users based on preferences</li>
                  <li><strong>Safety Systems:</strong> Verify identities, detect inappropriate behavior, respond to emergencies</li>
                  <li><strong>Communication:</strong> Enable secure messaging and video verification</li>
                  <li><strong>Location Services:</strong> Show approximate distance to potential matches (with your consent)</li>
                </ul>
              </div>

              <div className="bg-purple-950/20 border border-purple-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-4">Safety & Moderation</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-300">
                  <li>Automated content scanning for inappropriate material</li>
                  <li>Pattern analysis to detect potential bad actors</li>
                  <li>Emergency response coordination</li>
                  <li>Investigation of reported incidents</li>
                  <li>Compliance with law enforcement requests (when legally required)</li>
                </ul>
              </div>

              <div className="bg-blue-950/20 border border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Platform Improvement</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-300">
                  <li>Anonymized analytics to improve matching algorithms</li>
                  <li>Safety feature effectiveness analysis</li>
                  <li>User experience optimization</li>
                  <li>Bug fixes and performance improvements</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-pink-400" />
              3. Information Sharing
            </h2>

            <div className="space-y-6">
              <div className="bg-green-950/20 border border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4">What We Share</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">With Other Users (Only With Your Consent)</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>First name and age</li>
                      <li>Profile photos and bio</li>
                      <li>General location (approximate distance)</li>
                      <li>Compatibility indicators</li>
                      <li>Verification status</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">With Service Providers</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Cloud storage providers (encrypted data only)</li>
                      <li>Payment processors (for subscription billing)</li>
                      <li>Age verification services (temporary ID verification)</li>
                      <li>Emergency services (only when panic button activated)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-red-950/20 border border-red-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4">What We NEVER Share</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-300">
                  <li>Your exact location or address</li>
                  <li>Private messages or intimate photos</li>
                  <li>Personal contact information</li>
                  <li>Health or safety status information</li>
                  <li>Financial information</li>
                  <li>Individual user data for marketing purposes</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-yellow-400" />
              4. Data Security & Protection
            </h2>

            <div className="space-y-6">
              <div className="bg-yellow-950/20 border border-yellow-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4">Security Measures</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Data Encryption</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>End-to-end encryption for messages</li>
                      <li>AES-256 encryption for stored data</li>
                      <li>TLS 1.3 for data transmission</li>
                      <li>Encrypted database backups</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Access Controls</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Multi-factor authentication required</li>
                      <li>Role-based access limitations</li>
                      <li>Regular security audits</li>
                      <li>Automatic session timeouts</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-purple-950/20 border border-purple-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-4">Data Minimization</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-300">
                  <li>We collect only what's necessary for functionality and safety</li>
                  <li>Automatic deletion of expired data (e.g., "tonight" intentions)</li>
                  <li>Regular purging of inactive accounts</li>
                  <li>Immediate deletion of age verification documents after processing</li>
                  <li>Anonymous aggregation for analytics (no individual tracking)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights Under UK GDPR</h2>

            <div className="bg-blue-950/20 border border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">Data Subject Rights</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Access & Control</h4>
                  <ul className="space-y-1 list-disc list-inside text-gray-300">
                    <li><strong>Right to Access:</strong> Request a copy of your data</li>
                    <li><strong>Right to Rectification:</strong> Correct inaccurate information</li>
                    <li><strong>Right to Erasure:</strong> Delete your account and data</li>
                    <li><strong>Right to Portability:</strong> Export your data</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Processing Rights</h4>
                  <ul className="space-y-1 list-disc list-inside text-gray-300">
                    <li><strong>Right to Object:</strong> Opt out of processing</li>
                    <li><strong>Right to Restrict:</strong> Limit how we use your data</li>
                    <li><strong>Right to Withdraw Consent:</strong> Change your mind anytime</li>
                    <li><strong>Right to Complain:</strong> Contact the ICO</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-900/30 rounded-lg">
                <p className="text-blue-300">
                  <strong>To exercise your rights:</strong> Email us at{" "}
                  <a href="mailto:dpo@proximeet.com" className="text-blue-400 hover:underline">
                    dpo@proximeet.com
                  </a>{" "}
                  or use the in-app data controls. We'll respond within 30 days.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>

            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Retention Periods</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-green-400">Active Account Data</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Profile information: Until account deletion</li>
                      <li>Messages: 30 days (then auto-deleted)</li>
                      <li>Match data: Until one user deletes account</li>
                      <li>Safety incidents: 7 years (legal requirement)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-red-400">After Account Deletion</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Personal data: Deleted within 30 days</li>
                      <li>Anonymized analytics: Retained indefinitely</li>
                      <li>Safety reports: Retained per legal requirements</li>
                      <li>Verification records: Deleted immediately</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
              7. Third-Party Services
            </h2>

            <div className="space-y-4">
              <p className="text-gray-300">
                We use carefully selected third-party services to provide core functionality. 
                All partners are vetted for security and privacy compliance.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Essential Services</h4>
                  <ul className="space-y-1 list-disc list-inside text-gray-300">
                    <li><strong>Stripe:</strong> Payment processing (PCI DSS compliant)</li>
                    <li><strong>AWS:</strong> Cloud infrastructure (SOC 2 certified)</li>
                    <li><strong>Twilio:</strong> SMS verification (encrypted)</li>
                    <li><strong>Veriff:</strong> Age verification (GDPR compliant)</li>
                  </ul>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Analytics & Monitoring</h4>
                  <ul className="space-y-1 list-disc list-inside text-gray-300">
                    <li><strong>Plausible:</strong> Privacy-focused analytics</li>
                    <li><strong>Sentry:</strong> Error tracking (anonymized)</li>
                    <li><strong>LogRocket:</strong> Session replay (opt-in only)</li>
                    <li><strong>Mixpanel:</strong> Usage analytics (anonymized)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-950/20 border border-amber-800 rounded-lg p-4">
                <p className="text-amber-300">
                  <strong>No Social Media Integration:</strong> We don't integrate with Facebook, 
                  Google, or other social platforms to protect your privacy and discretion.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Law Enforcement Cooperation</h2>

            <div className="bg-red-950/20 border border-red-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Legal Obligations</h3>
              <p className="text-gray-300 mb-4">
                We cooperate with law enforcement when legally required, but we protect user 
                privacy to the fullest extent possible under UK law.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">We may disclose information when:</h4>
                  <ul className="space-y-1 list-disc list-inside text-gray-300">
                    <li>Required by court order or warrant</li>
                    <li>Requested for child protection purposes</li>
                    <li>Necessary to prevent serious harm or crime</li>
                    <li>Required under terrorism prevention legislation</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">User protections:</h4>
                  <ul className="space-y-1 list-disc list-inside text-gray-300">
                    <li>We challenge overly broad requests</li>
                    <li>We notify users when legally permitted</li>
                    <li>We provide only the minimum required information</li>
                    <li>We maintain detailed logs of all requests</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. International Transfers</h2>

            <div className="space-y-4 text-gray-300">
              <p>
                Your data is primarily stored within the UK/EU. When international transfers 
                are necessary (e.g., cloud backups), we ensure adequate protection through:
              </p>
              
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li>Standard Contractual Clauses (SCCs)</li>
                <li>Adequacy decisions where available</li>
                <li>Additional encryption and access controls</li>
                <li>Regular compliance audits</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>

            <div className="bg-red-950/20 border border-red-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Strict 18+ Policy</h3>
              <p className="text-gray-300 mb-4">
                ProxiMeet is exclusively for adults. We do not knowingly collect information 
                from anyone under 18.
              </p>
              
              <div className="space-y-2">
                <p className="text-gray-300"><strong>If we discover underage users:</strong></p>
                <ul className="space-y-1 list-disc list-inside text-gray-300">
                  <li>Immediate account suspension and data deletion</li>
                  <li>Investigation of how they bypassed verification</li>
                  <li>System improvements to prevent recurrence</li>
                  <li>Potential reporting to authorities if required</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>

            <div className="space-y-4 text-gray-300">
              <p>
                We may update this Privacy Policy to reflect changes in our practices or 
                legal requirements. We'll notify you of significant changes through:
              </p>
              
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li>In-app notifications</li>
                <li>Email alerts (for major changes)</li>
                <li>Website announcements</li>
                <li>30-day notice period for material changes</li>
              </ul>
              
              <p className="mt-4">
                Continued use of the service after changes indicates acceptance of the 
                updated policy.
              </p>
            </div>
          </section>

          <section className="bg-purple-950/20 border border-purple-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">12. Contact Information</h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                For privacy questions, data requests, or to exercise your rights:
              </p>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Data Protection Officer</strong></p>
                    <p>Email: dpo@proximeet.com</p>
                    <p>Response time: Within 30 days</p>
                  </div>
                  <div>
                    <p><strong>Privacy Team</strong></p>
                    <p>Email: privacy@proximeet.com</p>
                    <p>Phone: +44 (0) 20 xxxx xxxx</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p><strong>ProxiMeet Ltd</strong></p>
                  <p>[Company Address]</p>
                  <p>London, UK</p>
                  <p>ICO Registration: [ICO Number]</p>
                </div>
              </div>
              
              <div className="bg-blue-950/20 border border-blue-800 rounded-lg p-4">
                <p className="text-blue-300">
                  <strong>Right to Complain:</strong> You have the right to lodge a complaint 
                  with the Information Commissioner's Office (ICO) if you're unhappy with how 
                  we handle your personal data.
                </p>
                <p className="text-blue-400 mt-2">
                  ICO Website: <a href="https://ico.org.uk" className="hover:underline">ico.org.uk</a> | 
                  Helpline: 0303 123 1113
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            Your privacy matters. Questions? Contact us at{" "}
            <a href="mailto:privacy@proximeet.com" className="text-purple-400 hover:underline">
              privacy@proximeet.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
