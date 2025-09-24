// app/api/admin/orders-export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sb } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  // --- vstupní parametry ?from=YYYY-MM-DD&to=YYYY-MM-DD (volitelné) ---
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ?? new Date().toISOString().slice(0, 10);
  const to = searchParams.get("to") ?? new Date().toISOString().slice(0, 10);

  // celé dny v UTC (00:00–23:59), aby to nepadalo na timezonech
  const fromISO = new Date(`${from}T00:00:00Z`).toISOString();
  const toISO = new Date(`${to}T23:59:59Z`).toISOString();

  // --- dotaz na objednávky v rozsahu ---
  const { data, error } = await sb
    .from("orders")
    .select(
      "id,created_at,status,payment_status,total,address_text,courier_id"
    )
    .gte("created_at", fromISO)
    .lte("created_at", toISO)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // --- bezpečné zpracování dat (data může být null/undefined) ---
  const header = [
    "id",
    "created_at",
    "status",
    "payment_status",
    "total",
    "address_text",
    "courier_id",
  ];
  const safeData: any[] = Array.isArray(data) ? data : [];

  // převod na CSV (prázdná pole vyplníme prázdným stringem)
  const rows = safeData.map((o: any) =>
    header.map((h) => (o?.[h] ?? "")).join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="orders.csv"',
      "Cache-Control": "no-store",
    },
  });
}
