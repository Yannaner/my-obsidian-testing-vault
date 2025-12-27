import { redirect } from 'next/navigation';
import { getAllNotes, getContentTree } from '@/lib/contentIndex';
import { Sidebar } from '@/components/Sidebar';
import { getNoteUrl } from '@/lib/pathUtil';

export default function HomePage() {
  const tree = getContentTree();
  const allNotes = getAllNotes();

  // Redirect to first note if any exist
  if (allNotes.length > 0) {
    redirect(getNoteUrl(allNotes[0].slug));
  }

  return (
    <div className="app-container">
      <Sidebar tree={tree} />
      <main className="main-content">
        <div className="empty-state">
          <h1>Welcome to VaultSite</h1>
          <p>No notes found. Use the VaultSite plugin to sync your notes.</p>
          <div className="instructions">
            <h2>Getting Started</h2>
            <ol>
              <li>Open Obsidian and install the VaultSite plugin</li>
              <li>Run the command: <code>VaultSite: Sync Notes</code></li>
              <li>Your notes will appear here automatically</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
