import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'nl2br',
    standalone: true
})
export class Nl2brPipe implements PipeTransform {
    private sanitizer = inject(DomSanitizer);

    transform(value: string): SafeHtml {
        if (!value) return '';
        const html = value.replace(/\n/g, '<br>');
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
} 