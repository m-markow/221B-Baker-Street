import Board from "./Board.js";

window.addEventListener('DOMContentLoaded', ()=>{
    let c64_font = new FontFace('C64','url(./styles/C64_Pro-STYLE.ttf)');
    c64_font.load().then((font)=>{
        // @ts-ignore
        document.fonts.add(font);
        new Board();
    });

});