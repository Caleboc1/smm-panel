const API_URL = process.env.UPSTREAM_API_URL!;
const API_KEY = process.env.UPSTREAM_API_KEY!;

async function call(params: Record<string, string | number>) {
  const body = new URLSearchParams({ key: API_KEY, ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) });
  const res = await fetch(API_URL, { method: "POST", body });
  return res.json();
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
