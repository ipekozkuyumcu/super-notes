import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators';
import { ConfigModel, CustomHtmlModel } from '../../models';
import { ConfigService, PageService } from '../../services';

/**
 * Side Bar Component
 */
@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html'
})
export class SideBarComponent implements OnInit {
    /** do you want to hide search widget */
    hideSearchWidget = false;
    /** primary custom html widget */
    customHtml: CustomHtmlModel;

    /**
     * constructor of SideBarComponent
     * @param router: Router
     * @param pageService: PageService
     * @param configService: ConfigService
     * @param locale: LOCALE_ID
     */
    constructor(public router: Router,
                public pageService: PageService,
                public configService: ConfigService,
                @Inject(LOCALE_ID) public locale: string) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.configService.getConfig()
            .subscribe((config: ConfigModel) => {
                this.customHtml = config.primaryCustomHtmlWidget;
            });
    }

}
