import Player from "./Player.js";

const CANVAS: HTMLCanvasElement | null = document.querySelector('#canva');
const TEXT_AREA: HTMLCanvasElement | null = document.querySelector('#text_area');

export default class Game{

    protected players_board: Array<Player>;
    public coded_clues: boolean;
    public case: number;
    public diceRoll_result: number | null = null;

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
            this.next_round(this.players_board[0], 0);
        }

    }

    next_round(player: Player, player_number: number)
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
            let dice_border = new Image()
            dice_border.src = './assets/dice_border.png';
            dice_border.onload = ()=>{
                ctx!.drawImage(dice_border, 450, 20);
            }

            let key = new Image();
            key.src = './assets/key.png';
            key.onload = ()=>{
                ctx!.drawImage(key, 110, 90, 20, 20);
            }

            document.addEventListener('keydown', dice_roll);
            document.addEventListener('keyup', end_dice_roll);
        }



        const dice_roll = (e: KeyboardEvent)=>
        {
            if (e.key == ' ' || e.code == 'Space')
            {
                ctx!.clearRect(475, 45, 40, 30)
                this.diceRoll_result = Math.floor(Math.random() * 6) + 1;
                ctx!.font = '20pt C64'
                ctx!.fillText(String(this.diceRoll_result), 485, 75);
            }
        }

        const end_dice_roll = (e: KeyboardEvent)=> {
            if (e.key == '' || e.code == 'Space') {
                document.removeEventListener('keydown', dice_roll);
                document.removeEventListener('keyup', end_dice_roll);
                player.allowMove(true, this.diceRoll_result!);

                //change text on left bottom corner
                ctx!.clearRect(80, 0, 300, 70);
                ctx!.font = '10pt C64';
                ctx!.fillText(player.playerName, 100,30);
                ctx!.fillText("MOVES MADE: 0", 100, 50);

                const check_moves = ()=>
                {
                    if (!player.check_moves()) {
                        player.allowMove(false, null);
                        if (player_number + 1 <= this.players_board.length - 1) {
                            console.log('nastepny');
                            this.next_round(this.players_board[player_number++], player_number++);
                        }
                        else {
                            console.log('ten sam');
                            this.next_round(this.players_board[player_number], player_number);
                        }
                    }else window.setTimeout(check_moves, 100);
                }
                check_moves();
            }
        }

    }





    /**
     * Function ending game
     */
    endGame()
    {

    }
}