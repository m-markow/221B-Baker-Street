var CANVAS = document.querySelector('#canva');
var TEXT_AREA = document.querySelector('#text_area');
var Game = /** @class */ (function () {
    function Game(players_board, coded_clues, choosed_case) {
        this.players_board = players_board;
        this.coded_clues = coded_clues;
        this.case = choosed_case;
        this.startGame();
    }
    /**
     * Function starting game
     */
    Game.prototype.startGame = function () {
        var _this = this;
        var ctx = CANVAS.getContext("2d");
        var img = document.querySelector('#img');
        img.src = './assets/map.png';
        img.onload = function () {
            ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
            ctx.drawImage(img, 0, -540);
            /** Spawn players */
            for (var i = 0; i < _this.players_board.length; i++) {
                _this.players_board[i].spawn();
            }
            _this.next_round(_this.players_board[0]);
        };
    };
    Game.prototype.next_round = function (player) {
        var ctx = TEXT_AREA.getContext("2d");
        ctx.clearRect(0, 0, TEXT_AREA.width, TEXT_AREA.height);
        var icon = new Image();
        icon.src = './assets/characters/icons/' + (player.playerCharacter + 1) + '.png';
        icon.onload = function () {
            ctx.drawImage(icon, 700, 0);
            ctx.fillStyle = '#fff';
            ctx.font = '10pt C64';
            ctx.fillText(player.playerName, 100, 30);
            ctx.fillText("IT'S YOUR TURN !", 100, 50);
            ctx.fillText('HOLD SPACE BAR TO ROLL', 100, 70);
        };
    };
    /**
     * Function ending game
     */
    Game.prototype.endGame = function () {
    };
    return Game;
}());
export default Game;
