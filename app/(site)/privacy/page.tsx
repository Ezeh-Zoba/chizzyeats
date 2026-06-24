import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      intro="Last updated June 2026. Here's how Chizzy Eats handles your information."
      sections={[
        {
          heading: "What We Collect",
          body: "When you subscribe to the newsletter or get in touch through the contact form, we collect your name and email address so we can respond to you and send the recipes you've signed up for.",
        },
        {
          heading: "How We Use It",
          body: "Your email is used only to send the weekly newsletter and reply to messages — never sold or shared with third parties.",
        },
        {
          heading: "Cookies",
          body: "We use a minimal set of cookies to keep the site running smoothly. See our Cookies page for details.",
        },
        {
          heading: "Your Choices",
          body: "You can unsubscribe from the newsletter at any time, and you can reach out via the Contact page to request your data be removed.",
        },
      ]}
    />
  );
}
