import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, TrendingUp, CheckCircle2, Grid, Users, BarChart3, 
  Search, Bell, Menu, Settings, Filter, ArrowUpDown, Plus, ChevronRight,
  Edit3, Copy, Trash2
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
import { ContactsPage } from './pages/Contacts';
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
  const [leads, setLeads] = useState<any[]>([
    { id: '1', name: 'Orçamento - 5535', company: 'TechPhone', views: 2, value: 580, stage: 'prospect' },
    { id: '2', name: 'Orçamento - 5536', company: 'UP Suportes', views: 0, value: 690, stage: 'prospect' },
    { id: '3', name: 'Orçamento - 2874', company: 'OPTIMUM', views: 15, value: 8820, stage: 'prospect' },
    { id: '4', name: 'Orçamento - 5504', company: 'Agendor', views: 5, value: 650, stage: 'contact' },
    { id: '5', name: 'Orçamento - 1458', company: 'Tael Soluções', views: 8, value: 5880, stage: 'proposal' },
  ]);

  const [companies, setCompanies] = useState<any[]>([
    { id: 'c1', name: 'TechSolutions S.A', cnpj: '12.345.678/0001-90', city: 'São Paulo, SP', segment: 'Tecnologia' },
    { id: 'c2', name: 'Inova Gestão', cnpj: '98.765.432/0001-10', city: 'Curitiba, PR', segment: 'Consultoria' },
  ]);

  const [contacts, setContacts] = useState<any[]>([
    { id: 'p1', name: 'Ricardo Almeida', role: 'Diretor', company: 'TechSolutions S.A', email: 'ricardo@tech.com', phone: '(11) 98888-7777' },
  ]);

  const [tasks, setTasks] = useState<any[]>([
    { id: 't1', title: 'Ligar para Ricardo Almeida', company: 'TechSolutions', date: new Date(2026, 1, 10, 14, 0), priority: 'high' },
    { id: 't2', title: 'Enviar Proposta BSIT', company: 'Inova Gestão', date: new Date(2026, 1, 12, 10, 30), priority: 'medium' },
    { id: 't3', title: 'Reunião de Fechamento', company: 'Global Corp', date: new Date(2026, 1, 10, 16, 0), priority: 'high' },
    { id: 't4', title: 'Follow-up Diagnóstico', company: 'Prime Log', date: new Date(2026, 1, 15, 0, 0), priority: 'low' },
    { id: 't5', title: 'Prospecção Ativa', company: 'Posto Shell', date: new Date(2026, 1, 2, 9, 0), priority: 'high' },
    { id: 't19', title: 'Auditoria Interna', company: 'BSIT Interno', date: new Date(2026, 1, 27, 14, 0), priority: 'high' },
  ]);

  // --- CRUD HELPERS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const handleEdit = (item: any) => { setEditingItem(item); setFormData(item); setIsModalOpen(true); };
  const handleAdd = () => { setEditingItem(null); setFormData({}); setIsModalOpen(true); };
  
  const handleDelete = (id: string, type: string) => {
    if (!window.confirm('Excluir este registro?')) return;
    if (type === 'leads') setLeads(prev => prev.filter(i => i.id !== id));
    if (type === 'companies') setCompanies(prev => prev.filter(i => i.id !== id));
    if (type === 'contacts') setContacts(prev => prev.filter(i => i.id !== id));
    if (type === 'tasks') setTasks(prev => prev.filter(i => i.id !== id));
  };

  const handleDuplicate = (item: any, type: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newItem = { ...item, id, name: item.name ? `${item.name} (Cópia)` : item.title ? `${item.title} (Cópia)` : '' };
    if (type === 'leads') setLeads(prev => [...prev, newItem]);
    if (type === 'companies') setCompanies(prev => [...prev, newItem]);
    if (type === 'contacts') setContacts(prev => [...prev, newItem]);
    if (type === 'tasks') setTasks(prev => [...prev, newItem]);
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    setLeads(prev => {
      const newLeads = Array.from(prev);
      const [movedLead] = newLeads.splice(newLeads.findIndex(l => l.id === draggableId), 1);
      
      // Atualizar o stage
      movedLead.stage = destination.droppableId;

      // Pegar leads da coluna de destino (excluindo o movido se ele já estava lá)
      const destLeads = newLeads.filter(l => l.stage === destination.droppableId);
      
      // Inserir o lead movido na posição correta da coluna de destino
      const insertIndex = newLeads.findIndex(l => l.id === (destLeads[destination.index]?.id));
      
      if (insertIndex === -1) {
        newLeads.push(movedLead);
      } else {
        newLeads.splice(insertIndex, 0, movedLead);
      }

      return newLeads;
    });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard/*" element={
          <DashboardLayout 
            leads={leads} companies={companies} contacts={contacts} tasks={tasks}
            onEdit={handleEdit} onAdd={handleAdd} onDelete={handleDelete} onDuplicate={handleDuplicate} onDragEnd={onDragEnd}
            isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} editingItem={editingItem} formData={formData} setFormData={setFormData} setLeads={setLeads} setCompanies={setCompanies} setContacts={setContacts} setTasks={setTasks}
          />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

// --- LAYOUT MASTER ---
const DashboardLayout = ({ leads, companies, contacts, tasks, onEdit, onAdd, onDelete, onDuplicate, onDragEnd, isModalOpen, setIsModalOpen, editingItem, formData, setFormData, setLeads, setCompanies, setContacts, setTasks }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const activeTab = location.pathname.split('/').pop() || 'negocios';

  const menuItems = [
    { id: 'inicio', label: 'Início', icon: LayoutDashboard },
    { id: 'tarefas', label: 'Tarefas', icon: CheckCircle2 },
    { id: 'empresas', label: 'Empresas & Contatos', icon: Grid },
    { id: 'negocios', label: 'Negócios', icon: TrendingUp },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingItem?.id || Math.random().toString(36).substr(2, 9);
    const data = { ...formData, id, value: formData.value ? parseFloat(formData.value) : 0 };

    if (activeTab === 'negocios') {
      setLeads((prev: any) => editingItem ? prev.map((i: any) => i.id === id ? data : i) : [...prev, { ...data, views: 0 }]);
    } else if (activeTab === 'empresas') {
      setCompanies((prev: any) => editingItem ? prev.map((i: any) => i.id === id ? data : i) : [...prev, data]);
    } else if (activeTab === 'pessoas') {
      setContacts((prev: any) => editingItem ? prev.map((i: any) => i.id === id ? data : i) : [...prev, data]);
    } else if (activeTab === 'tarefas') {
      setTasks((prev: any) => editingItem ? prev.map((i: any) => i.id === id ? data : i) : [...prev, data]);
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
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} /><input type="text" placeholder="Buscar" className="bg-[#2b2b3d] text-white text-xs pl-10 pr-4 py-1.5 rounded-md border border-slate-700 outline-none w-64 focus:border-indigo-500" /></div>
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
              <Title className="text-lg uppercase tracking-tight">{activeTab}</Title>
            </div>
            <PrimaryButton onClick={onAdd} icon={Plus}>Adicionar {activeTab}</PrimaryButton>
          </div>

          <main className={`flex-1 overflow-auto bg-[#f4f5f7] ${activeTab === 'negocios' ? 'overflow-y-hidden' : 'p-6'}`}>
            <Routes>
              <Route path="inicio" element={<HomePage />} />
              <Route path="negocios" element={
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="h-full inline-flex gap-4 min-w-full px-6">
                    {STAGES.map((stage) => {
                      const stageLeads = leads.filter((l: any) => l.stage === stage.id);
                      return (
                        <KanbanColumn key={stage.id} stage={{ ...stage, count: stageLeads.length, total: stageLeads.reduce((a:any,c:any)=>a+c.value,0) }}>
                          <Droppable droppableId={stage.id}>
                            {(provided) => (
                              <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 min-h-[200px]">
                                {stageLeads.map((lead: any, index: number) => (
                                  <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                    {(provided) => (
                                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="relative group/kanban mb-3">
                                        <KanbanCard lead={lead} />
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
                          <button onClick={onAdd} className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-300 hover:border-indigo-200 hover:text-indigo-300 transition-all flex items-center justify-center mt-3"><Plus size={20} /></button>
                        </KanbanColumn>
                      );
                    })}
                  </div>
                </DragDropContext>
              } />
              <Route path="tarefas" element={<TasksPage tasks={tasks} onEdit={onEdit} onDelete={(id) => onDelete(id, 'tasks')} onDuplicate={(item) => onDuplicate(item, 'tasks')} />} />
              <Route path="empresas" element={<CompaniesPage companies={companies} contacts={contacts} onEdit={onEdit} onDelete={onDelete} onDuplicate={onDuplicate} />} />
              <Route path="relatorios" element={<ReportsPage />} />
              <Route path="*" element={<Navigate to="negocios" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${editingItem ? 'Editar' : 'Novo'} ${activeTab}`} subtitle="Preencha os campos abaixo" footer={<div className="flex gap-4"><button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-gray-200 text-slate-400 rounded-2xl font-black uppercase text-[10px]">Cancelar</button><PrimaryButton onClick={handleSubmit} className="flex-1 justify-center py-4 rounded-2xl">Salvar Registro</PrimaryButton></div>}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(activeTab === 'negocios' || activeTab === 'empresas' || activeTab === 'pessoas') && (
            <div className="space-y-1"><Label>Nome / Razão Social</Label><input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold" /></div>
          )}
          {activeTab === 'tarefas' && (
            <div className="space-y-1"><Label>Título da Tarefa</Label><input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold" /></div>
          )}
          {activeTab === 'negocios' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Valor (R$)</Label><input type="number" value={formData.value || ''} onChange={e => setFormData({...formData, value: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold" /></div>
              <div className="space-y-1"><Label>Etapa</Label><select value={formData.stage || 'prospect'} onChange={e => setFormData({...formData, stage: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold uppercase">{STAGES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            </div>
          )}
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </div>
  );
};

export default App;
