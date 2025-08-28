import type { Metadata } from 'next';
import css from '@/components/CreateNote/CreateNote.module.css';
import NoteForm from '@/components/NoteForm/NoteForm';

export const metadata: Metadata = {
  title: 'Create Note | NoteHub',
  description: 'Create a new note in your NoteHub workspace.',
  openGraph: {
    title: 'Create Note | NoteHub',
    description: 'Create a new note in your NoteHub workspace.',
    url: 'https://09-auth-eta-silk.vercel.app/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub Create Note',
      },
    ],
    type: 'website',
  },
};

const CreateNote = async () => {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
};

export default CreateNote;