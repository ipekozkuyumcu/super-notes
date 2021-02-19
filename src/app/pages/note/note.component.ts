import { Component, Inject, LOCALE_ID, OnInit, PLATFORM_ID } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { NoteItemModel, PageModel } from '../../models';
import { AlertService, PageService } from '../../services';

/**
 * NoteItem Component
 */
@Component({
    selector: 'app-note',
    templateUrl: './note.component.html'
})
export class NoteComponent implements OnInit {
    /** current page object */
    page$: Observable<PageModel>;
    /** current note data */
    noteItem: NoteItemModel = {};

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
     * ngOnInit
     */
    ngOnInit(): void {
        this.page$ = this.pageService.getPageFromFirestore(PageModel, 'pages', this.pageService.getRoutePathName());
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

        this.afs.collection('noteItems')
            .add(this.noteItem)
            .then(value => this.router.navigate(['/dashboard']))
            .catch(// istanbul ignore next
                reason => {
                this.alert.error(reason);
            });
    }
}
