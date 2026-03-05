import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, TrendingUp, CheckCircle2, Grid, Users, BarChart3, 
  Search, Bell, Menu, Settings, Filter, ArrowUpDown, Plus, ChevronRight,
  Edit3, Copy, Trash2, XCircle, UserPlus, PhoneCall, Building
} from 'lucide-react';

// UI Components
import { Title, Label, PrimaryButton, CircularButton, IconButton, Modal } from '../components/ui/Base';
import { KanbanCard, KanbanColumn } from '../components/ui/Kanban';

// Pages
import { LoginPage } from './Login';
import { HomePage } from './Home';
import { ReportsPage } from './Reports';
import { TasksPage } from './Tasks';
import { CompaniesPage } from './Companies';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const STAGES = [
  { id: 'prospect', name: 'NOVA OPORTUNIDADE', color: 'border-t-blue-500' },
  { id: 'contact', name: 'CONTATO REALIZADO', color: 'border-t-indigo-500' },
  { id: 'meeting', name: 'REUNIÃO AGENDADA', color: 'border-t-sky-500' },
  { id: 'presentation', name: 'ENVIO DE APRESENTAÇÃO', color: 'border-t-violet-500' },
  { id: 'proposal', name: 'ENVIO DE PROPOSTA', color: 'border-t-purple-500' },
  { id: 'followup', name: 'FUP/ACOMPANHAMENTO', color: 'border-t-fuchsia-500' },
  { id: 'closing', name: 'FECHAMENTO', color: 'border-t-pink-500' },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const activeTab = location.pathname.split('/').pop() || 'negocios';

  // --- GLOBAL STATES ---
  const [leads, setLeads] = useState<any[]>([
    { id: '1', name: 'Orçamento - 5535', company: 'TechPhone', views: 2, value: 580, stage: 'prospect' },
    { id: '4', name: 'Orçamento - 5504', company: 'Agendor', views: 5, value: 650, stage: 'contact' },
  ]);

  const [companies, setCompanies] = useState<any[]>([
    { id: 'c1', name: 'TechSolutions S.A', cnpj: '12.345.678/0001-90', city: 'São Paulo, SP', contacts: [{ name: 'Ricardo Almeida', phone: '(11) 98888-7777', dept: 'TI' }] },
    { id: 'c2', name: 'Inova Gestão', cnpj: '98.765.432/0001-10', city: 'Curitiba, PR', contacts: [{ name: 'Ana Silva', phone: '(41) 99999-1111', dept: 'Financeiro' }] },
  ]);

  const [tasks, setTasks] = useState<any[]>([
    { id: 't1', title: 'Ligar para Ricardo Almeida', company: 'TechSolutions', date: new Date(2026, 1, 10, 14, 0), priority: 'high' },
    { id: 't19', title: 'Auditoria Interna', company: 'BSIT Interno', date: new Date(2026, 1, 27, 14, 0), priority: 'high' },
  ]);

  // --- CRUD LOGIC ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const openAdd = () => {
    setEditingItem(null);
    setFormData(activeTab === 'empresas' ? { contacts: [{ name: '', phone: '', dept: '' }] } : {});
    setIsModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, type: string) => {
    if (!window.confirm('Excluir este registro?')) return;
    if (type === 'leads') setLeads(prev => prev.filter(i => i.id !== id));
    if (type === 'companies') setCompanies(prev => prev.filter(i => i.id !== id));
    if (type === 'tasks') setTasks(prev => prev.filter(i => i.id !== id));
  };

  const handleDuplicate = (item: any, type: string) => {
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9), name: item.name ? `${item.name} (Cópia)` : `${item.title} (Cópia)` };
    if (type === 'leads') setLeads(prev => [...prev, newItem]);
    if (type === 'companies') setCompanies(prev => [...prev, newItem]);
    if (type === 'tasks') setTasks(prev => [...prev, newItem]);
  };

  const handleAddSubContact = () => {
    const currentContacts = formData.contacts || [];
    setFormData({ ...formData, contacts: [...currentContacts, { name: '', phone: '', dept: '' }] });
  };

  const handleRemoveSubContact = (index: number) => {
    const currentContacts = [...(formData.contacts || [])];
    currentContacts.splice(index, 1);
    setFormData({ ...formData, contacts: currentContacts });
  };

  const handleSubContactChange = (index: number, field: string, value: string) => {
    const currentContacts = [...(formData.contacts || [])];
    currentContacts[index] = { ...currentContacts[index], [field]: value };
    setFormData({ ...formData, contacts: currentContacts });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const id = editingItem?.id || Math.random().toString(36).substr(2, 9);
    const data = { ...formData, id };

    if (activeTab === 'negocios') {
      setLeads(prev => editingItem ? prev.map(i => i.id === id ? data : i) : [...prev, { ...data, views: 0 }]);
    } else if (activeTab === 'empresas') {
      setCompanies(prev => editingItem ? prev.map(i => i.id === id ? data : i) : [...prev, data]);
    } else if (activeTab === 'tarefas') {
      setTasks(prev => editingItem ? prev.map(i => i.id === id ? data : i) : [...prev, data]);
    }
    setIsModalOpen(false);
  };

  const onDragEnd = (result: any) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    setLeads(prev => prev.map(l => l.id === draggableId ? { ...l, stage: destination.droppableId } : l));
  };

  const menuItems = [
    { id: 'inicio', label: 'Início', icon: LayoutDashboard },
    { id: 'tarefas', label: 'Tarefas', icon: CheckCircle2 },
    { id: 'empresas', label: 'Contatos', icon: Grid },
    { id: 'negocios', label: 'Negócios', icon: TrendingUp },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#f4f5f7] font-sans text-slate-700 overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-[#1e1e2d] flex items-center justify-between px-4 shrink-0 z-50 shadow-lg">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-[#1e1e2d] text-xl italic">p</div>
            <div className="h-4 w-px bg-slate-700 mx-2"></div>
            <span className="text-white font-black tracking-[0.3em] text-[10px] uppercase">Prospecção BSIT</span>
          </div>
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
              <Title className="text-lg uppercase tracking-tight">{menuItems.find(i => i.id === activeTab)?.label}</Title>
            </div>
            <PrimaryButton onClick={openAdd} icon={Plus}>Novo {activeTab === 'empresas' ? 'Contato' : activeTab}</PrimaryButton>
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
                                          <button onClick={() => openEdit(lead)} className="p-1.5 bg-white shadow-md rounded-md text-blue-600 hover:bg-blue-50"><Edit3 size={12} /></button>
                                          <button onClick={() => handleDuplicate(lead, 'leads')} className="p-1.5 bg-white shadow-md rounded-md text-indigo-600 hover:bg-indigo-50"><Copy size={12} /></button>
                                          <button onClick={() => handleDelete(lead.id, 'leads')} className="p-1.5 bg-white shadow-md rounded-md text-red-600 hover:bg-red-50"><Trash2 size={12} /></button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                          <button onClick={openAdd} className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-300 hover:border-indigo-200 hover:text-indigo-300 transition-all flex items-center justify-center mt-3"><Plus size={20} /></button>
                        </KanbanColumn>
                      );
                    })}
                  </div>
                </DragDropContext>
              } />
              <Route path="tarefas" element={<TasksPage tasks={tasks} onEdit={openEdit} onDelete={(id) => handleDelete(id, 'tasks')} onDuplicate={(item) => handleDuplicate(item, 'tasks')} />} />
              <Route path="empresas" element={<CompaniesPage entities={companies} onEdit={openEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} />} />
              <Route path="relatorios" element={<ReportsPage />} />
              <Route path="*" element={<Navigate to="negocios" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${editingItem ? 'Editar' : 'Novo'} ${activeTab}`} subtitle="Gerencie as informações detalhadas" footer={<div className="flex gap-4"><button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-gray-200 text-slate-400 rounded-2xl font-black uppercase text-[10px]">Cancelar</button><PrimaryButton onClick={handleSubmit} className="flex-1 justify-center py-4 rounded-2xl">Salvar Registro</PrimaryButton></div>}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {(activeTab === 'negocios' || activeTab === 'empresas') && (
            <div className="space-y-2"><Label>Entidade / Organização</Label><input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-indigo-500" placeholder="Nome da empresa ou pessoa" /></div>
          )}
          {activeTab === 'empresas' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>CNPJ / CPF</Label><input value={formData.cnpj || ''} onChange={e => setFormData({...formData, cnpj: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-5 py-4 text-sm font-bold outline-none" /></div>
                <div className="space-y-2"><Label>Cidade/UF</Label><input value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-5 py-4 text-sm font-bold outline-none" /></div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-indigo-600">Pessoas & Departamentos</Label>
                  <button type="button" onClick={handleAddSubContact} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"><UserPlus size={16} /></button>
                </div>
                <div className="space-y-4">
                  {formData.contacts?.map((contact: any, index: number) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-gray-100 space-y-3 relative group">
                      <button type="button" onClick={() => handleRemoveSubContact(index)} className="absolute top-2 right-2 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><XCircle size={14} /></button>
                      <input value={contact.name} onChange={e => handleSubContactChange(index, 'name', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[11px] font-bold outline-none" placeholder="Nome do Responsável" />
                      <div className="grid grid-cols-2 gap-2">
                        <input value={contact.phone} onChange={e => handleSubContactChange(index, 'phone', e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-[11px] font-bold outline-none" placeholder="Telefone" />
                        <input value={contact.dept} onChange={e => handleSubContactChange(index, 'dept', e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-[11px] font-bold outline-none" placeholder="Departamento" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </div>
  );
};
