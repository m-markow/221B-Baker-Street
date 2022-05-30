import Player from "./Player.js";
var CANVAS = document.querySelector('#canva');
var Board = /** @class */ (function () {
    function Board() {
        this.playersBoard = [];
        this.coded_clues = false;
        this.case = 0;
        this.playersNumber = 0;
        this.init();
    }
    /**
     * Function initialising game - all of init images
     */
    Board.prototype.init = function () {
        // let img = document.querySelector('#img') as HTMLImageElement;
        // window.setTimeout(()=>{
        //     img.src = './assets/init/init1.png';
        // }, 5000);
        // window.setTimeout(()=>{
        //     img.src = './assets/init/init2.png';
        // }, 10000);
        this.config();
    };
    /**
     * Function is setting all available options that user can set up
     */
    Board.prototype.config = function () {
        var _this = this;
        var KeyPress_playersNumber = function (x, y, context) {
            // @ts-ignore
            if (parseInt(event.key) && parseInt(event.key) > 0 && parseInt(event.key) < 5) {
                _this.playersNumber = parseInt(event.key);
                context === null || context === void 0 ? void 0 : context.fillText(event.key, x, y);
                playerNames();
            }
        };
        var ctx = CANVAS.getContext("2d");
        var img = document.querySelector('#img');
        var eventHandler = KeyPress_playersNumber.bind(this, 800, 216, ctx);
        window.setTimeout(function () {
            document.querySelector('#config').style.display = 'none';
            document.querySelector('#game').style.display = 'flex';
            img.src = './assets/config/config0.png';
            img.onload = function () {
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, 0, 0, img.width / 1.5, img.height / 1.5);
                ctx.font = '15pt C64';
                ctx.fillStyle = '#AE8E81';
                window.addEventListener('keypress', eventHandler);
            };
        }, //15000
        1);
        var setPlayerName = function (value, player) {
            player.playerName = value;
        };
        var input_array = [];
        var playerNames = function () {
            window.removeEventListener('keypress', eventHandler);
            img.src = './assets/config/playerName.png';
            var enterListen = function () {
                if (event.keyCode === 13) {
                    var result = true;
                    for (var i = 1; i <= _this.playersNumber; i++) {
                        if (_this.playersBoard[i - 1].playerName == '')
                            result = false;
                        //console.log(this.playersBoard[i - 1].playerName);
                    }
                    if (result) {
                        choose_clues();
                        window.removeEventListener('keypress', enterListen);
                    }
                }
            };
            img.onload = function () {
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, 150, 230, img.width / 1.5, img.height / 1.5);
                var _loop_1 = function (i) {
                    if (i === 1) {
                        _this.playersBoard.push(new Player());
                        ctx.fillText('First:', 330, 350);
                        // @ts-ignore
                        var input_1_1 = new CanvasInput({
                            canvas: CANVAS,
                            fontSize: 15,
                            fontFamily: 'C64',
                            x: 450,
                            y: 330,
                            borderColor: 'transparent',
                            borderWidth: 0,
                            onkeyup: function () {
                                setPlayerName(input_1_1.value().toUpperCase(), _this.playersBoard[0]);
                            }
                        });
                        input_array.push(input_1_1);
                    }
                    else if (i === 2) {
                        ctx.fillText('Second:', 330, 390);
                        _this.playersBoard.push(new Player());
                        // @ts-ignore
                        var input_2_1 = new CanvasInput({
                            canvas: CANVAS,
                            fontSize: 15,
                            fontFamily: 'C64',
                            x: 450,
                            y: 370,
                            borderColor: 'transparent',
                            borderWidth: 0,
                            onkeyup: function () {
                                setPlayerName(input_2_1.value().toUpperCase(), _this.playersBoard[1]);
                            }
                        });
                        input_array.push(input_2_1);
                    }
                    else if (i === 3) {
                        ctx.fillText('Third:', 330, 430);
                        _this.playersBoard.push(new Player());
                        // @ts-ignore
                        var input_3_1 = new CanvasInput({
                            canvas: CANVAS,
                            fontSize: 15,
                            fontFamily: 'C64',
                            x: 450,
                            y: 410,
                            borderColor: 'transparent',
                            borderWidth: 0,
                            onkeyup: function () {
                                setPlayerName(input_3_1.value().toUpperCase(), _this.playersBoard[2]);
                            }
                        });
                        input_array.push(input_3_1);
                    }
                    else if (i === 4) {
                        ctx.fillText('Fourth:', 330, 470);
                        _this.playersBoard.push(new Player());
                        // @ts-ignore
                        var input_4_1 = new CanvasInput({
                            canvas: CANVAS,
                            fontSize: 15,
                            fontFamily: 'C64',
                            x: 450,
                            y: 450,
                            borderColor: 'transparent',
                            borderWidth: 0,
                            onkeyup: function () {
                                setPlayerName(input_4_1.value().toUpperCase(), _this.playersBoard[3]);
                            }
                        });
                        input_array.push(input_4_1);
                    }
                };
                for (var i = 1; i <= _this.playersNumber; i++) {
                    _loop_1(i);
                }
                window.addEventListener('keypress', enterListen);
            };
        };
        var choose_clues = function () {
            for (var i = 0; i < input_array.length; i++) {
                input_array[i].destroy();
            }
            var yn_listen = function (x, y) {
                if (event.key == 'y' || event.key == 'n') {
                    ctx.fillText(event.key.toUpperCase(), x, y);
                    if (event.key == 'y') {
                        _this.coded_clues = true;
                        clues_assignment();
                    }
                    else
                        choose_characters();
                }
            };
            var ynHandler = yn_listen.bind(_this, 800, 260);
            var clues_assignment = function () {
                window.removeEventListener('keypress', ynHandler);
                var code_array = ['A', 'B', 'C', 'D'];
                var showClueCode = function (i) {
                    _this.playersBoard[i].clueCode(code_array[Math.floor(Math.random() * code_array.length)] + (Math.floor(Math.random() * 5) + 1));
                    //console.log(this.playersBoard[i].clueCodeGet());
                    img.src = './assets/config/empty.png';
                    img.onload = function () {
                        ctx.drawImage(img, 0, 0, img.width / 1.2, img.height / 1.2);
                        ctx.fillText('CODED CLUE ASSIGNMENT', 300, 150);
                        ctx.fillText('FOR YOUR EYES ONLY, ' + _this.playersBoard[i].playerName, 200, 300);
                        ctx.fillText('PRESS "RETURN" WHEN READY', 200, 340);
                        var clicked_1 = function (e) {
                            if (e.keyCode === 13) {
                                ctx.fillText('YOUR CODE NUMBER IS: ' + _this.playersBoard[i].clueCodeGet(), 200, 370);
                                ctx.fillText('PRESS "RETURN" TO CONTINUE', 300, 420);
                                document.addEventListener("keyup", clicked_2);
                            }
                        };
                        var clicked_2 = function (e) {
                            if (e.keyCode === 13 && (i + 1) < _this.playersBoard.length) {
                                showClueCode(i + 1);
                            }
                            else
                                choose_characters();
                            document.removeEventListener('keyup', clicked_1);
                            document.removeEventListener('keyup', clicked_2);
                        };
                        document.addEventListener("keyup", clicked_1);
                    };
                };
                showClueCode(0);
            };
            img.src = './assets/config/empty.png';
            img.onload = function () {
                ctx.drawImage(img, 0, 0, img.width / 1.2, img.height / 1.2);
                img.src = './assets/config/clues.png';
                img.onload = function () {
                    ctx.drawImage(img, 180, 230, img.width / 1.5, img.height / 1.5);
                    window.addEventListener('keypress', ynHandler);
                };
            };
        };
        var choose_characters = function () {
            var characters_array = [100, 210, 320, 430];
            img.src = './assets/config/config3.png';
            img.onload = function () {
                ctx.drawImage(img, 50, 0, img.width / 1.1, 540);
                var select_eachCharacter = function (i) {
                    ctx.fillStyle = '#000';
                    ctx.fillRect(200, 50, 540, 25);
                    ctx.fillStyle = '#fff';
                    ctx.fillText(_this.playersBoard[i].playerName + ', SELECT 1, 2, 3 OR 4', 200, 70);
                    var clicked_1 = function (e) {
                        if (parseInt(e.key) && parseInt(e.key) <= 4) {
                            var is_free = true;
                            for (var j = 0; j < _this.playersBoard.length; j++) {
                                if (_this.playersBoard[j].playerCharacter === parseInt(e.key) - 1)
                                    is_free = false;
                            }
                            if (is_free) {
                                ctx.fillText(_this.playersBoard[i].playerName + ' - ', 100, characters_array[parseInt(e.key) - 1]);
                                ctx.fillText('YOU WILL REPRESENT', 100, characters_array[parseInt(e.key) - 1] + 30);
                                _this.playersBoard[i].playerCharacter = parseInt(e.key) - 1;
                                nextCharacter(i);
                            }
                        }
                    };
                    document.addEventListener('keyup', clicked_1);
                    var clicked_2 = function (e) {
                        if (e.keyCode === 13) {
                            document.removeEventListener('keyup', clicked_1);
                            document.removeEventListener('keyup', clicked_2);
                            choose_case();
                        }
                    };
                    var nextCharacter = function (i) {
                        document.removeEventListener('keyup', clicked_1);
                        if ((i + 1) < _this.playersBoard.length)
                            select_eachCharacter(i + 1);
                        else {
                            ctx.fillStyle = '#000';
                            ctx.fillRect(200, 50, 540, 25);
                            ctx.fillStyle = '#fff';
                            ctx.fillText('PRESS "RETURN" TO CONTINUE', 200, 70);
                            document.addEventListener('keyup', clicked_2);
                        }
                    };
                };
                select_eachCharacter(0);
            };
        };
        var choose_case = function () {
            img.src = './assets/config/config4.png';
            img.onload = function () {
                ctx.drawImage(img, -30, -200, img.width, img.width / 1.2);
                ctx.fillStyle = '#AE8E81';
                var setCase = function (val) {
                    _this.case = parseInt(val);
                };
                // @ts-ignore
                var input = new CanvasInput({
                    canvas: CANVAS,
                    fontSize: 15,
                    fontFamily: 'C64',
                    x: 600,
                    y: 510,
                    borderColor: 'transparent',
                    borderWidth: 0,
                    width: 60,
                    onkeyup: function () {
                        setCase(input.value().toUpperCase());
                    }
                });
                var click = function (e) {
                    if (e.keyCode === 13) {
                        document.removeEventListener('keyup', click);
                        input.destroy();
                        _this.startGame();
                    }
                };
                document.addEventListener('keyup', click);
            };
        };
    };
    /**
     * Function starting game
     */
    Board.prototype.startGame = function () {
        console.log(this.case);
        var ctx = CANVAS.getContext("2d");
        var img = document.querySelector('#img');
        img.src = './assets/map.png';
        img.onload = function () {
            ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
            ctx.drawImage(img, 0, -540);
        };
    };
    return Board;
}());
export default Board;
