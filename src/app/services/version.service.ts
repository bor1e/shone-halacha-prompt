import { Injectable } from '@angular/core';

export interface VersionInfo {
  version: string;
  buildDate: string | null;
  commitHash?: string;
  environment: string;
}

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  private versionInfo: VersionInfo = {
    version: '0.0.0',
    buildDate: null,
    environment: 'development'
  };

  constructor() {
    this.loadVersionInfo();
  }

  getVersionInfo(): VersionInfo {
    return { ...this.versionInfo };
  }

  getVersion(): string {
    return this.versionInfo.version;
  }

  getBuildDate(): string | null {
    return this.versionInfo.buildDate;
  }

  getEnvironment(): string {
    return this.versionInfo.environment;
  }

  getCommitHash(): string | undefined {
    return this.versionInfo.commitHash;
  }

  private loadVersionInfo(): void {
    try {
      // Try to import the generated version file
      import('../../version').then(module => {
        this.versionInfo = module.VERSION_INFO;
      }).catch(() => {
        // Fallback to development values if version file doesn't exist
        this.setDevelopmentVersion();
      });
    } catch (error) {
      // Fallback to development values
      this.setDevelopmentVersion();
    }
  }

  private setDevelopmentVersion(): void {
    this.versionInfo = {
      version: '0.0.0',
      buildDate: new Date().toISOString().split('T')[0],
      environment: 'development'
    };
  }
} 