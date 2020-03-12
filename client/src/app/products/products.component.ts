import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Product } from '../model/product.model';

declare var require;
var ProgressBar = require('progressbar.js');

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  progressbar: any;
  product: Product;
  lastupdate: number;
  maxAchat: number;
  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  _money: number;
  @Input()
  set money(value: number) {
    this._money = value;
  }

  _qtmulti: number;
  @Input()
  set qtmulti(value: number) {
    this._qtmulti = value;
    if (this._qtmulti && this.product) this.calcMaxCanBuy();
  }

  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

  constructor() { }

  ngOnInit(): void {
    this.progressbar = new ProgressBar.Line("#bar", {
      strokeWidth: 4,
      easing: 'easeInOut',
      duration: 1400,
      color: '#FFEA82',
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: {width: '100%', height: '100%'}
    });
   //setInterval(() => { this.calcScore(); }, 100);
  }

  production() {
   // if (this.product.quantite >= 1) {
      this.product.timeleft = this.product.vitesse;
      this.lastupdate = Date.now();
      this.progressbar.animate(1.0);
     // this.progressbar.animate(1, { duration: this.product.vitesse });
  //  }
  }

  calcScore() {
    if (this.product.timeleft != 0) {
      this.product.timeleft = this.product.timeleft - (Date.now() - this.lastupdate);
      if (this.product.timeleft <= 0) {
        this.product.timeleft = 0;
       // this.progressbar.set(0);
        this.notifyProduction.emit(this.product);
      }
    }
  }

  calcMaxCanBuy() {
    if(this._qtmulti==1000){
      var x = (1/Math.log(this.product.croissance))*(1 - (this._money * (1 - this.product.croissance))/this.product.cout);
      this.maxAchat = Math.floor(x); 
      console.log(this.maxAchat);
    }
  }

}
