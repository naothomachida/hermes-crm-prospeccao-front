import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User as UserIcon, Check } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

interface UserSelectorProps {
  users: User[];
  selectedUserId?: string;
  onSelect: (userId: string) => void;
  className?: string;
  placeholder?: string;
  showName?: boolean;
}

export const UserSelector: React.FC<UserSelectorProps> = ({ 
  users, 
  selectedUserId, 
  onSelect, 
  className = "",
  placeholder = "Atribuir...",
  showName = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedUser = users.find(u => u.id === selectedUserId);

  const formatName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length <= 1) return fullName;
    const firstName = parts[0];
    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    return `${firstName} ${lastInitial}.`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
      >
        <div className="w-6 h-6 rounded-full bg-slate-100 border border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
          {selectedUser?.avatar ? (
            <img src={selectedUser.avatar} className="w-full h-full object-cover" alt="" />
          ) : (
            <UserIcon size={12} className="text-slate-400" />
          )}
        </div>
        {showName && (
          <span className={`text-[10px] font-black uppercase tracking-widest ${selectedUser ? 'text-slate-700' : 'text-slate-400'}`}>
            {selectedUser ? formatName(selectedUser.name) : placeholder}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 mt-2 z-[300] bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 min-w-[220px]"
          >
            <div className="relative mb-2">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar equipe..."
                className="w-full bg-slate-50 border border-transparent focus:border-indigo-100 rounded-xl pl-8 pr-3 py-2 text-[10px] font-bold outline-none"
              />
            </div>

            <div className="max-h-[200px] overflow-y-auto custom-scrollbar flex flex-col gap-0.5">
              {filteredUsers.length > 0 ? filteredUsers.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    onSelect(user.id);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`flex items-center justify-between px-2.5 py-2 hover:bg-slate-50 rounded-xl transition-colors text-left ${
                    selectedUserId === user.id ? 'bg-indigo-50/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <span className="text-[8px] font-black text-slate-400">{user.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight leading-none">{user.name}</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{user.role}</span>
                    </div>
                  </div>
                  {selectedUserId === user.id && <Check size={12} className="text-indigo-600" />}
                </button>
              )) : (
                <div className="py-4 text-center text-[10px] font-bold text-slate-400 uppercase">Ninguém encontrado</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
