import { Component, OnInit } from '@angular/core';
import { RestService } from './service/rest.service';
import { NotificationService } from './service/notification.service';


import { World } from './model/world.model';
import { Product } from './model/product.model';
import { Pallier } from './model/pallier.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'client';
  username: string = '';
  qtmulti: number = 1;
  world: World = new World();
  server: string;
  constructor(private service: RestService, private notifyService : NotificationService) {
    this.server = service.getServer();
    service.getWorld().then(world => {
      this.world = world;
    });
    this.createUsername();
  }
  ngAfterViewInit() {
   
  }
 
  commutateur() {
    switch (this.qtmulti) {
      case 1:
        this.qtmulti = 10
        break;
      case 10:
        this.qtmulti = 100
        break;
      case 100:
        this.qtmulti = 1000
        break;
      default:
        this.qtmulti = 1
    }
  }
  onProductionDone(p: Product) {
    this.world.money = this.world.money + p.revenu;
    this.world.score = this.world.score + p.revenu;
  }

  onAchatDone(m: number) {
    this.world.money = this.world.money - m;
  }

  onUsernameChanged(): void {
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username);
  }
  createUsername(): void {
    this.username = localStorage.getItem("username");
    if (this.username == '') {
      this.username = 'Captain' + Math.floor(Math.random() * 10000);
      localStorage.setItem("username", this.username);
    }
    this.service.setUser(this.username);
  }
  
  achatManager(m : Pallier){
   if(this.world.money >= m.seuil){
      this.world.money = this.world.money - m.seuil;
      var index = this.world.managers.pallier.indexOf(m);
      this.world.managers.pallier[index].unlocked = true;
      this.notifyService.showSuccess("Achat de "+m.name+" effectué", "Notification")
   }
  }
}
