import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Info, ExternalLink, Box, Zap, DollarSign } from 'lucide-angular';
import { AIModel } from '../../../../core/models/api.models';

@Component({
  selector: 'app-model-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './model-card.html'
})
export class ModelCard {
  /** The model data to display. Required. */
  readonly model = input.required<AIModel>();

  /** The currently selected model ID (global). Used to highlight the card or set default dropdown value. */
  readonly selectedModelId = input<string | null>(null);

  /** Exact version ID to show as selected in the dropdown, overriding defaults. */
  readonly preferredVersion = input<string | undefined>(undefined);

  /** Emitted when a specific version is selected. */
  readonly modelSelect = output<string>();

  // Icons
  readonly InfoIcon = Info;
  readonly ExternalLinkIcon = ExternalLink;
  readonly BoxIcon = Box;
  readonly ZapIcon = Zap;
  readonly DollarSignIcon = DollarSign;
}
