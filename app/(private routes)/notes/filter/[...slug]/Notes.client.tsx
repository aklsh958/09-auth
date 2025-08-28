'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { fetchNotes } from '@/lib/api/clientApi';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebounce } from 'use-debounce';
import css from '@/components/NotePage/NotePage.module.css';
import { Note } from '@/types/note';
import Link from 'next/link';
import { FetchNotesResponse } from '@/lib/api/clientApi';

interface NotesClientProps {
  initialNotes: FetchNotesResponse;
  initialTag?: Note['tag'];
}
export default function NotesClient({
  initialNotes,
  initialTag,
}: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  useEffect(() => {
    setPage(1);
  }, [initialTag, debouncedSearch]);
  const { data = initialNotes } = useQuery({
    queryKey: ['notes', page, debouncedSearch, initialTag ?? 'All'],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debouncedSearch,
        tag: initialTag,
      }),
    placeholderData: keepPreviousData,
    initialData:
      page === 1 && debouncedSearch === '' ? initialNotes : undefined,
  });
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        {data && data.total > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.total}
            onPageChange={setPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
      <NoteList notes={data.data} />
    </div>
  );
}