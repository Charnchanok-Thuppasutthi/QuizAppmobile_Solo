import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { ItemsComponent } from './item/items.component'
import { ItemDetailComponent } from './item/item-detail.component'

import { MenuComponent } from'./menu/menu.component'
import { CategoryComponent } from './category/category.component'
import { PlayComponent } from './play/play.component'
import { ResultComponent } from './result/result.component'
import { AddComponent } from './add/add.component'
import { QuestionComponent } from './add/component/question/question.component'

const routes: Routes = [
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: 'items', component: ItemsComponent },
  { path: 'item/:id', component: ItemDetailComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'category', component: CategoryComponent},
  { path: 'play/:id', component: PlayComponent },
  { path: 'result/:id/:score', component: ResultComponent},
  { path: 'add', component: AddComponent},
  //{ path: 'add/question', component:QuestionComponent}
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
