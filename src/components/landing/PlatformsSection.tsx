const platforms = [
  { name: "Instagram", emoji: "📸" },
  { name: "TikTok", emoji: "🎵" },
  { name: "YouTube", emoji: "▶️" },
  { name: "Twitter/X", emoji: "✖️" },
  { name: "Telegram", emoji: "✈️" },
  { name: "Facebook", emoji: "👤" },
  { name: "Spotify", emoji: "🎧" },
  { name: "LinkedIn", emoji: "💼" },
  { name: "Snapchat", emoji: "👻" },
  { name: "Discord", emoji: "🎮" },
];

export function PlatformsSection() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{fontFamily:"var(--font-grotesk)"}}>Every Platform. One Panel.</h2>
          <p className="text-white/50">Grow across all major social networks from one dashboard</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {platforms.map((p) => (
            <div key={p.name} className="surface-2 border-subtle rounded-xl p-4 flex flex-col items-center gap-2 hover:border-violet-500/30 transition-all hover:-translate-y-1 cursor-default">
              <span className="text-2xl">{p.emoji}</span>
              <span className="text-sm font-medium text-white/80">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
