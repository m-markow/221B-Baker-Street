import Player from "./Player.js";
import {clues} from "./data_tools/Clue.js";
import {hint_code} from "./data_tools/HintCodeSystem.js";
import Game from "./Game.js";
import {placesPositions} from "./data_tools/PlacesPositions";

const getKeyValue = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key];
const SCENE: HTMLCanvasElement | null = document.querySelector('#place_scene');
const CANVAS: HTMLCanvasElement | null = document.querySelector('#canva');
const TEXT_AREA: HTMLCanvasElement | null = document.querySelector('#text_scene');

const extract=([beg, end]: Array<string>)=> {
    const matcher = new RegExp(`${beg}(.*?)${end}`,'gm');
    const normalise = (str:string) => str.slice(beg.length,end.length*-1);
    return function(str: string) {
        return str.match(matcher)!.map(normalise);
    }
}


export default class PlaceScene{

    public player: Player | null = null;
    public location: string;
    public coordinates: Array<number> | null = null;
    public clue: number = 0;
    public is_locked: boolean = false;
    public image: string;
    public current_visitor: Player | null = null;
    public identificator: string;
    public game: Game | null = null;


    constructor(location: string, coordinates: Array<number>, image: string, identificator: string) {
        this.location = location;
        this.coordinates = coordinates;
        this.image = image;
        this.identificator = identificator;
    }

    show_scene(player_entering: Player)
    {
        this.current_visitor = player_entering;
        let scene_ctx: CanvasRenderingContext2D | null = SCENE!.getContext('2d');
        let text_ctx: CanvasRenderingContext2D | null = TEXT_AREA!.getContext('2d');

        let bg_image = new Image();
        bg_image.src = this.image;
        bg_image.onload = ()=>{
            SCENE!.style.zIndex = '10';
            scene_ctx!.drawImage(bg_image, 0, 200);
            TEXT_AREA!.width = TEXT_AREA!.width;
            TEXT_AREA!.style.zIndex = '2';

            //fill text
            const show_clues = ()=>{
                let values = clues[this.clue]["places"][this.identificator];
                player_entering.clues_seen.push(this);
                // if (player_entering.clueCodeGet() != '') {
                    let extracted = extract(['{{', '}}'])(values[0]);
                    let result: Array<string> = [];
                    for (let i = 0; i < extracted.length; i++) {

                        for (let j = 0; j < extracted[i].length; j++) {
                            let dupa = extracted[i].charAt(j);
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
                    text_ctx!.fillStyle = '#fff';
                    text_ctx!.font = '15pt C64';
                    text_ctx!.fillText('You are in ' + this.location, 250, 30);
                    text_ctx!.fillText(values[0], 200, 60);
                    if (values[1])
                        text_ctx!.fillText(values[1], 200, 90);
                    text_ctx!.fillText('Press "RETURN" to continue game.', 250, 150);
                    document.addEventListener('keyup', enter_listen);
                //}
            }

            if (this.identificator == '221B' && player_entering.has_badge)
            {
                this.start_quiz();
            }else show_clues();

        }

        const enter_listen = (e: KeyboardEvent)=>{
            if (e.key == 'Enter')
            {
                document.removeEventListener('keyup', enter_listen);
                this.end_scene();
            }
        }
    }

    end_scene()
    {
        SCENE!.style.zIndex = "-2";
        TEXT_AREA!.width = TEXT_AREA!.width;
        TEXT_AREA!.style.zIndex = '-1';
        //set round for next player
        this.current_visitor!.diceRoll_result = 0;
    }

    start_quiz()
    {
        let user_answers: Array<number> = [];
        let current_question = 0;
        let text_ctx: CanvasRenderingContext2D | null = TEXT_AREA!.getContext('2d');
        text_ctx!.fillStyle = '#fff';
        text_ctx!.font = '15pt C64';
        text_ctx!.fillText('You are in ' + this.location, 250,30);
        text_ctx!.fillText('Do you wish to solve the case? (Y/N)', 220, 150);

        const yn_listener = (e: KeyboardEvent)=>{

            if (e!.key == 'y' || e!.key == 'n') {
                if (e!.key == 'y') {
                    show_questions();
                }else
                    this.end_scene()
            }
        }

        document.addEventListener('keyup', yn_listener);

        const show_questions = ()=>{
            document.removeEventListener('keyup', yn_listener);
            text_ctx?.clearRect(0,0,TEXT_AREA!.width, TEXT_AREA!.height);
            text_ctx!.fillText('FOR YOUR EYES ONLY, ' + this.current_visitor?.playerName, 250,30);
            text_ctx!.fillText('Press "RETURN" for quiz', 220, 150);

            const enter_listen = (e: KeyboardEvent)=>{
                if (e.key == 'Enter')
                {
                    document.removeEventListener('keyup', enter_listen);
                    killer_question();
                }
            }
            document.addEventListener('keyup', enter_listen);

            const number_listener = (e: KeyboardEvent)=>{
                if (parseInt(e.key) && parseInt(e.key) > 0 && parseInt(e.key) < 5)
                {
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

            }

            const killer_question = ()=>{
                text_ctx?.clearRect(0,0,TEXT_AREA!.width, TEXT_AREA!.height);
                let values = clues[this.clue]["quiz"]["0"];

                text_ctx!.fillText('KILLER', 100,20);
                for (let i = 0; i < values.length; i++) {
                    text_ctx!.fillText(i + '. ' + values[i], 100, 50 + 30*i);
                }

                text_ctx!.fillText('Enter number: ', 100, 170);

                document.addEventListener('keyup', number_listener);
            }

            const weapon_question = ()=>{
                text_ctx?.clearRect(0,0,TEXT_AREA!.width, TEXT_AREA!.height);
                let values = clues[this.clue]["quiz"]["1"];

                text_ctx!.fillText('WEAPON', 100,20);
                for (let i = 0; i < values.length; i++) {
                    text_ctx!.fillText(i + '. ' + values[i], 100, 50 + 30*i);
                }

                text_ctx!.fillText('Enter number: ', 100, 170);
            }

            const motive_question = ()=>{
                text_ctx?.clearRect(0,0,TEXT_AREA!.width, TEXT_AREA!.height);
                let values = clues[this.clue]["quiz"]["3"];

                text_ctx!.fillText('MOTIVE', 100,20);
                for (let i = 0; i < values.length; i++) {
                    text_ctx!.fillText(i + '. ' + values[i], 100, 50 + 30*i);
                }

                text_ctx!.fillText('Enter number: ', 100, 170);
            }

            const enter_explanation = (e: KeyboardEvent)=>{
                if (e.key == 'Enter')
                {
                    show_explanation();
                }
            }

            const exit_quiz = (e: KeyboardEvent)=>{
                if (e.key == 'Enter')
                {
                    document.removeEventListener('keyup', exit_quiz);
                    this.end_scene();
                }
            }

            const end_quiz = ()=>
            {
                document.removeEventListener('keyup', number_listener);
                let values = clues[this.clue]["answers"];
                let difference = 0;
                for (let i = 0; i < values.length; i++) {
                    if (values[i] !== user_answers[i]) difference++;
                }
                if (difference == 0)
                {
                    //end game
                    text_ctx?.clearRect(0,0,TEXT_AREA!.width, TEXT_AREA!.height);
                    text_ctx!.fillText('You are absolutely correct!', 250,30);
                    text_ctx!.fillText('Press "RETURN" for explanation.', 220, 150);
                    document.addEventListener('keyup', enter_explanation);
                }
                else
                {
                    //end scene
                    text_ctx?.clearRect(0,0,TEXT_AREA!.width, TEXT_AREA!.height);
                    text_ctx!.fillText('You have ' + difference + ' incorrect answer(s)', 250,30);
                    text_ctx!.fillText('Press "RETURN" for continue.', 220, 150);
                    document.addEventListener('keyup', exit_quiz);
                }
            }

            const show_explanation = ()=>{
                document.removeEventListener('keyup', enter_explanation);
                SCENE!.width = SCENE!.width;
                const explanation_canvas: HTMLCanvasElement | null = document.querySelector('#explanation_canvas');
                explanation_canvas!.style.zIndex = '15';
                const exp_ctx = explanation_canvas?.getContext('2d');
                text_ctx?.clearRect(0,0,TEXT_AREA!.width, TEXT_AREA!.height);

                exp_ctx!.fillStyle = '#fff';
                exp_ctx!.font = '13pt C64';

                let values = clues[this.clue]["explenation"];
                for (let i = 0; i < values.length; i++) {
                    exp_ctx!.fillText(values[i], 0, 50 + 20*i);
                }
                exp_ctx!.fillText('Press "RETURN" to continue.', 220, 400);


            }
        }
    }

}