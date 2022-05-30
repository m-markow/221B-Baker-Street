export default class Player
{
    public playerName: string = '';
    private _clueCode: string = '';
    public playerCharacter: number | null = null;
    public diceRoll_result: number | null = null;
    protected currentPosition: number = 0;


    clueCode(value: string) {
        this._clueCode = value;
    }

    clueCodeGet(): string {
        return this._clueCode;
    }
}