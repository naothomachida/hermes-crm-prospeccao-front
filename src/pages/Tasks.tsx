import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval,
  addDays, subDays, isWithinInterval, parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CheckCircle2, Clock, MoreVertical, ChevronLeft, ChevronRight, 
  Calendar as CalendarIcon, Filter, Plus 
} from 'lucide-react';
import { Title, IconButton, Label, PrimaryButton } from '../components/ui/Base';

interface Task {
  id: string; title: string; company: string; date: Date; priority: string;
}

interface TasksPageProps {
  tasks: Task[];
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (task: any) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({ tasks, onEdit, onDelete, onDuplicate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 10));
  const [visibleDays, setVisibleDays] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const monthTasks = useMemo(() => {
    return tasks
      .filter(t => isSameMonth(new Date(t.date), currentMonth))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [tasks, currentMonth]);

  const highlightRange = useMemo(() => {
    if (visibleDays.length === 0) return null;
    const sorted = [...visibleDays].sort();
    const start = subDays(parseISO(sorted[0]), 1);
    const end = addDays(parseISO(sorted[sorted.length - 1]), 1);
    return { start, end };
  }, [visibleDays]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => entry.target.getAttribute('data-day') || '');
        
        setVisibleDays(prev => {
          const newVisible = [...visible];
          return newVisible.length > 0 ? newVisible : prev;
        });
      },
      { root: listRef.current, threshold: 0.1, rootMargin: '-10% 0px -70% 0px' }
    );

    Object.values(dayRefs.current).forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentMonth, monthTasks]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const scrollToDay = (day: Date) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    const element = dayRefs.current[dayKey];
    if (element && listRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6 h-full overflow-hidden">
      <div className="w-80 flex flex-col gap-4 shrink-0">
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</h3>
            <div className="flex gap-1">
              <button onClick={prevMonth} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronLeft size={16} /></button>
              <button onClick={nextMonth} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronRight size={16} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 mb-2 text-center">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
              <span key={`${d}-${i}`} className="text-[9px] font-black text-slate-300 uppercase">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              const dayKey = format(day, 'yyyy-MM-dd');
              const hasTasks = tasks.some(t => isSameDay(new Date(t.date), day));
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isVisible = visibleDays.includes(dayKey);
              const isInRange = highlightRange && isWithinInterval(day, highlightRange);
              return (
                <button
                  key={i}
                  onClick={() => scrollToDay(day)}
                  className={`h-9 w-full rounded-lg flex flex-col items-center justify-center relative transition-all duration-300 border-2
                    ${isVisible ? 'bg-indigo-600 text-white border-indigo-600 shadow-md z-20' : 
                      isInRange ? 'bg-indigo-50 text-indigo-700 border-indigo-200 z-10' : 
                      hasTasks ? 'bg-slate-50 text-slate-400 border-transparent' : 'hover:bg-slate-50 text-slate-600 border-transparent'}
                    ${!isCurrentMonth && !isInRange ? 'opacity-10' : ''}`}
                >
                  <span className="text-[11px] font-black">{format(day, 'd')}</span>
                  {hasTasks && !isVisible && !isInRange && (<div className="w-1 h-1 bg-indigo-200 rounded-full mt-0.5" />)}
                </button>
              );
            })}
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl overflow-hidden relative">
          <div className="flex items-center gap-3 text-bs-primary mb-2 relative z-10"><CalendarIcon size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Foco Ativo</span></div>
          <div className="mt-4 flex flex-col relative z-10">
            <span className="text-2xl font-black text-white leading-none">{visibleDays.length > 0 ? format(new Date(visibleDays[0]), 'dd') : format(new Date(), 'dd')}</span>
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Início da Timeline</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12"><Clock size={80} /></div>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex flex-col flex-1 relative">
          <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white z-10 shrink-0">
            <div><Title className="text-sm">Fluxo de Atividades</Title><Label className="mt-1">Rastreio inteligente de produtividade</Label></div>
          </div>
          <div ref={listRef} className="flex-1 overflow-y-auto custom-scrollbar p-8 scroll-smooth">
            {monthTasks.length > 0 ? (
              <div className="space-y-10">
                {calendarDays.filter(day => isSameMonth(day, currentMonth)).map(day => {
                  const dayTasks = monthTasks.filter(t => isSameDay(new Date(t.date), day));
                  if (dayTasks.length === 0) return null;
                  const dayKey = format(day, 'yyyy-MM-dd');
                                      return (
                                        <div key={dayKey} ref={el => { dayRefs.current[dayKey] = el; }} data-day={dayKey} className="space-y-4">
                                          <div className="flex items-center gap-4">
                  
                        <span className={`text-xl font-black transition-colors duration-500 ${visibleDays.includes(dayKey) ? 'text-indigo-600' : 'text-slate-900'}`}>{format(day, 'dd')}</span>
                        <div className="h-px bg-slate-100 flex-1" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{format(day, "EEEE", { locale: ptBR })}</span>
                      </div>
                      <div className="space-y-3">
                        {dayTasks.map(task => (
                          <div key={task.id} onClick={() => onEdit(task)} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all group cursor-pointer">
                            <div className="flex items-center gap-4">
                              <button className="text-slate-200 hover:text-green-500 transition-colors cursor-pointer" onClick={(e) => e.stopPropagation()}><CheckCircle2 size={20} /></button>
                              <div>
                                <div className="text-xs font-black text-slate-900 uppercase tracking-tight">{task.title}</div>
                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{task.company}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2 text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-100"><Clock size={12} className="text-indigo-400" /><span className="text-[10px] font-black">{format(new Date(task.date), 'HH:mm')}</span></div>
                              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity"><IconButton icon={MoreVertical} /></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4"><CalendarIcon size={40} className="opacity-20" /><Label>Nenhuma tarefa agendada para este mês</Label></div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
