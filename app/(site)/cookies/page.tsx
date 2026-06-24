import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      intro="Last updated June 2026. Here's what cookies do on Chizzy Eats."
      sections={[
        {
          heading: "Essential Cookies",
          body: "A small number of cookies keep core site features working, like remembering your admin session when you're signed in.",
        },
        {
          heading: "No Tracking Ads",
          body: "This site doesn't run third-party advertising trackers. We don't sell your browsing data.",
        },
        {
          heading: "Managing Cookies",
          body: "You can clear or block cookies at any time through your browser settings — the site will still work, though signed-in features may require logging in more often.",
        },
      ]}
    />
  );
}
