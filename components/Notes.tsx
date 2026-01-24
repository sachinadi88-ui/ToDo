
import React, { useState } from 'react';
import { Note } from '../types';
import { Icons } from '../constants';

interface NotesProps {
  notes: Note[];
  onAddNote: () => void;
  onUpdateNote: (id: string, title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

const Notes: React.FC<NotesProps> = ({ notes, onAddNote, onUpdateNote, onDeleteNote }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="p-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Notes</h1>
          <p className="text-gray-500 text-sm mt-1">Capture ideas, snippets, and organized chaos.</p>
        </div>
        <button 
          onClick={onAddNote}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-purple-900/20"
        >
          <Icons.Plus /> New Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {notes.map(note => (
          <div 
            key={note.id} 
            className="bg-[#171717] border border-[#262626] rounded-2xl overflow-hidden flex flex-col group hover:border-blue-500/30 transition-all hover:shadow-2xl h-64"
          >
            <div className="h-1" style={{ backgroundColor: note.color }} />
            <div className="p-5 flex flex-col h-full">
              <div className="flex justify-between items-start mb-2">
                <input 
                  className="bg-transparent text-lg font-bold text-white outline-none border-none w-full mr-2 focus:ring-1 focus:ring-blue-500/20 rounded px-1"
                  value={note.title}
                  onChange={(e) => onUpdateNote(note.id, e.target.value, note.content)}
                  placeholder="Note Title"
                />
                <button 
                  onClick={() => onDeleteNote(note.id)}
                  className="text-gray-600 hover:text-red-500 transition-colors p-1"
                >
                  <Icons.Trash />
                </button>
              </div>
              <textarea 
                className="bg-transparent flex-1 w-full outline-none text-gray-400 text-sm resize-none leading-relaxed overflow-y-auto"
                value={note.content}
                onChange={(e) => onUpdateNote(note.id, note.title, e.target.value)}
                placeholder="Type your thoughts here..."
              />
              <div className="mt-4 pt-3 border-t border-[#262626] flex justify-between items-center text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                <span>Last Edit: {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="group-hover:text-blue-500 transition-colors">Task Note</span>
              </div>
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="col-span-full py-20 border-2 border-dashed border-[#262626] rounded-3xl flex flex-col items-center justify-center text-gray-500">
            <div className="w-12 h-12 rounded-full bg-[#171717] flex items-center justify-center mb-4 text-gray-400">
              <Icons.Notes />
            </div>
            <p className="font-medium text-lg text-gray-400">Nothing here yet</p>
            <p className="text-sm mt-1">Start by adding your first note</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
