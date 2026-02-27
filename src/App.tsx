import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, TrendingUp, CheckCircle2, Grid, BarChart3, 
  Search, Bell, Settings, Plus, ChevronRight,
  Edit3, Copy, Trash2, UserPlus, Clock, MessageSquare, History
} from 'lucide-react';

// UI Components
import { Title, Label, PrimaryButton, CircularButton, IconButton, Modal } from './components/ui/Base';
import { KanbanCard, KanbanColumn } from './components/ui/Kanban';

// Pages
import { LoginPage } from './pages/Login';
import { HomePage } from './pages/Home';
import { ReportsPage } from './pages/Reports';
import { TasksPage } from './pages/Tasks';
import { CompaniesPage } from './pages/Companies';
import { UsersPage } from './pages/Users';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const STAGES = [
  { id: 'prospect', name: 'CONTATO', color: 'border-t-blue-500' },
  { id: 'contact', name: 'ENVIO DE APRESENTAÇÃO', color: 'border-t-indigo-500' },
  { id: 'proposal', name: 'ENVIO DE PROPOSTA', color: 'border-t-violet-500' },
  { id: 'followup', name: 'ACOMPANHAMENTO', color: 'border-t-purple-500' },
  { id: 'closing', name: 'FECHAMENTO', color: 'border-t-fuchsia-500' },
];

const App: React.FC = () => {
  // --- GLOBAL STATES ---
  const [users, setUsers] = useState<any[]>([
    { id: 'u1', name: 'Gabriel Ursini', role: 'Administrador', avatar: 'https://i.pravatar.cc/150?u=u1', email: 'gabriel@bsit.com' },
    { id: 'u2', name: 'Ana Silva', role: 'Consultora', avatar: 'https://i.pravatar.cc/150?u=u2', email: 'ana@bsit.com' },
  ]);

  const [entities, setEntities] = useState<any[]>([
    { id: 'e1', type: 'PJ', name: 'TechSolutions S.A', document: '12.345.678/0001-90', city: 'São Paulo, SP', email: 'contato@tech.com', phone: '(11) 3333-4444' },
    { id: 'e2', type: 'PF', name: 'Ricardo Almeida', document: '123.456.789-00', city: 'Curitiba, PR', email: 'ricardo@tech.com', phone: '(11) 98888-7777', role: 'Diretor' },
  ]);

  const [leads, setLeads] = useState<any[]>([
    { id: '1', name: 'Orçamento - 5535', entityId: 'e1', views: 2, value: 580, stage: 'prospect', ownerId: 'u1' },
    { id: '2', name: 'Orçamento - 5536', entityId: 'e2', views: 0, value: 690, stage: 'prospect', ownerId: 'u2' },
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
    setFormData(type === 'empresas' ? { type: 'PJ' } : type === 'usuarios' ? { role: 'Consultor' } : {}); 
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
        description: `Mudança de etapa: ${STAGES.find(s => s.id === destination.droppableId)?.name}`,
        date: new Date()
      }]);
    }

    setLeads(prev => prev.map(l => l.id === draggableId ? { ...l, stage: destination.droppableId } : l));
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard/*" element={
          <DashboardLayout 
            leads={leads} entities={entities} tasks={tasks} users={users} activities={activities}
            onEdit={handleEdit} onAdd={handleAdd} onDelete={handleDelete} onDuplicate={handleDuplicate} onDragEnd={onDragEnd} toggleTask={toggleTask}
            isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} editingItem={editingItem} formData={formData} setFormData={setFormData} setLeads={setLeads} setEntities={setEntities} setTasks={setTasks} setUsers={setUsers}
          />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

// --- LAYOUT MASTER ---
const DashboardLayout = ({ leads, entities, tasks, users, activities, onEdit, onAdd, onDelete, onDuplicate, onDragEnd, toggleTask, isModalOpen, setIsModalOpen, editingItem, formData, setFormData, setLeads, setEntities, setTasks, setUsers }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const activeTab = location.pathname.split('/').pop() || 'negocios';

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

    if (activeTab === 'negocios') {
      setLeads((prev: any) => editingItem ? prev.map((i: any) => i.id === id ? data : i) : [...prev, { ...data, views: 0 }]);
    } else if (activeTab === 'empresas') {
      setEntities((prev: any) => editingItem ? prev.map((i: any) => i.id === id ? data : i) : [...prev, data]);
    } else if (activeTab === 'tarefas') {
      setTasks((prev: any) => editingItem ? prev.map((i: any) => i.id === id ? data : i) : [...prev, data]);
    } else if (activeTab === 'usuarios') {
      setUsers((prev: any) => editingItem ? prev.map((i: any) => i.id === id ? data : i) : [...prev, { ...data, avatar: `https://i.pravatar.cc/150?u=${id}` }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f4f5f7] font-sans text-slate-700 overflow-hidden">
      <header className="h-14 bg-[#1e1e2d] flex items-center justify-between px-4 shrink-0 z-50 shadow-lg">
        <div className="flex items-center gap-8">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-[#1e1e2d] text-xl italic">p</div>
          <nav className="flex items-center gap-6">
            {menuItems.map(item => (
              <button key={item.id} onClick={() => navigate(`/dashboard/${item.id}`)} className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 py-4 ${activeTab === item.id ? 'text-white border-bs-primary' : 'text-slate-400 border-transparent hover:text-white'}`}>
                <item.icon size={14} /> {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <IconButton icon={Bell} badge={1} />
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">GU</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence initial={false}>
          {isSidebarVisible && (
            <motion.aside initial={{ width: 0 }} animate={{ width: 56 }} exit={{ width: 0 }} className="bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-4 shrink-0 overflow-hidden">
              <CircularButton label="SPO" /> <CircularButton label="VOL" /> <CircularButton label="VEN" active />
              <div className="mt-auto mb-2"><IconButton icon={Settings} /></div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} className={`transition-transform ${!isSidebarVisible ? '' : 'rotate-180'}`}><ChevronRight className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full p-0.5 hover:bg-indigo-200" /></button>
              <Title className="text-lg uppercase tracking-tight">
                {activeTab === 'empresas' ? 'Empresas & Pessoas' : activeTab === 'usuarios' ? 'Equipe & Usuários' : activeTab}
              </Title>
            </div>
            <PrimaryButton onClick={() => onAdd(activeTab)} icon={Plus}>Adicionar {activeTab === 'empresas' ? 'Registro' : activeTab === 'usuarios' ? 'Membro' : activeTab}</PrimaryButton>
          </div>

          <main className={`flex-1 overflow-auto bg-[#f4f5f7] ${activeTab === 'negocios' ? 'overflow-y-hidden' : 'p-6'}`}>
            <Routes>
              <Route path="inicio" element={<HomePage />} />
              <Route path="negocios" element={
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="h-full inline-flex gap-4 min-w-full px-6">
                    {STAGES.map((stage) => {
                      const stageLeads = leads.filter((l: any) => l.stage === stage.id).map((l: any) => ({
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
                                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="relative group/kanban mb-3">
                                        <KanbanCard lead={{...lead, company: lead.entity?.name}} />
                                        <div className="absolute top-2 right-2 opacity-0 group-hover/kanban:opacity-100 transition-opacity flex gap-1 z-20">
                                          <button onClick={() => onEdit(lead)} className="p-1.5 bg-white shadow-md rounded-md text-blue-600 hover:bg-blue-50"><Edit3 size={12} /></button>
                                          <button onClick={() => onDuplicate(lead, 'leads')} className="p-1.5 bg-white shadow-md rounded-md text-indigo-600 hover:bg-indigo-50"><Copy size={12} /></button>
                                          <button onClick={() => onDelete(lead.id, 'leads')} className="p-1.5 bg-white shadow-md rounded-md text-red-600 hover:bg-red-50"><Trash2 size={12} /></button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                          <button onClick={() => onAdd('negocios')} className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-300 hover:border-indigo-200 hover:text-indigo-300 transition-all flex items-center justify-center mt-3"><Plus size={20} /></button>
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
                  onEdit={onEdit} 
                  onDelete={(id: string) => onDelete(id, 'tasks')} 
                  onDuplicate={(item: any) => onDuplicate(item, 'tasks')} 
                />
              } />
              <Route path="empresas" element={<CompaniesPage entities={entities} onEdit={onEdit} onDelete={(id: string) => onDelete(id, 'entities')} onDuplicate={(item: any) => onDuplicate(item, 'entities')} />} />
              <Route path="usuarios" element={<UsersPage users={users} onEdit={onEdit} onDelete={(id: string) => onDelete(id, 'users')} />} />
              <Route path="relatorios" element={<ReportsPage />} />
              <Route path="*" element={<Navigate to="negocios" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${editingItem ? 'Editar' : 'Novo'} ${activeTab}`} subtitle="Gerencie as informações detalhadas" footer={<div className="flex gap-4"><button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-gray-200 text-slate-400 rounded-2xl font-black uppercase text-[10px]">Cancelar</button><PrimaryButton type="submit" className="flex-1 justify-center py-4 rounded-2xl">Salvar Registro</PrimaryButton></div>}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'empresas' && (
            <div className="flex gap-4 mb-4">
              <button type="button" onClick={() => setFormData({...formData, type: 'PJ'})} className={`flex-1 py-2 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${formData.type === 'PJ' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 text-slate-400'}`}>Pessoa Jurídica</button>
              <button type="button" onClick={() => setFormData({...formData, type: 'PF'})} className={`flex-1 py-2 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${formData.type === 'PF' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 text-slate-400'}`}>Pessoa Física</button>
            </div>
          )}

          {(activeTab === 'negocios' || activeTab === 'empresas' || activeTab === 'usuarios') && (
            <div className="space-y-1"><Label>Nome Completo / Razão</Label><input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold" /></div>
          )}

          {activeTab === 'usuarios' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>E-mail</Label><input value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold" /></div>
              <div className="space-y-1"><Label>Cargo</Label><select value={formData.role || 'Consultor'} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold uppercase"><option value="Administrador">Administrador</option><option value="Gerente">Gerente</option><option value="Consultor">Consultor</option></select></div>
            </div>
          )}

          {activeTab === 'empresas' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>{formData.type === 'PF' ? 'CPF' : 'CNPJ'}</Label><input value={formData.document || ''} onChange={e => setFormData({...formData, document: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold" /></div>
              <div className="space-y-1"><Label>Cidade/UF</Label><input value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold" /></div>
              <div className="space-y-1"><Label>Email</Label><input value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold" /></div>
              <div className="space-y-1"><Label>Telefone</Label><input value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold" /></div>
            </div>
          )}

          {activeTab === 'negocios' && (
            <>
              <div className="space-y-1">
                <Label>Vincular Empresa/Pessoa</Label>
                <select required value={formData.entityId || ''} onChange={e => setFormData({...formData, entityId: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold uppercase">
                  <option value="">Selecione...</option>
                  {entities.map((e: any) => <option key={e.id} value={e.id}>{e.name} ({e.type})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label>Valor (R$)</Label><input type="number" value={formData.value || ''} onChange={e => setFormData({...formData, value: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold" /></div>
                <div className="space-y-1"><Label>Etapa</Label><select value={formData.stage || 'prospect'} onChange={e => setFormData({...formData, stage: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold uppercase">{STAGES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
              </div>
              <div className="space-y-1"><Label>Responsável Comercial</Label><select value={formData.ownerId || 'u1'} onChange={e => setFormData({...formData, ownerId: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold uppercase">{users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
            </>
          )}

          {activeTab === 'tarefas' && (
            <>
              <div className="space-y-1"><Label>Título da Tarefa</Label><input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label>Vincular Negócio</Label><select required value={formData.leadId || ''} onChange={e => setFormData({...formData, leadId: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold uppercase"><option value="">Selecione...</option>{leads.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
                <div className="space-y-1"><Label>Responsável</Label><select value={formData.userId || 'u1'} onChange={e => setFormData({...formData, userId: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold uppercase">{users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
              </div>
            </>
          )}

          {/* Business Timeline Section */}
          {activeTab === 'negocios' && editingItem && (
            <div className="pt-8 border-t border-gray-100 mt-8">
              <div className="flex items-center gap-2 mb-6">
                <History className="text-indigo-600" size={18} />
                <Title className="text-xs">Linha do Tempo & Histórico</Title>
              </div>

              <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {/* Unified Activity Stream: Tasks + Activities */}
                {[
                  ...tasks.filter((t: any) => t.leadId === editingItem.id).map((t: any) => ({ ...t, streamType: 'task' })),
                  ...activities.filter((a: any) => a.leadId === editingItem.id).map((a: any) => ({ ...a, streamType: 'activity' }))
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item: any) => {
                  const user = users.find((u: any) => u.id === (item.userId || item.ownerId));
                  return (
                    <div key={item.id} className="relative pl-10 group">
                      {/* Icon Bullet */}
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
                            {new Date(item.date).toLocaleDateString('pt-BR')}
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
                })}
              </div>
            </div>
          )}
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </div>
  );
};

export default App;
