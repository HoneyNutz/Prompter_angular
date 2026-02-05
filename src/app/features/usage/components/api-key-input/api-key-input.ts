import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Key, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-api-key-input',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './api-key-input.html'
})
export class ApiKeyInput {
  readonly key = signal('');
  readonly submit = output<string>();

  readonly KeyIcon = Key;
  readonly ArrowRightIcon = ArrowRight;

  handleSubmit() {
    if (this.key().trim().length > 3) {
      this.submit.emit(this.key());
    }
  }
}
