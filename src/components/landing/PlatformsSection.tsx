"use client";

import {
  RiInstagramFill,
  RiTiktokFill,
  RiYoutubeFill,
  RiTwitterXFill,
  RiTelegramFill,
  RiFacebookBoxFill,
  RiSpotifyFill,
  RiLinkedinFill,
  RiSnapchatFill,
  RiDiscordFill
} from "react-icons/ri";

const platforms = [
  { name: "Instagram", emoji: <RiInstagramFill /> },
  { name: "TikTok", emoji: <RiTiktokFill /> },
  { name: "YouTube", emoji: <RiYoutubeFill /> },
  { name: "Twitter/X", emoji: <RiTwitterXFill /> },
  { name: "Telegram", emoji: <RiTelegramFill /> },
  { name: "Facebook", emoji: <RiFacebookBoxFill /> },
  { name: "Spotify", emoji: <RiSpotifyFill /> },
  { name: "LinkedIn", emoji: <RiLinkedinFill /> },
  { name: "Snapchat", emoji: <RiSnapchatFill /> },
  { name: "Discord", emoji: <RiDiscordFill /> },
];

export function PlatformsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 font-space-mono">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div 
          className="text-center mb-12"
          data-aos="fade-up"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-climate-crisis)" }}
          >
            Every Platform. One Panel.
          </h2>
          <p className="text-foreground/50">
            Grow across all major social networks from one dashboard
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {platforms.map((p, index) => (
            <div
              key={p.name}
              data-aos="zoom-in"
              data-aos-delay={index * 80} // 🔥 stagger effect
              className="surface-2 border-subtle rounded-xl p-4 flex flex-col items-center gap-2 
              transition-all duration-300 hover:border-violet-500/30 hover:-translate-y-1 hover:scale-[1.03] cursor-default"
            >
              <span className="text-2xl">{p.emoji}</span>
              <span className="text-sm font-medium text-foreground/80">
                {p.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}