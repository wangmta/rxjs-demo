import { Observable, Subject } from 'rxjs';
import { combineLatest } from 'rxjs/operators';

const me$ = new Subject();

const article$ = new Subject();

// const editable$ = combineLatest(article$, me$).map(arr => {
//   let [article, me] = arr;
//   return me.isAdmin || article.author === me.id;
// });
