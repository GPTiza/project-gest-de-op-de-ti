import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users:User[]=[];

  constructor(private userService:UserService) {}

  ngOnInit() {
    this.userService.getUser()
    console.log('xd');
    // console.log(this.userService.getUser())
    // this.users.fill(,0,5)
  }

}
