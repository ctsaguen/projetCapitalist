import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';

import { Product } from '../model/product.model';

declare var require;
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  progressbar: any;
  @ViewChild('bar') progressBarItem;
  product: Product;
  lastupdate: number;
  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  _money: number;
  @Input()
  set money(value: number) {
    this._money = value;
  }

  _qtmulti: string;
  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    if (this._qtmulti && this.product) this.calcMaxCanBuy();
  }

  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

  constructor() { }

  ngOnInit(): void {
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, {
        strokeWidth: 100,
        color: '#00ff00',
        trailColor: '#eee',
        trailWidth: 1,
        svgStyle: { width: '100%', height: '100%' },
        from: { color: '#FFEA82' },
        to: { color: '#ED6A5A' }
      });
   // setInterval(() => { this.calcScore(); }, 100);
  }

  production() {
    if (this.product.quantite > 1) {
      this.product.timeleft = this.product.vitesse;
      this.lastupdate = Date.now();
      this.progressbar.animate(1, { duration: this.product.vitesse });
    }
  }

  calcScore() {
    if (this.product.timeleft != 0) {
      this.product.timeleft = this.product.timeleft - (Date.now() - this.lastupdate);
      if (this.product.timeleft <= 0) {
        this.product.timeleft = 0;
        this.progressbar.set(0);
        this.notifyProduction.emit(this.product);
      }
    }
  }

  calcMaxCanBuy() {

  }

}
