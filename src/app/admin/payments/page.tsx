
import { prisma } from "@/lib/prisma";
export default async function PaymentsAdmin() {
  const payments = await prisma.payment.findMany({ orderBy:{createdAt:"desc"} });
  const total    = payments.filter(p=>p.status==="COMPLETED").reduce((a,p)=>a+p.amount,0);
  return (
    <div className="p-8">
      <h1 className="font-heading font-black text-2xl mb-1">Payments</h1>
      <p className="text-slate-500 text-sm mb-6">Stripe payment records</p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[{l:"Total Revenue",v:`$${total.toFixed(2)}`},{l:"Completed",v:payments.filter(p=>p.status==="COMPLETED").length},{l:"Total Transactions",v:payments.length}].map(s=>(
          <div key={s.l} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="font-heading font-black text-3xl mb-1" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.v}</div>
            <div className="text-slate-500 text-xs">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {payments.map(p=>(
          <div key={p.id} className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="flex-1"><div className="font-medium text-sm">{p.name}</div><div className="text-slate-500 text-xs">{p.email}</div></div>
            <div className="text-right">
              <div className="font-heading font-bold text-sm">${p.amount.toFixed(2)} {p.currency.toUpperCase()}</div>
              <div className="text-slate-500 text-xs">{p.description}</div>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${p.status==="COMPLETED"?"text-green-400 bg-green-400/10":p.status==="PENDING"?"text-yellow-400 bg-yellow-400/10":"text-red-400 bg-red-400/10"}`}>{p.status}</span>
            <span className="text-slate-600 text-xs">{new Date(p.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
        {payments.length===0&&<div className="text-center py-16 text-slate-500">No payments recorded yet. Stripe integration is ready.</div>}
      </div>
    </div>
  );
}
