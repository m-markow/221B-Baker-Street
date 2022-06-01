const CANVAS: HTMLCanvasElement | null = document.querySelector('#canva');

// left-bottom corner [40, 450]
// each next +-125px (OX) (right/left)
// each next +-50px (OX) +-55px (OY) (up/down) |
const forbidden_positions = [
    //221B
    [85, 395], [210, 395], [335, 395],
    [385, 340], [435 ,285], [485, 230],
    [360, 230], [235, 230]
];

export default class Player
{
    public playerName: string = '';
    private _clueCode: string = '';
    public playerCharacter: number | null = null;
    public diceRoll_result: number | null = null;
    protected currentPosition: Array<number> = [160, 450]; // default spawn position [160, 450]
    protected position_row_col: Array<number> = [0, 1]; // default spawn position [0, 1]
    public canvas: HTMLCanvasElement | null = null;


    clueCode(value: string) {
        this._clueCode = value;
    }

    clueCodeGet(): string {
        return this._clueCode;
    }

    spawn()
    {
        //create canvas
        let canvas = document.createElement('canvas');
        canvas.style.zIndex = String(this.playerCharacter! + 1);
        canvas.style.background = 'transparent';
        canvas.width = 1000;
        canvas.height = 540;
        document.querySelector('#game')!.appendChild(canvas);
        this.canvas = canvas;


        let ctx = this.canvas!.getContext("2d") as CanvasRenderingContext2D;
        let character = new Image();
        character.src = './assets/characters/'+(this.playerCharacter! + 1)+'_right.png';
        character.onload = ()=>{
            ctx!.drawImage(character, this.currentPosition[0], this.currentPosition[1]);
        }

        const move_listener = (e: KeyboardEvent)=>{
            switch (e.key) {
                case "ArrowLeft":
                    this.move_left();
                    break;
                case "ArrowRight":
                    this.move_right();
                    break;
                case "ArrowUp":
                    this.move_up();
                    break;
                case "ArrowDown":
                    this.move_down();
                    break;
            }
        }

        document.addEventListener('keyup', move_listener);
    }

    check_if_forbidden(x: number, y: number): boolean
    {
        let result = true;
        for (let i = 0; i < forbidden_positions.length; i++) {
            if(forbidden_positions[i][0] == x && forbidden_positions[i][1] == y) result = false;
        }
        return result;
    }

    move_up()
    {
        if (this.check_if_forbidden(this.currentPosition[0] + 50, this.currentPosition[1] - 55)){
            let ctx = this.canvas!.getContext("2d") as CanvasRenderingContext2D;
            ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
            this.currentPosition[0] += 50;
            this.currentPosition[1] -= 55;
            let character = new Image();
            character.src = './assets/characters/'+(this.playerCharacter! + 1)+'_up.png';
            character.onload = ()=>{
                ctx!.drawImage(character, this.currentPosition[0], this.currentPosition[1]);
                this.position_row_col[0] += 1;
            }
        }

    }

    move_down() {
        if (this.check_if_forbidden(this.currentPosition[0] - 50, this.currentPosition[1] + 55)) {
            let ctx = this.canvas!.getContext("2d") as CanvasRenderingContext2D;
            ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
            this.currentPosition[0] -= 50;
            this.currentPosition[1] += 55;
            let character = new Image();
            character.src = './assets/characters/' + (this.playerCharacter! + 1) + '_down.png';
            character.onload = () => {
                ctx!.drawImage(character, this.currentPosition[0], this.currentPosition[1]);
                this.position_row_col[0] -= 1;
            }
        }
    }

    move_left() {
        if (this.check_if_forbidden(this.currentPosition[0] - 125, this.currentPosition[1])) {
            let ctx = this.canvas!.getContext("2d") as CanvasRenderingContext2D;
            ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
            this.currentPosition[0] -= 125;
            let character = new Image();
            character.src = './assets/characters/' + (this.playerCharacter! + 1) + '_left.png';
            character.onload = () => {
                ctx!.drawImage(character, this.currentPosition[0], this.currentPosition[1]);
                this.position_row_col[1] -= 1;
            }
        }
    }

    move_right() {
        if (this.check_if_forbidden(this.currentPosition[0] + 125, this.currentPosition[1])) {
            let ctx = this.canvas!.getContext("2d") as CanvasRenderingContext2D;
            ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
            this.currentPosition[0] += 125;
            let character = new Image();
            character.src = './assets/characters/' + (this.playerCharacter! + 1) + '_right.png';
            character.onload = () => {
                ctx!.drawImage(character, this.currentPosition[0], this.currentPosition[1]);
                this.position_row_col[1] += 1;
            }
        }
    }

}