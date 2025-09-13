import React, { useState, useEffect } from 'react';

const SAMPLE_OCCUPATIONS = [
  { id: 'electrician', title: 'Electrician', cluster: 'Skilled Trades', education: 'Apprenticeship/Trade', aiRisk: 'Low', growth: 'Stable/High', tags: ['hands-on', 'technical', 'outdoor'], description: 'Installs, maintains, and repairs electrical systems.' },
  { id: 'cybersec', title: 'Cybersecurity Analyst', cluster: 'Tech & Security', education: 'Cert/Bachelor', aiRisk: 'Medium-Low', growth: 'High', tags: ['data', 'problem-solving', 'remote-friendly'], description: 'Protects networks and data from cyber threats.' },
  { id: 'pta', title: 'Physical Therapist Assistant', cluster: 'Healthcare', education: '2-year program', aiRisk: 'Low', growth: 'High', tags: ['helping', 'hands-on'], description: 'Helps patients recover movement under supervision of physical therapists.' },
  { id: 'windtech', title: 'Wind Turbine Technician', cluster: 'Renewable Energy', education: 'Certificate/Apprenticeship', aiRisk: 'Low', growth: 'Very High', tags: ['outdoor', 'technical'], description: 'Maintains and repairs wind turbines.' },
  { id: 'ux', title: 'UX/UI Designer', cluster: 'Design & Creative Tech', education: 'Cert/Bachelor', aiRisk: 'Medium', growth: 'High', tags: ['creative', 'human-centered'], description: 'Designs user interfaces and experiences for digital products.' }
];

const CLUSTERS = ['Skilled Trades', 'Healthcare', 'Tech & Security', 'Renewable Energy', 'Design & Creative Tech'];

export default function App() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState(() => CLUSTERS.reduce((a,c)=>{a[c]=0;return a;},{}));
  const [results, setResults] = useState([]);
  const [whatIfFactor, setWhatIfFactor] = useState(0);

  useEffect(() => {
    const weighted = SCORE_TO_OCCUPATIONS(scores, whatIfFactor);
    setResults(weighted);
  }, [scores, whatIfFactor]);

  function handleChoice(clusterBoosts={}){
    const nextScores = {...scores};
    Object.entries(clusterBoosts).forEach(([c,delta]) => { if(nextScores[c]!==undefined) nextScores[c]+=delta; });
    setScores(nextScores);
    setStep(s=>Math.min(s+1,4));
  }

  return (
    <div style={{fontFamily:'Inter, Arial',maxWidth:900,margin:'20px auto',padding:20}}>
      <h1>AI Career Pathfinder — Prototype</h1>
      {step<4 ? (
        <QuestionFlow step={step} onChoice={handleChoice} />
      ) : (
        <ResultView results={results} whatIfFactor={whatIfFactor} setWhatIfFactor={setWhatIfFactor} />
      )}
    </div>
  );
}

function QuestionFlow({step,onChoice}){
  switch(step){
    case 0:
      return <div><h2>What tasks do you enjoy?</h2><button onClick={()=>onChoice({'Skilled Trades':2,'Renewable Energy':2})}>Hands-on</button><button onClick={()=>onChoice({'Healthcare':2})}>Helping People</button><button onClick={()=>onChoice({'Tech & Security':2})}>Data/Systems</button><button onClick={()=>onChoice({'Design & Creative Tech':2})}>Creative</button></div>;
    case 1:
      return <div><h2>Preferred work style?</h2><button onClick={()=>onChoice({'Tech & Security':1,'Design & Creative Tech':1})}>Indoor/Office</button><button onClick={()=>onChoice({'Skilled Trades':1,'Renewable Energy':1})}>Outdoor</button></div>;
    case 2:
      return <div><h2>Training commitment?</h2><button onClick={()=>onChoice({'Skilled Trades':1,'Renewable Energy':1})}>Short</button><button onClick={()=>onChoice({'Tech & Security':1,'Design & Creative Tech':1})}>Bachelor</button><button onClick={()=>onChoice({'Healthcare':1})}>Graduate</button></div>;
    case 3:
      return <div><h2>Concern about AI risk?</h2><button onClick={()=>onChoice({'Skilled Trades':1,'Healthcare':1})}>High Concern</button><button onClick={()=>onChoice({'Tech & Security':1})}>Low Concern</button></div>;
    default:
      return <div/>;
  }
}

function SCORE_TO_OCCUPATIONS(scores, factor){
  return SAMPLE_OCCUPATIONS.map(o=>{
    const base = scores[o.cluster]||0;
    const penalty = (o.aiRisk==='High')?factor*2:(o.aiRisk==='Medium'?factor:0);
    const score = base-penalty+Math.random();
    return {...o,score};
  }).sort((a,b)=>b.score-a.score);
}

function ResultView({results,whatIfFactor,setWhatIfFactor}){
  const [explanation,setExplanation] = useState('');

  async function fetchExplanation(title){
    setExplanation('Loading...');
    const res = await fetch(`/api/explain?career=${encodeURIComponent(title)}`);
    const data = await res.json();
    setExplanation(data.explanation);
  }

  return <div>
    <h2>Top career matches</h2>
    <input type="range" min={0} max={5} value={whatIfFactor} onChange={e=>setWhatIfFactor(Number(e.target.value))} /> AI concern: {whatIfFactor}
    {results.slice(0,3).map(r=>(
      <div key={r.id} style={{border:'1px solid #ddd',margin:'12px 0',padding:8}}>
        <h3>{r.title} ({r.cluster})</h3>
        <p>{r.description}</p>
        <button onClick={()=>fetchExplanation(r.title)}>Why this career?</button>
      </div>
    ))}
    {explanation && <div style={{marginTop:12,padding:8,background:'#f7f7f7'}}><strong>AI says:</strong> {explanation}</div>}
  </div>;
}
