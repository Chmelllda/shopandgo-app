import { sb } from '@/lib/supabase-admin'

export default async function Page() {
  const start = new Date(new Date().setHours(0,0,0,0)).toISOString()
  const { data = [], error } = await sb.from('orders')
    .select('status, total, created_at, payment_status')
    .gte('created_at', start)
  if (error) return <p className="text-red-600">{error.message}</p>

  const count = data.length
  const revenue = data.reduce((s: number, o: any)=> s + Number(o.total||0), 0)
  const paid = data.filter((o:any)=> o.payment_status==='paid').length
  const byStatus: Record<string, number> = {}
  data.forEach((o:any)=> { byStatus[o.status] = (byStatus[o.status]||0)+1 })

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <Card label="Objednávky dnes" value={String(count)} />
      <Card label="Obrat dnes" value={`${revenue.toFixed(2)} Kč`} />
      <Card label="Zaplacené" value={String(paid)} />
      <Card label="Stavy" value={`Přijato:${byStatus.received||0} • Nakup:${byStatus.shopping||0} • Na cestě:${byStatus.on_route||0}`} />
    </div>
  )
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-black/10">
      <div className="text-xs text-black/60">{label}</div>
      <div className="text-2xl font-extrabold mt-1">{value}</div>
    </div>
  )
}
