import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { AIModel, ModelVersion, UsageStat, LimitStatus } from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  
  /** Base URL for internal API relay. */
  private internalBaseUrl = 'https://internal-relay.adicapr.io/v1';
  
  /** Base URL for external OpenAI API. */
  private externalBaseUrl = 'https://api.openai.com/v1';

  constructor() { }

  /**
   * Retrieves the list of supported AI models.
   * 
   * Logic:
   * 1. Check for `openaiApiKey` in the environment configuration.
   * 2. If present, fetch real models from OpenAI API (`v1/models`) and map them to `AIModel`.
   * 3. Response is filtered to only include 'gpt', 'dall-e', and 'embedding' models to keep the UI focused.
   * 4. If no key is present, fallback to a hardcoded list of mock models for demonstration/discovery purposes.
   * 
   * @returns Observable array of `AIModel` objects.
   */
  /**
   * Retrieves the list of supported AI models from the static configuration.
   * 
   * Logic:
   * 1. Fetches `/data/models.json`.
   * 2. Maps the raw JSON to the `AIModel` interface.
   * 3. Derives legacy fields like `modelKind` and `id` from the new structure.
   * 
   * @returns Observable array of `AIModel` objects.
   */
  getSupportedModels(): Observable<AIModel[]> {
    return this.http.get<any[]>('/data/models.json').pipe(
      map(rawModels => {
        return rawModels.map(raw => {
          // Derive ID from version or title, but keep it url-friendly.
          // The user provided "version": "5.2-preview-2026". We can use that as ID, or make a slug from title.
          // Let's use the 'title' lowercased/slugified as the main ID for the card, and 'version' as the default version.
          const id = raw.title.toLowerCase().replace(/\./g, '-').replace(/\s+/g, '-');
          
          // Map Modalities to primary ModelKind (legacy support for UI card badge)
          let kind: 'Text' | 'Image' | 'Audio' | 'Embedding' = 'Text';
          if (raw.modality.includes('image')) kind = 'Image';
          if (raw.modality.includes('audio')) kind = 'Audio'; // Audio usually implies text + audio
          if (raw.title.toLowerCase().includes('embedding')) kind = 'Embedding';

          return {
            id: id,
            name: raw.title,
            description: raw.description,
            contextSizeKTokens: raw.context_window / 1000,
            inputCostTeu: raw.teu_cost_in,
            outputCostTeu: raw.teu_cost_out,
            modality: raw.modality,
            functionality: raw.functionality,
            modelKind: kind,
            modelClass: raw.functionality[0], // Use first functionality as class tag
            versions: [raw.version], // Use the specific version string provided
            url: raw.url
          } as AIModel;
        });
      }),
      delay(500) // Simulate slight network latency
    );
  }

  /**
   * Retrieves version history for a specific model.
   * Currently returns mock data simulating deprecated and active versions.
   * 
   * @param modelId The ID of the model to fetch versions for.
   * @returns Observable array of `ModelVersion`.
   */
  getSupportedModelVersions(modelId: string): Observable<ModelVersion[]> {
    return of([
      { id: `${modelId}-v1`, modelId, version: '2023-11-06', releaseDate: '2023-11-06', isDeprecated: false },
      { id: `${modelId}-legacy`, modelId, version: '2023-06-13', releaseDate: '2023-06-13', isDeprecated: true }
    ]).pipe(delay(300));
  }

  /**
   * Generates realistic dummy usage statistics for the user.
   * 
   * Logic:
   * 1. Generates 12 months of historical data based on the current date.
   * 2. For each month, randomly selects 2 models from a predefined list.
   * 3. Assigns random token usage and cost values (higher for GPT-4).
   * 4. Returns the list sorted by date ascending.
   * 
   * @param apiKey The user's API key (used to simulate fetching user-specific data).
   * @returns Observable array of `UsageStat`.
   */
  getUserUsage(apiKey: string): Observable<UsageStat[]> {
    // Realistic Dummy Data Generation
    const stats: UsageStat[] = [];
    const now = new Date();
    const models = ['gpt-4-turbo', 'gpt-3.5-turbo', 'dall-e-3', 'text-embedding-3-small'];
    
    // Generate data for the last 12 months
    for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthModels = this.getRandomSubarray(models, 2); // User used 2 random models this month

        monthModels.forEach(modelId => {
             stats.push({
                date: date.toISOString(),
                totalTokens: Math.floor(Math.random() * (modelId.includes('gpt-4') ? 500000 : 2000000)) + 10000,
                totalCost: Math.random() * (modelId.includes('gpt-4') ? 100 : 20) + 5,
                modelId: modelId
            });
        });
    }

    // Sort by date ascending (oldest first)
    return of(stats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())).pipe(delay(800));
  }

  /**
   * Helper function to get a random subarray of unique elements from an array.
   * Used for generating varied usage data.
   * 
   * @param arr The source array.
   * @param size The number of elements to select.
   * @returns A new array containing `size` random elements from `arr`.
   */
  private getRandomSubarray(arr: string[], size: number) {
    const shuffled = arr.slice(0);
    let i = arr.length;
    let temp, index;
    while (i--) {
        index = Math.floor(Math.random() * (i + 1));
        temp = shuffled[i];
        shuffled[i] = shuffled[index];
        shuffled[index] = temp;
    }
    return shuffled.slice(0, size);
  }

  /**
   * Retrieves the current rate limit and quota status for models.
   * Currently returns mock data showing no limits reached.
   * 
   * @returns Observable array of `LimitStatus`.
   */
  getLimitStatus(): Observable<LimitStatus[]> {
    return of([
        { modelId: 'gpt-4-turbo', isRateLimited: false, isQuotaExceeded: false }
    ]);
  }
}
