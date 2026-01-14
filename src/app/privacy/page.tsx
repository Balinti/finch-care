export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Privacy Policy</h1>

      <div className="prose prose-slate max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Overview</h2>
          <p className="text-slate-600">
            Finch Care is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights regarding your information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Data We Collect</h2>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li><strong>Account information:</strong> Email address and encrypted password when you create an account.</li>
            <li><strong>Usage data:</strong> Your progress through lessons, regulation session history, GAD-2 responses, and panic counts (if you choose to track them).</li>
            <li><strong>Rewards data:</strong> Points balance and unlocked cosmetics.</li>
            <li><strong>Payment information:</strong> Processed securely by Stripe. We do not store credit card details.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">How We Use Your Data</h2>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>To provide and improve the app&apos;s features</li>
            <li>To sync your progress across devices</li>
            <li>To process subscription payments</li>
            <li>To display your personal progress and trends</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Data Sharing</h2>
          <p className="text-slate-600">
            We do not sell your data or share it with third parties for advertising purposes. Your health and progress data is never shared with anyone. We only share data with service providers necessary to operate the app (Supabase for database, Stripe for payments).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Anonymous Use</h2>
          <p className="text-slate-600">
            You can use Finch Care without creating an account. When used anonymously, all your data is stored locally on your device and never transmitted to our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Your Rights</h2>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Request a copy of your data</li>
            <li>Request deletion of your account and data</li>
            <li>Export your progress data</li>
          </ul>
          <p className="text-slate-600 mt-3">
            To exercise these rights, contact support through the app.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Data Security</h2>
          <p className="text-slate-600">
            We use industry-standard security measures to protect your data, including encryption in transit and at rest. Authentication is handled by Supabase Auth with secure password hashing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Health Information</h2>
          <p className="text-slate-600">
            The information you provide (GAD-2 responses, panic counts, etc.) is for your personal use only. We are not a healthcare provider and do not use this information for medical purposes. This data is never shared with healthcare providers, insurance companies, or any third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Updates</h2>
          <p className="text-slate-600">
            We may update this policy from time to time. Significant changes will be communicated through the app.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Contact</h2>
          <p className="text-slate-600">
            For privacy-related questions or concerns, please contact us through the app.
          </p>
        </section>
      </div>
    </div>
  )
}
