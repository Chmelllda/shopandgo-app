import { sb } from '@/lib/supabase-admin'

async function assign(orderId: string, courierId: string) {
  await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL || ''}/api/orders/${orderId}/assign`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courier_id: courierId })
  })
}

export default async function Page(){
  const [{ data: orders = [] }, { data: couriers = [] }] = await Promise.all([
    sb.from('orders').select('id, created_at, total, address_text').is('courier_id', null).eq('status','received').order('created_at', { ascending: true }).limit(200),
    sb.from('profiles').select('id, full_name, email').eq('role','courier').order('full_name', { ascending: true })
  ])
  async function action(formData: FormData){ 'use server'; const id = String(formData.get('id')); const cid = String(formData.get('courier')); await assign(id, cid) }
  return (
    <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-black/5"><tr><th className="text-left px-4 py-2">Objednávka</th><th className="text-left px-4 py-2">Čas</th><th className="text-left px-4 py-2">Adresa</th><th className="text-right px-4 py-2">Celkem</th><th className="px-4 py-2">Přiřadit</th></tr></thead>
        <tbody>
          {orders.length===0 ? (
            <tr><td colSpan={5} className="px-4 py-6 text-center text-black/60">Žádné nepřiřazené objednávky</td></tr>
          ) : orders.map((o:any)=> (
            <tr key={o.id} className="border-t border-black/10">
              <td className="px-4 py-3 font-semibold">#{o.id.slice(0,8)}</td>
              <td className="px-4 py-3">{new Date(o.created_at).toLocaleString()}</td>
              <td className="px-4 py-3">{o.address_text || '—'}</td>
              <td className="px-4 py-3 text-right">{Number(o.total).toFixed(2)} Kč</td>
              <td className="px-4 py-3">
                <form action={action} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <select name="courier" className="border rounded-xl px-3 py-2" defaultValue="">
                    <option value="">— vyber kurýra —</option>
                    {couriers.map((c:any)=> (<option key={c.id} value={c.id}>{c.full_name || c.email || c.id}</option>))}
                  </select>
                  <button className="bg-[#FF5C1C] text-white px-3 py-2 rounded-xl">Přiřadit</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
