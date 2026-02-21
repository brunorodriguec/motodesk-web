"use client";
import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function MotoDesk() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState<{ role: string, text: string }[]>([
    { role: "model", text: "Olá! Sou o assistente da MotoDesk. 🏍️ Como posso ajudar sua máquina hoje?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [chatLog]);

  async function processarEGravar(texto: string) {
    try {
      const jsonMatch = texto.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const dados = JSON.parse(jsonMatch[0]);
        await addDoc(collection(db, "agendamentos"), {
          ...dados,
          status: "pendente",
          createdAt: serverTimestamp()
        });
      }
    } catch (e) {
      console.error("Erro na gravação:", e);
    }
  }

  async function enviarMensagem() {
    if (!input.trim() || loading) return;
    const userMessage = input;
    setInput("");
    setChatLog((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        systemInstruction: `Você é o assistente da MotoDesk. Triage N1. 
        Colete: Nome, Moto, Placa e Horário. Finalize com um JSON: 
        {"cliente": "nome", "moto": "modelo", "servico": "tipo", "horario": "hora"}`
      });

      const result = await model.generateContent(userMessage);
      const response = await result.response;
      const textoIA = response.text();
      setChatLog((prev) => [...prev, { role: "model", text: textoIA }]);
      await processarEGravar(textoIA);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans">
      <header className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">🏍️</div>
        <div>
            <h1 className="font-bold text-lg">MotoDesk</h1>
            <p className="text-[10px] text-green-500 font-bold">● ONLINE</p>
        </div>
      </header>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatLog.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === "user" ? "bg-blue-600" : "bg-zinc-900 border border-zinc-800"}`}>
              <p className="text-sm whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
      </div>
      <footer className="p-4 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
            className="flex-1 p-3 bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Fale com a MotoDesk..." />
          <button onClick={enviarMensagem} disabled={loading} className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl transition-all">➤</button>
        </div>
      </footer>
    </main>
  );
}
