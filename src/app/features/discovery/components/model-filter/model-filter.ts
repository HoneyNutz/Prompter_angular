import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AppStore, BackendMode } from '../../../../core/stores/app.store';
import { LucideAngularModule, Search, Server, Globe } from 'lucide-angular';

/** Represents the current state of the filters. */
export interface FilterState {
  search: string;
  kinds: { [key: string]: boolean };
}

@Component({
  selector: 'app-model-filter',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './model-filter.html'
})
export class ModelFilter {
  readonly store = inject(AppStore);
  
  /** Emitted when the filter state changes (either search term or kinds). */
  readonly filterChange = output<FilterState>();

  // Local State
  readonly searchTerm = signal('');
  readonly kinds = signal<{ [key: string]: boolean }>({
    'Text': true,
    'Image': true,
    'Audio': true,
    'Embedding': true
  });
  
  // Icons
  readonly SearchIcon = Search;
  readonly ServerIcon = Server;
  readonly GlobeIcon = Globe;

  /**
   * Toggles the backend mode in the global store.
   * @param mode 'Internal' or 'External'
   */
  toggleBackend(mode: BackendMode) {
    this.store.setBackendMode(mode);
  }

  /**
   * Updates the search term signal and emits the new filter state.
   * @param term The new search text.
   */
  updateSearch(term: string) {
    this.searchTerm.set(term);
    this.emitChange();
  }

  /**
   * Toggles the active state of a specific model kind (e.g. 'Text' -> true/false).
   * Implements "Single Select / Toggle to All" behavior:
   * - If no specific filter is active (all true, or logic implies all), clicking one selects ONLY that one.
   * - If one is already selected and clicked again, it reverts to ALL selected.
   * - If one is selected and another is clicked, it switches to the new one.
   */
  toggleKind(kind: string) {
    this.kinds.update(current => {
      // Check if currently ALL are true (default state)
      const allTrue = Object.values(current).every(v => v);
      
      // Check if ONLY the clicked kind is currently true
      const onlyThisTrue = current[kind] && Object.entries(current).every(([k, v]) => k === kind ? v : !v);

      if (allTrue) {
        // From All -> Select Only This
        const newState: any = { Text: false, Image: false, Audio: false, Embedding: false };
        newState[kind] = true;
        return newState;
      } else if (onlyThisTrue) {
        // From Only This -> Select All
        return { Text: true, Image: true, Audio: true, Embedding: true };
      } else {
        // From (Mixed or Other Single) -> Select Only This
        // "if a user selects one it will only select that one element"
        const newState: any = { Text: false, Image: false, Audio: false, Embedding: false };
        newState[kind] = true;
        return newState;
      }
    });

    this.emitChange();
  }

  private emitChange() {
    this.filterChange.emit({
      search: this.searchTerm(),
      kinds: this.kinds()
    });
  }
}
