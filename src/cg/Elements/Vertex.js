import BaseElement from "./BaseElement";
import {vec3} from 'gl-matrix';

export default class Vertex extends BaseElement{
    constructor(id, x, y, z){
        super(id);
        this.coords = vec3.fromValues(x, y, z);
        this.normal = null;
        this.polygons = [];
    }

    // ------- Calculation Methods: Should be called once -------

    calculateNormal(){
        this.normal = vec3.create();
        for (let i = 0; i < this.polygons.length; i++) {
            vec3.add(this.normal, this.normal, this.polygons[i].getNormal());
        }
        vec3.normalize(this.normal, this.normal)
    }

    // ------ Getters that require calculation/checks ------

    getNormal(){
        if (this.normal == null) {
            this.calculateNormal();
        }
        return vec3.clone(this.normal);
    }
}