import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutGrid, BarChart3, Key } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-obsidian text-slate-200 font-sans flex flex-col">
      <!-- Top Nav -->
      <nav class="h-14 border-b border-slate-700/50 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-sunray flex items-center justify-center shadow-lg shadow-brand-sunray/20 font-bold text-white text-lg">
             P
          </div>
          <span class="font-bold text-slate-100 tracking-tight">Prompter</span>
        </div>

        <!-- Links -->
        <div class="flex items-center gap-1 bg-black-pearl/50 p-1 rounded-lg border border-slate-700/50">
          <a routerLink="/" 
             routerLinkActive="bg-black-pearl text-brand-sunray shadow-sm" 
             [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-slate-200 transition-all">
             <lucide-icon [img]="LayoutGridIcon" class="w-4 h-4"></lucide-icon>
             Discovery
          </a>
          <a routerLink="/usage" 
             routerLinkActive="bg-black-pearl text-brand-sunray shadow-sm"
             class="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-slate-200 transition-all">
             <lucide-icon [img]="BarChartIcon" class="w-4 h-4"></lucide-icon>
             Usage
          </a>
        </div>
        
        <!-- Right (Auth/Settings Placeholder) -->
        <div class="flex items-center gap-3">
          <button class="w-8 h-8 rounded-full bg-black-pearl flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/30">
            <lucide-icon [img]="KeyIcon" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 relative overflow-hidden">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  title = 'prompter-dashboard';
  readonly LayoutGridIcon = LayoutGrid;
  readonly BarChartIcon = BarChart3;
  readonly KeyIcon = Key;
}
