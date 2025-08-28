import { cookies } from 'next/headers';
import { api } from './api';
import { Note } from '@/types/note';
import { User } from '@/types/user';
import {
  FetchNotesParams,
  FetchNotesResponse,
  RawFetchNotesResponse,
} from './clientApi';

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await api.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export const getServerMe = async () => {
  const cookieStore = await cookies();
  const { data } = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const fetchServerNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();
  const { page = 1, perPage = 12, search = '', tag } = params;

  const response = await api.get<RawFetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search !== '' && { search: search }),
      ...(tag && { tag }),
    },
    headers: {
      Cookie: cookieStore.toString(),
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

export const fetchServerNoteById = async (id: string) => {
  const cookieStore = await cookies();
  const res = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return res.data;
};