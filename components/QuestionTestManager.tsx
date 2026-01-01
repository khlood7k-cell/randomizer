
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ListData, NameItem, Settings } from '../types';
import { 
  Plus, 
  RefreshCw, 
  HelpCircle, 
  Trash, 
  Sparkles,
  Trophy,
  History,
  Target,
  Eye,
  Pencil,
  Check,
  X,
  RotateCcw,
  Play,
  Award
} from 'lucide-react';
import { suggestNames } from '../services/geminiService';

interface QuestionTestManagerProps {
  list: ListData;
  settings: Settings;
  onUpdate: (updatedList: ListData) => void;
}

const QuestionItem: React.FC<{
  item: NameItem;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newQuestion: string, newAnswer: string) => void;
}> = ({ item, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editQ, setEditQ] = useState(item.value);
  const [editA, setEditA] = useState(item.answer || '');

  const handleSave = () => {
    if (editQ.trim()) {
      onUpdate(item.id, editQ.trim(), editA.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="group flex flex-col gap-1 p-2 bg-slate-50 dark:bg-slate-800/30 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
      {isEditing ? (
        <div className="space-y-1.5" onClick={e => e.stopPropagation()}>
          <input
            type="text"
            value={editQ}
            onChange={e => setEditQ(e.target.value)}
            className="w-full bg-white dark:bg-slate-700 border-none outline-none text-[11px] font-semibold py-0.5 px-1 rounded ring-1 ring-theme"
            placeholder="Question"
          />
          <input
            type="text"
            value={editA}
            onChange={e => setEditA(e.target.value)}
            className="w-full bg-white dark:bg-slate-700 border-none outline-none text-[11px] font-semibold py-0.5 px-1 rounded ring-1 ring-theme"
            placeholder="Answer"
          />
          <div className="flex gap-1 justify-end">
            <button onClick={handleSave} className="p-1 bg-theme text-white rounded"><Check size={10} /></button>
            <button onClick={() => setIsEditing(false)} className="p-1 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200 rounded"><X size={10} /></button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate block">{item.value}</span>
            <span className="text-[9px] text-slate-400 block truncate">{item.answer}</span>
          </div>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
            <button onClick={() => setIsEditing(true)} className="p-0.5 text-slate-300 hover:text-theme">
              <Pencil size={12} />
            </button>
            <button onClick={() => onDelete(item.id)} className="p-0.5 text-slate-300 hover:text-rose-500">
              <Trash size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const QuestionTestManager: React.FC<QuestionTestManagerProps> = ({ list, settings, onUpdate }) => {
  const [questionInput, setQuestionInput] = useState('');
  const [answerInput, setAnswerInput] = useState('');
  const [winner, setWinner] = useState<NameItem | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  // Exam State
  const [isExamMode, setIsExamMode] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<NameItem[]>([]);
  const [examIndex, setExamIndex] = useState(0);
  const [examScore, setExamScore] = useState(0);
  const [selectedExamAnswer, setSelectedExamAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [examFinished, setExamFinished] = useState(false);
  
  const questionInputRef = useRef<HTMLInputElement>(null);

  const availableItems = list.items.filter(item => !item.isPicked);
  const pickedItems = list.items.filter(item => item.isPicked).sort((a, b) => (b.pickedAt || 0) - (a.pickedAt || 0));

  const handleAddItem = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!questionInput.trim()) return;

    const newItem: NameItem = {
      id: crypto.randomUUID(),
      value: questionInput.trim(),
      answer: answerInput.trim() || 'No answer provided.',
      isPicked: false
    };

    onUpdate({
      ...list,
      items: [...list.items, newItem]
    });
    setQuestionInput('');
    setAnswerInput('');
    questionInputRef.current?.focus();
  };

  const handleSuggest = async () => {
    if (!list.title || list.title === "New Question Test") return;
    setIsSuggesting(true);
    const suggestions = await suggestNames(`Questions and answers for: ${list.title}. Format as Question: Answer.`);
    const newItems = suggestions.map(val => {
      const [q, ...a] = val.split(':');
      return {
        id: crypto.randomUUID(),
        value: q.trim(),
        answer: a.join(':').trim() || 'No answer generated.',
        isPicked: false
      };
    });
    onUpdate({
      ...list,
      items: [...list.items, ...newItems]
    });
    setIsSuggesting(false);
  };

  const handlePickRandom = () => {
    if (availableItems.length === 0) {
      if (settings.autoResetPool) handleReset();
      return;
    }
    const finalWinner = availableItems[Math.floor(Math.random() * availableItems.length)];
    setWinner(finalWinner);
    setShowAnswer(false);
    onUpdate({
      ...list,
      items: list.items.map(item => 
        item.id === finalWinner.id ? { ...item, isPicked: true, pickedAt: Date.now() } : item
      )
    });
  };

  const handleReset = () => {
    onUpdate({
      ...list,
      items: list.items.map(item => ({ ...item, isPicked: false, pickedAt: undefined }))
    });
    setWinner(null);
    setShowAnswer(false);
    setIsExamMode(false);
    setExamFinished(false);
    setShuffledQuestions([]);
  };

  const handleDeleteItem = (id: string) => {
    onUpdate({
      ...list,
      items: list.items.filter(item => item.id !== id)
    });
  };

  const handleUpdateItem = (id: string, newQ: string, newA: string) => {
    onUpdate({
      ...list,
      items: list.items.map(item => item.id === id ? { ...item, value: newQ, answer: newA } : item)
    });
  };

  // Exam Logic
  const startExam = () => {
    if (list.items.length < 3) return;
    
    // Shuffle the questions for the exam
    const shuffled = [...list.items].sort(() => Math.random() - 0.5);
    
    setShuffledQuestions(shuffled);
    setIsExamMode(true);
    setExamIndex(0);
    setExamScore(0);
    setSelectedExamAnswer(null);
    setIsAnswerCorrect(null);
    setExamFinished(false);
  };

  const currentExamQuestion = shuffledQuestions[examIndex];
  
  // Generate multiple choice options
  const examOptions = useMemo(() => {
    if (!isExamMode || !currentExamQuestion) return [];
    
    const correctAnswer = currentExamQuestion.answer || '';
    const otherAnswers = list.items
      .filter(item => item.id !== currentExamQuestion.id)
      .map(item => item.answer || 'No answer provided');
    
    // Pick 2 random distractors from the entire pool
    const shuffledOthers = [...otherAnswers].sort(() => Math.random() - 0.5);
    const distractors = shuffledOthers.slice(0, 2);
    
    return [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);
  }, [isExamMode, examIndex, shuffledQuestions, list.items]);

  const handleSelectAnswer = (answer: string) => {
    if (selectedExamAnswer !== null) return;
    
    setSelectedExamAnswer(answer);
    const correct = answer === currentExamQuestion.answer;
    setIsAnswerCorrect(correct);
    if (correct) setExamScore(prev => prev + 1);
    
    setTimeout(() => {
      if (examIndex < shuffledQuestions.length - 1) {
        setExamIndex(prev => prev + 1);
        setSelectedExamAnswer(null);
        setIsAnswerCorrect(null);
      } else {
        setExamFinished(true);
      }
    }, 1500);
  };

  if (isExamMode) {
    return (
      <div className="w-full space-y-3 max-w-xl mx-auto animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-center">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setIsExamMode(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <X size={20} />
            </button>
            <div className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              Exam Mode • Question {examIndex + 1} of {shuffledQuestions.length}
            </div>
            <div className="w-5" />
          </div>

          {!examFinished ? (
            <div className="space-y-8 py-4">
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">The Question</p>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{currentExamQuestion.value}</h2>
              </div>

              <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                {examOptions.map((opt, i) => {
                  const isSelected = selectedExamAnswer === opt;
                  const isCorrect = opt === currentExamQuestion.answer;
                  
                  let btnClass = "w-full p-4 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-between ";
                  if (selectedExamAnswer === null) {
                    btnClass += "border-slate-100 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800";
                  } else if (isSelected) {
                    btnClass += isCorrect ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-600";
                  } else {
                    btnClass += isCorrect ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 opacity-50" : "border-slate-100 dark:border-slate-800 opacity-30 text-slate-400";
                  }

                  return (
                    <button 
                      key={i}
                      disabled={selectedExamAnswer !== null}
                      onClick={() => handleSelectAnswer(opt)}
                      className={btnClass}
                    >
                      <span className="truncate pr-4">{opt}</span>
                      {selectedExamAnswer !== null && isCorrect && <Check size={18} className="flex-shrink-0" />}
                      {isSelected && !isCorrect && <X size={18} className="flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {selectedExamAnswer !== null && (
                <p className={`text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 ${isAnswerCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isAnswerCorrect ? 'Correct!' : 'Incorrect Answer'}
                </p>
              )}
            </div>
          ) : (
            <div className="py-12 space-y-6 animate-in zoom-in-95 duration-500">
               <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/40 rounded-full flex items-center justify-center mx-auto text-violet-600">
                  <Award size={40} />
               </div>
               <div>
                 <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Test Complete!</h2>
                 <p className="text-slate-500 dark:text-slate-400 font-medium italic">You've reached the end of the shuffled exam.</p>
               </div>
               <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 max-w-xs mx-auto">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Score</p>
                  <p className="text-5xl font-black text-violet-600">{Math.round((examScore / shuffledQuestions.length) * 100)}%</p>
                  <p className="text-xs font-bold text-slate-400 mt-2">{examScore} correct out of {shuffledQuestions.length}</p>
               </div>
               <button 
                 onClick={() => setIsExamMode(false)}
                 className="px-8 py-3 bg-violet-600 text-white rounded-xl font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
               >
                 BACK TO POOL
               </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 max-w-xl mx-auto">
      {/* Mini Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex-1">
            <input 
              type="text"
              value={list.title}
              onChange={(e) => onUpdate({ ...list, title: e.target.value })}
              className="text-lg font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none focus:ring-0 w-full mb-0.5 p-0"
              placeholder="Test Topic..."
            />
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                <Target size={10} /> {availableItems.length} questions left
              </span>
              <button 
                onClick={handleSuggest}
                disabled={isSuggesting || !list.title}
                className="flex items-center gap-1 text-[8px] font-bold text-theme uppercase tracking-widest hover:opacity-70 disabled:opacity-30 transition-opacity"
              >
                <Sparkles size={10} /> {isSuggesting ? 'Generating...' : 'AI Boost'}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {list.items.length >= 3 && (
              <button 
                onClick={startExam}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-md font-bold text-[10px] hover:brightness-110 active:scale-95 transition-all shadow-sm"
              >
                <Play size={10} fill="currentColor" /> START TEST
              </button>
            )}
            <button 
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Compact Result Area */}
        <div className={`relative min-h-[110px] rounded-lg transition-all duration-300 border flex flex-col items-center justify-center px-4 py-4 ${winner ? 'bg-violet-600 border-violet-600 text-white' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent'}`}>
          {winner ? (
            <div className="text-center animate-in zoom-in-95 duration-200 w-full flex flex-col items-center">
               <div className="flex items-center justify-center gap-2 mb-1">
                  <HelpCircle size={14} className="text-white/90" />
                  <p className="text-white/80 text-[8px] font-bold uppercase tracking-widest">Random Review</p>
               </div>
               <h2 className="text-xl font-bold italic tracking-tight truncate w-full mb-3">{winner.value}</h2>
               
               <div className="flex flex-col items-center gap-2 w-full">
                 {showAnswer ? (
                   <div className="bg-white/10 p-3 rounded-lg w-full mb-2 animate-in slide-in-from-top-2">
                     <p className="text-[8px] text-white/60 font-black uppercase tracking-widest mb-1">Answer</p>
                     <p className="text-sm font-semibold">{winner.answer}</p>
                   </div>
                 ) : (
                   <button 
                     onClick={() => setShowAnswer(true)}
                     className="flex items-center gap-2 px-4 py-1.5 bg-white text-violet-600 rounded-md font-bold text-[9px] hover:bg-slate-100 transition-colors mb-1"
                   >
                     <Eye size={12} /> VIEW ANSWER
                   </button>
                 )}

                 <button 
                  onClick={handlePickRandom}
                  disabled={availableItems.length === 0}
                  className="px-8 py-2 bg-white text-violet-600 rounded-lg font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                 >
                  <RotateCcw size={14} /> PICK NEXT
                 </button>
               </div>
            </div>
          ) : (
            <button 
              onClick={handlePickRandom}
              disabled={availableItems.length === 0}
              className="w-full max-w-xs py-3 bg-violet-600 text-white rounded-lg font-bold text-xs shadow hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-2"
            >
              <HelpCircle size={14} /> RANDOM QUESTION
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Input & Pool Section */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-2">New Question</h3>
            <form onSubmit={handleAddItem} className="space-y-2">
              <input 
                ref={questionInputRef}
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="The question..."
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-theme outline-none text-[11px] font-semibold"
              />
              <div className="flex gap-1.5">
                <input 
                  type="text"
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="The answer..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-theme outline-none text-[11px] font-semibold"
                />
                <button type="submit" className="p-1.5 bg-theme text-white rounded-lg hover:brightness-110 active:scale-95 transition-all">
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col min-h-[160px] max-h-[350px]">
            <h3 className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <HelpCircle size={10} /> Question Pool
            </h3>
            <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {availableItems.length === 0 ? (
                <div className="py-10 text-center opacity-30">
                  <p className="text-[9px] font-bold italic">Empty</p>
                </div>
              ) : (
                availableItems.map((item) => (
                  <QuestionItem 
                    key={item.id} 
                    item={item} 
                    onDelete={handleDeleteItem} 
                    onUpdate={handleUpdateItem} 
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-200/50 dark:border-slate-800/50 h-full flex flex-col">
          <h3 className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
            <History size={10} /> Test Log
          </h3>
          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[440px] pr-1 custom-scrollbar">
            {pickedItems.length === 0 ? (
              <div className="py-12 text-center opacity-20">
                <p className="text-[9px] font-bold italic">No questions tested</p>
              </div>
            ) : (
              pickedItems.map((item, idx) => (
                <div key={item.id} className="flex flex-col gap-1 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-theme-light text-theme rounded flex items-center justify-center font-bold text-[8px]">
                      {pickedItems.length - idx}
                    </div>
                    <p className="text-[10px] font-bold text-slate-800 dark:text-white truncate flex-1">{item.value}</p>
                    {idx === 0 && <Trophy size={10} className="text-amber-400" />}
                  </div>
                  <div className="pl-6 border-l border-slate-100 dark:border-slate-700">
                     <p className="text-[9px] text-slate-500 italic truncate">{item.answer}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>
  );
};
