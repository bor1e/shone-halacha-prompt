import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    setDoc,
    query,
    where,
    orderBy,
    limit
} from '@angular/fire/firestore';
import { Observable, from, map, combineLatest, switchMap } from 'rxjs';
import {
    HalachaDocument,
    HalachaSummaryDocument,
    HalachaWithSummaries
} from '../../types/halacha.types';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {
    private firestore = inject(Firestore);
    private readonly halachaCollection = 'halachot';
    private readonly summariesCollection = 'halacha-summaries';

    /**
     * Saves original halacha content with halachaNumber as document ID
     */
    saveOriginalHalacha(halachaNumber: number, hebrewText: string): Observable<void> {
        const halachaDoc: HalachaDocument = {
            halachaNumber,
            hebrewText,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = doc(this.firestore, this.halachaCollection, halachaNumber.toString());
        return from(setDoc(docRef, halachaDoc));
    }

    /**
     * Saves AI-generated summary with metadata
     */
    saveSummary(
        halachaNumber: number,
        summary: string,
        language: string,
        isAdvancedLevel: boolean
    ): Observable<string> {
        const summaryDoc: HalachaSummaryDocument = {
            halachaNumber,
            summary,
            language,
            isAdvancedLevel,
            createdAt: new Date()
        };

        const collectionRef = collection(this.firestore, this.summariesCollection);
        return from(addDoc(collectionRef, summaryDoc)).pipe(
            map(docRef => docRef.id)
        );
    }

    /**
     * Gets original halacha by number
     */
    getHalachaByNumber(halachaNumber: number): Observable<HalachaDocument | null> {
        const docRef = doc(this.firestore, this.halachaCollection, halachaNumber.toString());
        return from(getDoc(docRef)).pipe(
            map(docSnap => {
                if (docSnap.exists()) {
                    return docSnap.data() as HalachaDocument;
                }
                return null;
            })
        );
    }

    /**
     * Gets summaries for a specific halacha
     */
    getSummariesForHalacha(halachaNumber: number): Observable<HalachaSummaryDocument[]> {
        const collectionRef = collection(this.firestore, this.summariesCollection);
        const q = query(
            collectionRef,
            where('halachaNumber', '==', halachaNumber),
            orderBy('createdAt', 'desc')
        );

        return from(getDocs(q)).pipe(
            map(querySnapshot =>
                querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as HalachaSummaryDocument))
            )
        );
    }

    /**
     * Gets the last 5 requested halachot with their summaries
     */
    getRecentHalachot(): Observable<HalachaWithSummaries[]> {
        const halachaCollectionRef = collection(this.firestore, this.halachaCollection);
        const halachaQuery = query(halachaCollectionRef, orderBy('createdAt', 'desc'), limit(5));

        return from(getDocs(halachaQuery)).pipe(
            switchMap(querySnapshot => {
                const halachot = querySnapshot.docs.map(doc => doc.data() as HalachaDocument);

                if (halachot.length === 0) {
                    return from([[]]);
                }

                const halachotWithSummaries$ = halachot.map(halacha =>
                    this.getSummariesForHalacha(halacha.halachaNumber).pipe(
                        map(summaries => ({
                            halachaNumber: halacha.halachaNumber,
                            hebrewText: halacha.hebrewText,
                            createdAt: halacha.createdAt,
                            summaries
                        } as HalachaWithSummaries))
                    )
                );

                return combineLatest(halachotWithSummaries$);
            })
        );
    }

    /**
     * Checks if a specific summary already exists
     */
    summaryExists(halachaNumber: number, language: string, isAdvancedLevel: boolean): Observable<boolean> {
        const collectionRef = collection(this.firestore, this.summariesCollection);
        const q = query(
            collectionRef,
            where('halachaNumber', '==', halachaNumber),
            where('language', '==', language),
            where('isAdvancedLevel', '==', isAdvancedLevel),
            limit(1)
        );

        return from(getDocs(q)).pipe(
            map(querySnapshot => !querySnapshot.empty)
        );
    }

    /**
     * Gets existing summary if it exists
     */
    getExistingSummary(
        halachaNumber: number,
        language: string,
        isAdvancedLevel: boolean
    ): Observable<HalachaSummaryDocument | null> {
        const collectionRef = collection(this.firestore, this.summariesCollection);
        const q = query(
            collectionRef,
            where('halachaNumber', '==', halachaNumber),
            where('language', '==', language),
            where('isAdvancedLevel', '==', isAdvancedLevel),
            limit(1)
        );

        return from(getDocs(q)).pipe(
            map(querySnapshot => {
                if (querySnapshot.empty) {
                    return null;
                }
                const doc = querySnapshot.docs[0];
                return {
                    id: doc.id,
                    ...doc.data()
                } as HalachaSummaryDocument;
            })
        );
    }
}