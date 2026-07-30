import type { Metadata } from "next";
import { getBusinessInfo, InfoPage } from "@/components/landing/InfoPage";

const { appName } = getBusinessInfo();

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `${appName} privacy policy for customer account, order, and payment information.`,
};

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      intro={`This Privacy Policy explains how ${appName} collects and uses information needed to operate customer accounts, process orders, and provide support.`}
      sections={[
        {
          title: "Information we collect",
          body: [
            "We collect account information such as name, email address, password, wallet balance, API key, order history, support messages, and transaction references.",
            "When customers place orders, we collect the public profile link, post link, channel link, username, quantity, and other details required to process the selected service.",
          ],
        },
        {
          title: "Payments",
          body: [
            "Payments are currently processed through manual bank transfer. We store payment references, transaction amounts, status, and related account records so we can reconcile wallet top-ups, orders, refunds, and disputes.",
          ],
        },
        {
          title: "How we use information",
          body: [
            "We use customer information to create accounts, process wallet funding, fulfill orders, update order statuses, prevent misuse, respond to support requests, and keep basic accounting and compliance records.",
            "We may share only the information required to process an order or payment with payment processors, fulfillment partners, service providers, or authorities where required by law.",
          ],
        },
        {
          title: "Data security and retention",
          body: [
            "We use reasonable technical and operational measures to protect customer records. No online system is completely risk-free, so customers should use strong passwords and keep account credentials private.",
            "We retain order and transaction records for business, support, fraud prevention, accounting, and legal compliance purposes.",
          ],
        },
        {
          title: "Customer choices",
          body: [
            "Customers may contact support to request account help, corrections to account details, or review of stored personal information where applicable.",
          ],
        },
      ]}
    />
  );
}
