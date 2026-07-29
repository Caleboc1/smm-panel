import type { Metadata } from "next";
import { getBusinessInfo, InfoPage } from "@/components/landing/InfoPage";

const { appName, supportEmail } = getBusinessInfo();

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${appName} for order, wallet, refund, and account support.`,
};

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Contact"
      title="Contact support"
      intro={`For questions about ${appName}, payments, orders, wallet funding, delivery, refunds, or account access, reach out through our support email.`}
      sections={[
        {
          title: "Support email",
          body: [
            `Email: ${supportEmail}`,
            "Please include your registered email address, order ID or payment reference where available, and a short description of the issue so we can trace the transaction or order quickly.",
          ],
        },
        {
          title: "Support scope",
          body: [
            "We handle wallet funding issues, order status checks, duplicate payment reports, refill or replacement requests for eligible services, and refund reviews under our refund policy.",
            "Support is provided for orders placed directly through this website. We may ask for additional information to verify ownership of an account or content link before handling some requests.",
          ],
        },
        {
          title: "Response time",
          body: [
            "We aim to review support messages as soon as possible. Complex order or payment issues may require additional checks with our payment processor or fulfillment provider.",
          ],
        },
      ]}
    />
  );
}
