import {vec3} from 'gl-matrix';

export default class Translator{
    constructor() {
        this.v = vec3.create();
    }

    setMovementStart(event_x, event_y){
        this.startX = event_x;
        this.startY = event_y;
    }

    moveTo(event_x, event_y){
        this.endX = event_x;
        this.endY = event_y;

        const dx = this.startX - this.endX;
        const dy = this.startY - this.endY;

        this.v[0] += dx;
        this.v[1] += dy;
        this.v[2] += 0.0;

        this.startX = this.endX;
        this.startY = this.endY;
    }

    getMovementVector(){
        return this.v;
    }

    reset(){
        this.v = vec3.create()
    }

}