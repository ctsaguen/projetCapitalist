import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { RestService } from './service/rest.service';
import { NotificationService } from './service/notification.service';
import { ProductsComponent } from './products/products.component'

import { World } from './model/world.model';
import { Product } from './model/product.model';
import { Pallier } from './model/pallier.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  @ViewChildren(ProductsComponent) public productsComponent: QueryList<ProductsComponent>;
  title = 'client';
  username: string = '';
  qtmulti: number = 1;
  world: World = new World();
  server: string;
  dispoManager:boolean;

  constructor(private service: RestService, private notifyService : NotificationService) {
    this.server = service.getServer();
    service.getWorld().then(world => {
      this.world = world;
    });

    this.createUsername();
  }

  //ici on teste la disponibilité d'un manager pour le signaler visuellement à l'utilisateur d'un changement et c'est utilisé dans lors des nombreuses productions.
  disponibiliteManager():void{
   this.dispoManager = false;
    this.world.managers.pallier.forEach(val => {
      if(!this.dispoManager){
        if(this.world.money > val.seuil && !val.unlocked){
          this.dispoManager = true;
         }
      }
    })
  }

  //commutateur de changement des valeurs possible d'achat de produit, on a soit 1 produit, soit 10, soit 100 ou le max
  commutateur() {
    switch (this.qtmulti) {
      case 1:
        this.qtmulti = 10
        break;
      case 10:
        this.qtmulti = 100
        break;
      case 100:
        this.qtmulti = 100000
        break;
      default:
        this.qtmulti = 1
    }
  }
  //Prise en compte des productions effectués dans le component Product
  onProductionDone(p: Product) {
    this.world.money = this.world.money + p.revenu;
    this.world.score = this.world.score + p.revenu;
    this.disponibiliteManager();
  }

  //on valide l'achat d'un produit dans le component Product
  onAchatDone(m: number) {
    this.world.money = this.world.money - m;
  }

  //ici on enregistre les changements de nom d'utilisateur effectué par l'utilisateur
  onUsernameChanged(): void {
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username);
  }
  //ici on crée le nom d'utilisateur s'il n'exite pas et l'enregistre dans le serveur
  createUsername(): void {
    this.username = localStorage.getItem("username");
    if (this.username == '') {
      this.username = 'Captain' + Math.floor(Math.random() * 10000);
      localStorage.setItem("username", this.username);
    }
    this.service.setUser(this.username);
  }
  
  //cette partie nous permet d'acheter un manager 
  achatManager(m : Pallier){
   if(this.world.money >= m.seuil){
      this.world.money = this.world.money - m.seuil;
      var index = this.world.managers.pallier.indexOf(m);

      this.world.managers.pallier[index].unlocked = true;

      this.world.products.product.forEach(element => {
        if(m.idcible==element.id){
           var index = this.world.products.product.indexOf(element);
           this.world.products.product[index].managerUnlocked = true;
        }
      });
      this.disponibiliteManager();
      this.notifyService.showSuccess("Achat de "+m.name+" effectué", "Notification")
   }
  }
}
