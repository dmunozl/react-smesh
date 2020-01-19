import BaseElement from "./BaseElement";
import {vec3} from 'gl-matrix';

export default class Polygon extends BaseElement{
    constructor(id){
        super(id);
        this.vertices = [];
        this.angles = null;
        this.area = null;
        this.normal = null;
        this.geometricCenter = null;
        this.neighbours = [];
    }

    isNeighbour(polygon){
        return this.neighbours.includes(polygon);
    }

    // ------- Calculation Methods: Should be called once -------

    calculateNormal(){
        this.normal = vec3.create();
        const U = vec3.create();
        const V = vec3.create();
        vec3.subtract(U, this.vertices[1].coords, this.vertices[0].coords);
        vec3.subtract(V, this.vertices[2].coords, this.vertices[0].coords);
        vec3.cross(this.normal, U, V);
        vec3.normalize(this.normal, this.normal);
    }

    calculateGeometricCenter(){
        this.geometricCenter = vec3.create();
        for (let i = 0; i < this.vertices.length; i++) {
            vec3.add(this.geometricCenter, this.geometricCenter, this.vertices[i].coords)
        }
        this.geometricCenter[0] = this.geometricCenter[0]/this.vertices.length;
        this.geometricCenter[1] = this.geometricCenter[1]/this.vertices.length;
        this.geometricCenter[2] = this.geometricCenter[2]/this.vertices.length;
    }

    calculateArea(){
        const total = vec3.create();
        let result, v1, v2;
        for (let i = 0; i < this.vertices.length; i++) {
            v1 = this.vertices[i].coords;
            if (i === this.vertices.length-1) {
                v2 = this.vertices[0].coords;
            } else {
                v2 = this.vertices[i+1].coords
            }
            const prod = vec3.create();
            vec3.cross(prod, v1, v2);
            vec3.add(total, total, prod)
        }
        result = vec3.dot(total, this.normal);
        this.area = Math.abs(result/2);
    }

    calculateAngles(){
        this.angles = new Array(this.vertices.length);
        for (let i = 0; i < this.vertices.length; i++) {
            const vertex1 = this.vertices[i].coords;
            const vertex2 = this.vertices[(i+1)%this.vertices.length].coords;
            const vertex3 = this.vertices[(i+2)%this.vertices.length].coords;

            const vector1 = vec3.create();
            const vector2 = vec3.create();

            vec3.subtract(vector1, vertex1, vertex2);
            vec3.subtract(vector2, vertex2, vertex3);
            this.angles[i] = Math.PI - vec3.angle(vector1, vector2);
        }
    }

    // ------ Getters that require calculation/checks ------

    getVerticesCount(){
        return this.vertices.length;
    }

    getNormal(){
        if (this.normal == null) {
            this.calculateNormal();
        }
        return vec3.clone(this.normal);
    }

    getGeometricCenter(){
        if (this.geometricCenter == null) {
            this.calculateGeometricCenter();
        }
        return this.geometricCenter;
    }

    getArea (){
        if (this.area == null) {
            this.calculateArea();
        }
        return this.area;
    }

    getAngles (){
        if (this.angles == null) {
            this.calculateAngles();
        }
        return this.area;
    }
}