var Board = /** @class */ (function () {
    function Board() {
        this.playersNumber = 0;
        this.init();
    }
    Board.prototype.init = function () {
        var CANVAS = document.querySelector('#canva');
        var ctx = CANVAS.getContext("2d");
        var img = document.querySelector('#img');
        img.onload = function () {
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, -1400, -100);
        };
    };
    return Board;
}());
export default Board;
