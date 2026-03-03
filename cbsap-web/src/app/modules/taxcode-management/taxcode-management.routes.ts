import { Routes } from '@angular/router';
import { TaxCodeSearchComponent } from './pages/taxcode-search/taxcode-search.component';
import { TaxCodeEditorComponent } from './pages/taxcode-details/taxcode-editor.component';


export const TAXCODE_ROUTES : Routes = [
   {
    path: '',
    component: TaxCodeSearchComponent
   },
   {
      path: 'add-taxcode',
      component: TaxCodeEditorComponent
   },
   {
      path: 'edit-taxcode/:taxCodeID',
      component: TaxCodeEditorComponent
   }
]