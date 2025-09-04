import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, Shield, Users, Ban, Flag } from "lucide-react";
import Link from "next/link";

export default function CommunityGuidelines() {
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
            <h1 className="text-3xl font-bold">Community Guidelines</h1>
            <p className="text-gray-400 mt-2">Building a safe, consensual community</p>
          </div>
        </div>

        {/* Community Values */}
        <Card className="bg-purple-950/20 border-purple-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Heart className="w-5 h-5" />
              Our Community Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-green-400">Consent First</h3>
                <p className="text-gray-300 text-sm">Every interaction must be mutual and enthusiastic</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-400">Respect Always</h3>
                <p className="text-gray-300 text-sm">Treat others with dignity and kindness</p>
              </div>
              <div className="text-center">
                <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <h3 className="font-semibold text-pink-400">No Judgment</h3>
                <p className="text-gray-300 text-sm">Embrace diversity in all its forms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-400" />
              1. Consent & Safety
            </h2>

            <div className="space-y-6">
              <div className="bg-green-950/20 border border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Consent is Non-Negotiable</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">✅ Expected Behavior</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Always obtain explicit consent before sharing intimate content</li>
                      <li>Respect "no" immediately and without argument</li>
                      <li>Communicate boundaries clearly and respect others' boundaries</li>
                      <li>Use our safety features when meeting in person</li>
                      <li>Report concerning behavior to keep our community safe</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-red-400">❌ Unacceptable Behavior</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Pressuring someone after they've said no</li>
                      <li>Sharing intimate photos without explicit consent</li>
                      <li>Ignoring or dismissing someone's boundaries</li>
                      <li>Threatening or coercive behavior of any kind</li>
                      <li>Attempting to meet without proper safety protocols</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-950/20 border border-amber-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">Safety Protocols</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Before Meeting</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Complete video verification when requested</li>
                      <li>Agree on a public meeting location</li>
                      <li>Share your plans with a trusted friend</li>
                      <li>Use our location sharing features</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">During Encounters</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Check in using our safety tools</li>
                      <li>Respect the agreed-upon boundaries</li>
                      <li>Use protection and practice safe sex</li>
                      <li>Trust your instincts and leave if uncomfortable</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              2. Respectful Communication
            </h2>

            <div className="space-y-6">
              <div className="bg-blue-950/20 border border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Communication Standards</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-green-400">✅ Encouraged</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Clear, honest communication about intentions</li>
                      <li>Respectful compliments and appreciation</li>
                      <li>Open discussion about preferences and boundaries</li>
                      <li>Polite rejection when not interested</li>
                      <li>Constructive feedback about experiences</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-red-400">❌ Not Tolerated</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Sexually explicit messages without consent</li>
                      <li>Harassment or persistent unwanted contact</li>
                      <li>Derogatory comments about appearance or preferences</li>
                      <li>Hate speech, discrimination, or prejudice</li>
                      <li>Threats, intimidation, or aggressive language</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-purple-950/20 border border-purple-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-4">Photo & Content Guidelines</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Profile Photos</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Must clearly show your face</li>
                      <li>Should be recent (within 6 months)</li>
                      <li>No filters that significantly alter appearance</li>
                      <li>Nudity allowed in private albums only (with consent gates)</li>
                      <li>No photos of other people without their consent</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Private Content Sharing</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Always ask for consent before sharing intimate photos</li>
                      <li>Respect if someone declines to share or receive</li>
                      <li>Never share someone else's private photos</li>
                      <li>Use our secure sharing features for protection</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Ban className="w-6 h-6 text-red-400" />
              3. Prohibited Activities
            </h2>

            <div className="space-y-6">
              <div className="bg-red-950/20 border border-red-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4">Zero Tolerance Policies</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Sexual Misconduct</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Non-consensual sexual contact</li>
                      <li>Sexual harassment or coercion</li>
                      <li>Sharing intimate images without consent</li>
                      <li>Stealthing or removing protection without consent</li>
                      <li>Any form of sexual assault</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Platform Abuse</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Creating fake profiles or catfishing</li>
                      <li>Impersonating another person</li>
                      <li>Using the platform for prostitution/escort services</li>
                      <li>Spam, scams, or commercial solicitation</li>
                      <li>Attempting to bypass safety features</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-orange-950/20 border border-orange-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-400 mb-4">Serious Violations</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Illegal Activities</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Any involvement with minors (under 18)</li>
                      <li>Drug dealing or illegal substance promotion</li>
                      <li>Violence, threats, or stalking behavior</li>
                      <li>Revenge porn or blackmail</li>
                      <li>Money laundering or fraud</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Discrimination & Hate</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Racism, sexism, homophobia, or transphobia</li>
                      <li>Religious or cultural discrimination</li>
                      <li>Body shaming or appearance-based harassment</li>
                      <li>Promotion of hate groups or extremist ideologies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Flag className="w-6 h-6 text-yellow-400" />
              4. Reporting & Enforcement
            </h2>

            <div className="space-y-6">
              <div className="bg-yellow-950/20 border border-yellow-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4">How to Report</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">In-App Reporting</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Use the report button on any profile or message</li>
                      <li>Select the appropriate violation category</li>
                      <li>Provide detailed description of the incident</li>
                      <li>Include screenshots or evidence if available</li>
                      <li>Block the user immediately for your safety</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Emergency Reporting</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Use panic button for immediate emergencies</li>
                      <li>Contact support@proximeet.com for urgent issues</li>
                      <li>Call 999 for immediate physical danger</li>
                      <li>Report to police for criminal activities</li>
                      <li>Contact domestic violence helplines if needed</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-950/20 border border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Our Response Process</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Investigation Timeline</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li><strong>Immediate:</strong> Safety-related reports (automatic account suspension)</li>
                      <li><strong>Within 2 hours:</strong> Sexual misconduct or harassment reports</li>
                      <li><strong>Within 24 hours:</strong> Profile violations and spam reports</li>
                      <li><strong>Within 48 hours:</strong> Complex cases requiring detailed investigation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Enforcement Actions</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-orange-400">Warning Level</h5>
                        <ul className="space-y-1 list-disc list-inside text-gray-300 text-sm">
                          <li>First-time minor violations</li>
                          <li>Educational content provided</li>
                          <li>Account marked for monitoring</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-red-400">Immediate Ban</h5>
                        <ul className="space-y-1 list-disc list-inside text-gray-300 text-sm">
                          <li>Sexual misconduct or harassment</li>
                          <li>Illegal activities</li>
                          <li>Underage users</li>
                          <li>Repeated serious violations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Appeals Process</h2>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Fair Appeals System</h3>
              <div className="space-y-4">
                <p className="text-gray-300">
                  If you believe your account was suspended or banned in error, you have the right to appeal.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">How to Appeal</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Email appeals@proximeet.com within 30 days</li>
                      <li>Include your username and reason for appeal</li>
                      <li>Provide any additional context or evidence</li>
                      <li>Wait for response within 7 business days</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Appeal Outcomes</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      <li>Account reinstated if suspended in error</li>
                      <li>Reduced penalty for mitigating circumstances</li>
                      <li>Upheld decision with detailed explanation</li>
                      <li>Escalation to senior review if warranted</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-red-950/20 border border-red-800 rounded-lg p-4 mt-4">
                  <p className="text-red-300">
                    <strong>Note:</strong> Appeals for serious safety violations (sexual misconduct, 
                    illegal activities, underage users) are rarely overturned and require 
                    extraordinary evidence.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Support Resources</h2>

            <div className="space-y-6">
              <div className="bg-green-950/20 border border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Safety & Support Services</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">UK Emergency Services</h4>
                    <ul className="space-y-1 text-gray-300">
                      <li><strong>Emergency:</strong> 999</li>
                      <li><strong>Non-emergency Police:</strong> 101</li>
                      <li><strong>NHS 111:</strong> 111</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Specialized Helplines</h4>
                    <ul className="space-y-1 text-gray-300">
                      <li><strong>National Domestic Violence:</strong> 0808 2000 247</li>
                      <li><strong>Rape Crisis:</strong> 0808 802 9999</li>
                      <li><strong>Samaritans:</strong> 116 123</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-purple-950/20 border border-purple-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-4">Sexual Health Resources</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Testing & Treatment</h4>
                    <ul className="space-y-1 text-gray-300">
                      <li><strong>NHS Sexual Health:</strong> nhs.uk/live-well/sexual-health</li>
                      <li><strong>Find a clinic:</strong> sh24.org.uk</li>
                      <li><strong>Free testing:</strong> Local GUM clinics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Information & Support</h4>
                    <ul className="space-y-1 text-gray-300">
                      <li><strong>Sexual Health Line:</strong> 0300 123 7123</li>
                      <li><strong>Contraception advice:</strong> Your GP or local clinic</li>
                      <li><strong>Brook (under 25):</strong> brook.org.uk</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-purple-950/20 border border-purple-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">7. Community Commitment</h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                These guidelines exist to protect our community and ensure everyone can explore 
                their sexuality safely and consensually. By following these guidelines, you help 
                create a space where adults can connect authentically without fear of harassment 
                or harm.
              </p>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Remember:</h3>
                <ul className="space-y-1 list-disc list-inside text-gray-300">
                  <li>Consent is sexy and non-negotiable</li>
                  <li>Everyone deserves respect regardless of their preferences</li>
                  <li>Your safety and the safety of others is our top priority</li>
                  <li>When in doubt, ask for clarification or seek help</li>
                  <li>Together, we can build a safer space for adult connections</li>
                </ul>
              </div>
              
              <p className="text-purple-300 font-semibold">
                Thank you for being part of our community and helping us maintain these standards.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            Questions about our guidelines? Contact us at{" "}
            <a href="mailto:community@proximeet.com" className="text-purple-400 hover:underline">
              community@proximeet.com
            </a>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Last updated: September 4, 2025 | Version 1.0
          </p>
        </div>
      </div>
    </div>
  );
}
