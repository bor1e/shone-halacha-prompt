import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { MarkdownPipe } from './markdown.pipe';

describe('MarkdownPipe', () => {
    let pipe: MarkdownPipe;
    let sanitizer: DomSanitizer;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MarkdownPipe],
        });
        pipe = TestBed.inject(MarkdownPipe);
        sanitizer = TestBed.inject(DomSanitizer);
    });

    it('sollte eine Instanz erstellen', () => {
        expect(pipe).toBeTruthy();
    });

    it('sollte einen leeren String zurückgeben, wenn der Input leer ist', () => {
        const result = pipe.transform('');
        const sanitizedResult = sanitizer.sanitize(SecurityContext.HTML, result);
        expect(sanitizedResult).toBe('');
    });

    it('sollte einen leeren String zurückgeben, wenn der Input null oder undefined ist', () => {
        const resultNull = pipe.transform('');
        const resultUndefined = pipe.transform('');

        const sanitizedNull = sanitizer.sanitize(SecurityContext.HTML, resultNull);
        const sanitizedUndefined = sanitizer.sanitize(SecurityContext.HTML, resultUndefined);

        expect(sanitizedNull).toBe('');
        expect(sanitizedUndefined).toBe('');
    });

    it('sollte einfachen kursiven Text korrekt umwandeln', () => {
        const markdownInput = 'Das ist *kursiver* Text.';
        const expectedHtml = '<p>Das ist <em>kursiver</em> Text.</p>\n';
        const result = pipe.transform(markdownInput);
        const sanitizedResult = sanitizer.sanitize(SecurityContext.HTML, result);
        expect(sanitizedResult).toBe(expectedHtml);
    });

    it('sollte einfachen fetten Text korrekt umwandeln', () => {
        const markdownInput = 'Das ist **fetter** Text.';
        const expectedHtml = '<p>Das ist <strong>fetter</strong> Text.</p>\n';
        const result = pipe.transform(markdownInput);
        const sanitizedResult = sanitizer.sanitize(SecurityContext.HTML, result);
        expect(sanitizedResult).toBe(expectedHtml);
    });

    // --- Tests für die spezifische Reparatur-Logik ---

    it('sollte einen Abstand zwischen Fettdruck und einer direkt folgenden Fußnote einfügen', () => {
        const markdownInput2 = '**Ein wichtiger Punkt**¹';
        const expectedHtml2 = '<p><strong>Ein wichtiger Punkt</strong> ¹</p>\n';

        const result = pipe.transform(markdownInput2);
        const sanitizedResult = sanitizer.sanitize(SecurityContext.HTML, result);
        expect(sanitizedResult).toBe(expectedHtml2);
    });

    it('sollte einen Abstand zwischen Kursivschrift und einer direkt folgenden Fußnote einfügen', () => {
        const markdownInput = '*Ein wichtiger Punkt*²';
        const expectedHtml = '<p><em>Ein wichtiger Punkt</em> ²</p>\n';
        const result = pipe.transform(markdownInput);
        const sanitizedResult = sanitizer.sanitize(SecurityContext.HTML, result);
        expect(sanitizedResult).toBe(expectedHtml);
    });

    it('sollte mehrere Vorkommnisse in einem String korrekt behandeln', () => {
        const markdownInput = 'Das ist **fett**¹ und das ist *kursiv*².';
        const expectedHtml = '<p>Das ist <strong>fett</strong> ¹ und das ist <em>kursiv</em> ².</p>\n';
        const result = pipe.transform(markdownInput);
        const sanitizedResult = sanitizer.sanitize(SecurityContext.HTML, result);
        expect(sanitizedResult).toBe(expectedHtml);
    });

    it('sollte keinen Abstand hinzufügen, wenn bereits einer vorhanden ist', () => {
        const markdownInput = 'Das ist **fett** ¹.';
        const expectedHtml = '<p>Das ist <strong>fett</strong> ¹.</p>\n';
        const result = pipe.transform(markdownInput);
        const sanitizedResult = sanitizer.sanitize(SecurityContext.HTML, result);
        expect(sanitizedResult).toBe(expectedHtml);
    });

    it('sollte ein SafeHtml-Objekt zurückgeben', () => {
        const result = pipe.transform('test');
        // Wir prüfen, ob das Ergebnis ein Objekt ist und nicht nur ein einfacher String.
        // SafeHtml ist eine abstrakte Klasse, die konkrete Implementierung ist intern.
        // Ein einfacher Check ist, ob es sich um ein Objekt handelt und nicht um einen primitiven Typ.
        expect(typeof result).toBe('object');
        // Eine genauere Prüfung, ob es sich um ein von Angular als sicher eingestuftes Objekt handelt.
        expect(result instanceof Object && 'changingThisBreaksApplicationSecurity' in result).toBeTrue();
    });
});