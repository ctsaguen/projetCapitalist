import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { Product } from '../model/product.model';

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
  product: Product;
  @Input()
  set prod(value: Product) {
    this.product = value;
    if (this.product && this.product.timeleft > 0) {
      this.lastupdate = Date.now();
    }
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
  @Output() notifyMoney: EventEmitter<number> = new EventEmitter<number>();

  constructor(private renderer: Renderer2) { }


  ngOnInit(): void {
    // console.log(this.progressBarItem);
    /*
    setTimeout(function(){ 
      alert("Hello"); }, 3000);
    */

    setInterval(() => { this.calcScore(); }, 1000);

  }

  ngAfterViewInit() {
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

  production() {
    // if (this.product.quantite >= 1) {

    //bar.animate(1.0);
    this.bar.animate(1, { duration: this.product.vitesse });
    this.product.timeleft = this.product.vitesse;
    this.lastupdate = Date.now();
    this.isRun = true;
    //  }
  }

  calcScore() {
    if (this.isRun) {
      if (this.product.timeleft > 0) {
        this.product.timeleft = this.product.timeleft - (Date.now() - this.lastupdate);
      }
      else {
        this.product.timeleft = 0;
        this.lastupdate = 0;
        this.notifyProduction.emit(this.product);
        this.isRun = false;
        this.bar.set(0);
      }
    }
  }

  calcMaxCanBuy(): number {
    var a = 1 - ((this._money / this.product.cout) * (1 - this.product.croissance)) - this.product.croissance;
    console.log(a)
    var result = - (Math.log(a) - 1);
    var maxAchat = Math.floor(result);
    console.log(maxAchat);
    return maxAchat;
  }

  achatProduct() {
    console.log(this.calcMaxCanBuy())
    //if(this._qtmulti >= this.calcMaxCanBuy()){
    var coutAchat = this.product.cout * this._qtmulti
    this.notifyMoney.emit(coutAchat);
    // }
  }

}
