import type { Metadata } from "next";
import { getBusinessInfo, InfoPage } from "@/components/landing/InfoPage";

const { appName } = getBusinessInfo();

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${appName} and the social media marketing services offered on the platform.`,
};

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="About"
      title={`About ${appName}`}
      intro={`${appName} is a Nigeria-based social media marketing platform that helps creators, small businesses, agencies, and digital marketers buy online promotional services in Nigerian Naira.`}
      sections={[
        {
          title: "What we offer",
          body: [
            "Customers can browse and order social media marketing services such as followers, likes, views, comments, watch time, and other engagement or visibility packages for supported platforms including Instagram, TikTok, YouTube, Facebook, Telegram, and X/Twitter.",
            "Payments are currently received through manual bank transfer for wallet top-ups and customer orders placed on the platform. Wallet balances are used by customers to pay for selected services at the displayed NGN rates.",
          ],
        },
        {
          title: "How orders work",
          body: [
            "A customer creates an account, funds their wallet, selects a service, enters the required public profile or content link, quantity, and submits an order. The platform processes the order and updates the customer dashboard with order status.",
            "Delivery times depend on the selected service, order volume, and platform conditions. Some services include refill or replacement support where clearly marked.",
          ],
        },
        {
          title: "Responsible use",
          body: [
            "Customers are expected to use the platform for lawful promotion of accounts, pages, channels, content, brands, or projects they own or are authorised to promote.",
            "We do not support fraud, impersonation, harassment, illegal content, or activities that violate applicable laws or payment rules.",
          ],
        },
      ]}
    />
  );
}
