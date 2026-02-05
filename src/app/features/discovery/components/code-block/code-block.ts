import { Component, input, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightModule } from 'ngx-highlightjs';
import { LucideAngularModule, Copy, Check, Terminal } from 'lucide-angular';
import { BackendMode } from '../../../../core/stores/app.store';

type Language = 'python' | 'r' | 'typescript' | 'csharp' | 'curl';

@Component({
  selector: 'app-code-block',
  standalone: true,
  imports: [CommonModule, HighlightModule, LucideAngularModule],
  templateUrl: './code-block.html'
})
export class CodeBlock {
  /** The ID of the model to generate the code snippet for. */
  readonly modelId = input<string>('gpt-4-turbo');

  /** The backend environment mode ('Internal' vs 'External'). Affects base URL and API key usage. */
  readonly backendMode = input<BackendMode>('External');

  /** Custom text to display in the header (e.g., 'API Request' or 'API Request Code Sample'). */
  readonly headerText = input<string>('API Request');
  
  // Default to Python as requested
  readonly language = signal<Language>('python');
  readonly copied = signal(false);
  
  // Params
  readonly temperature = signal(0.7);
  readonly top_p = signal(1.0);
  readonly showParams = signal(false);

  readonly CopyIcon = Copy;
  readonly CheckIcon = Check;
  readonly TerminalIcon = Terminal;

  /**
   * Computes the code snippet based on the current language, model, backend mode, and parameters.
   * dynamically adjusts the Base URL and API Key placeholders.
   */
  readonly codeSnippet = computed(() => {
    const model = this.modelId();
    const mode = this.backendMode();
    const lang = this.language();
    
    const baseUrl = mode === 'Internal' 
      ? `https://internal-relay.adicapr.io/v1/${model}/chat/completions`
      : 'https://api.openai.com/v1/chat/completions';
      
    if (lang === 'python') {
      return `from openai import OpenAI

client = OpenAI(${mode === 'External' ? '' : `
    base_url="${baseUrl}",
    api_key="your-internal-key",
`})

response = client.chat.completions.create(
    model="${model}",
    temperature=${this.temperature()},
    top_p=${this.top_p()},
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)
print(response.choices[0].message.content)`;
    } else if (lang === 'r') {
      return `library(httr)
library(jsonlite)

response <- POST(
  url = "${baseUrl}",
  add_headers(
    "Content-Type" = "application/json",
    "Authorization" = "Bearer $OPENAI_API_KEY"
  ),
  body = list(
    model = "${model}",
    temperature = ${this.temperature()},
    top_p = ${this.top_p()},
    messages = list(
      list(role = "user", content = "Hello!")
    )
  ),
  encode = "json"
)

content(response)`;
    } else if (lang === 'typescript') {
      return `import OpenAI from 'openai';

const client = new OpenAI({${mode === 'External' ? '' : `
  baseURL: '${baseUrl}',
  apiKey: 'your-internal-key',
`}
});

async function main() {
  const completion = await client.chat.completions.create({
    messages: [{ role: 'user', content: 'Hello!' }],
    model: '${model}',
    temperature: ${this.temperature()},
    top_p: ${this.top_p()},
  });

  console.log(completion.choices[0]);
}

main();`;
    } else if (lang === 'csharp') {
      return `using System.Text;
using System.Text.Json;

using HttpClient client = new();
client.DefaultRequestHeaders.Add("Authorization", "Bearer $OPENAI_API_KEY");

var payload = new {
    model = "${model}",
    temperature = ${this.temperature()},
    top_p = ${this.top_p()},
    messages = new[] {
        new { role = "user", content = "Hello!" }
    }
};

var content = new StringContent(
    JsonSerializer.Serialize(payload),
    Encoding.UTF8,
    "application/json"
);

var response = await client.PostAsync(
    "${baseUrl}",
    content
);

Console.WriteLine(await response.Content.ReadAsStringAsync());`;
    } else {
      // cURL
      return `curl ${baseUrl} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -d '{
    "model": "${model}",
    "temperature": ${this.temperature()},
    "top_p": ${this.top_p()},
    "messages": [
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }'`;
    }
  });

  setLanguage(lang: Language) {
    this.language.set(lang);
  }

  copyCode() {
    navigator.clipboard.writeText(this.codeSnippet());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
