import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CreateNotePayload } from '../api/clientApi';
import { NoteTag } from '@/types/note';

export const initialDraft: CreateNotePayload = {
  title: '',
  content: '',
  tag: 'Todo' as NoteTag,
};

type NoteStore = {
  draft: CreateNotePayload;
  setDraft: (note: CreateNotePayload) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note: CreateNotePayload) => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    { name: 'notehub-draft', partialize: (state) => ({ draft: state.draft }) }
  )
);