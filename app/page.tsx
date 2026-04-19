"use client";
import { useState, useEffect } from "react";

const WORDS = ["Face", "Velvet", "Church", "Daisy", "Red"];

const questions = [
  {
    id: "orientation", section: "ORIENTATION", icon: "🗓",
    items: [
      { q: "What is today's date? (number)", key: "date", type: "number", correct: new Date().getDate().toString() },
      { q: "What month is it? (number 1-12)", key: "month", type: "number", correct: (new Date().getMonth() + 1).toString() },
      { q: "What year is it?", key: "year", type: "number", correct: new Date().getFullYear().toString() },
      { q: "What day of the week is it?", key: "day", type: "text", correct: ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][new Date().getDay()] },
      { q: "What city are you in?", key: "city", type: "text", correct: null },
    ]
  },
  {
    id: "attention", section: "ATTENTION", icon: "🧮",
    items: [
      { q: "Subtract 7 from 100. What do you get?", key: "a1", type: "number", correct: "93" },
      { q: "Subtract 7 again.", key: "a2", type: "number", correct: "86" },
      { q: "And again?", key: "a3", type: "number", correct: "79" },
      { q: "And again?", key: "a4", type: "number", correct: "72" },
      { q: "One more time?", key: "a5", type: "number", correct: "65" },
    ]
  },
  {
    id: "language", section: "LANGUAGE & ABSTRACTION", icon: "💬",
    items: [
      { q: "Name an animal that lives in the jungle and has a mane.", key: "l1", type: "text", correct: "lion" },
      { q: "Name an animal with a very long neck.", key: "l2", type: "text", correct: "giraffe" },
      { q: "Name the largest land animal on Earth.", key: "l3", type: "text", correct: "elephant" },
      { q: "What do a train and a bicycle have in common?", key: "abs", type: "text", correct: null },
    ]
  },
  {
    id: "recall", section: "DELAYED RECALL", icon: "🔁", recall: true,
    items: WORDS.map((w, i) => ({ q: `Word ${i + 1} of 5:`, key: `r${i}`, type: "text", correct: w.toLowerCase() }))
  }
];

function ResourceLinks() {
  return (
    <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16,padding:20,marginBottom:16}}>
      <p style={{fontSize:11,letterSpacing:3,color:"#60a5fa",fontFamily:"monospace",textTransform:"uppercase",marginBottom:12}}>Official Resources</p>
      {[
        { href:"https://www.alz.org", icon:"🧠", title:"Alzheimer's Association", sub:"alz.org — Free resources, helpline 800-272-3900" },
        { href:"https://mocatest.org", icon:"📋", title:"Official MoCA Test", sub:"mocatest.org — Clinically validated assessment" },
        { href:"https://www.nia.nih.gov/health/alzheimers-and-dementia", icon:"🏛", title:"NIH — National Institute on Aging", sub:"nia.nih.gov — Research, symptoms, diagnosis" },
      ].map(l => (
        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
          style={{display:"flex",alignItems:"center",gap:12,background:"rgba(37,99,235,0.15)",border:"1px solid rgba(37,99,235,0.3)",borderRadius:12,padding:"14px 16px",marginBottom:8,textDecoration:"none"}}>
          <span style={{fontSize:22}}>{l.icon}</span>
          <div style={{flex:1}}>
            <p style={{margin:0,fontSize:14,fontWeight:600,color:"#fef3c7"}}>{l.title}</p>
            <p style={{margin:0,fontSize:11,color:"#94a3b8",marginTop:2}}>{l.sub}</p>
          </div>
          <span style={{color:"#60a5fa",fontSize:16}}>→</span>
        </a>
      ))}
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState("intro");
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [registrationRead, setRegistrationRead] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const [score, setScore] = useState<{recallScore:number,recallMax:number,breakdown:{section:string,score:number,max:number}[]}|null>(null);

  useEffect(() => {
    if (phase === "register") {
      setCountdown(6); setRegistrationRead(false);
      const iv = setInterval(() => setCountdown(c => { if(c<=1){clearInterval(iv);setRegistrationRead(true);return 0;} return c-1; }), 1000);
      return () => clearInterval(iv);
    }
  }, [phase]);

  const cur = questions[sectionIdx];
  const allAnswered = cur?.items.every(item => (answers[item.key]||"").toString().trim() !== "");

  const nextSection = () => {
    if (sectionIdx < questions.length - 1) setSectionIdx(s => s+1);
    else {
      const breakdown = questions.map(section => {
        let s=0,max=0;
        section.items.forEach(item => { if(!item.correct) return; max++; if((answers[item.key]||"").toString().toLowerCase().trim()===item.correct) s++; });
        return {section:section.section,score:s,max};
      });
      const recallScore = WORDS.filter((w,i)=>(answers[`r${i}`]||"").toLowerCase().trim()===w.toLowerCase()).length;
      setScore({recallScore,recallMax:WORDS.length,breakdown});
      setPhase("results");
    }
  };

  const restart = () => { setPhase("intro");setSectionIdx(0);setAnswers({});setScore(null);setRegistrationRead(false); };

  const S = {
    page: {minHeight:"100vh",background:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%)",fontFamily:"Georgia,serif",color:"#e2e8f0",padding:0,margin:0},
    wrap: {maxWidth:580,margin:"0 auto",padding:"32px 20px 80px"},
    badge: {fontSize:11,letterSpacing:4,color:"#60a5fa",textTransform:"uppercase" as const,fontFamily:"monospace",marginBottom:8},
    h1: {fontSize:28,fontWeight:700,color:"#fef9f0",letterSpacing:1,margin:0},
    bar: {width:48,height:2,background:"linear-gradient(90deg,#3b82f6,#7dd3fc)",margin:"12px auto 0"},
    disc: {background:"rgba(146,64,14,0.2)",border:"1px solid rgba(217,119,6,0.3)",borderRadius:10,padding:"12px 16px",marginBottom:24,fontSize:12,lineHeight:1.7,color:"#fcd34d"},
    card: {background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:16,padding:24,marginBottom:16},
    btn: (on:boolean) => ({width:"100%",padding:"15px 24px",background:on?"#2563eb":"#1e293b",color:on?"#fff":"#475569",border:"none",borderRadius:12,fontSize:15,fontFamily:"Georgia,serif",fontWeight:600,cursor:on?"pointer":"not-allowed" as const,letterSpacing:0.5,marginTop:16}),
    input: {width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"11px 14px",color:"#fef9f0",fontSize:16,outline:"none",boxSizing:"border-box" as const,fontFamily:"Georgia,serif"},
  };
return (
    <div style={S.page}>
      <div style={S.wrap}>
        <header style={{textAlign:"center",marginBottom:28}}>
          <p style={S.badge}>Cognitive Screening Exercise</p>
          <h1 style={S.h1}>MoCA-Style Assessment</h1>
          <div style={S.bar}/>
          <p style={{fontSize:11,color:"#475569",fontFamily:"monospace",marginTop:8}}>Based on the Montreal Cognitive Assessment</p>
        </header>

        <div style={S.disc}>⚠️ <strong>Medical Disclaimer:</strong> This is an educational exercise only and <strong>cannot diagnose</strong> Alzheimer&apos;s disease or any condition. Only a licensed clinician can interpret cognitive assessments. If you have concerns, contact your doctor or call <strong>800-272-3900</strong>.</div>

        {phase==="intro" && (
          <>
            <div style={S.card}>
              <p style={{fontSize:14,lineHeight:1.8,color:"#cbd5e1",margin:"0 0 12px"}}>This exercise uses questions adapted from the <strong style={{color:"#fcd34d"}}>Montreal Cognitive Assessment (MoCA)</strong> — one of the most widely validated cognitive screening tools used by clinicians worldwide.</p>
              <p style={{fontSize:14,lineHeight:1.8,color:"#cbd5e1",margin:"0 0 12px"}}>Sections: <strong style={{color:"#93c5fd"}}>Orientation, Attention, Language, Abstraction,</strong> and <strong style={{color:"#93c5fd"}}>Delayed Word Recall.</strong></p>
              <div style={{background:"rgba(37,99,235,0.15)",border:"1px solid rgba(37,99,235,0.3)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#93c5fd"}}>📋 You will first see <strong>5 words to memorize</strong>. You&apos;ll be asked to recall them later — no hints.</div>
            </div>
            <ResourceLinks/>
            <button onClick={()=>setPhase("register")} style={S.btn(true)}>Begin Test →</button>
          </>
        )}

        {phase==="register" && (
          <div style={{textAlign:"center"}}>
            <p style={{...S.badge,marginBottom:20}}>Memorize These 5 Words</p>
            {WORDS.map((w,i)=>(
              <div key={w} style={{background:"rgba(37,99,235,0.15)",border:"1px solid rgba(37,99,235,0.35)",borderRadius:12,padding:"18px 24px",fontSize:26,fontWeight:700,letterSpacing:3,color:"#fef9f0",marginBottom:12,animation:`fadeUp 0.4s ease ${i*0.12}s both`}}>{w}</div>
            ))}
            <p style={{fontSize:12,color:"#475569",marginTop:8}}>Study carefully. No hints will be given later.</p>
            <button onClick={()=>{setPhase("test");setSectionIdx(0);}} disabled={!registrationRead} style={S.btn(registrationRead)}>
              {registrationRead?"I've Memorized Them — Continue →":`Please wait ${countdown}s…`}
            </button>
          </div>
        )}

        {phase==="test" && cur && (
          <>
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <span style={{fontSize:20}}>{cur.icon}</span>
                <span style={S.badge}>{cur.section}</span>
              </div>
              <div style={{height:3,background:"rgba(255,255,255,0.08)",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(sectionIdx/questions.length)*100}%`,background:"linear-gradient(90deg,#3b82f6,#7dd3fc)",transition:"width 0.4s"}}/>
              </div>
              <p style={{fontSize:11,color:"#334155",fontFamily:"monospace",marginTop:4}}>Section {sectionIdx+1} of {questions.length}</p>
            </div>
            {cur.recall && <div style={{background:"rgba(146,64,14,0.15)",border:"1px solid rgba(217,119,6,0.25)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#fcd34d",marginBottom:16}}>🔁 Recall the 5 words from the beginning — <strong>no hints!</strong></div>}
            {cur.items.map((item,i)=>(
              <div key={item.key} style={{...S.card,marginBottom:12}}>
                <p style={{fontSize:13,color:"#cbd5e1",marginBottom:10,lineHeight:1.5}}><span style={{color:"#60a5fa",fontFamily:"monospace",marginRight:8}}>{i+1}.</span>{item.q}</p>
                <input type={item.type==="number"?"number":"text"} value={answers[item.key]||""} onChange={e=>setAnswers(a=>({...a,[item.key]:e.target.value}))} placeholder="Your answer…" style={S.input}/>
              </div>
            ))}
            <button onClick={nextSection} disabled={!allAnswered} style={S.btn(!!allAnswered)}>
              {sectionIdx<questions.length-1?"Next Section →":"Submit & See Results →"}
            </button>
          </>
        )}
{phase==="results" && score && (
          <>
            <div style={{textAlign:"center",marginBottom:24}}>
              <p style={S.badge}>Your Results</p>
              <div style={{fontSize:72,fontWeight:700,color:"#3b82f6",lineHeight:1}}>{score.recallScore}<span style={{fontSize:32,color:"#334155"}}>/{score.recallMax}</span></div>
              <p style={{fontSize:12,color:"#475569"}}>words recalled</p>
            </div>
            <div style={S.card}>
              <p style={{...S.badge,marginBottom:14}}>Section Breakdown</p>
              {score.breakdown.map(b=>(
                <div key={b.section} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  <span style={{fontSize:13,color:"#cbd5e1"}}>{b.section}</span>
                  <span style={{fontFamily:"monospace",fontSize:13,color:b.score===b.max?"#4ade80":"#fbbf24"}}>{b.score}/{b.max}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",paddingTop:10}}>
                <span style={{fontSize:13,color:"#cbd5e1"}}>Word Recall</span>
                <span style={{fontFamily:"monospace",fontSize:13,color:score.recallScore>=4?"#4ade80":"#f87171"}}>{score.recallScore}/{score.recallMax}</span>
              </div>
            </div>
            <div style={{...S.disc,marginBottom:20}}>
              <strong>Important:</strong> These results are for self-reflection only and have no clinical meaning. For genuine concerns, speak with your physician or call:<br/><br/>
              📞 <strong>Alzheimer&apos;s Association: 800-272-3900</strong> (free, 24/7)
            </div>
            <ResourceLinks/>
            <button onClick={restart} style={S.btn(true)}>Retake Test ↺</button>
          </>
        )}
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}input:focus{border-color:rgba(59,130,246,0.6)!important;box-shadow:0 0 0 2px rgba(59,130,246,0.15)}input::placeholder{color:#334155}`}</style>
    </div>
  );
}
