'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FolderNode, NoteMetadata } from '@/lib/contentIndex';
import { getNoteUrl } from '@/lib/pathUtil';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  tree: FolderNode;
  currentSlug?: string[];
}

interface FolderItemProps {
  node: FolderNode;
  currentSlug?: string[];
  depth: number;
}

function FolderItem({ node, currentSlug, depth }: FolderItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const hasContent = node.children.length > 0 || node.notes.length > 0;

  if (!hasContent) {
    return null;
  }

  const currentSlugStr = currentSlug?.join('/');

  return (
    <div className="folder-item">
      {node.name !== 'root' && (
        <div
          className="folder-header"
          style={{ paddingLeft: `${depth * 12}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="folder-icon">{isOpen ? '📂' : '📁'}</span>
          <span className="folder-name">{node.name}</span>
        </div>
      )}
      {isOpen && (
        <div className="folder-content">
          {node.children.map((child) => (
            <FolderItem
              key={child.path}
              node={child}
              currentSlug={currentSlug}
              depth={node.name === 'root' ? depth : depth + 1}
            />
          ))}
          {node.notes.map((note) => {
            const noteSlugStr = note.slug.join('/');
            const isActive = currentSlugStr === noteSlugStr;
            return (
              <Link
                key={noteSlugStr}
                href={getNoteUrl(note.slug)}
                className={`note-link ${isActive ? 'active' : ''}`}
                style={{ paddingLeft: `${(node.name === 'root' ? depth : depth + 1) * 12 + 20}px` }}
              >
                <span className="note-icon">📄</span>
                <span className="note-title">{note.title}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ tree, currentSlug }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Flatten all notes for search
  const allNotes = useMemo(() => {
    const notes: NoteMetadata[] = [];
    function collectNotes(node: FolderNode) {
      notes.push(...node.notes);
      node.children.forEach(collectNotes);
    }
    collectNotes(tree);
    return notes;
  }, [tree]);

  // Filter notes based on search
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allNotes
      .filter(note => note.title.toLowerCase().includes(query))
      .slice(0, 10); // Limit to 10 results
  }, [searchQuery, allNotes]);

  const currentSlugStr = currentSlug?.join('/');

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-header-content">
          <Link href="/" className="site-title">
            <span className="site-icon">📝</span>
            VaultSite
          </Link>
          <ThemeToggle />
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="sidebar-content">
        {searchQuery && filteredNotes.length > 0 ? (
          <div className="search-results">
            <div className="search-results-header">
              Search Results ({filteredNotes.length})
            </div>
            {filteredNotes.map((note) => {
              const noteSlugStr = note.slug.join('/');
              const isActive = currentSlugStr === noteSlugStr;
              return (
                <Link
                  key={noteSlugStr}
                  href={getNoteUrl(note.slug)}
                  className={`note-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSearchQuery('')}
                >
                  <span className="note-icon">📄</span>
                  <span className="note-title">{note.title}</span>
                </Link>
              );
            })}
          </div>
        ) : searchQuery ? (
          <div className="search-no-results">
            No notes found for "{searchQuery}"
          </div>
        ) : (
          <FolderItem node={tree} currentSlug={currentSlug} depth={0} />
        )}
      </div>
    </nav>
  );
}
