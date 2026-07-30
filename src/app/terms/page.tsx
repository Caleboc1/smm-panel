import type { Metadata } from "next";
import { getBusinessInfo, InfoPage } from "@/components/landing/InfoPage";

const { appName } = getBusinessInfo();

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `${appName} terms of service for wallet funding and social media marketing orders.`,
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Terms"
      title="Terms of Service"
      intro={`These Terms of Service govern use of ${appName}, including account registration, wallet funding, and social media marketing orders.`}
      sections={[
        {
          title: "Services",
          body: [
            `${appName} provides access to social media marketing services such as followers, likes, views, comments, engagement, and visibility packages. Service availability, pricing, delivery speed, minimums, maximums, refill eligibility, and cancellation rules may vary by service.`,
            "Customers are responsible for reviewing the selected service details before placing an order.",
          ],
        },
        {
          title: "Customer responsibilities",
          body: [
            "Customers must provide accurate order details, including the correct profile, post, video, channel, or content link required for the selected service.",
            "Customers must only order services for accounts, pages, channels, content, brands, or projects they own or are authorised to promote. The platform must not be used for fraud, impersonation, harassment, scams, illegal content, or abusive activity.",
          ],
        },
        {
          title: "Payments and wallet balance",
          body: [
            "Payments are currently accepted through manual bank transfer to the account details displayed on the wallet page. Wallet balances are credited after successful payment confirmation.",
            "Prices are displayed in Nigerian Naira and may change based on service availability, supplier cost, or platform conditions.",
          ],
        },
        {
          title: "Delivery",
          body: [
            "Delivery starts after an order is accepted and processed. Delivery times are estimates and may be affected by queue volume, service limits, incorrect links, private accounts, deleted content, platform updates, or other external factors.",
            "Completed orders for correctly submitted links are generally not reversible because they are digital services.",
          ],
        },
        {
          title: "Account suspension",
          body: [
            "We may refuse, cancel, limit, or suspend orders or accounts that appear fraudulent, abusive, unlawful, high-risk, or in violation of these terms.",
          ],
        },
      ]}
    />
  );
}
