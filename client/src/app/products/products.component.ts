import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NotificationService } from '../service/notification.service';

import { Product } from '../model/product.model';
import { Pallier } from '../model/pallier.model'

declare var require;
var ProgressBar = require('progressbar.js');

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  @ViewChild('bar') progressBarItem: ElementRef;
  lastupdate: number;
  server: string = 'http://localhost:8080/';
  isRun: boolean;
  bar: any;
  maxAchat: number;
  
  //cette variable sert à faire évoluer les seuils de bonus
  seuil: number;
  //on récupére le produit du world
  product: Product;
  @Input()
  set prod(value: Product) {
    this.product = value;

    //on initialise le coût d'achat
    this.maxAchat = this.product.cout;

    if (this.product && this.product.timeleft > 0) {
      this.lastupdate = Date.now();
      let progress = (this.product.vitesse - this.product.timeleft) / this.product.vitesse;
      this.bar.set(progress);
      this.bar.animate(1, { duration: this.product.timeleft });
    }
  }
  //on récupère les gains du joueur 
  _money: number;
  @Input()
  set money(value: number) {
    this._money = value;
  }
  //on récupère la valeur du commutateur de quantité d'achat
  _qtmulti: number;
  @Input()
  set qtmulti(value: number) {
    if (value >= 100000) {
      this._qtmulti = this.calcMaxCanBuy();
    }
    else {
      this._qtmulti = value;
    }
  }
  //on renvoie à la couche mère le le Product en production 
  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
  //on renvoie à la couche mère le coût total du produit acheté 
  @Output() notifyMoney: EventEmitter<number> = new EventEmitter<number>();

  constructor(private notifyService: NotificationService) { }


  ngOnInit(): void {
    setInterval(() => {
      this.calcScore();
    }, 100);
  }

  ngAfterViewInit() {
    //ici on a mis un timeout afin d'initialiser la progressbar après la création du DOM sinon cela ne fonctionne pas. le hook se lance trop tôt
    setTimeout(() => {
      this.bar = new ProgressBar.Line(this.progressBarItem.nativeElement, {
        strokeWidth: 4,
        easing: 'easeInOut',
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        svgStyle: { width: '100%', height: '100%' },
        from: { color: '#FFEA82' },
        to: { color: '#ED6A5A' },
        step: (state, bar) => {
          bar.path.setAttribute('stroke', state.color);
        }
      });
    }, 100)

  }
  //fonction de production utilisé quand le joueur lance une production
  production() {
    if (this.product.quantite >= 1) {
      let progress = (this.product.vitesse - this.product.timeleft) / this.product.vitesse;
      this.bar.animate(1, { duration: progress });
      this.product.timeleft = this.product.vitesse;
      this.lastupdate = Date.now();
      this.isRun = true;
    }
  }
  //calcul du score du joueur après une production, elle est lancé chaque 100ms par le hook ngOnInit et mis à jour les resultats 
  calcScore() {
    if (this.isRun) {
      if (this.product.timeleft > 0) {
        this.product.timeleft = this.product.timeleft - (Date.now() - this.lastupdate);
      }
      else {
        this.product.timeleft = 0;
        this.lastupdate = 0;
        this.isRun = false;
        this.bar.set(0);
      }
      this.notifyProduction.emit(this.product);
    }
    if (this.product.managerUnlocked) {
      this.production();
    }
  }

  //cette fonction calcul la quantité maximal que que le joueur peut acheter en fonction de son argent
  calcMaxCanBuy(): number {
    let quantiteMax: number = 0;
    if(this.product.cout*this.product.croissance <= this._money){
      let calPrelem = (this.product.cout - (this._money*(1-this.product.croissance)))/this.product.cout;
      let quant = (Math.log(calPrelem))/Math.log(this.product.croissance);
      quantiteMax = Math.trunc(quant-1);
      if(isNaN(quantiteMax)){
        quantiteMax = 0;
      }
      
    }
    return quantiteMax;
  }

  // cette fonction lance l'achat d'un produit
  achatProduct() {
    //console.log(this.calcMaxCanBuy())
    if (this._qtmulti <= this.calcMaxCanBuy()) {
      var coutAchat = 0;
      for(let i=0;i<this._qtmulti;i++){
        this.maxAchat = this.maxAchat*this.product.croissance;
        coutAchat = coutAchat + this.maxAchat;
      }
      this.notifyMoney.emit(coutAchat);
      this.product.quantite = this.product.quantite + this._qtmulti;
      //bonus d'achat spécifique à chaque produit
      this.product.palliers.pallier.forEach(value => {
        if (!value.unlocked && this.product.quantite > value.seuil) {
          this.product.palliers.pallier[this.product.palliers.pallier.indexOf(value)].unlocked = true;
          this.calcUpgrade(value);
          this.notifyService.showSuccess("déblocage d'un bonus " + value.typeratio + " effectué pour " + this.product.name, "BONUS")
        }
      })
    }
  }

  //ici on calcul si le joeur a débloqué un bonus et il y'a 3 type de bonus, à savoir vitesse, gain ou encore ange
  calcUpgrade(pallier: Pallier) {
    switch (pallier.typeratio) {
      case 'vitesse':
        this.product.vitesse = this.product.vitesse / pallier.ratio;
        break;
      case 'gain':
        this.product.revenu = this.product.revenu * pallier.ratio;
        break;
    }
  }

}
