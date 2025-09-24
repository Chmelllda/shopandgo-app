import { sb } from '@/lib/supabase-admin'

async function patch(id: string, body: any) {
  await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL || ''}/api/orders/${id}/location`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  })
}
async function refund(id: string, amount: number | null) {
  await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL || ''}/api/orders/${id}/refund`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount })
  })
}

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const { data: o, error } = await sb.from('orders')
    .select('id, status, total, created_at, address_text, eta_minutes, courier_id, payment_status')
    .eq('id', params.id).single()
  if (error) return <p className="text-red-600">{error.message}</p>

  async function setStatus(s: string) { 'use server'; await patch(params.id, { status: s }) }
  async function saveEta(formData: FormData) { 'use server'; const eta = Number(formData.get('eta') as string); await patch(params.id, { eta_minutes: isFinite(eta)? eta : null }) }
  async function doRefund(formData: FormData) { 'use server'; const raw = formData.get('amount') as string; await refund(params.id, raw ? Number(raw) : null) }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-black/10 p-4">
        <h2 className="text-lg font-bold mb-2">Objednávka #{o.id.slice(0,8)}</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Field label="Stav" value={statusLabel(o.status)} />
          <Field label="Čas" value={new Date(o.created_at).toLocaleString()} />
          <Field label="Adresa" value={o.address_text || '—'} />
          <Field label="Platba" value={o.payment_status==='paid' ? 'Zaplaceno' : 'Nezaplaceno'} />
          <Field label="Celkem" value={`${Number(o.total).toFixed(2)} Kč`} />
          <Field label="Kurýr" value={o.courier_id || '—'} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/10 p-4 space-y-3">
        <div>
          <div className="text-sm font-semibold mb-1">Změna stavu</div>
          <div className="flex gap-2 flex-wrap">
            <Btn action={async ()=> setStatus('shopping')}>Nakupujeme</Btn>
            <Btn action={async ()=> setStatus('on_route')}>Na cestě</Btn>
            <Btn action={async ()=> setStatus('delivered')}>Doručeno</Btn>
          </div>
        </div>
        <form action={saveEta} className="flex items-end gap-2">
          <div>
            <label className="text-xs text-black/60">ETA (min)</label>
            <input name="eta" defaultValue={o.eta_minutes ?? ''} className="border rounded-xl px-3 py-2" placeholder="45" />
          </div>
          <button className="bg-[#FF5C1C] text-white px-4 py-2 rounded-xl">Uložit ETA</button>
        </form>
        <form action={doRefund} className="flex items-end gap-2">
          <div>
            <label className="text-xs text-black/60">Refund (Kč) – prázdné = plný</label>
            <input name="amount" className="border rounded-xl px-3 py-2" placeholder="např. 199" />
          </div>
          <button className="bg-black text-white px-4 py-2 rounded-xl">Refund</button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }){
  return <div className="bg-black/5 rounded-xl px-3 py-2"><div className="text-xs text-black/60">{label}</div><div className="text-sm font-semibold">{value}</div></div>
}
function Btn({ action, children }: { action: ()=>Promise<void>, children: React.ReactNode }){
  return <form action={action}><button className="bg-[#FF5C1C] text-white px-4 py-2 rounded-xl">{children}</button></form>
}
function statusLabel(s: string){
  switch(s){ case 'received': return 'Přijato'; case 'shopping': return 'Nakupujeme'; case 'on_route': return 'Na cestě'; case 'delivered': return 'Doručeno'; default: return s }
}
