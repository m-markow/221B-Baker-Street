import Player from "./Player.js";

const CANVAS: HTMLCanvasElement | null = document.querySelector('#canva');
const TEXT_AREA: HTMLCanvasElement | null = document.querySelector('#text_area');

export default class Game{

    protected players_board: Array<Player>;
    public coded_clues: boolean;
    public case: number;

    constructor(players_board: Array<Player>, coded_clues: boolean, choosed_case: number) {
        this.players_board = players_board;
        this.coded_clues = coded_clues;
        this.case = choosed_case;
        this.startGame();
    }

    /**
     * Function starting game
     */
    startGame()
    {
        let ctx = CANVAS!.getContext("2d");
        let img = document.querySelector('#img') as HTMLImageElement;
        img.src = './assets/map.png';
        img.onload = ()=> {
            ctx!.clearRect(0, 0, CANVAS!.width, CANVAS!.height);
            ctx!.drawImage(img, 0, -540);
            /** Spawn players */
            for(let i = 0; i < this.players_board.length; i++)
            {
                this.players_board[i].spawn();
            }
            this.next_round(this.players_board[0]);
        }

    }

    next_round(player: Player)
    {
        let ctx = TEXT_AREA!.getContext("2d");
        ctx!.clearRect(0,0,TEXT_AREA!.width, TEXT_AREA!.height);
        let icon = new Image();
        icon.src = './assets/characters/icons/'+(player.playerCharacter! + 1) + '.png';
        icon.onload = ()=>{
            ctx!.drawImage(icon, 700, 0);
            ctx!.fillStyle = '#fff';
            ctx!.font = '10pt C64';
            ctx!.fillText(player.playerName, 100,30);
            ctx!.fillText("IT'S YOUR TURN !", 100, 50);
            ctx!.fillText('HOLD SPACE BAR TO ROLL', 100, 70);
        }

    }

    /**
     * Function ending game
     */
    endGame()
    {

    }
}