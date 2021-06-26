import {Grid} from "./js/Grid.mjs";

let grille = new Grid('grid', 100, 100);

var a = document.getElementById('iteration').addEventListener('click', test);



function test() {
    setTimeout(() => {
        grille.iteration();
        test();
    }, 100);
}