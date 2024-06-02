import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    template: `
      {"success": true}
    `
})
export class UploadService implements OnInit {

    constructor(private router: Router) {}

    ngOnInit() {
        
    }
}