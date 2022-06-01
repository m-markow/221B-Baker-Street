var CANVAS = document.querySelector('#canva');
// left-bottom corner [40, 450]
// each next +-125px (OX) (right/left)
// each next +-50px (OX) +-55px (OY) (up/down) |
var forbidden_positions = [
    //221B
    [85, 395], [210, 395], [335, 395],
    [385, 340], [435, 285], [485, 230],
    [360, 230], [235, 230]
];
var Player = /** @class */ (function () {
    function Player() {
        this.playerName = '';
        this._clueCode = '';
        this.playerCharacter = null;
        this.diceRoll_result = null;
        this.currentPosition = [160, 450]; // default spawn position [160, 450]
        this.position_row_col = [0, 1]; // default spawn position [0, 1]
        this.canvas = null;
    }
    Player.prototype.clueCode = function (value) {
        this._clueCode = value;
    };
    Player.prototype.clueCodeGet = function () {
        return this._clueCode;
    };
    Player.prototype.spawn = function () {
        var _this = this;
        //create canvas
        var canvas = document.createElement('canvas');
        canvas.style.zIndex = String(this.playerCharacter + 1);
        canvas.style.background = 'transparent';
        canvas.width = 1000;
        canvas.height = 540;
        document.querySelector('#game').appendChild(canvas);
        this.canvas = canvas;
        var ctx = this.canvas.getContext("2d");
        var character = new Image();
        character.src = './assets/characters/' + (this.playerCharacter + 1) + '_right.png';
        character.onload = function () {
            ctx.drawImage(character, _this.currentPosition[0], _this.currentPosition[1]);
        };
        var move_listener = function (e) {
            switch (e.key) {
                case "ArrowLeft":
                    _this.move_left();
                    break;
                case "ArrowRight":
                    _this.move_right();
                    break;
                case "ArrowUp":
                    _this.move_up();
                    break;
                case "ArrowDown":
                    _this.move_down();
                    break;
            }
        };
        document.addEventListener('keyup', move_listener);
    };
    Player.prototype.check_if_forbidden = function (x, y) {
        var result = true;
        for (var i = 0; i < forbidden_positions.length; i++) {
            if (forbidden_positions[i][0] == x && forbidden_positions[i][1] == y)
                result = false;
        }
        return result;
    };
    Player.prototype.move_up = function () {
        var _this = this;
        if (this.check_if_forbidden(this.currentPosition[0] + 50, this.currentPosition[1] - 55)) {
            var ctx_1 = this.canvas.getContext("2d");
            ctx_1.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.currentPosition[0] += 50;
            this.currentPosition[1] -= 55;
            var character_1 = new Image();
            character_1.src = './assets/characters/' + (this.playerCharacter + 1) + '_up.png';
            character_1.onload = function () {
                ctx_1.drawImage(character_1, _this.currentPosition[0], _this.currentPosition[1]);
                _this.position_row_col[0] += 1;
            };
        }
    };
    Player.prototype.move_down = function () {
        var _this = this;
        if (this.check_if_forbidden(this.currentPosition[0] - 50, this.currentPosition[1] + 55)) {
            var ctx_2 = this.canvas.getContext("2d");
            ctx_2.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.currentPosition[0] -= 50;
            this.currentPosition[1] += 55;
            var character_2 = new Image();
            character_2.src = './assets/characters/' + (this.playerCharacter + 1) + '_down.png';
            character_2.onload = function () {
                ctx_2.drawImage(character_2, _this.currentPosition[0], _this.currentPosition[1]);
                _this.position_row_col[0] -= 1;
            };
        }
    };
    Player.prototype.move_left = function () {
        var _this = this;
        if (this.check_if_forbidden(this.currentPosition[0] - 125, this.currentPosition[1])) {
            var ctx_3 = this.canvas.getContext("2d");
            ctx_3.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.currentPosition[0] -= 125;
            var character_3 = new Image();
            character_3.src = './assets/characters/' + (this.playerCharacter + 1) + '_left.png';
            character_3.onload = function () {
                ctx_3.drawImage(character_3, _this.currentPosition[0], _this.currentPosition[1]);
                _this.position_row_col[1] -= 1;
            };
        }
    };
    Player.prototype.move_right = function () {
        var _this = this;
        if (this.check_if_forbidden(this.currentPosition[0] + 125, this.currentPosition[1])) {
            var ctx_4 = this.canvas.getContext("2d");
            ctx_4.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.currentPosition[0] += 125;
            var character_4 = new Image();
            character_4.src = './assets/characters/' + (this.playerCharacter + 1) + '_right.png';
            character_4.onload = function () {
                ctx_4.drawImage(character_4, _this.currentPosition[0], _this.currentPosition[1]);
                _this.position_row_col[1] += 1;
            };
        }
    };
    return Player;
}());
export default Player;
