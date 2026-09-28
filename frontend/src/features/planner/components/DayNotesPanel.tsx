import React, { useState, useEffect } from 'react';
import { FileText, Save } from 'lucide-react';
import { DayNote } from '../../../core/types';

interface DayNotesPanelProps {
    selectedDate: string;
    notes: DayNote[];
    onSaveNote: (date: string, content: string) => void;
}

const DayNotesPanel: React.FC<DayNotesPanelProps> = ({
    selectedDate,
    notes,
    onSaveNote,
}) => {
    const [content, setContent] = useState('');
    const [isSaved, setIsSaved] = useState(true);

    // Load note for selected date
    useEffect(() => {
        const existingNote = notes.find(note => note.date === selectedDate);
        setContent(existingNote?.content || '');
        setIsSaved(true);
    }, [selectedDate, notes]);

    const handleSave = () => {
        onSaveNote(selectedDate, content);
        setIsSaved(true);
    };

    const handleChange = (value: string) => {
        setContent(value);
        setIsSaved(false);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-cyan-500/10 text-cyan-400 rounded-lg flex items-center justify-center">
                        <FileText size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-100">Day Notes</h3>
                        <p className="text-xs text-slate-500">{formatDate(selectedDate)}</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaved}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isSaved
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                        }`}
                >
                    <Save size={14} />
                    {isSaved ? 'Saved' : 'Save'}
                </button>
            </div>

            {/* Note Editor */}
            <textarea
                value={content}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Add notes for this day... (reflections, achievements, reminders, etc.)"
                className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700 resize-none"
            />

            {/* Character Count */}
            <div className="mt-2 text-right">
                <span className="text-xs text-slate-600">
                    {content.length} characters
                </span>
            </div>
        </div>
    );
};

export default DayNotesPanel;
