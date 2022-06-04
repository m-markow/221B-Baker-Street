import { clues } from "./data_tools/Clue.js";
import { hint_code } from "./data_tools/HintCodeSystem.js";
var getKeyValue = function (obj, key) { return obj[key]; };
var SCENE = document.querySelector('#place_scene');
var CANVAS = document.querySelector('#canva');
var TEXT_AREA = document.querySelector('#text_scene');
var extract = function (_a) {
    var beg = _a[0], end = _a[1];
    var matcher = new RegExp(beg + "(.*?)" + end, 'gm');
    var normalise = function (str) { return str.slice(beg.length, end.length * -1); };
    return function (str) {
        return str.match(matcher).map(normalise);
    };
};
var PlaceScene = /** @class */ (function () {
    function PlaceScene(location, coordinates, image, identificator) {
        this.player = null;
        this.coordinates = null;
        this.clue = 0;
        this.is_locked = false;
        this.current_visitor = null;
        this.game = null;
        this.location = location;
        this.coordinates = coordinates;
        this.image = image;
        this.identificator = identificator;
    }
    PlaceScene.prototype.show_scene = function (player_entering) {
        var _this = this;
        this.current_visitor = player_entering;
        var scene_ctx = SCENE.getContext('2d');
        var text_ctx = TEXT_AREA.getContext('2d');
        var bg_image = new Image();
        bg_image.src = this.image;
        bg_image.onload = function () {
            SCENE.style.zIndex = '10';
            scene_ctx.drawImage(bg_image, 0, 200);
            TEXT_AREA.width = TEXT_AREA.width;
            TEXT_AREA.style.zIndex = '2';
            //fill text
            var show_clues = function () {
                var values = clues[_this.clue]["places"][_this.identificator];
                player_entering.clues_seen.push(_this);
                // if (player_entering.clueCodeGet() != '') {
                var extracted = extract(['{{', '}}'])(values[0]);
                var result = [];
                for (var i = 0; i < extracted.length; i++) {
                    for (var j = 0; j < extracted[i].length; j++) {
                        var dupa = extracted[i].charAt(j);
                        dupa = hint_code["A"][dupa][0][parseInt(player_entering.clueCodeGet()[1]) - 1];
                        console.log(dupa);
                        result[i] = result[i] + dupa;
                    }
                }
                // for (let i = 0; i < result.length; i++) {
                //     result[i] = result[i].substring(9);
                // }
                console.log(result);
                //}else {
                text_ctx.fillStyle = '#fff';
                text_ctx.font = '15pt C64';
                text_ctx.fillText('You are in ' + _this.location, 250, 30);
                text_ctx.fillText(values[0], 200, 60);
                if (values[1])
                    text_ctx.fillText(values[1], 200, 90);
                text_ctx.fillText('Press "RETURN" to continue game.', 250, 150);
                document.addEventListener('keyup', enter_listen);
                //}
            };
            if (_this.identificator == '221B' && player_entering.has_badge) {
                _this.start_quiz();
            }
            else
                show_clues();
        };
        var enter_listen = function (e) {
            if (e.key == 'Enter') {
                document.removeEventListener('keyup', enter_listen);
                _this.end_scene();
            }
        };
    };
    PlaceScene.prototype.end_scene = function () {
        SCENE.style.zIndex = "-2";
        TEXT_AREA.width = TEXT_AREA.width;
        TEXT_AREA.style.zIndex = '-1';
        //set round for next player
        this.current_visitor.diceRoll_result = 0;
    };
    PlaceScene.prototype.start_quiz = function () {
        var _this = this;
        var user_answers = [];
        var current_question = 0;
        var text_ctx = TEXT_AREA.getContext('2d');
        text_ctx.fillStyle = '#fff';
        text_ctx.font = '15pt C64';
        text_ctx.fillText('You are in ' + this.location, 250, 30);
        text_ctx.fillText('Do you wish to solve the case? (Y/N)', 220, 150);
        var yn_listener = function (e) {
            if (e.key == 'y' || e.key == 'n') {
                if (e.key == 'y') {
                    show_questions();
                }
                else
                    _this.end_scene();
            }
        };
        document.addEventListener('keyup', yn_listener);
        var show_questions = function () {
            var _a;
            document.removeEventListener('keyup', yn_listener);
            text_ctx === null || text_ctx === void 0 ? void 0 : text_ctx.clearRect(0, 0, TEXT_AREA.width, TEXT_AREA.height);
            text_ctx.fillText('FOR YOUR EYES ONLY, ' + ((_a = _this.current_visitor) === null || _a === void 0 ? void 0 : _a.playerName), 250, 30);
            text_ctx.fillText('Press "RETURN" for quiz', 220, 150);
            var enter_listen = function (e) {
                if (e.key == 'Enter') {
                    document.removeEventListener('keyup', enter_listen);
                    killer_question();
                }
            };
            document.addEventListener('keyup', enter_listen);
            var number_listener = function (e) {
                if (parseInt(e.key) && parseInt(e.key) > 0 && parseInt(e.key) < 5) {
                    current_question++;
                    user_answers.push(parseInt(e.key));
                    switch (current_question) {
                        case 1:
                            weapon_question();
                            break;
                        case 2:
                            motive_question();
                            break;
                        case 3:
                            end_quiz();
                            break;
                    }
                }
            };
            var killer_question = function () {
                text_ctx === null || text_ctx === void 0 ? void 0 : text_ctx.clearRect(0, 0, TEXT_AREA.width, TEXT_AREA.height);
                var values = clues[_this.clue]["quiz"]["0"];
                text_ctx.fillText('KILLER', 100, 20);
                for (var i = 0; i < values.length; i++) {
                    text_ctx.fillText(i + '. ' + values[i], 100, 50 + 30 * i);
                }
                text_ctx.fillText('Enter number: ', 100, 170);
                document.addEventListener('keyup', number_listener);
            };
            var weapon_question = function () {
                text_ctx === null || text_ctx === void 0 ? void 0 : text_ctx.clearRect(0, 0, TEXT_AREA.width, TEXT_AREA.height);
                var values = clues[_this.clue]["quiz"]["1"];
                text_ctx.fillText('WEAPON', 100, 20);
                for (var i = 0; i < values.length; i++) {
                    text_ctx.fillText(i + '. ' + values[i], 100, 50 + 30 * i);
                }
                text_ctx.fillText('Enter number: ', 100, 170);
            };
            var motive_question = function () {
                text_ctx === null || text_ctx === void 0 ? void 0 : text_ctx.clearRect(0, 0, TEXT_AREA.width, TEXT_AREA.height);
                var values = clues[_this.clue]["quiz"]["3"];
                text_ctx.fillText('MOTIVE', 100, 20);
                for (var i = 0; i < values.length; i++) {
                    text_ctx.fillText(i + '. ' + values[i], 100, 50 + 30 * i);
                }
                text_ctx.fillText('Enter number: ', 100, 170);
            };
            var enter_explanation = function (e) {
                if (e.key == 'Enter') {
                    show_explanation();
                }
            };
            var exit_quiz = function (e) {
                if (e.key == 'Enter') {
                    document.removeEventListener('keyup', exit_quiz);
                    _this.end_scene();
                }
            };
            var end_quiz = function () {
                document.removeEventListener('keyup', number_listener);
                var values = clues[_this.clue]["answers"];
                var difference = 0;
                for (var i = 0; i < values.length; i++) {
                    if (values[i] !== user_answers[i])
                        difference++;
                }
                if (difference == 0) {
                    //end game
                    text_ctx === null || text_ctx === void 0 ? void 0 : text_ctx.clearRect(0, 0, TEXT_AREA.width, TEXT_AREA.height);
                    text_ctx.fillText('You are absolutely correct!', 250, 30);
                    text_ctx.fillText('Press "RETURN" for explanation.', 220, 150);
                    document.addEventListener('keyup', enter_explanation);
                }
                else {
                    //end scene
                    text_ctx === null || text_ctx === void 0 ? void 0 : text_ctx.clearRect(0, 0, TEXT_AREA.width, TEXT_AREA.height);
                    text_ctx.fillText('You have ' + difference + ' incorrect answer(s)', 250, 30);
                    text_ctx.fillText('Press "RETURN" for continue.', 220, 150);
                    document.addEventListener('keyup', exit_quiz);
                }
            };
            var show_explanation = function () {
                document.removeEventListener('keyup', enter_explanation);
                SCENE.width = SCENE.width;
                var explanation_canvas = document.querySelector('#explanation_canvas');
                explanation_canvas.style.zIndex = '15';
                var exp_ctx = explanation_canvas === null || explanation_canvas === void 0 ? void 0 : explanation_canvas.getContext('2d');
                text_ctx === null || text_ctx === void 0 ? void 0 : text_ctx.clearRect(0, 0, TEXT_AREA.width, TEXT_AREA.height);
                exp_ctx.fillStyle = '#fff';
                exp_ctx.font = '13pt C64';
                var values = clues[_this.clue]["explenation"];
                for (var i = 0; i < values.length; i++) {
                    exp_ctx.fillText(values[i], 0, 50 + 20 * i);
                }
                exp_ctx.fillText('Press "RETURN" to continue.', 220, 400);
            };
        };
    };
    return PlaceScene;
}());
export default PlaceScene;
