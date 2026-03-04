import { Component, input, output } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LucideAngularModule, ExternalLink, Box, Activity, Cpu, Settings, Target, Zap, Server, FileText, Database, Shield, ZapIcon, Calculator } from 'lucide-angular';
import { AIModel } from '../../../../core/models/api.models';
import { ModelCalculator } from '../model-calculator/model-calculator';

@Component({
  selector: 'app-model-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ModelCalculator],
  templateUrl: './model-card.html'
})
export class ModelCard {
  /** The model data to display. Required. */
  readonly model = input.required<AIModel>();

  /** The currently selected model ID (global). Used to highlight the card or set default dropdown value. */
  readonly selectedModelId = input<string | null>(null);

  /** Exact version ID to show as selected in the dropdown, overriding defaults. */
  readonly preferredVersion = input<string | undefined>(undefined);

  /** Whether this model's calculator overlay is open. */
  readonly isCalculatorOpen = input<boolean>(false);

  /** Emitted when the user chooses "Select" for this model. */
  readonly modelSelect = output<string>();

  /** Emitted when the user toggles the calculator for this model. */
  readonly calculatorToggle = output<string>();

  // Icons
  readonly ExternalLinkIcon = ExternalLink;
  readonly BoxIcon = Box;
  readonly ZapIcon = Zap;
  readonly ServerIcon = Server;
  readonly TargetIcon = Target;
  readonly CalculatorIcon = Calculator;
}
