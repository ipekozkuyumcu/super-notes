import { TaxonomyModel } from './taxonomy-model';

/**
 * Note Item Model
 */
export class NoteItemModel {
    /** firestore id */
    id?: string;
    /** user ID */
    userID?: string;
    /** title */
    title?: string;
    /** content */
    content?: string;
    /** created at */
    createdAt?: any = {seconds: undefined};
    /** updated at */
    updatedAt?: any = {seconds: undefined};
    /** is sticky? */
    isSticky?: boolean;
    /** is archived? */
    isArchived?: boolean;
    /** tags */
    tags?: Array<string>;
    /** tag list */
    tagList?: Array<TaxonomyModel>;
}
