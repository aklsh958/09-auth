import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from '@tanstack/react-query';
import {
  checkServerSession,
  fetchServerNotes,
} from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import { NoteTag } from '@/types/note';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = slug?.[0];
  const tag = !res || res.toLowerCase() === 'all' ? 'All' : res;

  const title = `Notes — ${tag} | NoteHub`;
  const description = `Browse your notes filtered by: ${tag}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://09-auth-eta-silk.vercel.app/notes/filter/${tag}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

export default async function NotesPage({ params }: Props) {
  try {
    await checkServerSession();
  } catch {
    redirect('/sign-in');
  }

  let tag: NoteTag | undefined;
  let initialNotes: Awaited<ReturnType<typeof fetchServerNotes>>;

  try {
    const slug = (await params).slug?.[0];
    tag = !slug || slug.toLowerCase() === 'all' ? undefined : (slug as NoteTag);

    initialNotes = await fetchServerNotes({
      page: 1,
      perPage: 12,
      search: '',
      tag,
    });
  } catch {
    redirect('/sign-in');
  }

  const queryClient = new QueryClient();
  queryClient.setQueryData(['notes', 1, '', tag ?? 'all'], initialNotes);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialNotes={initialNotes} initialTag={tag} />
    </HydrationBoundary>
  );
}
