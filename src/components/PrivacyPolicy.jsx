const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen  text-white px-6 sm:px-12 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-center text-gray-300 mb-10">Last Updated: {new Date().toLocaleDateString()}</p>

        {/* Section Template */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-secondary">1. Introduction</h2>
          <p className="text-gray-300 leading-relaxed">
            Welcome to <strong>TechSillies</strong> (“we”, “our”, “us”). We are committed to protecting your
            privacy and ensuring that your personal information is handled responsibly. This Privacy Policy
            explains how we collect, use, and protect your data when you use
            <strong> techsillies.com</strong> and our services.
          </p>
        </section>

        {/* SECTION 2 - Information We Collect */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-secondary">2. Information We Collect</h2>

          <h3 className="text-xl font-semibold mt-4 text-primary">2.1 Personal Information</h3>
          <p className="text-gray-300 leading-relaxed">
            When you sign up or use TechSillies, we may collect:
          </p>
          <ul className="list-disc list-inside text-gray-400 mt-2">
            <li>Full name</li>
            <li>Email address</li>
            <li>Profile image</li>
            <li>Gender (if provided)</li>
            <li>Location or travel preferences</li>
            <li>Google OAuth information</li>
            <li>Information you add to your profile</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 text-primary">2.2 Usage Data</h3>
          <ul className="list-disc list-inside text-gray-400 mt-2">
            <li>IP address & device information</li>
            <li>Browser type & version</li>
            <li>Pages visited</li>
            <li>Time spent on the website</li>
            <li>Interaction logs</li>
            <li>Cookies & session data</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 text-primary">2.3 Chat Data (Encrypted)</h3>
          <p className="text-gray-300 leading-relaxed">When you use our chat feature, we collect:</p>
          <ul className="list-disc list-inside text-gray-400 mt-2">
            <li>Messages sent and received (end to end encrypted) </li>
            <li>Attachments (end to end encrypted)</li>
            <li>Timestamps</li>
          </ul>
        </section>

        {/* SECTION 3 - Usage */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-secondary">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Create and manage your account</li>
            <li>Match you with other users</li>
            <li>Enable chat and interaction features</li>
            <li>Improve platform performance</li>
            <li>Send notifications</li>
            <li>Prevent fraud and abuse</li>
            <li>Provide customer support</li>
          </ul>
        </section>

        {/* SECTION 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-secondary">4. How We Share Your Information</h2>
          <p className="text-gray-300 leading-relaxed">We may share your data with:</p>

          <h3 className="text-xl font-semibold mt-3 text-primary">4.1 Service Providers</h3>
          <ul className="list-disc list-inside text-gray-400">
            <li>AWS (Hosting)</li>
            <li>Cloudflare (Security & CDN)</li>
            <li>Cloudinary (Image hosting)</li>
            <li>Analytics tools</li>
          </ul>

          <h3 className="text-xl font-semibold mt-3 text-primary">4.2 Legal Authorities</h3>
          <p className="text-gray-300">
            Only when required for law enforcement, fraud prevention, or court orders.
          </p>

          <h3 className="text-xl font-semibold mt-3 text-primary">4.3 Other Users</h3>
          <p className="text-gray-300">
            Information shared **only when you choose** to connect, chat, or interact.
          </p>
        </section>

        {/* SECTION 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-secondary">5. Data Retention</h2>
          <p className="text-gray-300 leading-relaxed">
            We keep your data as long as your account remains active. Upon deletion, data is permanently
            removed except where legally required.
          </p>
        </section>

        {/* SECTION 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-secondary">6. Your Rights</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Access your data</li>
            <li>Correct or update data</li>
            <li>Delete your account</li>
            <li>Request a copy of your data</li>
            <li>Withdraw consent</li>
          </ul>
        </section>

        {/* SECTION 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-secondary">7. Security Measures</h2>
          <p className="text-gray-300">
            We use encryption, secure cookies, JWT authentication, Cloudflare security layers, and secure
            database handling. However, no system is 100% secure.
          </p>
        </section>

        {/* SECTION 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-secondary">8. Children’s Privacy</h2>
          <p className="text-gray-300">
            TechSillies is not intended for users under 16. If a minor registered, please contact us for
            immediate removal.
          </p>
        </section>

        {/* SECTION 9 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-secondary">9. Third-Party Services</h2>
          <p className="text-gray-300">
            External services (Google, Cloudinary, AWS, Cloudflare) follow their own privacy policies.
          </p>
        </section>

        {/* SECTION 10 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-secondary">10. Updates to This Policy</h2>
          <p className="text-gray-300">
            We may update this policy anytime. Updates will be posted on this page with a new date.
          </p>
        </section>

        {/* SECTION 11 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-secondary">11. Contact Us</h2>
          <p className="text-gray-300">
            If you have any questions, please contact us at:
            <span className="block mt-2 text-primary font-semibold">support@techsillies.com</span>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
