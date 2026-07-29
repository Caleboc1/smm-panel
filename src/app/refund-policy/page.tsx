import type { Metadata } from "next";
import { getBusinessInfo, InfoPage } from "@/components/landing/InfoPage";

const { appName } = getBusinessInfo();

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `${appName} refund policy for wallet funding and digital social media marketing orders.`,
};

export default function RefundPolicyPage() {
  return (
    <InfoPage
      eyebrow="Refund Policy"
      title="Refund Policy"
      intro={`This Refund Policy explains how ${appName} reviews wallet funding issues, failed orders, and eligible service complaints.`}
      sections={[
        {
          title: "Wallet funding",
          body: [
            "If a successful Paystack payment is not credited to a customer wallet, the customer should contact support with the payment reference. After verification, we will credit the wallet or resolve the duplicate or failed transaction issue.",
            "Wallet funding may be refundable only where the funds have not been used for orders and the payment can be traced and verified.",
          ],
        },
        {
          title: "Digital service orders",
          body: [
            "Orders that have already started or completed are generally not refundable because the service is digital and may involve irreversible delivery.",
            "A refund, wallet credit, replacement, or refill may be considered where an order fails to start, is cancelled by the system, is charged twice, or the selected service explicitly includes refill or replacement support.",
          ],
        },
        {
          title: "When refunds may be declined",
          body: [
            "Refunds may be declined where the customer submitted an incorrect link, changed the username, deleted the content, made the account private, ordered a service for content that violates platform rules, or requested cancellation after delivery started.",
            "Refunds may also be declined for losses caused by platform updates, account restrictions, content removal, or other factors outside our direct control after a service has been delivered.",
          ],
        },
        {
          title: "How to request a review",
          body: [
            "Contact support with your account email, order ID, payment reference, service name, link submitted, and a clear explanation of the issue.",
            "Approved refunds are usually processed as wallet credit unless a direct reversal is required and available through the payment channel.",
          ],
        },
      ]}
    />
  );
}
