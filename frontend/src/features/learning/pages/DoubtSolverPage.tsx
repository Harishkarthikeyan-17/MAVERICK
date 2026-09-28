import React, { useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  Mic, 
  Paperclip, 
  Image as ImageIcon, 
  Code as CodeIcon,
  Bot,
  Target,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { aiService } from '../../../services/aiService';

const DoubtSolverPage: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState('All Skills');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Mock conversation showing a technical doubt
  const MOCK_CONVO = [
    { role: 'user', content: 'Can you explain how navigation state persistence works in React Navigation? I keep losing my auth state on refresh.' },
    { role: 'assistant', content: `React Navigation state can be persisted to local storage (like AsyncStorage) so that when the user reloads the app, they return to where they were.\n\nHere's how you do it:\n\n\`\`\`javascript\nimport { NavigationContainer } from '@react-navigation/native';\nimport AsyncStorage from '@react-native-async-storage/async-storage';\n\nconst PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';\n\nexport default function App() {\n  const [isReady, setIsReady] = React.useState(false);\n  const [initialState, setInitialState] = React.useState();\n\n  React.useEffect(() => {\n    const restoreState = async () => {\n      try {\n        const savedState = await AsyncStorage.getItem(PERSISTENCE_KEY);\n        const state = savedState ? JSON.parse(savedState) : undefined;\n        if (state !== undefined) setInitialState(state);\n      } finally {\n        setIsReady(true);\n      }\n    };\n    restoreState();\n  }, []);\n\n  if (!isReady) return null;\n\n  return (\n    <NavigationContainer\n      initialState={initialState}\n      onStateChange={(state) => \n        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))\n      }\n    >\n      {/* Navigators */}\n    </NavigationContainer>\n  );\n}\n\`\`\`\n\n**Analogy**: Think of it like saving a video game. Without saving, every time you turn the console off, you start at level 1. By saving the state JSON to AsyncStorage, you're creating a save file.`}
  ];

  const [chatHistory, setChatHistory] = useState(MOCK_CONVO);

  const handleSend = async () => {
    if(!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiService.generateResponse(userMsg.content, `You are MAVERICK, a coding doubt solver. The user is asking about ${selectedSkill}. Provide conceptual answers and code examples if appropriate.`);
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
      setShowQuiz(true);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'AI connection failed.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 max-w-4xl mx-auto w-full relative">
      
      {/* Header & Skill Scope */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <HelpCircle className="text-emerald-400" /> Doubt Solver
          </h1>
          <p className="text-xs text-slate-500 font-medium">Concept clarification and debugging</p>
        </div>
        <div className="relative group min-w-[200px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <Target size={14} />
          </div>
          <select 
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-200 pl-9 pr-8 py-2 rounded-xl outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
          >
            <option>All Skills</option>
            <option>React Native</option>
            <option>System Design</option>
            <option>TypeScript</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-32 scrollbar-hide">
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[95%] md:max-w-[85%] rounded-2xl p-5 shadow-lg ${msg.role === 'user' ? 'bg-slate-800 text-slate-200 rounded-br-none border border-slate-700' : 'bg-slate-900 border border-emerald-500/20 text-slate-200 rounded-bl-none'}`}>
              
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold text-sm">
                  <Bot size={16} /> MAVERICK
                </div>
              )}
              
              {/* Simplistic rendering of markdown/code blocks for the mockup */}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content.split('```').map((part, index) => {
                  if (index % 2 === 1) {
                    // It's a code block
                    const codeContent = part.replace(/^javascript\n/, ''); // rough strip
                    return (
                      <div key={index} className="bg-slate-950 border border-slate-800 rounded-xl p-4 my-3 overflow-x-auto font-mono text-xs text-slate-300">
                        {codeContent}
                      </div>
                    );
                  }
                  return <span key={index}>{part}</span>;
                })}
              </div>

            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl rounded-bl-none p-4 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{animationDelay: '0.1s'}} />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{animationDelay: '0.2s'}} />
            </div>
          </div>
        )}

        {showQuiz && (
          <div className="flex justify-start animate-in slide-in-from-bottom-4">
            <div className="max-w-[85%] bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl rounded-bl-none p-5 shadow-xl shadow-emerald-500/5">
               <h4 className="text-emerald-400 font-bold text-sm mb-3 flex items-center gap-2"><CheckCircle2 size={16}/> Micro-Quiz: Navigation State</h4>
               <p className="text-sm text-slate-300 mb-4">Why do we use `AsyncStorage` instead of standard React `useState` for persisting navigation?</p>
               <div className="space-y-2">
                 <button className="w-full text-left p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500 hover:text-emerald-400 text-sm text-slate-300 transition-all">
                    A. AsyncStorage is faster than useState.
                 </button>
                 <button className="w-full text-left p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500 hover:text-emerald-400 text-sm text-slate-300 transition-all">
                    B. useState resets when the app is completely closed/reloaded.
                 </button>
                 <button className="w-full text-left p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500 hover:text-emerald-400 text-sm text-slate-300 transition-all">
                    C. React Navigation requires AsyncStorage by default.
                 </button>
               </div>
               <div className="mt-4 flex gap-2">
                 <button className="text-xs text-slate-500 hover:text-slate-300 font-medium px-3 py-1 bg-slate-800 rounded-lg">Skip Quiz</button>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex flex-col gap-2">
          {/* Follow-up suggestions */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors">
               How do I handle deep links with this?
            </button>
            <button className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors">
               Is there a secure storage alternative?
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-2 flex items-end gap-2 focus-within:border-emerald-500 focus-within:shadow-[0_0_10px_rgba(16,185,129,0.1)] transition-all">
            <div className="flex gap-1 pb-1">
              <button className="p-2 text-slate-500 hover:text-emerald-400 rounded-lg transition-colors" title="Voice Input"><Mic size={18}/></button>
              <button className="p-2 text-slate-500 hover:text-emerald-400 rounded-lg transition-colors" title="Attach PDF"><Paperclip size={18}/></button>
              <button className="p-2 text-slate-500 hover:text-emerald-400 rounded-lg transition-colors" title="Attach Image"><ImageIcon size={18}/></button>
              <button className="p-2 text-slate-500 hover:text-emerald-400 rounded-lg transition-colors" title="Add Code Snippet"><CodeIcon size={18}/></button>
            </div>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a conceptual question or paste code..." 
              className="flex-1 bg-transparent border-none text-sm text-slate-200 outline-none resize-none max-h-32 min-h-[44px] py-3 px-2"
              rows={1}
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button 
              onClick={handleSend}
              className={`p-3 rounded-xl transition-all ${input.trim() ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}
              disabled={!input.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DoubtSolverPage;
