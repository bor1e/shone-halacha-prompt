import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Import all components for showcase
import { AnalysisLanguageSelectorComponent } from '../analysis-language-selector/analysis-language-selector.component';
import { FooterComponent } from '../footer/footer.component';
import { HalachaNumberDialogComponent } from '../halacha-number-dialog/halacha-number-dialog.component';
import { MockPromptFormComponent } from './mock-prompt-form.component';

@Component({
    selector: 'app-design-library',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        AnalysisLanguageSelectorComponent,
        FooterComponent,
        MockPromptFormComponent
    ],
    template: `
    <div class="design-library">
      <div class="design-library-header">
        <h1>🎨 Design Library</h1>
        <p>Component showcase for development and design review</p>
      </div>

        <!-- Icon Library -->
        <section class="component-section">
          <div class="component-header">
            <h2>Icon Library</h2>
            <p>Common Material Icons used throughout the application</p>
          </div>
          <div class="component-demo">
            <div class="icon-grid">
              <div class="icon-item">
                <mat-icon>language</mat-icon>
                <span>language</span>
              </div>
              <div class="icon-item">
                <mat-icon>send</mat-icon>
                <span>send</span>
              </div>
              <div class="icon-item">
                <mat-icon>content_copy</mat-icon>
                <span>content_copy</span>
              </div>
              <div class="icon-item">
                <mat-icon>share</mat-icon>
                <span>share</span>
              </div>
              <div class="icon-item">
                <mat-icon>check</mat-icon>
                <span>check</span>
              </div>
              <div class="icon-item">
                <mat-icon>error</mat-icon>
                <span>error</span>
              </div>
              <div class="icon-item">
                <mat-icon>text_fields</mat-icon>
                <span>text_fields</span>
              </div>
              <div class="icon-item">
                <mat-icon>translate</mat-icon>
                <span>translate</span>
              </div>
              <div class="icon-item">
                <mat-icon>refresh</mat-icon>
                <span>refresh</span>
              </div>
              <div class="icon-item">
                <mat-icon>palette</mat-icon>
                <span>palette</span>
              </div>
              <div class="icon-item">
                <mat-icon>info</mat-icon>
                <span>info</span>
              </div>
              <div class="icon-item">
                <mat-icon>schedule</mat-icon>
                <span>schedule</span>
              </div>
              <div class="icon-item">
                <mat-icon>code</mat-icon>
                <span>code</span>
              </div>
              <div class="icon-item">
                <mat-icon>developer_mode</mat-icon>
                <span>developer_mode</span>
              </div>
              <div class="icon-item">
                <mat-icon>warning</mat-icon>
                <span>warning</span>
              </div>
            </div>
          </div>
        </section>

        <mat-divider></mat-divider>

        <!-- Analysis Language Selector -->
        <section class="component-section">
          <div class="component-header">
            <h2>Analysis Language Selector</h2>
            <p>Component for selecting the analysis language with override functionality</p>
          </div>
          <div class="component-demo">
            <app-analysis-language-selector></app-analysis-language-selector>
          </div>
        </section>

        <mat-divider></mat-divider>

        <!-- Prompt Form -->
        <section class="component-section">
          <div class="component-header">
            <h2>Prompt Form</h2>
            <p>Main form component for submitting Hebrew text and generating summaries</p>
          </div>
          <div class="component-demo">
            <app-mock-prompt-form></app-mock-prompt-form>
          </div>
        </section>

        <mat-divider></mat-divider>

        <!-- Halacha Number Dialog -->
        <section class="component-section">
          <div class="component-header">
            <h2>Halacha Number Dialog</h2>
            <p>Dialog component for manual halacha number input</p>
          </div>
          <div class="component-demo">
            <button mat-raised-button color="primary" (click)="openHalachaDialog()">
              Open Halacha Number Dialog
            </button>
          </div>
        </section>

        <mat-divider></mat-divider>

        <!-- Footer -->
        <section class="component-section">
          <div class="component-header">
            <h2>Footer</h2>
            <p>Application footer with version information and links</p>
          </div>
          <div class="component-demo">
            <app-footer></app-footer>
          </div>
        </section>
      </div>
    `,
    styles: [`
    .design-library {
      max-width: 1800px;
      margin: 0 auto;
      padding: 32px;
      background-color: #fafafa;
      min-height: 100vh;
    }

    .design-library-header {
      text-align: center;
      margin-bottom: 48px;
      padding: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .design-library-header h1 {
      margin: 0 0 8px 0;
      font-size: 2.5rem;
      font-weight: 300;
    }

    .design-library-header p {
      margin: 0;
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .component-section {
      margin-bottom: 48px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }

    .component-header {
      padding: 28px 36px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-bottom: 1px solid #e0e0e0;
    }

    .component-header h2 {
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .component-header p {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.95rem;
    }

    .component-demo {
      padding: 40px;
      background: white;
    }

    mat-divider {
      margin: 32px 0;
    }



    /* Icon Grid Styles */
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 16px;
      padding: 16px 0;
    }

    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fafafa;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .icon-item:hover {
      background: #f0f0f0;
      border-color: #1976d2;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .icon-item mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #1976d2;
      margin-bottom: 8px;
    }

    .icon-item span {
      font-size: 0.75rem;
      color: #666;
      text-align: center;
      font-family: 'Courier New', monospace;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .design-library {
        padding: 20px;
      }

      .design-library-header {
        padding: 28px 20px;
      }

      .design-library-header h1 {
        font-size: 2rem;
      }

      .component-header {
        padding: 24px 28px;
      }

      .component-demo {
        padding: 28px;
      }

      .icon-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 12px;
      }

      .icon-item {
        padding: 12px;
      }

      .icon-item mat-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignLibraryComponent {
    private dialog = inject(MatDialog);

    openHalachaDialog(): void {
        const mockData = {
            hebrewText: 'זהו טקסט עברי לדוגמה עם מספר הלכה 872. הטקסט הזה משמש להדגמת הדיאלוג.'
        };

        this.dialog.open(HalachaNumberDialogComponent, {
            width: '500px',
            data: mockData
        });
    }
} 