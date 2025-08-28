'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import css from '@/components/NotePreview/NotePreview.module.css';

type Props = { noteId: string };

export default function NotePreview({ noteId }: Props) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  const close = () => router.back();

  return (
    <Modal onClose={close}>
      <div className={css.container}>
        {isLoading && <p>Loading, please wait...</p>}
        {error && <p>Something went wrong.</p>}
        {!isLoading && !error && note && (
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>
              {note.updatedAt
                ? `Updated at: ${new Date(note.updatedAt).toLocaleString()}`
                : `Created at: ${new Date(note.createdAt).toLocaleString()}`}
            </p>

            <button className={css.backBtn} onClick={close} aria-label="Close">
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}