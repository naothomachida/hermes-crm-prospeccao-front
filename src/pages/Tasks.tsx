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
  Calendar as CalendarIcon, Filter, Plus, Maximize2, Minimize2 
} from 'lucide-react';
import { Title, IconButton, Label, PrimaryButton } from '../components/ui/Base';
import { UserSelector } from '../components/ui/UserSelector';

interface Task {
  id: string; title: string; company: string; date: Date; priority: string; userId?: string;
}

interface TasksPageProps {
  tasks: Task[];
  users: any[];
  onUpdateTaskOwner: (taskId: string, userId: string) => void;
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (task: any) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({ tasks, users, onUpdateTaskOwner, onEdit, onDelete, onDuplicate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 10));
  const [visibleDays, setVisibleDays] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Limpar refs quando mudar o mês para evitar "navegação" fantasma
  useEffect(() => {
    dayRefs.current = {};
  }, [currentMonth]);

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
    // Se clicar num dia de outro mês, muda o mês primeiro
    if (!isSameMonth(day, currentMonth)) {
      setCurrentMonth(startOfMonth(day));
      // Espera o render do novo mês para rolar
      setTimeout(() => scrollToDay(day), 100);
      return;
    }

    const dayKey = format(day, 'yyyy-MM-dd');
    const element = dayRefs.current[dayKey];
    if (element && listRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6 h-full w-full overflow-hidden">
      {/* Coluna do Calendário */}
      <div className={`flex flex-col gap-4 shrink-0 transition-all duration-500 ease-in-out ${isExpanded ? 'w-[600px]' : 'w-80'}`}>
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col h-fit">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <h3 className={`font-black uppercase tracking-widest text-slate-900 transition-all ${isExpanded ? 'text-lg' : 'text-xs'}`}>
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-indigo-50 rounded-xl text-indigo-600 transition-colors">
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <div className="flex gap-1 bg-slate-50 p-1 rounded-xl">
                <button onClick={prevMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 transition-all"><ChevronLeft size={16} /></button>
                <button onClick={nextMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 transition-all"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-2 text-center">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
              <span key={`${d}-${i}`} className={`font-black text-slate-300 uppercase ${isExpanded ? 'text-xs py-2' : 'text-[9px]'}`}>{d}</span>
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
                  className={`rounded-xl flex flex-col items-center justify-center relative transition-all duration-300 border-2
                    ${isExpanded ? 'h-16' : 'h-9'}
                    ${isVisible ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg z-20 scale-105' : 
                      isInRange ? 'bg-indigo-50 text-indigo-700 border-indigo-100 z-10' : 
                      hasTasks ? 'bg-slate-50 text-slate-400 border-transparent' : 'hover:bg-slate-50 text-slate-600 border-transparent'}
                    ${!isCurrentMonth && !isInRange ? 'opacity-20' : ''}`}
                >
                  <span className={`font-black ${isExpanded ? 'text-sm' : 'text-[11px]'}`}>{format(day, 'd')}</span>
                  {hasTasks && !isVisible && !isInRange && (
                    <div className={`bg-indigo-400 rounded-full ${isExpanded ? 'w-1.5 h-1.5 mt-1.5' : 'w-1 h-1 mt-0.5'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl overflow-hidden relative min-h-[140px] flex flex-col justify-center">
          <div className="flex items-center gap-3 text-bs-primary mb-2 relative z-10">
            <CalendarIcon size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Foco Ativo</span>
          </div>
          <div className="mt-2 flex flex-col relative z-10">
            <span className="text-4xl font-black text-white leading-none tracking-tighter">
              {visibleDays.length > 0 ? format(new Date(visibleDays[0]), 'dd') : format(new Date(), 'dd')}
            </span>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mt-2">Início da Timeline</span>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12">
            <Clock size={120} />
          </div>
        </div>
      </div>

      {/* Coluna das Tarefas */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="bg-white border border-gray-200 rounded-[32px] shadow-sm overflow-hidden flex flex-col flex-1 relative">
          <div className="px-10 py-6 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 shrink-0">
            <div>
              <Title className="text-base">Fluxo de Atividades</Title>
              <Label className="mt-1">Rastreio inteligente de produtividade</Label>
            </div>
            <div className="flex gap-2">
              <IconButton icon={Filter} />
              <PrimaryButton icon={Plus} onClick={() => {}}>Nova Tarefa</PrimaryButton>
            </div>
          </div>
          
          <div ref={listRef} className="flex-1 overflow-y-auto custom-scrollbar p-10 scroll-smooth">
            {monthTasks.length > 0 ? (
              <div className="space-y-12">
                {calendarDays.filter(day => isSameMonth(day, currentMonth)).map(day => {
                  const dayTasks = monthTasks.filter(t => isSameDay(new Date(t.date), day));
                  if (dayTasks.length === 0) return null;
                  const dayKey = format(day, 'yyyy-MM-dd');
                  
                  return (
                    <div key={dayKey} ref={el => { dayRefs.current[dayKey] = el; }} data-day={dayKey} className="space-y-6 scroll-mt-24">
                      <div className="flex items-center gap-6">
                        <span className={`text-3xl font-black transition-all duration-500 ${visibleDays.includes(dayKey) ? 'text-indigo-600 scale-110 translate-x-1' : 'text-slate-900'}`}>
                          {format(day, 'dd')}
                        </span>
                        <div className="h-px bg-slate-100 flex-1" />
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          {format(day, "EEEE", { locale: ptBR })}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {dayTasks.map(task => (
                          <div 
                            key={task.id} 
                            onClick={() => onEdit(task)} 
                            className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all group cursor-pointer"
                          >
                            <div className="flex items-center gap-5">
                              <button 
                                className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center text-transparent group-hover:border-green-500 group-hover:text-green-500 transition-all"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <CheckCircle2 size={14} />
                              </button>
                              <div>
                                <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{task.title}</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{task.company}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-8">
                              <div className="flex items-center gap-2.5 text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                                <Clock size={14} className="text-indigo-500" />
                                <span className="text-xs font-black">{format(new Date(task.date), 'HH:mm')}</span>
                              </div>
                              <div onClick={(e) => e.stopPropagation()}>
                                <UserSelector 
                                  users={users}
                                  selectedUserId={task.userId}
                                  onSelect={(uid) => onUpdateTaskOwner(task.id, uid)}
                                  showName={false}
                                />
                              </div>
                              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                <IconButton icon={MoreVertical} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-6">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                  <CalendarIcon size={40} className="opacity-20" />
                </div>
                <Label>Nenhuma tarefa agendada para este mês</Label>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};