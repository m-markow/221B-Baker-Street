import Player from "./Player.js";
import Game from "./Game.js";
import {placesPositions} from "./data_tools/PlacesPositions.js";

const CANVAS: HTMLCanvasElement | null = document.querySelector('#canva');

export default class Board
{
    public playersNumber: number;
    public playersBoard: Array<Player> = [];
    public coded_clues: boolean = false;
    public case: number = 0;

    constructor() {
        this.playersNumber = 0;
        this.init();
    }

    /**
     * Function initialising game - all of init images
     */
    init()
    {
        // let img = document.querySelector('#img') as HTMLImageElement;
        // window.setTimeout(()=>{
        //     img.src = './assets/init/init1.png';
        // }, 5000);
        // window.setTimeout(()=>{
        //     img.src = './assets/init/init2.png';
        // }, 10000);
        this.config();
    }

    /**
     * Function is setting all available options that user can set up
     */
    config() {
        const KeyPress_playersNumber = (x: number, y: number, context: CanvasRenderingContext2D) => {
            // @ts-ignore
            if (parseInt(event!.key) && parseInt(event!.key) > 0 && parseInt(event!.key) < 5) {
                // @ts-ignore
                this.playersNumber = parseInt(event!.key);
                // @ts-ignore
                context?.fillText(event!.key, x, y);
                playerNames();
            }
        }

        let ctx = CANVAS!.getContext("2d") as CanvasRenderingContext2D;
        let img = document.querySelector('#img') as HTMLImageElement;
        let eventHandler = KeyPress_playersNumber.bind(this, 800, 216, ctx);
        window.setTimeout(() => {
                (document.querySelector('#config') as HTMLDivElement).style.display = 'none';
                (document.querySelector('#game') as HTMLDivElement).style.display = 'block';
                img.src = './assets/config/config0.png';

                img.onload = () => {
                    ctx?.drawImage(img, 0, 0, img.width / 1.5, img.height / 1.5);
                    ctx!.font = '15pt C64';
                    ctx!.fillStyle = '#AE8E81';
                    document.addEventListener('keypress', eventHandler);

                }
            }, //15000
            1);

        const setPlayerName = (value: string, player: Player) => {
            player.playerName = value;
        }

        const input_array: any[] = [];

        const playerNames = () => {
            document.removeEventListener('keypress', eventHandler);
            img.src = './assets/config/playerName.png';

            const enterListen = () => {
                // @ts-ignore
                if (event!.keyCode === 13) {
                    let result = true;
                    for (let i = 1; i <= this.playersNumber; i++) {
                        if (this.playersBoard[i - 1].playerName == '') result = false;
                        //console.log(this.playersBoard[i - 1].playerName);
                    }
                    if (result) {
                        for (let i = 0; i < this.playersBoard.length; i++) {
                            this.playersBoard[i].players_board = this.playersBoard;
                        }
                        choose_clues();
                        document.removeEventListener('keypress', enterListen);
                    }
                }
            }

            img.onload = () => {
                ctx?.drawImage(img, 150, 230, img.width / 1.5, img.height / 1.5);
                for (let i = 1; i <= this.playersNumber; i++) {
                    if (i === 1) {
                        this.playersBoard.push(new Player());
                        ctx!.fillText('First:', 330, 350);

                        // @ts-ignore
                        const input_1 = new CanvasInput({
                            canvas: CANVAS,
                            fontSize: 15,
                            fontFamily: 'C64',
                            x: 450,
                            y: 330,
                            borderColor: 'transparent',
                            borderWidth: 0,
                            onkeyup: () => {
                                setPlayerName(input_1.value().toUpperCase(), this.playersBoard[0]);
                            }
                        });
                        input_array.push(input_1);
                    } else if (i === 2) {
                        ctx!.fillText('Second:', 330, 390);

                        this.playersBoard.push(new Player());

                        // @ts-ignore
                        const input_2 = new CanvasInput({
                            canvas: CANVAS,
                            fontSize: 15,
                            fontFamily: 'C64',
                            x: 450,
                            y: 370,
                            borderColor: 'transparent',
                            borderWidth: 0,
                            onkeyup: () => {
                                setPlayerName(input_2.value().toUpperCase(), this.playersBoard[1]);
                            }
                        });
                        input_array.push(input_2);
                    } else if (i === 3) {
                        ctx!.fillText('Third:', 330, 430);

                        this.playersBoard.push(new Player());

                        // @ts-ignore
                        const input_3 = new CanvasInput({
                            canvas: CANVAS,
                            fontSize: 15,
                            fontFamily: 'C64',
                            x: 450,
                            y: 410,
                            borderColor: 'transparent',
                            borderWidth: 0,
                            onkeyup: () => {
                                setPlayerName(input_3.value().toUpperCase(), this.playersBoard[2]);
                            }
                        });
                        input_array.push(input_3);
                    } else if (i === 4) {
                        ctx!.fillText('Fourth:', 330, 470);

                        this.playersBoard.push(new Player());

                        // @ts-ignore
                        const input_4 = new CanvasInput({
                            canvas: CANVAS,
                            fontSize: 15,
                            fontFamily: 'C64',
                            x: 450,
                            y: 450,
                            borderColor: 'transparent',
                            borderWidth: 0,
                            onkeyup: () => {
                                setPlayerName(input_4.value().toUpperCase(), this.playersBoard[3]);
                            }
                        });
                        input_array.push(input_4);
                    }
                }

                document.addEventListener('keypress', enterListen);

            }
        }

        const choose_clues = () => {
            for (let i = 0; i < input_array.length; i++) {
                input_array[i].destroy();
            }
            const yn_listen = (x: number, y: number) => {
                // @ts-ignore
                if (event!.key == 'y' || event!.key == 'n') {
                    // @ts-ignore
                    ctx!.fillText(event!.key.toUpperCase(), x, y);
                    // @ts-ignore
                    if (event!.key == 'y') {
                        this.coded_clues = true;
                        clues_assignment();
                    }
                    else choose_characters();
                }
            }
            let ynHandler = yn_listen.bind(this, 800, 260);

            const clues_assignment = () => {
                document.removeEventListener('keypress', ynHandler);
                //let code_array = ['A', 'B', 'C', 'D'];
                let code_array = ['A'];

                const showClueCode = (i: number) => {
                    this.playersBoard[i].clueCode(code_array[Math.floor(Math.random() * code_array.length)] + (Math.floor(Math.random() * 5) + 1));
                    //console.log(this.playersBoard[i].clueCodeGet());
                    img.src = './assets/config/empty.png';
                    img.onload = () => {
                        ctx!.drawImage(img, 0, 0, img.width / 1.2, img.height / 1.2);
                        ctx!.fillText('CODED CLUE ASSIGNMENT', 300, 150);
                        ctx!.fillText('FOR YOUR EYES ONLY, ' + this.playersBoard[i].playerName, 200, 300);
                        ctx!.fillText('PRESS "RETURN" WHEN READY', 200, 340);
                        const clicked_1 = (e: KeyboardEvent) => {
                            if (e.keyCode === 13) {
                                ctx!.fillText('YOUR CODE NUMBER IS: ' + this.playersBoard[i].clueCodeGet(), 200, 370);
                                ctx!.fillText('PRESS "RETURN" TO CONTINUE', 300, 420);
                                document.addEventListener("keyup", clicked_2);
                            }
                        }
                        const clicked_2 = (e: KeyboardEvent) => {
                            if (e.keyCode === 13 && (i + 1) < this.playersBoard.length) {
                                showClueCode(i + 1);
                            } else choose_characters();
                            document.removeEventListener('keyup', clicked_1);
                            document.removeEventListener('keyup', clicked_2);
                        }
                        document.addEventListener("keyup", clicked_1);
                    }
                }
                showClueCode(0);

            }

            img.src = './assets/config/empty.png';
            img.onload = () => {
                ctx!.drawImage(img, 0, 0, img.width / 1.2, img.height / 1.2);
                img.src = './assets/config/clues.png';
                img.onload = () => {
                    ctx!.drawImage(img, 180, 230, img.width / 1.5, img.height / 1.5);
                    document.addEventListener('keypress', ynHandler);
                }
            }
        }

        const choose_characters = () => {
            let characters_array: Array<number> = [100, 210, 320, 430];

            img.src = './assets/config/config3.png';
            img.onload = () => {
                ctx!.drawImage(img, 50, 0, img.width / 1.1, 540);
                const select_eachCharacter = (i: number) => {
                    ctx!.fillStyle = '#000';
                    ctx!.fillRect(200, 50, 540, 25);
                    ctx!.fillStyle = '#fff';
                    ctx!.fillText(this.playersBoard[i].playerName + ', SELECT 1, 2, 3 OR 4', 200, 70);
                    const clicked_1 = (e: KeyboardEvent) => {
                        if (parseInt(e.key) && parseInt(e.key) <= 4)
                        {
                            let is_free = true;
                            for (let j = 0; j < this.playersBoard.length; j++) {
                                if (this.playersBoard[j].playerCharacter === parseInt(e.key) - 1) is_free = false;
                            }
                            if (is_free) {
                                ctx!.fillText(this.playersBoard[i].playerName + ' - ', 100, characters_array[parseInt(e.key) - 1]);
                                ctx!.fillText('YOU WILL REPRESENT', 100, characters_array[parseInt(e.key) - 1] + 30);
                                this.playersBoard[i].playerCharacter = parseInt(e.key) - 1;
                                nextCharacter(i);
                            }
                        }
                    }
                    document.addEventListener('keyup', clicked_1);

                    const clicked_2 = (e: KeyboardEvent) => {
                        if (e.keyCode === 13) {
                            document.removeEventListener('keyup', clicked_1);
                            document.removeEventListener('keyup', clicked_2);
                            choose_case();
                        }
                    }

                    const nextCharacter = (i: number)=>{
                        document.removeEventListener('keyup', clicked_1);
                        if ((i + 1) < this.playersBoard.length) select_eachCharacter(i + 1);
                        else {
                            ctx!.fillStyle = '#000';
                            ctx!.fillRect(200, 50, 540, 25);
                            ctx!.fillStyle = '#fff';
                            ctx!.fillText('PRESS "RETURN" TO CONTINUE', 200, 70);
                            document.addEventListener('keyup', clicked_2);
                        }
                    }
                }
                select_eachCharacter(0);
            }

        }

        const choose_case = ()=>
        {
            img.src = './assets/config/config4.png';
            img.onload = ()=>{
                ctx!.drawImage(img, -30, -200, img.width, img.width/1.2);
                ctx!.fillStyle = '#AE8E81';

                const setCase = (val: string)=>{
                    if (parseInt(val))
                        this.case = parseInt(val);
                }

                // @ts-ignore
                const input = new CanvasInput({
                    canvas: CANVAS,
                    fontSize: 15,
                    fontFamily: 'C64',
                    x: 600,
                    y: 510,
                    borderColor: 'transparent',
                    borderWidth: 0,
                    width: 60,
                    onkeyup: () => {
                        setCase(input.value().toUpperCase());
                    }
                });

                const click = (e: KeyboardEvent)=>{
                    if (e.keyCode === 13 && this.case)
                    {
                        document.removeEventListener('keyup', click);
                        input.destroy();
                        for (let i = 0; i < placesPositions.length; i++) {
                            placesPositions[i].clue = this.case;
                        }
                        let game = new Game(this.playersBoard, this.coded_clues, this.case);
                        for (let i = 0; i < placesPositions.length; i++) {
                            placesPositions[i].game = game;
                        }
                    }
                }

                document.addEventListener('keyup', click);
            }
        }
    }


}