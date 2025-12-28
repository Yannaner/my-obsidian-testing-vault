import { getAllNotes, getContentTree } from '@/lib/contentIndex';
import { Sidebar } from '@/components/Sidebar';
import Link from 'next/link';
import { getNoteUrl } from '@/lib/pathUtil';

export default function HomePage() {
  const tree = getContentTree();
  const allNotes = getAllNotes();

  return (
    <div className="app-container">
      <Sidebar tree={tree} />
      <main className="main-content">
        {allNotes.length > 0 ? (
          <div className="home-content">
            <h1>Welcome to Your Notes</h1>
            <p>You have {allNotes.length} {allNotes.length === 1 ? 'note' : 'notes'} in your vault. Select from the sidebar or browse below.</p>

            <div className="recent-notes">
              <h2>All Notes</h2>
              <div className="notes-grid">
                {allNotes.map((note) => (
                  <Link
                    key={note.slug.join('/')}
                    href={getNoteUrl(note.slug)}
                    className="note-card"
                  >
                    <div className="note-card-title">{note.title}</div>
                    {note.folder && (
                      <div className="note-card-path">📁 {note.folder}</div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <h1>Welcome to VaultSite</h1>
            <p>No notes found. Use the VaultSite plugin in Obsidian to sync your notes.</p>
            <div className="instructions">
              <h2>Getting Started</h2>
              <ol>
                <li>Open Obsidian and make sure the VaultSite plugin is enabled</li>
                <li>Run the command: <code>VaultSite: Sync Notes</code></li>
                <li>Then run: <code>VaultSite: Publish (Sync + Push)</code></li>
                <li>Your notes will appear here after deployment completes</li>
              </ol>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
