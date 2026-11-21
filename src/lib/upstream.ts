const API_URL = process.env.UPSTREAM_API_URL!;
const API_KEY = process.env.UPSTREAM_API_KEY!;

async function call(params: Record<string, string | number>) {
  if (!API_URL || !API_KEY) throw new Error("Upstream API URL or key is not configured");
  const body = new URLSearchParams({ key: API_KEY, ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) });
  const res = await fetch(API_URL, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(50_000),
  });
  if (!res.ok) throw new Error(`Upstream API returned HTTP ${res.status}`);
  try {
    return await res.json();
  } catch {
    throw new Error("Upstream API returned invalid JSON");
  }
}

export async function getServices() {
  return call({ action: "services" });
}

export async function createOrder(serviceId: string, link: string, quantity: number, comment?: string) {
  return call({ action: "add", service: serviceId, link, quantity, ...(comment ? { comments: comment } : {}) });
}

export async function getOrderStatus(orderId: string) {
  return call({ action: "status", order: orderId });
}

export async function getOrdersStatus(orderIds: string[]) {
  return call({ action: "status", orders: orderIds.join(",") });
}

export async function getBalance() {
  return call({ action: "balance" });
}
