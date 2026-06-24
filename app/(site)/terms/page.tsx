import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Use"
      intro="Last updated June 2026. By using Chizzy Eats, you agree to the following."
      sections={[
        {
          heading: "Using the Site",
          body: "Chizzy Eats is provided for personal, non-commercial use. You're welcome to cook every recipe, share links to the site, and quote short excerpts with credit.",
        },
        {
          heading: "Recipe Content",
          body: "Recipes, photos, and written content on this site are the original work of Chizzy unless otherwise credited, and may not be republished in full without permission.",
        },
        {
          heading: "No Guarantees",
          body: "Recipes are tested with care, but cooking results can vary by ingredients, equipment, and skill level. Use your judgement, especially around food safety and allergies.",
        },
        {
          heading: "Changes",
          body: "These terms may be updated from time to time as the site grows — the latest version will always be posted on this page.",
        },
      ]}
    />
  );
}
