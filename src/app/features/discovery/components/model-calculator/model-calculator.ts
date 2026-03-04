import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Calculator, Coins, Hash, SplitSquareHorizontal, X } from 'lucide-angular';
import { AIModel } from '../../../../core/models/api.models';

export type CalcMode = 'tokensCap' | 'estimatedCost' | 'exactCost';

@Component({
  selector: 'app-model-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './model-calculator.html',
  styleUrl: './model-calculator.css',
  host: {
    'class': 'flex flex-col h-full w-full',
    'style': 'animation: calcFadeIn 0.2s ease-out forwards;'
  }
})
export class ModelCalculator {
  /** The model to calculate costs for. */
  readonly model = input.required<AIModel>();

  /** Emitted when the user closes the calculator. */
  readonly close = output<void>();

  // Icons
  readonly CalculatorIcon = Calculator;
  readonly CoinsIcon = Coins;
  readonly HashIcon = Hash;
  readonly SplitIcon = SplitSquareHorizontal;
  readonly XIcon = X;

  // Region: State
  readonly activeMode = signal<CalcMode>('tokensCap');

  // Input Signals (null by default so placeholders show)
  readonly budgetAmount = signal<number | null>(null);
  readonly totalTokensUser = signal<number | null>(null);
  
  readonly exactInputTokens = signal<number | null>(null);
  readonly exactOutputTokens = signal<number | null>(null);

  // Region: Computed Results

  /** Blended rate per 1M tokens assuming 10% input / 90% output */
  readonly blendedRatePer1m = computed(() => {
    const m = this.model();
    return 0.10 * m.inputCostTeu + 0.90 * m.outputCostTeu;
  });

  /** Mode 1: Estimated number of tokens for the given budget */
  readonly estimatedTokens = computed(() => {
    const budget = this.budgetAmount();
    if (budget == null || budget <= 0) return null;
    const rate = this.blendedRatePer1m();
    if (rate <= 0) return null; // Added check for rate
    return Math.floor((budget / rate) * 1000000); // Added Math.floor
  });

  /** Mode 2: Estimated cost for the given number of tokens */
  readonly estimatedCost = computed(() => {
    const tokens = this.totalTokensUser();
    if (tokens == null || tokens <= 0) return null;
    const rate = this.blendedRatePer1m();
    return (tokens / 1000000) * rate;
  });

  /** Mode 3: Exact cost based on separate input/output token counts */
  readonly exactCost = computed(() => {
    const inTok = this.exactInputTokens() ?? 0;
    const outTok = this.exactOutputTokens() ?? 0;
    if (inTok <= 0 && outTok <= 0) return null;
    const m = this.model();
    return (inTok / 1000000) * m.inputCostTeu + (outTok / 1000000) * m.outputCostTeu;
  });

  /** Mode 3: Breakdown of input and output costs */
  readonly exactBreakdown = computed(() => {
    const inTok = this.exactInputTokens() ?? 0;
    const outTok = this.exactOutputTokens() ?? 0;
    const m = this.model();
    return {
      inputCost: (inTok / 1000000) * m.inputCostTeu,
      outputCost: (outTok / 1000000) * m.outputCostTeu
    };
  });

  // Region: Actions

  setMode(mode: CalcMode) {
    this.activeMode.set(mode);
  }

  updateBudget(val: string) {
    const num = parseFloat(val);
    this.budgetAmount.set(isNaN(num) ? null : num);
  }

  updateTotalTokens(val: string) {
    const num = parseFloat(val);
    this.totalTokensUser.set(isNaN(num) ? null : num);
  }

  updateExactInput(val: string) {
    const num = parseFloat(val);
    this.exactInputTokens.set(isNaN(num) ? null : num);
  }

  updateExactOutput(val: string) {
    const num = parseFloat(val);
    this.exactOutputTokens.set(isNaN(num) ? null : num);
  }

  /** Formats large token numbers with commas */
  formatTokens(n: number): string {
    return n.toLocaleString('en-US');
  }
}
