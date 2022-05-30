var Player = /** @class */ (function () {
    function Player() {
        this.playerName = '';
        this._clueCode = '';
        this.playerCharacter = null;
        this.diceRoll_result = null;
        this.currentPosition = 0;
    }
    Player.prototype.clueCode = function (value) {
        this._clueCode = value;
    };
    Player.prototype.clueCodeGet = function () {
        return this._clueCode;
    };
    return Player;
}());
export default Player;
