import { Routes } from '@angular/router';
import { KeywordSearchComponent } from './pages/keyword-search/keyword-search.component';
import { KeywordEditorComponent } from './pages/keyword-detail/keyword-editor.component';

export const KEYWORD_ROUTES : Routes = [
   {
    path: '',
    component: KeywordSearchComponent
   },
   {
      path: 'add-keyword',
      component: KeywordEditorComponent
   },
   {
      path: 'edit-keyword/:keywordID',
      component: KeywordEditorComponent
   }
]