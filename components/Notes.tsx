
import React from 'react';
import { Note } from '../types';
import { Icons } from '../constants';

interface NotesProps {
  notes: Note[];
  onAddNote: () => void;
  onUpdateNote: (id: string, title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

const Notes: React.FC<NotesProps> = ({ notes, onAddNote, onUpdateNote, onDeleteNote }) => {
  return (
    <div className="p-4 md:p-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Notes</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Capture ideas and organize your thoughts.</p>
        </div>
        <button 
          onClick={onAddNote}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 md:py-2 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20 active:scale-95"
        >
          <Icons.Plus /> <span className="font-bold text-sm">New Note</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {notes.map(note => (
          <div 
            key={note.id} 
            className="bg-[#171717] border border-[#262626] rounded-2xl overflow-hidden flex flex-col group hover:border-[#333] transition-all hover:shadow-2xl h-[280px]"
          >
            <div className="h-1.5" style={{ backgroundColor: note.color }} />
            <div className="p-5 flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <input 
                  className="bg-transparent text-lg font-bold text-white outline-none border-none w-full mr-2 focus:text-blue-400 transition-colors"
                  value={note.title}
                  onChange={(e) => onUpdateNote(note.id, e.target.value, note.content)}
                  placeholder="Untitled Note"
                />
                <button 
                  onClick={() => onDeleteNote(note.id)}
                  className="text-gray-600 hover:text-red-500 transition-colors p-1"
                >
                  <Icons.Trash />
                </button>
              </div>
              <textarea 
                className="bg-transparent flex-1 w-full outline-none text-gray-400 text-sm resize-none leading-relaxed overflow-y-auto custom-scrollbar"
                value={note.content}
                onChange={(e) => onUpdateNote(note.id, note.title, e.target.value)}
                placeholder="Start typing your thoughts..."
              />
              <div className="mt-4 pt-4 border-t border-[#232323] flex justify-between items-center">
                <span className="text-[9px] text-gray-600 uppercase tracking-widest font-black">
                  {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-blue-500/50 group-hover:text-blue-500 transition-colors">
                  Nexus Note
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {notes.length === 0 && (
          <div className="col-span-full py-20 md:py-32 border-2 border-dashed border-[#262626] rounded-3xl flex flex-col items-center justify-center text-gray-500">
            <div className="w-16 h-16 rounded-full bg-[#171717] flex items-center justify-center mb-6 text-gray-400 shadow-xl border border-[#222]">
              <Icons.Notes />
            </div>
            <p className="font-black text-xl text-gray-300">Workspace empty</p>
            <p className="text-sm mt-1 text-gray-500 px-6 text-center">Capture your first brilliant idea today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
