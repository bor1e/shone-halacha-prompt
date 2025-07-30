import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import MarkdownIt from 'markdown-it';

@Pipe({ name: 'markdown', standalone: true })
export class MarkdownPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  private md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  });

  transform(value: string): SafeHtml {
    if (!value) return '';

    // Fügt ein Leerzeichen zwischen einem Markdown-End-Tag (**, *) 
    // und einer direkt folgenden hochgestellten Ziffer ein, um Parsing-Fehler zu beheben.
    const preprocessedValue = String(value)
      .replace(/(\*\*)([¹²³⁴⁵⁶⁷⁸⁹⁰]+)/g, '$1 $2') // Repariert **Fett**¹
      .replace(/(\*)([¹²³⁴⁵⁶⁷⁸⁹⁰]+)/g, '$1 $2');   // Repariert *Kursiv*¹

    // Konvertiert den vorverarbeiteten Markdown-String zu HTML
    const html = this.md.render(preprocessedValue);

    // Gibt das bereinigte HTML zurück
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}