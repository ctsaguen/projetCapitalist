import { Component } from '@angular/core';
import { RestService } from './service/rest.service';
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
  qtmulti : string;
  world: World = new World();
  server: string;
    constructor(private service: RestService) {
      this.server = service.getServer();
      service.getWorld().then(world => {
        this.world = world;
        console.log(world)
      });
      this.createUsername();
    }
  
  onProductionDone( p ) {
      this.world.money = this.world.money + p.revenu;
      this.world.score = this.world.score + 1;
    }
    onUsernameChanged():void{
      this.username = localStorage.getItem("username");
      this.service.setUser(this.username);
      this.createUsername();
    }
    createUsername():void{
      if(this.username==''){
        this.username = 'Captain' + Math.floor(Math.random() * 10000);
      }
    }
}
