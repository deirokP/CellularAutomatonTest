import { Case } from "./Case.mjs";

class Grid {
    constructor(id, hauteur, largeur) {
        this.hauteur = hauteur;
        this.largeur = largeur;
        this.id = id;
        this.alive = [];
        const table = document.getElementById(id);
        if (table === null) {
            throw `table ${id} not found`;
        }
        for (let a = 0; a < hauteur; a++) {
            let tr = document.createElement('tr');
            tr.className = "ligne-" + a;
            for (let b = 0; b < largeur; b++) {
                let td = document.createElement('td');
                td.className = "colonne-" + b;
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        this.#addListener();
        return true;
    }

    getCase(x, y) {
        return document.querySelector('tr.ligne-' + x + ' ' + 'td.colonne-' + y);
    }

    getTop(x, y) {
        x = parseInt(x) - 1;
        return document.querySelector('tr.ligne-' + x + ' ' + 'td.colonne-' + y);
    }

    getBot(x, y) {
        x = parseInt(x) + 1;
        return document.querySelector('tr.ligne-' + x + ' ' + 'td.colonne-' + y);
    }

    getLeft(x, y) {
        y = parseInt(y) - 1;
        return document.querySelector('tr.ligne-' + x + ' ' + 'td.colonne-' + y);
    }

    getRight(x, y) {
        y = parseInt(y) + 1;
        return document.querySelector('tr.ligne-' + x + ' ' + 'td.colonne-' + y);
    }

    getTopLeft(x, y) {
        x = parseInt(x) - 1;
        y = parseInt(y) - 1;
        return document.querySelector('tr.ligne-' + x + ' ' + 'td.colonne-' + y);
    }

    getTopRight(x, y) {
        x = parseInt(x) - 1;
        y = parseInt(y) + 1;
        return document.querySelector('tr.ligne-' + x + ' ' + 'td.colonne-' + y);
    }

    getBotLeft(x, y) {
        x = parseInt(x) + 1;
        y = parseInt(y) - 1;
        return document.querySelector('tr.ligne-' + x + ' ' + 'td.colonne-' + y);
    }

    getBotRight(x, y) {
        x = parseInt(x) + 1;
        y = parseInt(y) + 1;
        return document.querySelector('tr.ligne-' + x + ' ' + 'td.colonne-' + y);
    }

    checkSiAlive(element) {
        if (element !== null && element.classList.contains('alive')) {
            return true;
        }
        return false;
    }

    getNbCopain(x, y) {
        let count = 0;

        if (this.checkSiAlive(this.getTop(x, y))) {
            count++;
        }
        if (this.checkSiAlive(this.getBot(x, y))) {
            count++;
        }
        if (this.checkSiAlive(this.getLeft(x, y))) {
            count++;
        }
        if (this.checkSiAlive(this.getRight(x, y))) {
            count++;
        }
        if (this.checkSiAlive(this.getTopLeft(x, y))) {
            count++;
        }
        if (this.checkSiAlive(this.getTopRight(x, y))) {
            count++;
        }
        if (this.checkSiAlive(this.getBotLeft(x, y))) {
            count++;
        }
        if (this.checkSiAlive(this.getBotRight(x, y))) {
            count++;
        }

        return count;
    }

    getVoisin(x, y) {
        let listeVoisin = [];
        listeVoisin.push(this.getTop(x, y));
        listeVoisin.push(this.getBot(x, y));
        listeVoisin.push(this.getLeft(x, y));
        listeVoisin.push(this.getRight(x, y));
        listeVoisin.push(this.getTopLeft(x, y));
        listeVoisin.push(this.getTopRight(x, y));
        listeVoisin.push(this.getBotLeft(x, y));
        listeVoisin.push(this.getBotRight(x, y));

        return listeVoisin;
    }

    getCoord(element) {
        let x = element.parentElement.className.match(/\d+/g);
        let y = element.className.match(/\d+/g);
        return [x, y];
    }

    #addListener() {
        let listeTd = document.getElementById(this.id).getElementsByTagName('td');
        for (let td of listeTd) {
            td.addEventListener('click', this.callback(td));
            // td.addEventListener('click', function () {
            //     td.classList.add('alive');
            // });
        }
    }

    callback(td) {
        var self = this;
        
        return function () {
            td.classList.add("alive");
            self.alive.push(td);
        }
    }

    naissance(array) {
        for (let truc of array) {
            this.getCase(truc[0], truc[1]).classList.add('alive');
            this.alive.push(this.getCase(truc[0], truc[1]))
        }
    }

    mort(array) {
        for (let truc of array) {
            this.getCase(truc[0], truc[1]).classList.remove('alive');
            let index = this.alive.indexOf(this.getCase(truc[0], truc[1]));

            if (index > -1) {
                console.log("TROUVE");
                this.alive.splice(index, 1);
            } else {
                console.log("PAS TROUVE");
            }
            // for (let caseMorte of this.alive) {
            //     if (caseMorte === this.getCase(truc[0], truc[1])) {
                    
            //     }
            // }
            // this.alive = this.alive.filter(e => e !== this.getCase(truc[0], truc[1]));
        }
    }

    iteration() {
        let suppression = [];
        let ajout = []
        let listeTd = document.getElementById(this.id).getElementsByTagName('td');
        // let listeTd = this.alive;
        for (let td of listeTd) {
            if (td.classList.contains('alive')) {
                let x = this.getCoord(td)[0];
                let y = this.getCoord(td)[1];

                let nbCopainVivant = this.getNbCopain(x, y);
                if (nbCopainVivant == 2 || nbCopainVivant == 3) {
                    
                } else {
                    suppression.push([x, y]);
                }

                let listeVoisin = this.getVoisin(x, y);
                for (let voisin of listeVoisin) {
                    if (voisin !== null) {
                        let xCopain = this.getCoord(voisin)[0];
                        let yCopain = this.getCoord(voisin)[1];
                        let nbCopainVoisin = this.getNbCopain(xCopain, yCopain);
                        if (nbCopainVoisin === 3) {
                            ajout.push(this.getCoord(voisin))
                        }
                    }
                }
            }
        }

        this.mort(suppression);
        this.naissance(ajout);

    }

    // update() {
    //     setTimeout(function () {
    //         this.iteration();
    //         this.update();
    //     });
    // }

}

export {Grid};