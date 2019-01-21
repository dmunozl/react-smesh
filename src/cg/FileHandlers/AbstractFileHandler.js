import Model from  "../Model"
import {vec3} from "gl-matrix";

export default class AbstractFileHandler{
    constructor(file){
        this.file_extension = file.name.split('.').pop();
        this.model = new Model();
    }

    loadData(){
        throw new Error('loadData not implemented')
    }

    getModel(){
        return this.model;
    }

    completeTwins(){
        for (let i = 0 ; i<this.model.half_edges.length; i++){
            let current = this.model.half_edges[i];
            const next = this.model.half_edges[current[3]];
            const check_list = this.model.vertices_start[next[0]];

            if (current[1] !== -1) continue;

            for (let j = 0; j<check_list.length; j++){
                const check = this.model.half_edges[check_list[j]];
                const check_next =this.model.half_edges[check[3]];
                if (check_next[0] === current[0]){
                    current[1] = check_list[j];
                    check[1] = i;
                    break;
                }
            }
        }
    }

    calculateFacesNormals(){
        for (let i = 0; i<this.model.faces.length; i++){
            const first_he = this.model.half_edges[this.model.faces[i]];
            const second_he = this.model.half_edges[first_he[3]];
            const third_he = this.model.half_edges[second_he[3]];

            const vertex1 = this.model.vertices[first_he[0]];
            const vertex2 = this.model.vertices[second_he[0]];
            const vertex3 = this.model.vertices[third_he[0]];

            const normal = vec3.create();
            const U = vec3.create();
  	        const V = vec3.create();

  	        vec3.subtract(U, vertex2, vertex1);
  	        vec3.subtract(V, vertex3, vertex1);
  	        vec3.cross(normal, U, V);
  	        vec3.normalize(normal, normal);

  	        this.model.updateFaceNormal(i, normal);
        }
    }

    calculateVerticesNormals(){
        for (let i = 0; i<this.model.vertices.length; i++){
            const normal = vec3.create();
            const he_list = this.model.vertices_start[i];
            for (let j = 0; j<he_list.length; j++){
                let face_normal = this.model.face_normals[this.model.half_edges[he_list[j]][2]];
                vec3.add(normal, normal, face_normal);
            }
            vec3.normalize(normal, normal);

            this.model.updateVertexNormal(i, normal);
        }
    }
}
