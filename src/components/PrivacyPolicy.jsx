/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  const currentLocaleDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Helper for consistent section wrapper styling
  const PolicySection = ({ title, children, isMainHeader = false }) => (
    <section className="mb-8 p-4 md:p-6 bg-gray-800/25 border border-gray-700/50 rounded-xl shadow-lg">
      <h2
        className={`font-semibold mb-3 ${isMainHeader ? "text-2xl text-secondary" : "text-xl text-primary"}`}
      >
        {title}
      </h2>
      <div className="text-gray-300 leading-relaxed">{children}</div>
    </section>
  );

  // Custom List Item for better contrast and style
  const PolicyListItem = ({ children, icon: Icon = null }) => (
    <li className="flex items-start text-gray-400 mt-2">
      {Icon ? (
        <Icon className="text-secondary w-5 h-5 mr-3 mt-1 flex-shrink-0" />
      ) : (
        <span className="text-secondary w-5 h-5 mr-3 mt-1 flex-shrink-0">•</span>
      )}
      {children}
    </li>
  );

  return (
    <div className="min-h-screen  text-white px-4 sm:px-8 py-10">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent drop-shadow-md">
          Privacy Policy
        </h1>
        <p className="text-center text-gray-400 mb-10 text-sm">Last Updated: {currentLocaleDate}</p>

        {/* SECTION 1 - Introduction */}
        <PolicySection title="1. Introduction" isMainHeader>
          <p>
            Welcome to <strong>TechSillies</strong> (“we”, “our”, “us”). We are committed to protecting your
            privacy and ensuring that your personal information is handled responsibly. This Privacy Policy
            explains how we collect, use, and protect your data when you use
            <strong> techsillies.com</strong> and our services.
          </p>
        </PolicySection>

        {/* SECTION 2 - Information We Collect */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-secondary">2. Information We Collect</h2>
          <div className="p-4 md:p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg space-y-4">
            <h3 className="text-xl font-semibold text-primary border-b border-gray-700 pb-2">
              2.1 Personal Information
            </h3>
            <p className="text-gray-300 leading-relaxed">
              When you sign up or use TechSillies, we may collect:
            </p>
            <ul className="list-none text-gray-400">
              <PolicyListItem>Full name & Email address</PolicyListItem>
              <PolicyListItem>Profile image & Google OAuth information</PolicyListItem>
              <PolicyListItem>Gender & Location (if provided)</PolicyListItem>
              <PolicyListItem>
                Information you add to your public profile (Headline, Company, Skills)
              </PolicyListItem>
            </ul>

            <h3 className="text-xl font-semibold text-primary border-b border-gray-700 pb-2 pt-4">
              2.2 Usage Data
            </h3>
            <ul className="list-none text-gray-400">
              <PolicyListItem>IP address & device information (Browser type, version)</PolicyListItem>
              <PolicyListItem>Pages visited & Time spent on the website</PolicyListItem>
              <PolicyListItem>Interaction logs, Cookies & session data</PolicyListItem>
            </ul>

            <h3 className="text-xl font-semibold text-primary border-b border-gray-700 pb-2 pt-4">
              2.3 Chat Data (Encrypted)
            </h3>
            <p className="text-gray-300 leading-relaxed">When you use our chat feature, we collect:</p>
            <ul className="list-none text-gray-400">
              <PolicyListItem>Messages sent and received (end-to-end encrypted) </PolicyListItem>
              <PolicyListItem>Attachments & Timestamps (encrypted)</PolicyListItem>
            </ul>
          </div>
        </section>

        {/* SECTION 3 - Usage */}
        <PolicySection title="3. How We Use Your Information">
          <ul className="list-none text-gray-400 space-y-1">
            <PolicyListItem>To create and manage your account</PolicyListItem>
            <PolicyListItem>To match you with other users for networking</PolicyListItem>
            <PolicyListItem>To enable secure chat and interaction features</PolicyListItem>
            <PolicyListItem>To improve platform performance and personalize user experience</PolicyListItem>
            <PolicyListItem>To send essential notifications and support messages</PolicyListItem>
            <PolicyListItem>To prevent fraud and platform abuse</PolicyListItem>
          </ul>
        </PolicySection>

        {/* SECTION 4 - Sharing */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-secondary">4. How We Share Your Information</h2>
          <div className="p-4 md:p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg space-y-4">
            <h3 className="text-xl font-semibold text-primary">4.1 Service Providers</h3>
            <p className="text-gray-300">
              We share data minimally with trusted third-party services necessary for platform function: AWS
              (Hosting), Cloudflare (Security & CDN), Cloudinary (Image hosting), and Analytics tools.
            </p>

            <h3 className="text-xl font-semibold text-primary pt-3">4.2 Legal Authorities</h3>
            <p className="text-gray-300">
              Only when legally required for law enforcement, fraud prevention, or valid court orders.
            </p>

            <h3 className="text-xl font-semibold text-primary pt-3">4.3 Other Users (Controlled Sharing)</h3>
            <p className="text-gray-300">
              Information (your profile data, chat messages) is shared **only when you choose** to connect,
              chat, or initiate a referral request with another user.
            </p>
          </div>
        </section>

        {/* SECTION 5 - Data Retention */}
        <PolicySection title="5. Data Retention">
          <p>
            We keep your data as long as your account remains active. Upon account deletion, all associated
            data is permanently removed from our active servers, except for necessary records retained for
            legal or accounting requirements.
          </p>
        </PolicySection>

        {/* SECTION 6 - Your Rights */}
        <PolicySection title="6. Your Rights">
          <ul className="list-none text-gray-400 space-y-1">
            <PolicyListItem>Access your data (Right to Access)</PolicyListItem>
            <PolicyListItem>Correct or update data (Right to Rectification)</PolicyListItem>
            <PolicyListItem>Delete your account (Right to Erasure)</PolicyListItem>
            <PolicyListItem>Request a copy of your data (Data Portability)</PolicyListItem>
            <PolicyListItem>Withdraw consent (if applicable)</PolicyListItem>
          </ul>
        </PolicySection>

        {/* SECTION 7 - Security Measures */}
        <PolicySection title="7. Security Measures">
          <p>
            We employ industry-standard security measures including **encryption (TLS/SSL)**, secure cookies,
            **JWT authentication**, Cloudflare security layers, and secure database handling. However, please
            note that no system on the internet is 100% secure.
          </p>
        </PolicySection>

        {/* SECTION 8 - Children’s Privacy */}
        <PolicySection title="8. Children’s Privacy">
          <p>
            TechSillies is not intended for users under **16 years of age**. If we become aware that a minor
            has registered, we will take immediate steps to remove their information. Please contact us if you
            suspect a minor has registered.
          </p>
        </PolicySection>

        {/* SECTION 9 & 10 */}
        <PolicySection title="9. Third-Party Services & 10. Updates to This Policy">
          <p className="pb-3 border-b border-gray-700/50">
            External services (Google, Cloudinary, AWS, Cloudflare) used by our platform follow their own
            privacy policies. We are not responsible for their data practices.
          </p>
          <p className="pt-3">
            We may update this policy anytime. Any updates will be posted on this page, and the "Last Updated"
            date at the top will be revised accordingly.
          </p>
        </PolicySection>

        {/* SECTION 11 - Contact Us */}
        <PolicySection title="11. Contact Us">
          <p>
            If you have any questions or concerns regarding this Privacy Policy or your data, please contact
            us at:
            <span className="block mt-2 text-secondary font-semibold text-lg">support@techsillies.com</span>
          </p>
        </PolicySection>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
