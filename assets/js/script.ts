// Per compilare : tsc -t es5 script.ts

interface Chiamata {
    numero: string;
    ore: number;
    minuti: number;
    secondi: number;
  }
  
  interface ISmartphone {
    chiamate: Chiamata[];
  }
  
  class Smartphone implements ISmartphone {
    public modello: string;
    public schermo: HTMLElement;
    public callschermo: HTMLElement;
    public ultimechiam: HTMLElement;
    public timers: HTMLElement;
    public oras: HTMLElement;
    public credito: number;
    public costoPerMinuto: number;
    public minuti: number = 0;
    public secondi: number = 0;
    public ore: number = 0;
    public scatto: boolean = false;
    public chiamate: Chiamata[] = [];
    public setintervals: string = "";
    public interval: number = 0;
    private _numeroDigitato: string = "";
    public get numeroDigitato(): string {
      return this._numeroDigitato;
    }
    public set numeroDigitato(value: string) {
      this._numeroDigitato = value;
      this.schermo.innerText = value;
    }
  
    constructor(
      modello: string,
      credito: number,
      costoPerMinuto: number,
    ) {
      let screen = document.getElementById("screen" + modello);
      if (!screen) throw Error("Errore: non riesco a trovare lo schermo!");
      let callscreen = document.getElementById("numchiamato" + modello);
      if (!callscreen) throw Error("Errore: non riesco a trovare lo schermo!");
      let timer = document.getElementById("timer" + modello);
      if (!timer) throw Error("Errore: non riesco a trovare timer!");
      let ora = document.getElementById("ora" + modello);
      if (!ora) throw Error("Errore: non riesco a trovare ora!");
      this.timers = timer;
      this.oras = ora;
      this.schermo = screen;
      this.callschermo = callscreen;
      this.credito = credito;
      this.costoPerMinuto = costoPerMinuto;
      this.modello = modello;
    }
  
    public digitNumber(num: string): void {
      if (this.numeroDigitato.length >= 12){
        this.numeroDigitato = this.numeroDigitato.slice(0, -1);
      }else{
      this.numeroDigitato = this._numeroDigitato + num;
      }
    }
    public erasenumer(): void {
      this.numeroDigitato = this.numeroDigitato.slice(0, -1);
    }
    public registro(): void {
      let call: any = document.getElementById("call" + this.modello);
      let register: any = document.getElementById("register" + this.modello);
      call.classList.toggle("displaynone");
      register.classList.toggle("displaynone");
    }
    public resetregistro(): void {
      this.chiamate = [];
      let div = document.getElementById(
        "chiamates" + this.modello
      ) as HTMLDivElement;
      div.innerHTML = "";
    }
  
    public call(): void {
      switch (this.numeroDigitato) {
        case "404":
          this.numeroDigitato = "";
          this.schermo.innerText = "credito residuo:" + " " + this.credito + "€";
          break;
        case "100":
          this.numeroDigitato = "";
          this.schermo.innerText =
            "Tariffa al minuto:" + " " + this.costoPerMinuto + "€";
          break;
        case "#1":
          this.credito = this.credito + 1;
          this.numeroDigitato = "";
          this.schermo.innerText = "Cred. Ricaricato di 1€!";
          break;
        case "#10":
          this.credito = this.credito + 10;
          this.numeroDigitato = "";
          this.schermo.innerText = "Cred. Ricaricato di 10€!";
          break;
        case "#20":
          this.credito = this.credito + 20;
          this.numeroDigitato = "";
          this.schermo.innerText = "Cred. Ricaricato di 20€!";
          break;
        default:
          if (this.credito <= 0) {
            this.numeroDigitato = "";
            this.schermo.innerText = "Credito Insufficente!";
  
            return;
          } else if (this.numeroDigitato.length < 10) {
            this.numeroDigitato = "";
            this.schermo.innerText = "Numero non Valido!";
  
            return;
          } else if (this.numeroDigitato.length > 12) {
            this.numeroDigitato = "";
            this.schermo.innerText = "Numero non Valido!";
  
            return;
          }
          if (this.numeroDigitato.length == 10) {
            this.callschermo.innerText = "+39" + " " + this.numeroDigitato;
          } else {
            this.callschermo.innerText = "+"+this.numeroDigitato;
          }
          let call: any = document.getElementById("call" + this.modello);
          let callon: any = document.getElementById("callon" + this.modello);
          call.classList.add("displaynone");
          callon.classList.remove("displaynone");
          let salv: string = this.numeroDigitato;
          this.timer(salv);
      }
    }
  
    private timer(salv) {
      this.credito = this.credito - this.costoPerMinuto;
      this.scatto = true;
  
      let interval = setInterval(() => {
        if (this.secondi < 60) {
          this.secondi = this.secondi + 1;
          // TODO: risolto
          this.timers.innerText = this.minuti + ":" + this.secondi;
          this.interval = interval;
        } else {
          this.secondi = 0;
          this.minuti = this.minuti + 1;
          this.credito = this.credito - this.costoPerMinuto;
      
          this.scatto = false;
        }
        if ( this.credito < 0){
          this.credito = 0;
          this.chiudi();
        }
        if (this.minuti > 59) {
          this.secondi = 0;
          this.minuti = 0;
          this.ore = this.ore + 1;
          this.oras.innerText = this.ore + ":";
        }
        if (this.ore == 1) {
          let ore: any = document.getElementById("ora" + this.modello);
  
          ore.classList.remove("displaynone");
        }
  
        if (this.credito <= 0 && this.scatto == false) {
          this.credito = 0;
          this.setintervals = salv;
          this.scatto = true;
          this.chiudi();
        }
      }, 1000);
    }
  
    private chiudi() {
      let callon: any = document.getElementById("callon" + this.modello);
      callon.classList.add("displaynone");
      let call: any = document.getElementById("call" + this.modello);
      call.classList.remove("displaynone");
  
      clearInterval(this.interval);
  
      this.chiamate.push({
        numero: this.numeroDigitato,
        ore: this.ore,
        minuti: this.minuti,
        secondi: this.secondi,
      });
  
      this.scatto = true;
      this.minuti = 0;
      this.ore = 0;
      this.secondi = 0;
      this.numeroDigitato = "";
      this.timers.innerText = "0:0";
      this.schermo.innerText = "Chiamata Terminata!";
      this.ultimechiamate();
    }
    private ultimechiamate() {
      let div = document.getElementById(
        "chiamates" + this.modello
      ) as HTMLDivElement;
      div.innerHTML = "";
    
      let lista = document.getElementById(
        "chiamates" + this.modello
      ) as HTMLDivElement;

      this.chiamate.forEach(function (prod) {
        var div = document.createElement("div");
  
        div.innerHTML =
          "<p>Numero:" +
          prod.numero +
          "<br> Durata chiamata :" +
          " " +
          prod.ore +
          " " +
          "ore" +
          " " +
          prod.minuti +
          " " +
          "minuti" +
          " " +
          prod.secondi +
          " " +
          "secondi" +
          "</p><hr>";
        lista.appendChild(div);
      });
    }
  }
  
  let iphone = new Smartphone("iphone", 1, 1);
  let iphoneb = new Smartphone("iphoneb", 2, 2);
  let iphonec = new Smartphone("iphonec", 3, 3);
  