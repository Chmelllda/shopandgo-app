import Link from 'next/link'
import { sb } from '@/lib/supabase-admin'

export default async function OrdersPage() {
  const { data = [], error } = await sb.from('orders')
    .select('id, status, total, created_at, payment_status, courier_id, address_text')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) return <p className="text-red-600">{error.message}</p>

  const today = new Date().toISOString().slice(0,10)
  return (
    <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
        <div className="font-semibold">Objednávky</div>
        <a className="text-[#FF5C1C] hover:underline text-sm"
           href={`/api/admin/orders-export?from=${today}&to=${today}`}>
          Export CSV (dnes)
        </a>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-black/5">
          <tr>
            <th className="text-left px-4 py-2">Objednávka</th>
            <th className="text-left px-4 py-2">Stav</th>
            <th className="text-left px-4 py-2">Adresa</th>
            <th className="text-right px-4 py-2">Celkem</th>
            <th className="text-left px-4 py-2">Platba</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((o:any)=> (
            <tr key={o.id} className="border-t border-black/10">
              <td className="px-4 py-3 font-semibold">#{o.id.slice(0,8)}<div className="text-black/60 text-xs">{new Date(o.created_at).toLocaleString()}</div></td>
              <td className="px-4 py-3">{statusLabel(o.status)}</td>
              <td className="px-4 py-3">{o.address_text || '—'}</td>
              <td className="px-4 py-3 text-right">{Number(o.total).toFixed(2)} Kč</td>
              <td className="px-4 py-3">{o.payment_status==='paid' ? 'Zaplaceno' : 'Nezaplaceno'}</td>
              <td className="px-4 py-3 text-right"><Link className="text-[#FF5C1C] hover:underline" href={`/orders/${o.id}`}>Detail</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
function statusLabel(s: string){
  switch(s){ case 'received': return 'Přijato'; case 'shopping': return 'Nakupujeme'; case 'on_route': return 'Na cestě'; case 'delivered': return 'Doručeno'; default: return s }
}
