import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  templateUrl: 'confirmation-code.html',
  providers: [MessageService],
})

export class ConfirmationCodeComponent implements OnInit {

  email: string = "";
  loading: boolean = false;

  constructor(
    public messageService: MessageService,
    private router: Router
  ) {

  }
  
  ngOnInit(): void {
    this.email = sessionStorage.getItem('user') || 'ejemplo@mail.com';
  }

  onLogin(): void {
    this.router.navigate(['/']);
  }

}