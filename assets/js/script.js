// Per compilare : tsc -t es5 script.ts
var Smartphone = /** @class */ (function () {
    function Smartphone(modello, credito, costoPerMinuto) {
        this.minuti = 0;
        this.secondi = 0;
        this.ore = 0;
        this.scatto = false;
        this.chiamate = [];
        this.setintervals = "";
        this.interval = 0;
        this._numeroDigitato = "";
        var screen = document.getElementById("screen" + modello);
        if (!screen)
            throw Error("Errore: non riesco a trovare lo schermo!");
        var callscreen = document.getElementById("numchiamato" + modello);
        if (!callscreen)
            throw Error("Errore: non riesco a trovare lo schermo!");
        var timer = document.getElementById("timer" + modello);
        if (!timer)
            throw Error("Errore: non riesco a trovare timer!");
        var ora = document.getElementById("ora" + modello);
        if (!ora)
            throw Error("Errore: non riesco a trovare ora!");
        this.timers = timer;
        this.oras = ora;
        this.schermo = screen;
        this.callschermo = callscreen;
        this.credito = credito;
        this.costoPerMinuto = costoPerMinuto;
        this.modello = modello;
    }
    Object.defineProperty(Smartphone.prototype, "numeroDigitato", {
        get: function () {
            return this._numeroDigitato;
        },
        set: function (value) {
            this._numeroDigitato = value;
            this.schermo.innerText = value;
        },
        enumerable: false,
        configurable: true
    });
    Smartphone.prototype.digitNumber = function (num) {
        this.numeroDigitato = this._numeroDigitato + num;
    };
    Smartphone.prototype.erasenumer = function () {
        this.numeroDigitato = this.numeroDigitato.slice(0, -1);
    };
    Smartphone.prototype.registro = function () {
        var call = document.getElementById("call" + this.modello);
        var register = document.getElementById("register" + this.modello);
        call.classList.toggle("displaynone");
        register.classList.toggle("displaynone");
    };
    Smartphone.prototype.resetregistro = function () {
        this.chiamate = [];
        var div = document.getElementById("chiamates" + this.modello);
        div.innerHTML = "";
    };
    Smartphone.prototype.call = function () {
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
                }
                else if (this.numeroDigitato.length < 10) {
                    this.numeroDigitato = "";
                    this.schermo.innerText = "Numero non Valido!";
                    return;
                }
                if (this.numeroDigitato.length == 10) {
                    this.callschermo.innerText = "+39" + " " + this.numeroDigitato;
                }
                else {
                    this.callschermo.innerText = "+" + this.numeroDigitato;
                }
                var call = document.getElementById("call" + this.modello);
                var callon = document.getElementById("callon" + this.modello);
                call.classList.add("displaynone");
                callon.classList.remove("displaynone");
                var salv = this.numeroDigitato;
                this.timer(salv);
        }
    };
    Smartphone.prototype.timer = function (salv) {
        var _this = this;
        this.credito = this.credito - this.costoPerMinuto;
        this.scatto = true;
        var interval = setInterval(function () {
            if (_this.secondi < 60) {
                _this.secondi = _this.secondi + 1;
                // TODO: risolto
                _this.timers.innerText = _this.minuti + ":" + _this.secondi;
                _this.interval = interval;
            }
            else {
                _this.secondi = 0;
                _this.minuti = _this.minuti + 1;
                _this.credito = _this.credito - _this.costoPerMinuto;
                _this.scatto = false;
            }
            if (_this.minuti > 59) {
                _this.secondi = 0;
                _this.minuti = 0;
                _this.ore = _this.ore + 1;
                _this.oras.innerText = _this.ore + ":";
            }
            if (_this.ore == 1) {
                var ore = document.getElementById("ora" + _this.modello);
                ore.classList.remove("displaynone");
            }
            if (_this.credito <= 0 && _this.scatto == false) {
                _this.credito = 0;
                _this.setintervals = salv;
                _this.scatto = true;
                _this.chiudi();
            }
        }, 1000);
    };
    Smartphone.prototype.chiudi = function () {
        var callon = document.getElementById("callon" + this.modello);
        callon.classList.add("displaynone");
        var call = document.getElementById("call" + this.modello);
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
    };
    Smartphone.prototype.ultimechiamate = function () {
        var div = document.getElementById("chiamates" + this.modello);
        div.innerHTML = "";
        var lista = document.getElementById("chiamates" + this.modello);
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
    };
    return Smartphone;
}());
var iphone = new Smartphone("iphone", 1, 1);
var iphoneb = new Smartphone("iphoneb", 2, 2);
var iphonec = new Smartphone("iphonec", 3, 3);
