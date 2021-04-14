import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from '@nativescript/angular'
import { ResultComponent } from './result/result.component'
import { NativeScriptFormsModule } from "@nativescript/angular";

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { MenuComponent } from'./menu/menu.component'
import { CategoryComponent } from './category/category.component'
import { PlayComponent } from './play/play.component'
import { EditComponent } from './edit/edit.component'
import { AddComponent } from './edit/add.component'
import { DetailComponent } from './detail/detail.component'

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule, NativeScriptFormsModule],
  declarations: [AppComponent,MenuComponent, CategoryComponent, PlayComponent,
                ResultComponent, EditComponent, AddComponent, DetailComponent  ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
