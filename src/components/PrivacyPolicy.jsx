const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-200">
      <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>
      <p className="mb-4">
        Welcome to TechSillies! Your privacy is important to us. This Privacy Policy outlines how we collect,
        use, and protect your personal information when you use our platform.
      </p>

      <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>
          <strong>Personal Information:</strong> Name, email, profile picture.
        </li>
        <li>
          <strong>Chat Data:</strong> Messages and interactions with users (encrypted).
        </li>
        <li>
          <strong>Technical Data:</strong> IP address, browser type, and device details.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">2. How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>To provide and improve platform features.</li>
        <li>To ensure a secure and safe chatting experience.</li>
        <li>To communicate updates and support messages.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">3. Data Sharing and Protection</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>We do not sell, rent, or trade your data.</li>
        <li>Data may be shared with law enforcement if required by law.</li>
        <li>Messages are encrypted to ensure privacy.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">4. Cookies and Tracking</h2>
      <p className="mb-4">
        We use cookies to enhance user experience, such as remembering login sessions and improving website
        functionality.
      </p>

      <h2 className="text-xl font-semibold mt-6">5. Your Rights</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Access, edit, or delete your personal data.</li>
        <li>Opt out of non-essential communications.</li>
        <li>Request account deletion at any time.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">6. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Continued use of TechSillies means you accept any
        modifications.
      </p>

      <h2 className="text-xl font-semibold mt-6">7. Contact Us</h2>
      <p className="mb-4">
        For any privacy concerns, contact us at{" "}
        <a href="mailto:support@techsillies.com" className="text-blue-600">
          support@techsillies.com
        </a>
        .
      </p>
    </div>
  );
};

export default PrivacyPolicy;
