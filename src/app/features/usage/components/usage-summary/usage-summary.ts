import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, DollarSign, Box, RefreshCw } from 'lucide-angular';
import { UsageStat } from '../../../../core/models/api.models';

@Component({
  selector: 'app-usage-summary',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './usage-summary.html',
  styles: [`:host { display: block; }`]
})
export class UsageSummary {
  readonly stats = input.required<UsageStat[]>();
  readonly selectedMonth = input<string | null>(null);
  readonly reset = output<void>();

  readonly BoxIcon = Box;
  readonly DollarSignIcon = DollarSign;
  readonly RefreshCwIcon = RefreshCw;

  readonly totals = computed(() => {
    const data = this.stats();
    const selected = this.selectedMonth();

    if (selected) {
       const filtered = data.filter(d => 
         new Date(d.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) === selected
       );
       
       return {
         tokens: filtered.reduce((s, i) => s + i.totalTokens, 0),
         cost: filtered.reduce((s, i) => s + i.totalCost, 0),
         label: selected,
         isFiltered: true
       };
    }

    const totalTokens = data.reduce((sum, item) => sum + item.totalTokens, 0);
    const totalCost = data.reduce((sum, item) => sum + item.totalCost, 0);
    
    // Last month helper
    const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latestDateStr = sorted[0]?.date ? new Date(sorted[0].date).toISOString().slice(0, 7) : null; 
    
    const lastMonthData = data.filter(d => new Date(d.date).toISOString().startsWith(latestDateStr || ''));
    
    return {
      tokens: totalTokens,
      cost: totalCost,
      lastMonthTokens: lastMonthData.reduce((s, i) => s + i.totalTokens, 0),
      lastMonthCost: lastMonthData.reduce((s, i) => s + i.totalCost, 0),
      label: 'Total',
      isFiltered: false
    };
  });
}
