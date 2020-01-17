import { Subject } from 'rxjs';
import { scan, zip, startWith } from 'rxjs/operators';

const meAction$ = new Subject();
const meReducer = (state, payload) => {};

const articleAction$ = new Subject();
const articleReducer = (state, payload) => {};

const me$ = meAction$.pipe(scan(meReducer), startWith({}));
const article$ = articleAction$.pipe(scan(articleReducer), startWith({}));

const state$ = zip(me$, article$, (me, article) => {});
