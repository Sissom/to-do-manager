import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }



}
