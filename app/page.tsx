import dynamic from 'next/dynamic';

const PhotoWorkspace = dynamic(() => import('@/components/PhotoWorkspace'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <PhotoWorkspace />
    </main>
  );
}