'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import css from '@/components/NoteDetails/NoteDetails.module.css';

const NoteDetailsClient = () => {
  const { id } = useParams<{ id: string }>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id, 
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p className={css.status}>Loading, please wait...</p>;
  }

  if (error || !note) {
    return <p className={css.statusError}>Something went wrong.</p>;
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>

        {isClient && (
          <p className={css.date}>
            {note.updatedAt
              ? `Updated: ${new Date(note.updatedAt).toLocaleString()}`
              : `Created: ${new Date(note.createdAt).toLocaleString()}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default NoteDetailsClient;