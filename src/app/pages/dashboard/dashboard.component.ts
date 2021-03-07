import { isPlatformBrowser } from '@angular/common';
import {
    Component,
    HostBinding,
    HostListener,
    Inject,
    LOCALE_ID,
    OnInit,
    PLATFORM_ID
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NoteItemModel, PageModel, TaxonomyModel } from '../../models';
import { AlertService, ComponentCanDeactivate, PageService, PaginationService } from '../../services';

/**
 * Dashboard Component
 */
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, ComponentCanDeactivate  {
    /** class of page */
    @HostBinding('class') class = 'dashboard-page';

    /** current page object */
    page$: Observable<PageModel>;
    /** focused feed item */
    focusedItem: NoteItemModel;
    /** focused tag */
    focusedTag: TaxonomyModel;
    /** tag list */
    tagList: Array<TaxonomyModel>;
    /** css class of tag-cloud */
    tagCloudClass = 'tag-cloud';
    /** show modal */
    showModal = false;

    /**
     * constructor of DashboardComponent
     * @param platformId: PLATFORM_ID
     * @param pageService: PageService
     * @param afs: AngularFirestore
     * @param alert: AlertService
     * @param pagination: PaginationService
     * @param locale: LOCALE_ID
     */
    constructor(@Inject(PLATFORM_ID) private readonly platformId: string,
                public pageService: PageService,
                private readonly afs: AngularFirestore,
                public alert: AlertService,
                public pagination: PaginationService,
                @Inject(LOCALE_ID) public locale: string) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.page$ = this.pageService.getPageFromFirestore(PageModel, 'pages', this.pageService.getRoutePathName());
        this.loadTags();
        this.loadByTag({id: 'all'});
    }

    // @HostListener allows us to also guard against browser refresh, close, etc.
    /**
     * can deactivate component?
     */
    @HostListener('window:beforeunload') canDeactivate(): Observable<boolean> | boolean {
        return !environment.production;
    }

    /**
     * load tags
     */
    loadTags(): void {
        this.afs.collection<TaxonomyModel>('tags', ref => ref)
            .valueChanges()
            .subscribe(tagList => {
                this.tagList = tagList;
                this.tagList.forEach(tag => {
                    if (tag.id === 'all') {
                        this.afs.collection<NoteItemModel>('noteItems', ref =>
                            ref
                                .where('isArchived', '<=', false)
                                .orderBy('isArchived', 'asc')
                                .orderBy('createdAt', 'asc')
                                .limit(10))
                            .valueChanges()
                            .subscribe(value => {
                                tag.countOfUnreadText = value.length > 9 ? `${value.length}+` : `${value.length}`;
                            });
                    } else {
                        this.afs.collection<NoteItemModel>('noteItems', ref =>
                            ref
                                .where('isArchived', '<=', false)
                                .where('tags', 'array-contains', tag.id)
                                .orderBy('isArchived', 'asc')
                                .orderBy('tags', 'asc')
                                .orderBy('createdAt', 'asc')
                                .limit(10)
                        )
                            .valueChanges()
                            .subscribe(value => {
                                tag.countOfUnreadText = value.length > 9 ? `${value.length}+` : `${value.length}`;
                            });
                    }
                });
            });
    }

    /**
     * load page content by tag
     * @param tag: TaxonomyModel
     */
    loadByTag(tag: TaxonomyModel): void {
        this.focusedTag = tag;
        if (tag.id === 'all') {
            this.pagination.init(
                'noteItems', ['isArchived', 'createdAt'], {limit: 100, reverse: false, prepend: false}, undefined,
                {
                    fieldPath: 'isArchived', opStr: '<=', value: false
                });
        } else {
            this.pagination.init(
                'noteItems', ['isArchived', 'tags', 'createdAt'], {limit: 100, reverse: false, prepend: false}, undefined,
                {
                    fieldPath: 'isArchived', opStr: '<=', value: false
                },
                {
                    fieldPath: 'tags', opStr: 'array-contains', value: tag.id
                });
        }
        if (document.getElementById('item-list-body')) {
            if (isPlatformBrowser(this.platformId)) {
                const scrollToTop = window.setInterval(() => {
                    const pos = document.getElementById('item-list-body').scrollTop;
                    if (pos > 0) {
                        document.getElementById('item-list-body')
                            .scrollTo(0, pos - 60); // how far to scroll on each step
                    } else {
                        window.clearInterval(scrollToTop);
                    }
                }, 16);
            }
        }
    }

    /**
     * scroll handler for pagination
     * @param e: event
     */
    scrollHandler(e): void {
        if (e === 'bottom') {
            this.pagination.more();
        }
    }

    /**
     * show feed item preview
     * @param noteItem: FeedItemModel
     */
    showPreview(noteItem: NoteItemModel): void {
        this.showModal = true;
        this.focusedItem = noteItem;
        this.focusedItem.tagList = this.tagList.filter(tag => this.focusedItem.tags.indexOf(tag.id) > -1);
    }

    /**
     * on get an event
     * @param e: emitted event
     */
    onEventListener(e: any): void {
        if (e === 'close') {
            this.showModal = false;
            // TODO: reload data
        }
    }

}
