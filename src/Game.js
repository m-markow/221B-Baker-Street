var CANVAS = document.querySelector('#canva');
var TEXT_AREA = document.querySelector('#text_area');
var Game = /** @class */ (function () {
    function Game(players_board, coded_clues, choosed_case) {
        this.diceRoll_result = null;
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
            _this.next_round(_this.players_board[0], 0);
        };
    };
    Game.prototype.next_round = function (player, player_number) {
        var _this = this;
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
            var dice_border = new Image();
            dice_border.src = './assets/dice_border.png';
            dice_border.onload = function () {
                ctx.drawImage(dice_border, 450, 20);
            };
            var key = new Image();
            key.src = './assets/key.png';
            key.onload = function () {
                ctx.drawImage(key, 110, 90, 20, 20);
            };
            document.addEventListener('keydown', dice_roll);
            document.addEventListener('keyup', end_dice_roll);
        };
        var dice_roll = function (e) {
            if (e.key == ' ' || e.code == 'Space') {
                ctx.clearRect(475, 45, 40, 30);
                _this.diceRoll_result = Math.floor(Math.random() * 6) + 1;
                ctx.font = '20pt C64';
                ctx.fillText(String(_this.diceRoll_result), 485, 75);
            }
        };
        var end_dice_roll = function (e) {
            if (e.key == '' || e.code == 'Space') {
                document.removeEventListener('keydown', dice_roll);
                document.removeEventListener('keyup', end_dice_roll);
                player.allowMove(true, _this.diceRoll_result);
                //change text on left bottom corner
                ctx.clearRect(80, 0, 300, 70);
                ctx.font = '10pt C64';
                ctx.fillText(player.playerName, 100, 30);
                ctx.fillText("MOVES MADE: 0", 100, 50);
                var check_moves_1 = function () {
                    if (!player.check_moves()) {
                        player.allowMove(false, null);
                        if (player_number + 1 <= _this.players_board.length - 1) {
                            console.log('nastepny');
                            _this.next_round(_this.players_board[player_number++], player_number++);
                        }
                        else {
                            console.log('ten sam');
                            _this.next_round(_this.players_board[player_number], player_number);
                        }
                    }
                    else
                        window.setTimeout(check_moves_1, 100);
                };
                check_moves_1();
            }
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
