import type { Note, NoteTag } from '../../types/note';
import { User } from '@/types/user';
import { api } from './api';

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: Note['tag'];
}

export interface FetchNotesResponse {
  data: Note[];
  total: number;
  page: number;
  perPage: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface RawFetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

type CheckSessionRequest = {
  success: boolean;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search = '', tag } = params;

  const response = await api.get<RawFetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search && { search }),
      ...(tag && { tag }),
    },
  });
  const raw = response.data;

  return {
    page,
    perPage,
    data: raw.notes,
    total: raw.totalPages,
  };
};

export const createNote = async (
  noteData: CreateNotePayload
): Promise<Note> => {
  const response = await api.post<Note>('/notes', noteData);
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${noteId}`);
  return response.data;
};

export const fetchNoteById = async (id: string) => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export const register = async (data: RegisterRequest) => {
  const res = await api.post<User>('/auth/register', data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await api.post<User>('/auth/login', data);
  return res.data;
};

export const checkSession = async () => {
  const res = await api.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

export const getMe = async () => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

interface UpdateMeRequest {
  username: string;
}

export const updateMe = async (data: UpdateMeRequest) => {
  const res = await api.patch<User>('/users/me', data);
  return res.data;
};