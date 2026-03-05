import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, TrendingUp, CheckCircle2, Grid, BarChart3, 
  Search, Bell, Settings, Plus, ChevronRight, ChevronsRight,
  Edit3, Copy, Trash2, UserPlus, Clock, MessageSquare, History, ClipboardList, Camera
} from 'lucide-react';

// ... (existing imports)

// Image Compression Utility
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
  });
};


// UI Components
import { Title, Label, PrimaryButton, CircularButton, IconButton, Modal } from './components/ui/Base';
import { ProspectLogo } from './components/ui/ProspectLogo';
import { KanbanCard, KanbanColumn } from './components/ui/Kanban';
import { UserSelector } from './components/ui/UserSelector';

// Pages
import { LoginPage } from './pages/Login';
import { HomePage } from './pages/Home';
import { ReportsPage } from './pages/Reports';
import { TasksPage } from './pages/Tasks';
import { CompaniesPage } from './pages/Companies';
import { UsersPage } from './pages/Users';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Pipeline Definitions
const PIPELINE_CONFIG: Record<string, { name: string, stages: any[] }> = {
  PRO: {
    name: 'Prospecção',
    stages: [
      { id: 'lead_ident', name: 'LEAD IDENTIFICADO', color: 'border-t-slate-400' },
      { id: 'contact_made', name: 'CONTATO REALIZADO', color: 'border-t-blue-400' },
      { id: 'meeting_sched', name: 'REUNIÃO AGENDADA', color: 'border-t-sky-500' },
      { id: 'presentation', name: 'APRESENTAÇÃO FEITA', color: 'border-t-indigo-500' },
      { id: 'qualified', name: 'QUALIFICADO/VENDAS', color: 'border-t-emerald-500' },
    ]
  },
  VEN: {
    name: 'Vendas',
    stages: [
      { id: 'opportunity', name: 'OPORTUNIDADE', color: 'border-t-blue-500' },
      { id: 'proposal_sent', name: 'PROPOSTA ENVIADA', color: 'border-t-violet-500' },
      { id: 'followup', name: 'FUP/ACOMPANHAMENTO', color: 'border-t-purple-500' },
      { id: 'negotiation', name: 'NEGOCIAÇÃO', color: 'border-t-fuchsia-500' },
      { id: 'closing', name: 'FECHAMENTO', color: 'border-t-pink-500' },
    ]
  },
  OPE: {
    name: 'Operacional',
    stages: [
      { id: 'onboarding', name: 'ONBOARDING', color: 'border-t-cyan-400' },
      { id: 'execution', name: 'EM EXECUÇÃO', color: 'border-t-blue-600' },
      { id: 'waiting', name: 'AGUARDANDO CLIENTE', color: 'border-t-amber-500' },
      { id: 'review', name: 'REVISÃO/APROVAÇÃO', color: 'border-t-indigo-600' },
      { id: 'finished', name: 'ENTREGUE/CONCLUÍDO', color: 'border-t-emerald-500' },
    ]
  }
};

const App: React.FC = () => {
  // --- GLOBAL STATES ---
  const [activePipelineId, setActivePipelineId] = useState('PRO');
  const currentStages = PIPELINE_CONFIG[activePipelineId].stages;

  const [users, setUsers] = useState<any[]>([
    { id: 'u1', name: 'Gabriel Ursini', role: 'Administrador', avatar: 'https://i.pravatar.cc/150?u=u1', email: 'gabriel@bsit.com' },
    { id: 'u2', name: 'Ana Silva', role: 'Consultora', avatar: 'https://i.pravatar.cc/150?u=u2', email: 'ana@bsit.com' },
  ]);

  const [entities, setEntities] = useState<any[]>([
    { id: 'e1', type: 'PJ', name: 'TechSolutions S.A', document: '12.345.678/0001-90', city: 'São Paulo, SP', email: 'contato@tech.com', phone: '(11) 3333-4444' },
    { id: 'e2', type: 'PF', name: 'Ricardo Almeida', document: '123.456.789-00', city: 'Curitiba, PR', email: 'ricardo@tech.com', phone: '(11) 98888-7777', role: 'Diretor' },
  ]);

  const [leads, setLeads] = useState<any[]>([
    { id: '1', name: 'Prospecção TechSolutions', entityId: 'e1', views: 2, value: 580, stage: 'lead_ident', pipeline: 'PRO', ownerId: 'u1' },
    { id: '2', name: 'Venda Software ERP', entityId: 'e2', views: 0, value: 15000, stage: 'proposal_sent', pipeline: 'VEN', ownerId: 'u2' },
    { id: '3', name: 'Projeto Implementação', entityId: 'e1', views: 1, value: 0, stage: 'onboarding', pipeline: 'OPE', ownerId: 'u1' },
  ]);

  const [tasks, setTasks] = useState<any[]>([
    { id: 't1', title: 'Ligar para Ricardo Almeida', leadId: '1', date: new Date(2026, 1, 10, 14, 0), priority: 'high', completed: true, userId: 'u1' },
    { id: 't2', title: 'Enviar Proposta BSIT', leadId: '2', date: new Date(2026, 1, 12, 10, 30), priority: 'medium', completed: false, userId: 'u1' },
    { id: 't3', title: 'Follow-up inicial', leadId: '1', date: new Date(2026, 1, 18, 16, 0), priority: 'low', completed: false, userId: 'u2' },
  ]);

  const [activities, setActivities] = useState<any[]>([
    { id: 'a1', leadId: '1', userId: 'u1', type: 'creation', description: 'Negócio criado por Gabriel', date: new Date(2026, 1, 1) },
    { id: 'a2', leadId: '1', userId: 'u1', type: 'stage_change', description: 'Movido para CONTATO', date: new Date(2026, 1, 5) },
    { id: 'a3', leadId: '2', userId: 'u2', type: 'note', description: 'Cliente demonstrou interesse via WhatsApp', date: new Date(2026, 1, 15) },
  ]);

  // --- CRUD HELPERS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const handleEdit = (item: any) => { setEditingItem(item); setFormData(item); setIsModalOpen(true); };
  const handleAdd = (type: string) => { 
    setEditingItem(null); 
    setFormData(type === 'empresas' ? { type: 'PJ' } : type === 'usuarios' ? { role: 'Consultor' } : type === 'negocios' ? { pipeline: activePipelineId, stage: currentStages[0].id } : {}); 
    setIsModalOpen(true); 
  };
  
  const handleDelete = (id: string, type: string) => {
    if (!window.confirm('Excluir este registro?')) return;
    if (type === 'leads') setLeads(prev => prev.filter(i => i.id !== id));
    if (type === 'entities') setEntities(prev => prev.filter(i => i.id !== id));
    if (type === 'tasks') setTasks(prev => prev.filter(i => i.id !== id));
    if (type === 'users') setUsers(prev => prev.filter(i => i.id !== id));
  };

  const handleDuplicate = (item: any, type: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newItem = { ...item, id, name: item.name ? `${item.name} (Cópia)` : item.title ? `${item.title} (Cópia)` : '' };
    if (type === 'leads') setLeads(prev => [...prev, newItem]);
    if (type === 'entities') setEntities(prev => [...prev, newItem]);
    if (type === 'tasks') setTasks(prev => [...prev, newItem]);
  };

  const onDragEnd = (result: any) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    
    const lead = leads.find(l => l.id === draggableId);
    if (lead && lead.stage !== destination.droppableId) {
      setActivities(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        leadId: draggableId,
        userId: 'u1', // Assume current user
        type: 'stage_change',
        description: `Mudança de etapa: ${currentStages.find(s => s.id === destination.droppableId)?.name}`,
        date: new Date()
      }]);
    }

    setLeads(prev => prev.map(l => l.id === draggableId ? { ...l, stage: destination.droppableId } : l));
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleUpdateLeadOwner = (leadId: string, ownerId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ownerId } : l));
  };

  const handleUpdateTaskOwner = (taskId: string, userId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, userId } : t));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard/*" element={
          <DashboardLayout 
            leads={leads} entities={entities} tasks={tasks} users={users} activities={activities}
            onEdit={handleEdit} onAdd={handleAdd} onDelete={handleDelete} onDuplicate={handleDuplicate} onDragEnd={onDragEnd} toggleTask={toggleTask}
            isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} editingItem={editingItem} formData={formData} setFormData={setFormData} setLeads={setLeads} setEntities={setEntities} setTasks={setTasks} setUsers={setUsers} setActivities={setActivities}
            activePipelineId={activePipelineId} setActivePipelineId={setActivePipelineId} currentStages={currentStages}
            handleUpdateLeadOwner={handleUpdateLeadOwner} handleUpdateTaskOwner={handleUpdateTaskOwner}
          />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

// --- LAYOUT MASTER ---
const DashboardLayout = ({ 
  leads, entities, tasks, users, activities, onEdit, onAdd, onDelete, onDuplicate, onDragEnd, toggleTask, 
  isModalOpen, setIsModalOpen, editingItem, formData, setFormData, setLeads, setEntities, setTasks, setUsers, setActivities,
  activePipelineId, setActivePipelineId, currentStages, handleUpdateLeadOwner, handleUpdateTaskOwner
}: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [modalType, setModalType] = useState('');
  const [activeModalTab, setActiveModalTab] = useState('dados');
  const [newActivityNote, setNewActivityNote] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTaskUserId, setNewTaskUserId] = useState('u1');
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, lead: any } | null>(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const activeTab = location.pathname.split('/').pop() || 'negocios';

  React.useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, lead: any) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, lead });
  };

  const handleOpenAdd = (type: string, initialData = {}) => {
    setModalType(type);
    setFormData(initialData);
    setActiveModalTab('dados');
    onAdd(type);
  };

  const handleOpenEdit = (item: any, type: string) => {
    setModalType(type);
    setActiveModalTab('dados');
    onEdit(item);
  };

  const handleOpenLeadTasks = (lead: any) => {
    setModalType('negocios');
    onEdit(lead);
    setActiveModalTab('tarefas');
  };

  const handleOpenLeadHistory = (lead: any) => {
    setModalType('negocios');
    onEdit(lead);
    setActiveModalTab('historico');
  };

  const handleAddActivity = () => {
    if (!newActivityNote.trim()) return;
    const newActivity = {
      id: Math.random().toString(36).substr(2, 9),
      leadId: editingItem.id,
      userId: 'u1',
      type: 'note',
      description: newActivityNote,
      date: new Date()
    };
    setActivities((prev: any) => [...prev, newActivity]);
    setNewActivityNote('');
  };

  const handleInlineAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      leadId: editingItem.id,
      title: newTaskTitle,
      date: new Date(newTaskDate),
      priority: 'medium',
      completed: false,
      userId: newTaskUserId
    };
    setTasks((prev: any) => [...prev, newTask]);
    setNewTaskTitle('');
    setNewTaskDate(new Date().toISOString().split('T')[0]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await compressImage(file);
      setFormData((prev: any) => ({ ...prev, avatar: base64 }));
    }
  };

  const handleUpdateMyProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsers(prev => prev.map(u => u.id === 'u1' ? { ...u, ...formData } : u));
    setIsProfileOpen(false);
  };

  const pipelines = [

    { id: 'PRO', name: 'Prospecção', count: leads.filter((l:any) => l.pipeline === 'PRO').length, value: `R$ ${leads.filter((l:any) => l.pipeline === 'PRO').reduce((a:any,c:any)=>a+c.value,0)}`, color: 'bg-slate-500' },
    { id: 'VEN', name: 'Vendas', count: leads.filter((l:any) => l.pipeline === 'VEN').length, value: `R$ ${leads.filter((l:any) => l.pipeline === 'VEN').reduce((a:any,c:any)=>a+c.value,0)}`, color: 'bg-bs-primary' },
    { id: 'OPE', name: 'Operacional', count: leads.filter((l:any) => l.pipeline === 'OPE').length, value: `R$ ${leads.filter((l:any) => l.pipeline === 'OPE').reduce((a:any,c:any)=>a+c.value,0)}`, color: 'bg-blue-600' },
  ];

  const menuItems = [
    { id: 'inicio', label: 'Início', icon: LayoutDashboard },
    { id: 'tarefas', label: 'Tarefas', icon: CheckCircle2 },
    { id: 'empresas', label: 'Empresas & Pessoas', icon: Grid },
    { id: 'negocios', label: 'Negócios', icon: TrendingUp },
    { id: 'usuarios', label: 'Equipe', icon: Settings },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const id = editingItem?.id || Math.random().toString(36).substr(2, 9);
    const data = { ...formData, id, value: formData.value ? parseFloat(formData.value) : 0 };

    const typeToUse = modalType || activeTab;

    if (typeToUse === 'negocios') {
      setLeads((prev: any) => editingItem ? prev.map((i: any) => i.id === id ? data : i) : [...prev, { ...data, views: 0 }]);
    } else if (typeToUse === 'empresas') {
      setEntities((prev: any) => editingItem ? prev.map((i: any) => i.id === id ? data : i) : [...prev, data]);
    } else if (typeToUse === 'tarefas') {
      setTasks((prev: any) => editingItem ? prev.map((i: any) => i.id === id ? data : i) : [...prev, data]);
    } else if (typeToUse === 'usuarios') {
      setUsers((prev: any) => editingItem ? prev.map((i: any) => i.id === id ? data : i) : [...prev, { ...data, avatar: `https://i.pravatar.cc/150?u=${id}` }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f4f5f7] font-sans text-slate-700 overflow-hidden">
      <header className="h-14 bg-black flex items-center justify-between px-6 shrink-0 z-50 shadow-lg border-b border-white/5">
        <div className="flex items-center gap-10">
          <button 
            onClick={() => navigate('/dashboard/inicio')} 
            className="hover:scale-105 active:scale-95 transition-all focus:outline-none"
            aria-label="Ir para o início"
          >
            <ProspectLogo size="md" />
          </button>
          
          <nav className="hidden md:flex items-center gap-8" aria-label="Menu principal">
            {menuItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => navigate(`/dashboard/${item.id}`)} 
                className={`group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all border-b-2 py-4 ${
                  activeTab === item.id 
                    ? 'text-white border-bs-primary' 
                    : 'text-slate-500 border-transparent hover:text-white'
                }`}
              >
                <item.icon size={14} className={activeTab === item.id ? 'text-bs-primary' : 'group-hover:text-bs-primary transition-colors'} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence initial={false}>
          {isSidebarVisible && (
            <motion.aside 
              initial={false}
              animate={{ width: isSidebarExpanded ? 260 : 80 }}
              className="bg-black border-r border-white/5 flex flex-col py-8 shrink-0 overflow-visible relative z-40"
              aria-label="Barra lateral de navegação"
            >
              <button 
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                className="absolute -right-5 top-12 w-10 h-10 rounded-full bg-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.4)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all z-[100] border-4 border-black"
                aria-label={isSidebarExpanded ? "Recolher barra lateral" : "Expandir barra lateral"}
              >
                <div className="w-full h-full rounded-full border-2 border-white/20 flex items-center justify-center">
                  <ChevronsRight size={16} className={`transition-transform duration-500 ${isSidebarExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <nav className="flex flex-col gap-6 px-3 mt-12" aria-label="Pipelines">
                <p className={`text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-3 mb-2 transition-opacity duration-300 ${!isSidebarExpanded && 'opacity-0'}`}>
                  Pipelines de Negócio
                </p>
                {pipelines.map((pipe) => (
                  <button
                    key={pipe.id}
                    onClick={() => setActivePipelineId(pipe.id)}
                    className="flex items-center gap-4 relative group w-full"
                  >
                    <div className={`w-14 h-14 shrink-0 rounded-[20px] flex items-center justify-center font-black text-xs uppercase transition-all duration-300 shadow-lg ${
                      activePipelineId === pipe.id 
                        ? 'bg-white text-black translate-x-1 shadow-[0_8px_25px_rgba(255,255,255,0.15)] scale-105' 
                        : 'bg-[#0f0f0f] text-[#333333] hover:text-slate-400 hover:bg-[#151515] border border-white/5'
                    }`}>
                      {pipe.id}
                    </div>
                    
                    {isSidebarExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col items-start overflow-hidden whitespace-nowrap"
                      >
                        <span className={`text-[11px] font-black uppercase tracking-tight ${activePipelineId === pipe.id ? 'text-white' : 'text-slate-500'}`}>
                          {pipe.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{pipe.count} Itens</span>
                          <span className="text-[9px] font-black text-bs-primary">{pipe.value}</span>
                        </div>
                      </motion.div>
                    )}
                  </button>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-6 items-center px-4 py-8 border-t border-white/5">
                <IconButton icon={Bell} badge={1} onClick={() => alert('Notificações em breve')} className="hover:text-bs-primary transition-colors" />
                
                <button 
                  onClick={() => {
                    const me = users.find(u => u.id === 'u1');
                    setFormData(me || {});
                    setModalType('');
                    setIsProfileOpen(true);
                  }}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="w-10 h-10 rounded-[14px] bg-slate-900 flex items-center justify-center text-[10px] font-black text-white border border-white/10 group-hover:border-bs-primary transition-all shadow-lg overflow-hidden relative">
                    {users.find(u => u.id === 'u1')?.avatar ? (
                      <img src={users.find(u => u.id === 'u1')?.avatar} className="w-full h-full object-cover" alt="" />
                    ) : (
                      'GU'
                    )}
                    <div className="absolute inset-0 bg-bs-primary/0 group-hover:bg-bs-primary/5 transition-colors" />
                  </div>
                  {isSidebarExpanded && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                      <p className="text-[9px] font-black text-white uppercase leading-none">{users.find(u => u.id === 'u1')?.name.split(' ')[0]}</p>
                      <p className="text-[7px] font-bold text-slate-600 uppercase tracking-widest mt-1">Admin</p>
                    </motion.div>
                  )}
                </button>

                <button 
                  onClick={() => navigate('/dashboard/usuarios')}
                  className={`flex items-center gap-4 transition-colors group ${activeTab === 'usuarios' ? 'text-bs-primary' : 'text-slate-600 hover:text-white'}`}
                >
                  <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
                  {isSidebarExpanded && (
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Config</span>
                  )}
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shrink-0 shadow-sm z-30">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsSidebarVisible(!isSidebarVisible)} 
                className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-100 text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all ${!isSidebarVisible ? '' : 'rotate-180'}`}
                aria-label="Alternar visibilidade da barra lateral"
              >
                <ChevronRight size={16} />
              </button>
              <div>
                <Title className="text-xl uppercase tracking-tighter leading-none">
                  {activeTab === 'negocios' ? PIPELINE_CONFIG[activePipelineId].name : activeTab === 'empresas' ? 'Empresas & Pessoas' : activeTab === 'usuarios' ? 'Equipe & Usuários' : activeTab}
                </Title>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                  BSIT / <span className="text-indigo-600">{activeTab}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:shadow-sm transition-all">
                Exportar CSV
              </button>
              <PrimaryButton onClick={() => handleOpenAdd(activeTab)} icon={Plus} className="shadow-lg shadow-yellow-500/20">
                Novo Registro
              </PrimaryButton>
            </div>
          </header>

          <main className={`flex-1 bg-[#f8f9fa] ${activeTab === 'negocios' ? 'overflow-x-auto custom-scrollbar-h' : 'p-8 h-full overflow-y-auto custom-scrollbar'}`}>
            <div className={`h-full ${activeTab === 'negocios' ? '' : 'max-w-[1600px] mx-auto'}`}>
              <Routes>
                <Route path="inicio" element={<HomePage />} />
                <Route path="negocios" element={
                  <DragDropContext onDragEnd={onDragEnd}>
                    <div className="h-full inline-flex gap-4 min-w-full px-6">
                      {currentStages.map((stage: any) => {
                        const stageLeads = leads
                          .filter((l: any) => l.pipeline === activePipelineId && l.stage === stage.id)
                          .map((l: any) => ({
                            ...l,
                            entity: entities.find((e: any) => e.id === l.entityId)
                          }));
                        return (
                          <KanbanColumn key={stage.id} stage={{ ...stage, count: stageLeads.length, total: stageLeads.reduce((a:any,c:any)=>a+c.value,0) }}>
                            <Droppable droppableId={stage.id}>
                              {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 min-h-[200px]">
                                  {stageLeads.map((lead: any, index: number) => (
                                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                      {(provided) => (
                                        <div 
                                          ref={provided.innerRef} 
                                          {...provided.draggableProps} 
                                          {...provided.dragHandleProps} 
                                          onContextMenu={(e) => handleContextMenu(e, lead)}
                                          className="relative group/kanban mb-3"
                                        >
                                          <KanbanCard 
                                            lead={{...lead, company: lead.entity?.name}} 
                                            users={users}
                                            onUpdateOwner={(uid) => handleUpdateLeadOwner(lead.id, uid)}
                                          />
                                          <div className="absolute top-2 right-2 opacity-0 group-hover/kanban:opacity-100 transition-opacity flex gap-1 z-20">
                                            <button onClick={() => handleOpenLeadTasks(lead)} className="p-1.5 bg-white shadow-md rounded-md text-emerald-600 hover:bg-emerald-50" title="Ver Tarefas"><ClipboardList size={12} /></button>
                                            <button onClick={() => handleOpenLeadHistory(lead)} className="p-1.5 bg-white shadow-md rounded-md text-slate-600 hover:bg-slate-50" title="Ver Histórico"><History size={12} /></button>
                                            <button onClick={() => handleOpenEdit(lead, 'negocios')} className="p-1.5 bg-white shadow-md rounded-md text-blue-600 hover:bg-blue-50" title="Editar"><Edit3 size={12} /></button>
                                            <button onClick={() => onDuplicate(lead, 'leads')} className="p-1.5 bg-white shadow-md rounded-md text-indigo-600 hover:bg-indigo-50" title="Clonar Negócio"><Copy size={12} /></button>
                                            <button onClick={() => onDelete(lead.id, 'leads')} className="p-1.5 bg-white shadow-md rounded-md text-red-600 hover:bg-red-50" title="Excluir"><Trash2 size={12} /></button>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                            <button onClick={() => handleOpenAdd('negocios')} className="w-full py-3 rounded-lg border-2 border-dashed border-gray-200 text-gray-300 hover:border-indigo-200 hover:text-indigo-300 transition-all flex items-center justify-center mt-3"><Plus size={20} /></button>
                          </KanbanColumn>
                        );
                      })}
                    </div>
                  </DragDropContext>
                } />
                <Route path="tarefas" element={
                  <TasksPage 
                    tasks={tasks.map((t: any) => {
                      const lead = leads.find((l: any) => l.id === t.leadId);
                      const entity = entities.find((e: any) => e.id === lead?.entityId);
                      return { ...t, company: entity?.name || lead?.name || 'Sem vínculo' };
                    })} 
                    users={users}
                    onUpdateTaskOwner={handleUpdateTaskOwner}
                    onEdit={onEdit} 
                    onDelete={(id: string) => onDelete(id, 'tasks')} 
                    onDuplicate={(item: any) => onDuplicate(item, 'tasks')} 
                  />
                } />
                <Route path="empresas" element={<CompaniesPage entities={entities} onEdit={onEdit} onDelete={(id: string) => onDelete(id, 'entities')} onDuplicate={(item: any) => onDuplicate(item, 'entities')} />} />
                <Route path="usuarios" element={<UsersPage users={users} onEdit={(u: any) => handleOpenEdit(u, 'usuarios')} onDelete={(id: string) => onDelete(id, 'users')} />} />
                <Route path="relatorios" element={<ReportsPage />} />
                <Route path="*" element={<Navigate to="negocios" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>

      <Modal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        title="Meu Perfil" 
        subtitle="Configurações da sua conta" 
        footer={<div className="flex flex-col gap-3">
          <PrimaryButton onClick={handleUpdateMyProfile} className="w-full justify-center py-4 rounded-2xl">Salvar Alterações</PrimaryButton>
          <button type="button" onClick={() => navigate('/')} className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase text-[10px] hover:bg-red-600 hover:text-white transition-all">Sair do Sistema</button>
        </div>}
      >
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-slate-900 flex items-center justify-center text-3xl font-black text-white border-4 border-bs-primary shadow-xl shadow-yellow-500/10 overflow-hidden">
              {formData.avatar ? (
                <img src={formData.avatar} className="w-full h-full object-cover" alt="" />
              ) : (
                'GU'
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera size={24} />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{users.find(u => u.id === 'u1')?.name}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Administrador • BSIT</p>
          </div>
          <div className="w-full space-y-4 pt-4">
            <div className="space-y-1">
              <Label>Nome Completo</Label>
              <input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold" />
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100">
              <Label className="block mb-1">E-mail corporativo</Label>
              <p className="text-xs font-bold text-slate-700">{users.find(u => u.id === 'u1')?.email}</p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`${editingItem ? 'Editar' : 'Novo'} ${modalType || activeTab}`} 
        subtitle="Gerencie as informações detalhadas" 
        wide={editingItem && (modalType || activeTab) === 'negocios'}
        footer={<div className="flex gap-4"><button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-gray-200 text-slate-400 rounded-2xl font-black uppercase text-[10px]">Cancelar</button><PrimaryButton type="submit" onClick={handleSubmit} className="flex-1 justify-center py-4 rounded-2xl">Salvar Registro</PrimaryButton></div>}
      >
        {editingItem && (modalType || activeTab) === 'negocios' && (
          <div className="flex gap-4 mb-8 border-b border-gray-100 pb-4">
            {['dados', 'historico', 'tarefas'].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveModalTab(tab)}
                className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${
                  activeModalTab === tab ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
              >
                {tab === 'dados' ? 'Dados do Negócio' : tab === 'historico' ? 'Linha do Tempo' : 'Tarefas'}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-6">
          {activeModalTab === 'dados' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {(modalType || activeTab) === 'empresas' && (
                <div className="flex gap-4 mb-4">
                  <button type="button" onClick={() => setFormData({...formData, type: 'PJ'})} className={`flex-1 py-2 rounded-lg border-2 font-black text-[10px] uppercase transition-all ${formData.type === 'PJ' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 text-slate-400'}`}>Pessoa Jurídica</button>
                  <button type="button" onClick={() => setFormData({...formData, type: 'PF'})} className={`flex-1 py-2 rounded-lg border-2 font-black text-[10px] uppercase transition-all ${formData.type === 'PF' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 text-slate-400'}`}>Pessoa Física</button>
                </div>
              )}

              {((modalType || activeTab) === 'negocios' || (modalType || activeTab) === 'empresas' || (modalType || activeTab) === 'usuarios') && (
                <div className="space-y-1"><Label>Nome Completo / Razão</Label><input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold" /></div>
              )}

              {(modalType || activeTab) === 'usuarios' && (
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-black text-slate-400 border-2 border-slate-200 overflow-hidden">
                      {formData.avatar ? (
                        <img src={formData.avatar} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <UserPlus size={32} />
                      )}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera size={20} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                  <Label>Foto de Perfil</Label>
                </div>
              )}

              {(modalType || activeTab) === 'usuarios' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label>E-mail</Label><input value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold" /></div>
                  <div className="space-y-1"><Label>Cargo</Label><select value={formData.role || 'Consultor'} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold uppercase"><option value="Administrador">Administrador</option><option value="Gerente">Gerente</option><option value="Consultor">Consultor</option></select></div>
                </div>
              )}
              {(modalType || activeTab) === 'empresas' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label>{formData.type === 'PF' ? 'CPF' : 'CNPJ'}</Label><input value={formData.document || ''} onChange={e => setFormData({...formData, document: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold" /></div>
                  <div className="space-y-1"><Label>Cidade/UF</Label><input value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold" /></div>
                  <div className="space-y-1"><Label>Email</Label><input value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold" /></div>
                  <div className="space-y-1"><Label>Telefone</Label><input value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold" /></div>
                </div>
              )}

              {(modalType || activeTab) === 'negocios' && (
                <>
                  <div className="space-y-1">
                    <Label>Vincular Empresa/Pessoa</Label>
                    <select required value={formData.entityId || ''} onChange={e => setFormData({...formData, entityId: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold uppercase">
                      <option value="">Selecione...</option>
                      {entities.map((e: any) => <option key={e.id} value={e.id}>{e.name} ({e.type})</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label>Valor (R$)</Label><input type="number" value={formData.value || ''} onChange={e => setFormData({...formData, value: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold" /></div>
                    <div className="space-y-1"><Label>Etapa</Label><select value={formData.stage || (currentStages[0]?.id)} onChange={e => setFormData({...formData, stage: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold uppercase">{currentStages.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                  </div>
                  <div className="space-y-1"><Label>Responsável Comercial</Label><select value={formData.ownerId || 'u1'} onChange={e => setFormData({...formData, ownerId: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold uppercase">{users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
                </>
              )}

              {(modalType || activeTab) === 'tarefas' && (
                <>
                  <div className="space-y-1"><Label>Título da Tarefa</Label><input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label>Vincular Negócio</Label><select required value={formData.leadId || ''} onChange={e => setFormData({...formData, leadId: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold uppercase"><option value="">Selecione...</option>{leads.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
                    <div className="space-y-1"><Label>Responsável</Label><select value={formData.userId || 'u1'} onChange={e => setFormData({...formData, userId: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold uppercase">{users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
                  </div>
                </>
              )}
              <button type="submit" className="hidden" />
            </form>
          )}

          {activeModalTab === 'historico' && editingItem && (modalType || activeTab) === 'negocios' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3">
                <Label>Nova Nota / Observação</Label>
                <textarea 
                  value={newActivityNote}
                  onChange={(e) => setNewActivityNote(e.target.value)}
                  placeholder="Descreva o que aconteceu ou adicione uma nota..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-indigo-500 min-h-[80px]"
                />
                <div className="flex justify-end">
                  <PrimaryButton onClick={handleAddActivity} className="py-2 px-4 h-auto text-[9px]">Salvar Nota</PrimaryButton>
                </div>
              </div>

              <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 mt-8">
                {(() => {
                  const currentActivities = [
                    ...tasks.filter((t: any) => t.leadId === editingItem.id).map((t: any) => ({ ...t, streamType: 'task' })),
                    ...activities.filter((a: any) => a.leadId === editingItem.id).map((a: any) => ({ ...a, streamType: 'activity' }))
                  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                  if (currentActivities.length === 0) {
                    return <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center py-10 pl-10">Nenhum histórico registrado</p>;
                  }

                  return currentActivities.map((item: any) => {
                    const user = users.find((u: any) => u.id === (item.userId || item.ownerId));
                    return (
                      <div key={item.id} className="relative pl-10 group">
                        <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110 ${
                          item.streamType === 'task' 
                            ? item.completed ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white'
                            : 'bg-white text-slate-400 border-slate-200'
                        }`}>
                          {item.streamType === 'task' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        </div>

                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest block mb-1">
                                {item.streamType === 'task' ? 'Tarefa' : 'Atividade'}
                              </span>
                              <h4 className={`text-xs font-bold text-slate-800 ${item.completed ? 'line-through opacity-50' : ''}`}>
                                {item.title || item.description}
                              </h4>
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase whitespace-nowrap">
                              {new Date(item.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100/50">
                            <img src={user?.avatar} className="w-5 h-5 rounded-full ring-2 ring-white" alt="" />
                            <span className="text-[9px] font-black text-slate-500 uppercase">{user?.name}</span>
                            {item.streamType === 'task' && !item.completed && (
                              <button onClick={() => toggleTask(item.id)} className="ml-auto text-[8px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-600 hover:text-white transition-colors">CONCLUIR</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {activeModalTab === 'tarefas' && editingItem && (modalType || activeTab) === 'negocios' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3 mb-8">
                <Label>Nova Tarefa</Label>
                <div className="flex flex-col gap-3">
                  <input 
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Título da tarefa..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-indigo-500"
                  />
                  <div className="flex gap-3 items-center">
                    <input 
                      type="date"
                      value={newTaskDate}
                      onChange={(e) => setNewTaskDate(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-indigo-500"
                    />
                    <UserSelector 
                      users={users} 
                      selectedUserId={newTaskUserId} 
                      onSelect={setNewTaskUserId}
                      showName={false}
                    />
                    <PrimaryButton onClick={handleInlineAddTask} className="py-2 px-6 h-auto text-[9px]">Agendar Tarefa</PrimaryButton>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {tasks.filter((t: any) => t.leadId === editingItem.id).length === 0 ? (
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">Nenhuma tarefa encontrada</p>
                ) : (
                  tasks.filter((t: any) => t.leadId === editingItem.id)
                    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((task: any) => (
                    <div key={task.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:border-indigo-100 transition-all shadow-sm">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => toggleTask(task.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 text-transparent hover:border-indigo-500 hover:text-indigo-500'
                          }`}
                        >
                          <CheckCircle2 size={12} />
                        </button>
                        <div>
                          <h4 className={`text-xs font-bold text-slate-800 ${task.completed ? 'line-through opacity-50' : ''}`}>{task.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              Prazo: {new Date(task.date).toLocaleDateString('pt-BR')}
                            </p>
                            <span className="text-slate-200">|</span>
                            <UserSelector 
                              users={users}
                              selectedUserId={task.userId}
                              onSelect={(uid) => handleUpdateTaskOwner(task.id, uid)}
                              className="scale-90 origin-left"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenEdit(task, 'tarefas')} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"><Edit3 size={14} /></button>
                        <button onClick={() => onDelete(task.id, 'tasks')} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed z-[200] bg-white border border-slate-100 shadow-2xl rounded-2xl p-1.5 min-w-[190px] overflow-hidden"
          >
            <div className="flex flex-col gap-0.5">
              <button 
                onClick={() => handleOpenLeadTasks(contextMenu.lead)}
                className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-6 h-6 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                  <ClipboardList size={12} />
                </div>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Ver Tarefas</span>
              </button>

              <button 
                onClick={() => handleOpenLeadHistory(contextMenu.lead)}
                className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-6 h-6 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center">
                  <History size={12} />
                </div>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Ver Histórico</span>
              </button>

              <button 
                onClick={() => handleOpenEdit(contextMenu.lead, 'negocios')}
                className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <Edit3 size={12} />
                </div>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Editar Negócio</span>
              </button>

              <div className="h-px bg-slate-100 my-1 mx-2" />

              <button 
                onClick={() => onDuplicate(contextMenu.lead, 'leads')}
                className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                  <Copy size={12} />
                </div>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Clonar Negócio</span>
              </button>

              <button 
                onClick={() => onDelete(contextMenu.lead.id, 'leads')}
                className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-red-50 rounded-xl transition-colors text-left group"
              >
                <div className="w-6 h-6 bg-red-50 text-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Trash2 size={12} />
                </div>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-red-600">Excluir Registro</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
