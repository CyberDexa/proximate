import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
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
            <h1 className="text-3xl font-bold">Terms of Service</h1>
            <p className="text-gray-400 mt-2">Last updated: September 4, 2025</p>
          </div>
        </div>

        {/* Age Warning */}
        <Card className="bg-red-950/20 border-red-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              18+ ADULTS ONLY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-300">
              ProxiMeet is exclusively for adults aged 18 and over. By using this service, 
              you confirm that you are of legal age and consent to view adult content 
              related to casual encounters and intimate relationships.
            </p>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-400" />
              1. Acceptance of Terms
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                By accessing or using ProxiMeet ("the Service"), you agree to be bound by these 
                Terms of Service ("Terms"). If you disagree with any part of these terms, you 
                may not access the Service.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you and ProxiMeet Ltd, 
                a company registered in England and Wales.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Age Verification & Eligibility</h2>
            <div className="space-y-4 text-gray-300">
              <div className="bg-amber-950/20 border border-amber-800 rounded-lg p-4">
                <h3 className="font-semibold text-amber-400 mb-2">Mandatory Requirements:</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>You must be at least 18 years old</li>
                  <li>You must provide valid government-issued photo ID for verification</li>
                  <li>You must complete our consent education module</li>
                  <li>You must agree to our Community Guidelines</li>
                </ul>
              </div>
              <p>
                We use automated age verification systems and manual review processes. 
                Providing false age information is grounds for immediate account termination 
                and may constitute a criminal offense under UK law.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              3. Consent & Safety Policies
            </h2>
            <div className="space-y-4 text-gray-300">
              <h3 className="text-lg font-semibold text-blue-400">Consent Framework</h3>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li>All interactions must be consensual between adults</li>
                <li>Consent can be withdrawn at any time</li>
                <li>Users must respect clearly communicated boundaries</li>
                <li>No means no - failure to respect this will result in immediate ban</li>
              </ul>

              <h3 className="text-lg font-semibold text-blue-400 mt-6">Safety Commitments</h3>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li>We provide safety tools including panic buttons and location sharing</li>
                <li>We maintain 24/7 safety monitoring and rapid response teams</li>
                <li>We cooperate fully with law enforcement when required</li>
                <li>We implement comprehensive background checking options</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
            <div className="space-y-4 text-gray-300">
              <h3 className="text-lg font-semibold">You agree to:</h3>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li>Provide accurate, truthful information about yourself</li>
                <li>Use recent, unfiltered photos that clearly show your face</li>
                <li>Respect other users' privacy and boundaries</li>
                <li>Report inappropriate behavior immediately</li>
                <li>Use safety features responsibly</li>
                <li>Comply with all applicable laws in your jurisdiction</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6">You agree NOT to:</h3>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li>Engage in any form of harassment or abuse</li>
                <li>Share intimate content without explicit consent</li>
                <li>Solicit or offer money for sexual services</li>
                <li>Use the platform for any illegal activities</li>
                <li>Create fake profiles or impersonate others</li>
                <li>Share personal information of other users</li>
                <li>Attempt to bypass safety or age verification systems</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Prohibited Activities</h2>
            <div className="bg-red-950/20 border border-red-800 rounded-lg p-6">
              <h3 className="font-semibold text-red-400 mb-4">Zero Tolerance for:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <ul className="space-y-2 list-disc list-inside text-gray-300">
                    <li>Non-consensual behavior of any kind</li>
                    <li>Sexual harassment or coercion</li>
                    <li>Sharing intimate images without consent</li>
                    <li>Underage users or content</li>
                    <li>Prostitution or escort services</li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2 list-disc list-inside text-gray-300">
                    <li>Revenge porn or blackmail</li>
                    <li>Hate speech or discrimination</li>
                    <li>Violence or threats of violence</li>
                    <li>Drug dealing or illegal substances</li>
                    <li>Spam or commercial solicitation</li>
                  </ul>
                </div>
              </div>
              <p className="text-red-300 mt-4 font-semibold">
                Violation of these policies will result in immediate account termination 
                and may be reported to law enforcement.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Privacy & Data Protection</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Your privacy is paramount. We comply fully with UK GDPR and Data Protection Act 2018. 
                See our <Link href="/legal/privacy-policy" className="text-purple-400 hover:underline">
                Privacy Policy</Link> for detailed information about how we collect, use, and protect your data.
              </p>
              <div className="bg-purple-950/20 border border-purple-800 rounded-lg p-4">
                <h3 className="font-semibold text-purple-400 mb-2">Key Privacy Rights:</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Right to access your personal data</li>
                  <li>Right to correct inaccurate data</li>
                  <li>Right to delete your account and data</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Content Ownership & Usage</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                You retain ownership of all content you upload. By using the Service, you grant 
                us a limited license to display your content to other users as part of the Service.
              </p>
              <p>
                We may use anonymized, aggregated data for safety research and platform improvements. 
                Individual user content is never shared with third parties without explicit consent.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Subscription & Payment Terms</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Premium features are available through monthly subscriptions. All payments are 
                processed securely through Stripe. You may cancel at any time without penalty.
              </p>
              <div className="bg-green-950/20 border border-green-800 rounded-lg p-4">
                <h3 className="font-semibold text-green-400 mb-2">Fair Billing Practices:</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>No hidden fees or charges</li>
                  <li>Clear pricing displayed upfront</li>
                  <li>Easy cancellation process</li>
                  <li>Pro-rated refunds for unused periods</li>
                  <li>Safety features always remain free</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Account Termination</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We reserve the right to terminate accounts that violate these Terms or pose 
                a safety risk to our community. Serious violations may result in immediate 
                termination without warning.
              </p>
              <p>
                You may delete your account at any time. Upon deletion, your data will be 
                permanently removed within 30 days, except where retention is required by law.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Legal Compliance & Jurisdiction</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                These Terms are governed by the laws of England and Wales. Any disputes will 
                be subject to the exclusive jurisdiction of English courts.
              </p>
              <p>
                We comply with UK regulations including the Online Safety Act 2023, Digital 
                Markets Act, and all applicable data protection legislation.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact & Support</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                For questions about these Terms or to report safety concerns:
              </p>
              <div className="bg-gray-800 rounded-lg p-4">
                <p><strong>Safety Emergency:</strong> support@proximeet.com (24/7)</p>
                <p><strong>Legal Questions:</strong> legal@proximeet.com</p>
                <p><strong>Data Protection Officer:</strong> dpo@proximeet.com</p>
                <p><strong>Company Address:</strong> ProxiMeet Ltd, [Address], London, UK</p>
              </div>
            </div>
          </section>

          <section className="bg-purple-950/20 border border-purple-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">12. Acknowledgment</h2>
            <p className="text-gray-300">
              By using ProxiMeet, you acknowledge that you have read, understood, and agree 
              to be bound by these Terms of Service. You confirm that you are at least 18 
              years old and legally capable of entering into this agreement.
            </p>
            <p className="text-purple-300 mt-4 font-semibold">
              These Terms may be updated periodically. Continued use of the Service constitutes 
              acceptance of any changes.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            Questions? Contact us at{" "}
            <a href="mailto:legal@proximeet.com" className="text-purple-400 hover:underline">
              legal@proximeet.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
