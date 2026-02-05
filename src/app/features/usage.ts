import { Component, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { AppStore } from '../core/stores/app.store';
import { ApiKeyInput } from './usage/components/api-key-input/api-key-input';
import { UsageChart } from './usage/components/usage-chart/usage-chart';
import { UsageSummary } from './usage/components/usage-summary/usage-summary';
import { CodeBlock } from './discovery/components/code-block/code-block'; 
// Reusing CodeBlock from Discovery. 
// Ideally should be in shared, but prompt implies specific 'Personalized Code Block'. 
// I'll reuse and pass params.

@Component({
  selector: 'app-usage',
  standalone: true,
  imports: [CommonModule, ApiKeyInput, UsageChart, UsageSummary, CodeBlock],
  templateUrl: './usage.html'
})
export class Usage {
  private api = inject(ApiService);
  readonly store = inject(AppStore);

  // Stats Logic
  // When apiKey changes, fetch usage.
  readonly usageStats = toSignal(
    toObservable(this.store.currentUserApiKey).pipe(
      switchMap(key => key ? this.api.getUserUsage(key) : of([]))
    ), 
    { initialValue: [] }
  );
  
  // Top Model Logic (Mock: most used model from stats or default)
  readonly topModelId = computed(() => {
     const stats = this.usageStats();
     if (!stats.length) return 'gpt-4-turbo';
     
     // Find freq model (mock logic: just take the one from last month)
     return stats[stats.length - 1].modelId || 'gpt-4-turbo';
  });

  // Interaction
  readonly selectedMonth = signal<string | null>(null);

  handleMonthSelect(month: string) {
    this.selectedMonth.set(month);
  }

  handleKeySubmit(key: string) {
    this.store.setApiKey(key);
  }
}

// Helper to bridge Signal to Observable for toSignal
import { toObservable } from '@angular/core/rxjs-interop';
