import {vec3, mat4, quat} from 'gl-matrix';

export default class Rotator{
    constructor(gl){
        this.width = gl.canvas.clientWidth;
        this.height = gl.canvas.clientHeight;
        this.r = Math.min(this.width, this.height)/2;
        this.q = quat.create();
    }

    getTrackballVector(event_x, event_y){
        const x = (2.0*event_x-this.width)/this.width;
        const y = (this.height-2.0*event_y)/this.height;
        let z = 0;
        const v = vec3.fromValues(x, y, z);
        let len = vec3.length(v);

        len = (len<1.0)? len:1.0;
        z = Math.sqrt(1-len*len);
        v[2] = z;
        vec3.normalize(v, v);

        return v
    }

    setRotationStart(event_x, event_y){
        this.start = this.getTrackballVector(event_x, event_y);
    }

    rotateTo(event_x, event_y){
        const end = this.getTrackballVector(event_x, event_y);
        const axis = vec3.create();
        vec3.cross(axis, end, this.start);
        vec3.normalize(axis, axis);

        const aux = vec3.create();
        vec3.subtract(aux, end, this.start);
        const dis = 0 - vec3.length(aux)*2;

        const curRP = quat.create();
        quat.setAxisAngle(curRP, axis, dis);

        quat.multiply(this.q, curRP, this.q);
        this.start = end
    }

    getRotationMatrix(){
        const temp = mat4.create();
        if (this.q == null){
            return temp;
        }
        mat4.fromQuat(temp, this.q);
        return temp;
    }
}