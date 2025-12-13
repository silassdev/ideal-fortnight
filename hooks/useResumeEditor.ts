"use client";

import { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

const INITIAL_DATA = {
    name: '',
    title: '',
    summary: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    experience: [],
    education: [],
    projects: [],
    skills: [],
    certifications: [],
    sectionTitles: {
        experience: 'Experience',
        education: 'Education',
        projects: 'Projects',
        skills: 'Skills',
        certifications: 'Certifications',
        summary: 'Professional Summary'
    }
};

const DEFAULT_TITLES = {
    experience: 'Experience',
    education: 'Education',
    projects: 'Projects',
    skills: 'Skills',
    certifications: 'Certifications',
    summary: 'Professional Summary'
};

export interface ResumeData {
    name: string;
    title: string;
    summary: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    experience: any[];
    education: any[];
    projects: any[];
    skills: any[];
    certifications: any[];
    sectionTitles: { [key: string]: string; };
    [key: string]: any;
}

export const useResumeEditor = (initialData?: ResumeData | null) => {
    // State
    const [data, setData] = useState<ResumeData>({
        ...INITIAL_DATA,
        ...initialData,
        sectionTitles: {
            ...DEFAULT_TITLES,
            ...(initialData?.sectionTitles || {})
        }
    });

    const [history, setHistory] = useState<ResumeData[]>([data]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const [isPreview, setIsPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ isOpen: boolean; status: 'success' | 'error'; }>({ isOpen: false, status: 'success' });

    // Refs
    const componentRef = useRef<HTMLDivElement>(null);
    const historyDebounceRef = useRef<NodeJS.Timeout | null>(null);

    // Persistence (Legacy LS)
    useEffect(() => {
        if (!initialData) {
            const saved = localStorage.getItem('aurora_resume_data'); // Consider making key dynamic or generic
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const merged = {
                        ...INITIAL_DATA,
                        ...parsed,
                        sectionTitles: { ...DEFAULT_TITLES, ...parsed.sectionTitles }
                    };
                    setData(merged);
                    setHistory([merged]);
                } catch (e) { console.error("LS Load Error", e); }
            }
        }
    }, [initialData]);

    // History Management
    const addToHistory = (newData: ResumeData) => {
        setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            // Avoid duplicates
            if (JSON.stringify(newHistory[newHistory.length - 1]) === JSON.stringify(newData)) return prev;
            newHistory.push(newData);
            if (newHistory.length > 50) newHistory.shift();
            return newHistory;
        });
        setHistoryIndex(prev => Math.min(prev + 1, 49));
    };

    // Central Update Handler
    const handleDataChange = (newData: ResumeData, immediateHistory = false) => {
        setData(newData);
        setIsDirty(true);
        localStorage.setItem('aurora_resume_data', JSON.stringify(newData)); // TODO: Make key generic

        if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current);

        if (immediateHistory) {
            addToHistory(newData);
        } else {
            historyDebounceRef.current = setTimeout(() => {
                addToHistory(newData);
            }, 1000);
        }
    };

    // Actions
    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setData(history[newIndex]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setData(history[newIndex]);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Save failed');
            setIsDirty(false);
            setSaveStatus({ isOpen: true, status: 'success' });
        } catch (error) {
            console.error(error);
            setSaveStatus({ isOpen: true, status: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `${data.name} - Resume`,
        onBeforeGetContent: async () => {
            if (isDirty) {
                const confirm = window.confirm("You have unsaved changes. It is recommended to SAVE before downloading. Continue anyway?");
                if (!confirm) throw new Error("Unsaved changes");
            }
            setIsPreview(true);
            return new Promise((resolve) => setTimeout(resolve, 300));
        },
        onAfterPrint: () => setIsPreview(false),
        onPrintError: (errorLocation: any, error: any) => {
            if (error.message !== "Unsaved changes") console.error(error);
        }
    } as any);

    // CRUD Helpers
    const handleDragEnd = (event: DragEndEvent, listKey: string) => { // Key type loose for generality
        const { active, over } = event;
        if (active.id !== over?.id && Array.isArray(data[listKey])) {
            const list = data[listKey] as any[];
            const oldIndex = list.findIndex((item) => item.id === active.id);
            const newIndex = list.findIndex((item) => item.id === over?.id);
            handleDataChange({ ...data, [listKey]: arrayMove(list, oldIndex, newIndex) }, true);
        }
    };

    const updateItem = (listKey: string, id: string, field: string | object, val?: any) => {
        handleDataChange({
            ...data,
            [listKey]: (data[listKey] as any[]).map(item => {
                if (item.id !== id) return item;
                if (typeof field === 'object') {
                    return { ...item, ...field };
                }
                return { ...item, [field]: val };
            })
        });
    };

    const addItem = (listKey: string, newItem: any) => {
        handleDataChange({
            ...data,
            [listKey]: [...(data[listKey] as any[]), { ...newItem, id: Date.now().toString() }]
        }, true);
    };

    const removeItem = (listKey: string, id: string) => {
        handleDataChange({
            ...data,
            [listKey]: (data[listKey] as any[]).filter(item => item.id !== id)
        }, true);
    };

    const updateRoot = (field: string, value: any) => {
        handleDataChange({ ...data, [field]: value });
    };

    const updateSectionTitle = (key: string, val: string) => {
        handleDataChange({ ...data, sectionTitles: { ...data.sectionTitles, [key]: val } });
    };

    return {
        data,
        setData, // Expose raw setter for legacy bridges
        historyIndex,
        history,
        isPreview,
        setIsPreview,
        isSaving,
        isDirty,
        saveStatus,
        setSaveStatus,
        componentRef,
        handleUndo,
        handleRedo,
        undo: handleUndo, // Alias
        redo: handleRedo, // Alias
        handleSave,
        handlePrint,
        handleDragEnd,
        updateItem,
        addItem,
        removeItem,
        updateRoot,
        updateSectionTitle
    };
};
