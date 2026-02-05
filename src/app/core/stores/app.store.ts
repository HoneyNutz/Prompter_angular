import { Injectable, signal, computed } from '@angular/core';

export type BackendMode = 'Internal' | 'External';

@Injectable({
  providedIn: 'root'
})
export class AppStore {
  // Region: State
  
  /** The current user's API key. Null if not authenticated. */
  readonly currentUserApiKey = signal<string | null>(null);
  
  /** The currently active backend mode ('Internal' vs 'External'). Defaults to 'External'. */
  readonly backendMode = signal<BackendMode>('External');
  
  /** The ID of the currently selected AI model. */
  readonly selectedModelId = signal<string | null>(null);
  
  /** Whether the sidebar navigation is open. */
  readonly isSidebarOpen = signal<boolean>(true);


  // Region: Computed

  /** Computed boolean indicating if the backend mode is 'Internal'. */
  readonly isInternal = computed(() => this.backendMode() === 'Internal');


  // Region: Actions

  /**
   * Updates the current user's API key.
   * @param key The new API key.
   */
  setApiKey(key: string) {
    this.currentUserApiKey.set(key);
  }

  /**
   * Switches the backend mode.
   * @param mode 'Internal' or 'External'.
   */
  setBackendMode(mode: BackendMode) {
    this.backendMode.set(mode);
  }

  /**
   * Sets the currently selected model ID.
   * @param modelId The ID of the model (e.g., 'gpt-4-turbo').
   */
  setSelectedModel(modelId: string) {
    this.selectedModelId.set(modelId);
  }

  /**
   * Toggles the visibility of the sidebar.
   */
  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }
}
