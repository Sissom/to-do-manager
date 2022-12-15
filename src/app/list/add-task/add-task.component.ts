import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HTTPService } from 'src/app/shared/http/http.service';
import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  addTaskForm: FormGroup;
  priorities: string[] = ['Low', 'Medium', 'High', 'Urgent'];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private taskService: TaskService,
    private httpService: HTTPService
    )
    {
    this.addTaskForm = this.formBuilder.group({
      name: new FormControl<string | null>(null, Validators.required),
      description: new FormControl<string | null>(null),
      materials: new FormControl<string | null>(null),
      priority: new FormControl<string | null>(null)
      })
    }

  ngOnInit(): void {
  }

  onCancel() {
    this.router.navigate(["/current-tasks"]);
  }

  onSubmit() {
    let newTask = new Task(
      this.addTaskForm.value.name,
      this.addTaskForm.value.description,
      this.addTaskForm.value.materials,
      this.addTaskForm.value.priority
      );
    this.taskService.addTask(newTask);
    this.httpService.saveTasksToFirebase();
    this.router.navigate(["/current-tasks"]);
  }

}
