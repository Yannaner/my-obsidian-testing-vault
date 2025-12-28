'use client';

import { Sidebar } from './Sidebar';
import { ThemeProvider } from './ThemeProvider';
import { FolderNode } from '@/lib/contentIndex';

interface SidebarWithThemeProps {
  tree: FolderNode;
  currentSlug?: string[];
}

export function SidebarWithTheme({ tree, currentSlug }: SidebarWithThemeProps) {
  return (
    <ThemeProvider>
      <Sidebar tree={tree} currentSlug={currentSlug} />
    </ThemeProvider>
  );
}
