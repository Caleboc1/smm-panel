import Link from "next/link";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "SMMPanel";
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "calsmm@kmail.li";

type Section = {
  title: string;
  body: string[];
};

export function getBusinessInfo() {
  return { appName: APP_NAME, supportEmail: SUPPORT_EMAIL };
}

export function InfoPage({
  eyebrow,
  title,
  intro,
  sections,
  updated = "July 29, 2026",
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
  updated?: string;
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      <LandingNav />
      <section className="px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="font-space-mono text-xs font-semibold uppercase tracking-widest text-violet-600">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-extrabold text-gray-950 sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">{intro}</p>
            <p className="mt-3 font-space-mono text-xs text-gray-400">Last updated: {updated}</p>
          </div>

          <div className="space-y-4">
            {sections.map((section) => (
              <section key={section.title} className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="text-lg font-bold text-gray-950">{section.title}</h2>
                <div className="mt-3 space-y-3 text-sm leading-6 text-gray-600">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-violet-200 bg-violet-50 p-5 text-sm text-gray-700">
            For questions, order issues, refunds, or account support, contact{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-violet-700 hover:text-violet-600">
              {SUPPORT_EMAIL}
            </a>
            . You can also browse available services from the{" "}
            <Link href="/services" className="font-semibold text-violet-700 hover:text-violet-600">
              services page
            </Link>
            .
          </div>
        </div>
      </section>
      <LandingFooter />
    </main>
  );
}
