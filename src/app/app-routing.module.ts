import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTaskComponent } from './list/add-task/add-task.component';
import { ArchivedTasksComponent } from './list/archived-tasks/archived-tasks.component';
import { CurrentTasksComponent } from './list/current-tasks/current-tasks.component';
import { EditTaskComponent } from './list/edit-task/edit-task.component';
import { ViewTaskComponent } from './list/view-task/view-task.component';
import { AuthComponent } from './shared/auth/auth.component';

const routes: Routes = [
  { path: "", redirectTo: "/auth", pathMatch: 'full'},
  { path: "current-tasks", component: CurrentTasksComponent, children:[
    { path: ":id", component: ViewTaskComponent, pathMatch: 'full' },
    { path: "edit/:id", component: EditTaskComponent, pathMatch: 'full'}
  ] },
  { path: "archived-tasks", component: ArchivedTasksComponent, children: [
    { path: ":id", component: ViewTaskComponent, pathMatch: 'full' },
    { path: "edit/:id", component: EditTaskComponent, pathMatch: 'full'}
  ]},
  { path: "add-task", component: AddTaskComponent, pathMatch: 'full' },
  { path: 'auth', component: AuthComponent, pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
