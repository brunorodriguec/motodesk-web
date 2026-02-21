"use client";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "agendamentos"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const alterarStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "agendamentos", id), { status });
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Workshop Dashboard 🛠️</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tickets.map((t) => (
          <div key={t.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-xl">
            <div className="flex justify-between mb-2">
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${t.status === 'pronto' ? 'bg-green-900' : 'bg-blue-900'}`}>{t.status || 'pendente'}</span>
              <button onClick={() => deleteDoc(doc(db, "agendamentos", t.id))} className="text-zinc-600 hover:text-red-500 text-xs font-bold">X</button>
            </div>
            <h3 className="font-bold text-lg">{t.cliente}</h3>
            <p className="text-zinc-400 text-sm font-mono">{t.moto} - {t.horario}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => alterarStatus(t.id, "lavando")} className="flex-1 bg-zinc-800 hover:bg-yellow-700 text-[10px] py-2 rounded-lg transition-all">INICIAR</button>
              <button onClick={() => alterarStatus(t.id, "pronto")} className="flex-1 bg-zinc-800 hover:bg-green-700 text-[10px] py-2 rounded-lg transition-all">CONCLUIR</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
