import { Component, EventEmitter, Inject, Input, LOCALE_ID, Output, PLATFORM_ID } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { NoteItemModel } from '../../models';
import { AlertService, PageService } from '../../services';

/**
 * NoteItem Component
 */
@Component({
    selector: 'app-note',
    templateUrl: './note.component.html'
})
export class NoteComponent {
    /** event emitter */
    @Output() readonly eventEmitter = new EventEmitter();
    /** current note data */
    @Input() noteItem: NoteItemModel = {};

    /**
     * constructor of DashboardComponent
     * @param platformId: PLATFORM_ID
     * @param pageService: PageService
     * @param afs: AngularFirestore
     * @param alert: AlertService
     * @param router: Router
     * @param locale: LOCALE_ID
     */
    constructor(@Inject(PLATFORM_ID) private readonly platformId: string,
                public pageService: PageService,
                private readonly afs: AngularFirestore,
                public alert: AlertService,
                private readonly router: Router,
                @Inject(LOCALE_ID) public locale: string) {
    }

    /**
     * on click save button
     */
    onClickSave(): void {
        if (!this.noteItem.createdAt) {
            this.noteItem.createdAt = firebase.firestore.Timestamp.now();
            this.noteItem.isArchived = false;
        }
        this.noteItem.updatedAt = firebase.firestore.Timestamp.now();

        const newNote = {...this.noteItem};
        delete newNote.doc;
        delete newNote.id;
        if (this.noteItem.id) {
            this.afs.collection('noteItems')
                .doc(this.noteItem.id)
                .set(newNote, {merge: true})
                .then(() => {
                    // no need to show info
                })
                .catch(reason => {
                    this.alert.error(reason);
                });
        } else {
            this.afs.collection('noteItems')
                .add(newNote)
                .then(() => {
                    // no need to show info
                })
                .catch(reason => {
                    this.alert.error(reason);
                });
        }
    }

    /**
     * update note item
     * @param newData: FeedItemModel
     */
    updateNoteItem(newData: NoteItemModel): void {
        Object.keys(newData)
            .forEach(key => {
                this.noteItem[key] = newData[key];
            });
        this.onClickSave();
    }

    /**
     * on click close
     */
    onClickClose(): void {
        this.eventEmitter.emit('close');
    }
}
