import { useState } from 'react';
import { supabase } from '../../infrastructure/supabase/client';

export function PatientSessionView({ sessionId }: { sessionId: string }) {
  const [notes, setNotes] = useState('');
  const [decision, setDecision] = useState('no_decision');

  const saveNotes = async () => {
    await supabase.from('clinic_visit_sessions').update({ doctor_notes: notes }).eq('id', sessionId);
  };

  const submitDecision = async () => {
    await supabase.from('clinic_visit_sessions').update({
      par_result: decision,
      updated_at: new Date().toISOString()
    }).eq('id', sessionId);
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl">
      <h2 className="text-2xl font-bold text-white">Session Details</h2>
      
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">PAR Decision</h3>
        <div className="grid grid-cols-2 gap-2">
          {['full_acceptance', 'partial_acceptance', 'deferred', 'rejection'].map((d) => (
            <button key={d} onClick={() => setDecision(d)}
              className={`px-3 py-2 rounded text-sm ${decision === d ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
              {d.replace('_', ' ')}
            </button>
          ))}
        </div>
        <button onClick={submitDecision} className="mt-2 w-full px-4 py-2 bg-slate-600 text-white rounded">Submit</button>
      </div>

      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Clinical Notes</h3>
        <textarea className="w-full bg-slate-900 text-white rounded p-3 min-h-[100px] border border-slate-600"
          value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Enter notes..." />
        <button onClick={saveNotes} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </div>
    </div>
  );
}
