import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../core/services/api.service';
import { AppStore } from '../core/stores/app.store';
import { ModelFilter, FilterState } from './discovery/components/model-filter/model-filter';
import { ModelCard } from './discovery/components/model-card/model-card';
import { CodeBlock } from './discovery/components/code-block/code-block';
import { ModelCalculator } from './discovery/components/model-calculator/model-calculator';

@Component({
  selector: 'app-discovery',
  standalone: true,
  imports: [CommonModule, ModelFilter, ModelCard, CodeBlock, ModelCalculator],
  templateUrl: './discovery.html',
  styleUrl: './discovery.css'
})
export class Discovery {
  private api = inject(ApiService); 
  readonly store = inject(AppStore);

  // Region: Data
  
  /** Signal containing the list of all supported models fetched from the API. */
  readonly models = toSignal(this.api.getSupportedModels(), { initialValue: [] });
  
  /** Signal managing the current state of the model filters (search text and kinds). */
  readonly filterState = signal<FilterState>({
    search: '',
    kinds: { Text: true, Image: true, Audio: true, Embedding: true }
  });

  // Region: Derived State

  /**
   * Computed list of models filtered by the current `filterState`.
   * Filters by both Model Kind (Text, Image, etc.) and search term (Name, ID, Description).
   */
  readonly filteredModels = computed(() => {
    const all = this.models();
    const { search, kinds } = this.filterState();
    const term = search.toLowerCase();

    return all.filter(m => {
      // 1. Kind Check (Match any supported modality)
      // Check if ANY of the model's modalities are active in the filter
      const matchesKind = m.modality.some(mod => {
        // Map raw modality 'image' to filter key 'Image', 'text' to 'Text' etc.
        // Simple case-insensitive match against keys
        const key = Object.keys(kinds).find(k => k.toLowerCase() === mod.toLowerCase());
        return key ? kinds[key] : false;
      });

      if (!matchesKind) return false;
      
      // 2. Search Check
      if (!term) return true;
      return m.name.toLowerCase().includes(term) || 
             m.id.toLowerCase().includes(term) ||
             (m.description?.toLowerCase().includes(term) ?? false);
    });
  });

  /**
   * Updates the filter state when the user interacts with the filter controls.
   * @param state The new filter state.
   */
  handleFilterChange(state: FilterState) {
    this.filterState.set(state);
  }

  // Region: Local Preference State
  readonly preferredVersions = signal<Record<string, string>>({});

  // Region: Calculator State
  
  /** The model ID whose calculator is currently open, or null if none. */
  readonly calculatorModelId = signal<string | null>(null);

  /** The full model object for the open calculator (derived from calculatorModelId). */
  readonly calculatorModel = computed(() => {
    const id = this.calculatorModelId();
    if (!id) return null;
    return this.models().find(m => m.id === id) ?? null;
  });

  /**
   * Toggles the calculator panel for a given model ID.
   * Closes the calculator if it's already open for that model, otherwise opens it.
   */
  toggleCalculator(id: string) {
    this.calculatorModelId.update(current => current === id ? null : id);
  }

  /**
   * Selects a model to display detailed information or code samples.
   * Handles "sticky" selection: 
   * - If an ID is a version, it saves it as the preference for that Model Family.
   * - If an ID is a Model Family, it checks if there's a preferred version and selects that instead.
   * - If the ID starts with 'calc:', it toggles the calculator instead.
   * 
   * @param id The ID of the model or version to select.
   */
  selectModel(id: string) {
    // Intercept calculator toggle
    if (id.startsWith('calc:')) {
      this.toggleCalculator(id.substring(5));
      return;
    }

    const models = this.models();
    
    // Check if this ID is a known version of any model
    const parentModel = models.find(m => m.id === id || m.versions?.includes(id));
    
    if (parentModel) {
      if (parentModel.id === id) {
        // User clicked the card (Base ID)
        // Check if we have a preferred version for this model
        const preferred = this.preferredVersions()[parentModel.id];
        if (preferred) {
          this.store.setSelectedModel(preferred);
          return;
        }
      } else {
        // User clicked a specific version (Version ID)
        // Save this as the preference for the parent model
        this.preferredVersions.update(prefs => ({
          ...prefs,
          [parentModel.id]: id
        }));
      }
    }

    this.store.setSelectedModel(id);
  }
}

