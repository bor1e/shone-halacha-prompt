import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HalachaNumberExtractor } from '../../utils/halacha-number-extractor';

export interface HalachaNumberDialogData {
    hebrewText: string;
    currentLocale: string;
}

export interface HalachaNumberDialogResult {
    halachaNumber: number;
}

@Component({
    selector: 'app-halacha-number-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    template: `
    <div class="dialog-container" [dir]="isRTL ? 'rtl' : 'ltr'">
      <h2 mat-dialog-title i18n="@@dialog.halacha-number.title">
        Halacha Nummer eingeben
      </h2>
      
      <mat-dialog-content>
        <p i18n="@@dialog.halacha-number.message">
          Die Halacha-Nummer konnte nicht automatisch aus dem Text extrahiert werden. 
          Bitte geben Sie die Nummer manuell ein.
        </p>
        
        <mat-form-field appearance="outline" style="width: 100%; margin-top: 16px;">
          <mat-label i18n="@@dialog.halacha-number.label">Halacha Nummer</mat-label>
          <input 
            matInput 
            type="number" 
            [(ngModel)]="halachaNumber"
            [placeholder]="'z.B. 872'"
            min="100"
            max="9999"
            required
            #halachaInput
            (keyup.enter)="confirm()"
          >
          <mat-error *ngIf="!isValidNumber" i18n="@@dialog.halacha-number.error">
            Bitte geben Sie eine gültige Halacha-Nummer ein (100-9999).
          </mat-error>
        </mat-form-field>
        
        <div class="text-preview" *ngIf="hebrewTextPreview">
          <h4 i18n="@@dialog.halacha-number.preview">Textvorschau:</h4>
          <div class="preview-content">
            {{ hebrewTextPreview }}
          </div>
        </div>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button (click)="cancel()" i18n="@@dialog.cancel">
          Abbrechen
        </button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="confirm()"
          [disabled]="!isValidNumber"
          i18n="@@dialog.confirm"
        >
          Bestätigen
        </button>
      </mat-dialog-actions>
    </div>
  `,
    styleUrls: ['./halacha-number-dialog.component.scss']
})
export class HalachaNumberDialogComponent {
    private dialogRef = inject(MatDialogRef<HalachaNumberDialogComponent>);
    private data = inject(MAT_DIALOG_DATA) as HalachaNumberDialogData;

    halachaNumber: number | null = null;
    hebrewTextPreview: string = '';

    constructor() {
        // Show first 200 characters of the Hebrew text as preview
        this.hebrewTextPreview = this.data.hebrewText.substring(0, 200);
        if (this.data.hebrewText.length > 200) {
            this.hebrewTextPreview += '...';
        }
    }

    get currentLocale(): string {
        return this.data.currentLocale;
    }

    get isRTL(): boolean {
        return this.currentLocale === 'he';
    }

    get isValidNumber(): boolean {
        if (!this.halachaNumber) return false;
        return HalachaNumberExtractor.isValidHalachaNumber(this.halachaNumber);
    }

    confirm(): void {
        if (this.isValidNumber && this.halachaNumber) {
            const result: HalachaNumberDialogResult = {
                halachaNumber: this.halachaNumber
            };
            this.dialogRef.close(result);
        }
    }

    cancel(): void {
        this.dialogRef.close();
    }
} 