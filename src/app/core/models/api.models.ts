/**
 * Represents an AI Model provided by the service.
 */
export interface AIModel {
  /** Unique identifier for the model (mapped from version or title). */
  id: string;
  /** Display name of the model (mapped from title). */
  name: string;
  /** Brief description of the model's capabilities. */
  description?: string;
  /** Context window size in tokens. */
  contextSizeKTokens: number;
  /** Cost per 1k input tokens (TEU). */
  inputCostTeu: number; 
  /** Cost per 1k output tokens. */
  outputCostTeu: number;
  
  // New Fields
  /** Supported modalities (text, image, audio). */
  modality: string[];
  /** Supported functionalities (reasoning, tool-calling, etc). */
  functionality: string[];

  // Legacy/Mapped Fields (to avoid breaking UI immediately)
  /** Primary category (derived from modality). */
  modelKind: 'Text' | 'Image' | 'Audio' | 'Embedding';
  /** Optional classification (mapped from functionality or description). */
  modelClass?: string;
  
  /** Link to further documentation. */
  url?: string;
  
  /** Available versions/snapshots for this model family. */
  versions?: string[];
}

/**
 * Detailed version information for a specific model.
 */
export interface ModelVersion {
  /** Unique identifier for this version (e.g., 'gpt-4-1106-preview'). */
  id: string;
  /** The parent model ID. */
  modelId: string;
  /** Semantic semantic or date-based version string. */
  version: string;
  /** Release date in ISO format. */
  releaseDate: string;
  /** Whether this version is marked for deprecation. */
  isDeprecated: boolean;
}

/**
 * Historical usage statistics for a specific date and model.
 */
export interface UsageStat {
  /** The date of usage (ISO string). */
  date: string;
  /** Total tokens consumed. */
  totalTokens: number;
  /** Total cost accrued. */
  totalCost: number;
  /** The model ID associated with this usage. */
  modelId: string;
}

/**
 * Aggregated summary of usage for a specific model.
 */
export interface ModelUsageSummary {
    /** The model ID. */
  modelId: string;
    /** Total aggregated tokens. */
  tokens: number;
    /** Total aggregated cost. */
  cost: number;
}

/**
 * Application configuration.
 */
export interface Config {
  /** Base URL for the internal relay service. */
  internalRelayUrl: string;
  /** Base URL for the external direct API. */
  externalApiUrl: string;
}

/**
 * Rate limit and quota status for a model.
 */
export interface LimitStatus {
  /** The model ID. */
  modelId: string;
  /** Whether the model is currently rate limited. */
  isRateLimited: boolean;
  /** Whether the user has exceeded their quota for this model. */
  isQuotaExceeded: boolean;
}
