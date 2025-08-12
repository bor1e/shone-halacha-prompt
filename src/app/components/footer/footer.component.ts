import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { VersionService } from '../../services/version.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-info">
          <span class="version-info">
            <mat-icon class="version-icon">info</mat-icon>
            <span i18n="@@footer.version">Version</span>: {{ version }}
          </span>
          @if (buildDate && environment !== 'production') {
            <span class="build-info">
              <mat-icon class="build-icon">schedule</mat-icon>
              <span i18n="@@footer.build">Build</span>: {{ buildDate }}
            </span>
          }
          @if (commitHash && environment !== 'production') {
            <span class="commit-info">
              <mat-icon class="commit-icon">code</mat-icon>
              <span i18n="@@footer.commit">Commit</span>: {{ commitHash }}
            </span>
          }
          @if (environment !== 'production') {
            <span class="environment-info">
              <mat-icon class="environment-icon">developer_mode</mat-icon>
              <span i18n="@@footer.environment">Environment</span>: {{ environment }}
            </span>
          }
        </div>
        <div class="footer-links">
          <span class="nuremberg-attribution">
            <span i18n="@@footer.builtWith">Built with</span> 
            <mat-icon class="heart-icon">favorite</mat-icon> 
            <span i18n="@@footer.inNuremberg">in Nuremberg</span>
          </span>
          <a href="https://github.com/bor1e/shone-halacha-prompt" target="_blank" rel="noopener noreferrer">
            <mat-icon>code</mat-icon>
            <span i18n="@@footer.source">Source</span>
          </a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
      border-top: 1px solid #c3e6c3;
      padding: 16px 0;
      margin-top: auto;
      box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .footer-info {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .version-info,
    .build-info,
    .commit-info,
    .environment-info {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.875rem;
      color: #666;
    }

    .version-icon,
    .build-icon,
    .commit-icon,
    .environment-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #1976d2;
    }

    .commit-icon {
      color: #4caf50;
    }

    .environment-icon {
      color: #ff9800;
    }

    .footer-links {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .nuremberg-attribution {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.875rem;
      color: #666;
      font-weight: 500;
    }

    .heart-icon {
      color: #e91e63;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .footer-links a {
      display: flex;
      align-items: center;
      gap: 4px;
      text-decoration: none;
      color: #1976d2;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }

    .footer-links a:hover {
      color: #1565c0;
    }

    .footer-links mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    @media (max-width: 600px) {
      .footer-content {
        flex-direction: column;
        text-align: center;
      }

      .footer-info {
        justify-content: center;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  private versionService = inject(VersionService);

  get version(): string {
    return this.versionService.getVersion();
  }

  get buildDate(): string | null {
    return this.versionService.getBuildDate();
  }

  get commitHash(): string | undefined {
    return this.versionService.getCommitHash();
  }

  get environment(): string {
    return environment.production ? 'production' : 'development';
  }
} 