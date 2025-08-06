import { Injectable } from '@angular/core';
import { VERSION_INFO } from '../../environments/version';

export interface VersionInfo {
    version: string;
    buildDate: string | null;
    commitHash?: string;
}

@Injectable({
    providedIn: 'root'
})
export class VersionService {
    private versionInfo: VersionInfo = VERSION_INFO;

    getVersionInfo(): VersionInfo {
        return { ...this.versionInfo };
    }

    getVersion(): string {
        return this.versionInfo.version;
    }

    getBuildDate(): string | null {
        return this.versionInfo.buildDate;
    }

    getCommitHash(): string | undefined {
        return this.versionInfo.commitHash;
    }
} 