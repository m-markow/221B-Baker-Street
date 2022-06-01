const CANVAS: HTMLCanvasElement | null = document.querySelector('#canva');
const main_context: CanvasRenderingContext2D | null = CANVAS!.getContext('2d');

import {forbidden_positions, map_edges} from "./data_tools/ForbiddenPositions.js";
import {map_parts_management} from "./data_tools/MapPartsManagement.js";

// left-bottom corner [35, 450]
// each next +-125px (OX) (right/left)
// each next +-50px (OX) +-55px (OY) (up/down) |

export default class Player
{
    public playerName: string = '';
    private _clueCode: string = '';
    public playerCharacter: number | null = null;
    public diceRoll_result: number | null = null;
    protected currentPosition: Array<number> = [160, 450]; // default spawn position [160, 450]
    protected position_row_col: Array<number> = [0, 1]; // default spawn position [0, 1]
    public canvas: HTMLCanvasElement | null = null;
    public map_segment: Array<number> = [0, -540];
    public forbidden_pos_coefficient: Array<number> = [0, 0];


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

    /**
     * Function check whether user try to step out from board or onto building
     * @param x - x coordinate
     * @param y - y coordinate
     */
    check_if_forbidden(x: number, y: number): boolean
    {
        let result = true;
        for (let i = 0; i < forbidden_positions.length; i++) {
            if(forbidden_positions[i][0] + this.forbidden_pos_coefficient[0] == x && forbidden_positions[i][1] + this.forbidden_pos_coefficient[1] == y) result = false;
        }

        for (let i = 0; i < map_edges.length; i++) {
            if (map_edges[i][0] + this.forbidden_pos_coefficient[0] == x && map_edges[i][1] + this.forbidden_pos_coefficient[1] == y) result = false;
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
                for (let i = 0; i < map_parts_management.up.length; i++) {
                    if (map_parts_management.up[i][0] + this.forbidden_pos_coefficient[0] == this.currentPosition[0] && map_parts_management.up[i][1] + this.forbidden_pos_coefficient[1] == this.currentPosition[1])
                    {
                        let new_map_segment = new Image();
                        new_map_segment.src = './assets/map.png';
                        new_map_segment.onload = ()=>{
                            main_context!.clearRect(0, 0, CANVAS!.width, CANVAS!.height);
                            this.map_segment[0] -= 420;
                            this.map_segment[1] += 300;
                            main_context!.drawImage(new_map_segment, this.map_segment[0], this.map_segment[1]);

                            ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
                            this.currentPosition[0] -= 420;
                            this.currentPosition[1] += 300;
                            this.forbidden_pos_coefficient[0] -= 420;
                            this.forbidden_pos_coefficient[1] += 300;
                            ctx!.drawImage(character, this.currentPosition[0], this.currentPosition[1]);
                        }
                    }
                }
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
                for (let i = 0; i < map_parts_management.down.length; i++) {
                    if (map_parts_management.down[i][0] + this.forbidden_pos_coefficient[0] == this.currentPosition[0] && map_parts_management.down[i][1] + this.forbidden_pos_coefficient[1] == this.currentPosition[1])
                    {
                        let new_map_segment = new Image();
                        new_map_segment.src = './assets/map.png';
                        new_map_segment.onload = ()=>{
                            main_context!.clearRect(0, 0, CANVAS!.width, CANVAS!.height);
                            this.map_segment[0] += 420;
                            this.map_segment[1] -= 300;
                            main_context!.drawImage(new_map_segment, this.map_segment[0], this.map_segment[1]);

                            ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
                            this.currentPosition[0] += 420;
                            this.currentPosition[1] -= 300;
                            this.forbidden_pos_coefficient[0] += 420;
                            this.forbidden_pos_coefficient[1] -= 300;
                            ctx!.drawImage(character, this.currentPosition[0], this.currentPosition[1]);
                        }
                    }
                }
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
                for (let i = 0; i < map_parts_management.left.length; i++) {
                    if (map_parts_management.left[i][0] + this.forbidden_pos_coefficient[0] == this.currentPosition[0] && map_parts_management.left[i][1] + this.forbidden_pos_coefficient[1] == this.currentPosition[1])
                    {
                        let new_map_segment = new Image();
                        new_map_segment.src = './assets/map.png';
                        new_map_segment.onload = ()=>{
                            main_context!.clearRect(0, 0, CANVAS!.width, CANVAS!.height);
                            this.map_segment[0] += 1000;
                            main_context!.drawImage(new_map_segment, this.map_segment[0], this.map_segment[1]);

                            ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
                            this.currentPosition[0] += 1000;
                            this.forbidden_pos_coefficient[0] += 1000;
                            ctx!.drawImage(character, this.currentPosition[0], this.currentPosition[1]);
                        }
                    }
                }
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
                for (let i = 0; i < map_parts_management.right.length; i++) {
                    if (map_parts_management.right[i][0] + this.forbidden_pos_coefficient[0] == this.currentPosition[0] && map_parts_management.right[i][1] + this.forbidden_pos_coefficient[1] == this.currentPosition[1])
                    {
                        let new_map_segment = new Image();
                        new_map_segment.src = './assets/map.png';
                        new_map_segment.onload = ()=>{
                            main_context!.clearRect(0, 0, CANVAS!.width, CANVAS!.height);
                            this.map_segment[0] -= 1000;
                            main_context!.drawImage(new_map_segment, this.map_segment[0], this.map_segment[1]);

                            ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
                            this.currentPosition[0] -= 1000;
                            this.forbidden_pos_coefficient[0] -= 1000;
                            ctx!.drawImage(character, this.currentPosition[0], this.currentPosition[1]);
                        }
                    }
                }
            }

        }
    }

}