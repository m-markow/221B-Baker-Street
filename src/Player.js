var CANVAS = document.querySelector('#canva');
var main_context = CANVAS.getContext('2d');
import { forbidden_positions, map_edges } from "./data_tools/ForbiddenPositions.js";
import { map_parts_management } from "./data_tools/MapPartsManagement.js";
// left-bottom corner [35, 450]
// each next +-125px (OX) (right/left)
// each next +-50px (OX) +-55px (OY) (up/down) |
var Player = /** @class */ (function () {
    function Player() {
        this.playerName = '';
        this._clueCode = '';
        this.playerCharacter = null;
        this.currentPosition = [160, 450]; // default spawn position [160, 450]
        this.position_row_col = [0, 1]; // default spawn position [0, 1]
        this.canvas = null;
        this.map_segment = [0, -540];
        this.forbidden_pos_coefficient = [0, 0];
        this.diceRoll_result = null;
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
    };
    /**
     * Function enables or disables moves of player
     * @param is_allowed - boolean indicating whether move is allowed or not
     * @param dice_roll_result - roll result
     */
    Player.prototype.allowMove = function (is_allowed, dice_roll_result) {
        var _this = this;
        console.log(dice_roll_result);
        if (dice_roll_result !== null)
            this.diceRoll_result = dice_roll_result;
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
        if (is_allowed) {
            this.move_handler = move_listener.bind(this);
            document.addEventListener('keyup', this.move_handler);
        }
        else
            document.removeEventListener('keyup', this.move_handler);
    };
    Player.prototype.check_moves = function () {
        return this.diceRoll_result > 0;
    };
    /**
     * Function check whether user try to step out from board or onto building
     * @param x - x coordinate
     * @param y - y coordinate
     */
    Player.prototype.check_if_forbidden = function (x, y) {
        var result = true;
        for (var i = 0; i < forbidden_positions.length; i++) {
            if (forbidden_positions[i][0] + this.forbidden_pos_coefficient[0] == x && forbidden_positions[i][1] + this.forbidden_pos_coefficient[1] == y)
                result = false;
        }
        for (var i = 0; i < map_edges.length; i++) {
            if (map_edges[i][0] + this.forbidden_pos_coefficient[0] == x && map_edges[i][1] + this.forbidden_pos_coefficient[1] == y)
                result = false;
        }
        return result;
    };
    Player.prototype.move_up = function () {
        var _this = this;
        if (this.check_if_forbidden(this.currentPosition[0] + 50, this.currentPosition[1] - 55)) {
            this.diceRoll_result--;
            var ctx_1 = this.canvas.getContext("2d");
            ctx_1.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.currentPosition[0] += 50;
            this.currentPosition[1] -= 55;
            var character_1 = new Image();
            character_1.src = './assets/characters/' + (this.playerCharacter + 1) + '_up.png';
            character_1.onload = function () {
                ctx_1.drawImage(character_1, _this.currentPosition[0], _this.currentPosition[1]);
                _this.position_row_col[0] += 1;
                var _loop_1 = function (i) {
                    if (map_parts_management.up[i][0] + _this.forbidden_pos_coefficient[0] == _this.currentPosition[0] && map_parts_management.up[i][1] + _this.forbidden_pos_coefficient[1] == _this.currentPosition[1]) {
                        var new_map_segment_1 = new Image();
                        new_map_segment_1.src = './assets/map.png';
                        new_map_segment_1.onload = function () {
                            main_context.clearRect(0, 0, CANVAS.width, CANVAS.height);
                            _this.map_segment[0] -= 420;
                            _this.map_segment[1] += 300;
                            main_context.drawImage(new_map_segment_1, _this.map_segment[0], _this.map_segment[1]);
                            ctx_1.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
                            _this.currentPosition[0] -= 420;
                            _this.currentPosition[1] += 300;
                            _this.forbidden_pos_coefficient[0] -= 420;
                            _this.forbidden_pos_coefficient[1] += 300;
                            ctx_1.drawImage(character_1, _this.currentPosition[0], _this.currentPosition[1]);
                        };
                    }
                };
                for (var i = 0; i < map_parts_management.up.length; i++) {
                    _loop_1(i);
                }
            };
        }
    };
    Player.prototype.move_down = function () {
        var _this = this;
        if (this.check_if_forbidden(this.currentPosition[0] - 50, this.currentPosition[1] + 55)) {
            this.diceRoll_result--;
            var ctx_2 = this.canvas.getContext("2d");
            ctx_2.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.currentPosition[0] -= 50;
            this.currentPosition[1] += 55;
            var character_2 = new Image();
            character_2.src = './assets/characters/' + (this.playerCharacter + 1) + '_down.png';
            character_2.onload = function () {
                ctx_2.drawImage(character_2, _this.currentPosition[0], _this.currentPosition[1]);
                _this.position_row_col[0] -= 1;
                var _loop_2 = function (i) {
                    if (map_parts_management.down[i][0] + _this.forbidden_pos_coefficient[0] == _this.currentPosition[0] && map_parts_management.down[i][1] + _this.forbidden_pos_coefficient[1] == _this.currentPosition[1]) {
                        var new_map_segment_2 = new Image();
                        new_map_segment_2.src = './assets/map.png';
                        new_map_segment_2.onload = function () {
                            main_context.clearRect(0, 0, CANVAS.width, CANVAS.height);
                            _this.map_segment[0] += 420;
                            _this.map_segment[1] -= 300;
                            main_context.drawImage(new_map_segment_2, _this.map_segment[0], _this.map_segment[1]);
                            ctx_2.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
                            _this.currentPosition[0] += 420;
                            _this.currentPosition[1] -= 300;
                            _this.forbidden_pos_coefficient[0] += 420;
                            _this.forbidden_pos_coefficient[1] -= 300;
                            ctx_2.drawImage(character_2, _this.currentPosition[0], _this.currentPosition[1]);
                        };
                    }
                };
                for (var i = 0; i < map_parts_management.down.length; i++) {
                    _loop_2(i);
                }
            };
        }
    };
    Player.prototype.move_left = function () {
        var _this = this;
        if (this.check_if_forbidden(this.currentPosition[0] - 125, this.currentPosition[1])) {
            this.diceRoll_result--;
            var ctx_3 = this.canvas.getContext("2d");
            ctx_3.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.currentPosition[0] -= 125;
            var character_3 = new Image();
            character_3.src = './assets/characters/' + (this.playerCharacter + 1) + '_left.png';
            character_3.onload = function () {
                ctx_3.drawImage(character_3, _this.currentPosition[0], _this.currentPosition[1]);
                _this.position_row_col[1] -= 1;
                var _loop_3 = function (i) {
                    if (map_parts_management.left[i][0] + _this.forbidden_pos_coefficient[0] == _this.currentPosition[0] && map_parts_management.left[i][1] + _this.forbidden_pos_coefficient[1] == _this.currentPosition[1]) {
                        var new_map_segment_3 = new Image();
                        new_map_segment_3.src = './assets/map.png';
                        new_map_segment_3.onload = function () {
                            main_context.clearRect(0, 0, CANVAS.width, CANVAS.height);
                            _this.map_segment[0] += 1000;
                            main_context.drawImage(new_map_segment_3, _this.map_segment[0], _this.map_segment[1]);
                            ctx_3.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
                            _this.currentPosition[0] += 1000;
                            _this.forbidden_pos_coefficient[0] += 1000;
                            ctx_3.drawImage(character_3, _this.currentPosition[0], _this.currentPosition[1]);
                        };
                    }
                };
                for (var i = 0; i < map_parts_management.left.length; i++) {
                    _loop_3(i);
                }
            };
        }
    };
    Player.prototype.move_right = function () {
        var _this = this;
        if (this.check_if_forbidden(this.currentPosition[0] + 125, this.currentPosition[1])) {
            this.diceRoll_result--;
            var ctx_4 = this.canvas.getContext("2d");
            ctx_4.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.currentPosition[0] += 125;
            var character_4 = new Image();
            character_4.src = './assets/characters/' + (this.playerCharacter + 1) + '_right.png';
            character_4.onload = function () {
                ctx_4.drawImage(character_4, _this.currentPosition[0], _this.currentPosition[1]);
                _this.position_row_col[1] += 1;
                var _loop_4 = function (i) {
                    if (map_parts_management.right[i][0] + _this.forbidden_pos_coefficient[0] == _this.currentPosition[0] && map_parts_management.right[i][1] + _this.forbidden_pos_coefficient[1] == _this.currentPosition[1]) {
                        var new_map_segment_4 = new Image();
                        new_map_segment_4.src = './assets/map.png';
                        new_map_segment_4.onload = function () {
                            main_context.clearRect(0, 0, CANVAS.width, CANVAS.height);
                            _this.map_segment[0] -= 1000;
                            main_context.drawImage(new_map_segment_4, _this.map_segment[0], _this.map_segment[1]);
                            ctx_4.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
                            _this.currentPosition[0] -= 1000;
                            _this.forbidden_pos_coefficient[0] -= 1000;
                            ctx_4.drawImage(character_4, _this.currentPosition[0], _this.currentPosition[1]);
                        };
                    }
                };
                for (var i = 0; i < map_parts_management.right.length; i++) {
                    _loop_4(i);
                }
            };
        }
    };
    return Player;
}());
export default Player;
