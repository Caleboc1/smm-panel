interface Props { stats: { totalOrders: number; totalUsers: number } }

export function StatsBar({ stats }: Props) {
  const items = [
    { label: "Orders Completed", value: (stats.totalOrders + 72000000).toLocaleString() + "+" },
    { label: "Active Customers", value: stats.totalUsers.toLocaleString() + "+" },
    { label: "Starting Price", value: "₦8 / 1K" },
    { label: "Uptime", value: "99.9%" },
  ];
  return (
    <section className="border-y border-white/5 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gradient mb-1" style={{fontFamily:"var(--font-grotesk)"}}>{item.value}</div>
            <div className="text-sm text-foreground">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
