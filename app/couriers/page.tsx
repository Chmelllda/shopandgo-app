import { sb } from '@/lib/supabase-admin'

export default async function Page(){
  const { data = [], error } = await sb.from('profiles').select('id, full_name, email').eq('role','courier').order('full_name',{ ascending: true })
  if (error) return <p className="text-red-600">{error.message}</p>
  return (
    <div className="bg-white rounded-2xl border border-black/10">
      <table className="w-full text-sm">
        <thead className="bg-black/5"><tr><th className="text-left px-4 py-2">Kurýr</th><th className="text-left px-4 py-2">E-mail</th><th className="text-left px-4 py-2">ID</th></tr></thead>
        <tbody>
          {data.map((c:any)=> (
            <tr key={c.id} className="border-t border-black/10"><td className="px-4 py-3 font-semibold">{c.full_name || '—'}</td><td className="px-4 py-3">{c.email || '—'}</td><td className="px-4 py-3 text-xs">{c.id}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
