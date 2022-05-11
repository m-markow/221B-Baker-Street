export default class Board
{
    public playersNumber: number;

    constructor() {
        this.playersNumber = 0;
        this.init();
    }

    init()
    {
        const CANVAS: HTMLCanvasElement | null = document.querySelector('#canva');
        let ctx = CANVAS!.getContext("2d");
        let img: any = document.querySelector('#img');
        img.onload = ()=> {
            ctx?.drawImage(img, -1400, -100);
        }
    }
}