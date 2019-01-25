import AbstractFileHandler from "./AbstractFileHandler"
import LineNavigator from "line-navigator";

export default class OffFileHandler extends  AbstractFileHandler{
    constructor(file){
        super(file);
        this.navigator = new LineNavigator(file,{chunkSize: 1024*48});
        this.accepted_first_lines = ['COFF', 'OFF', 'OFFC'];
        this.vertices_count = undefined;
        this.faces_count = undefined;
        this.current_index = 0;
        this.vertex_index = 0;
        this.face_index = 0;
        this.he_index = 0;
    }

    loadData(){
        this.model.updateStatus('LOADING', 'loading model');
        this.navigator.readSomeLines(0, (err, index, lines, isEof) => {
            this.linesHandler(err, index,lines, isEof)
        });
    }

    linesHandler(err, index, lines, isEof){
        if (index === 0 && !this.validateFile(lines[0])){
            this.model.updateStatus('ERROR', `Invalid ${this.file_extension} File`);
            this.model.loadedCallback();
            return;
        }

        if(err){
            this.model.updateStatus('ERROR', 'line-navigator error');
            this.model.loadedCallback();
            return;
        }

        for(let line of lines){
            // Ignore empty and comment lines
            if (line !== '' && line[0] !== '#'){
                line = line.replace(/\t/g, " ");
                line = line.split(' ').filter(Boolean);
                if (!this.vertices_count || !this.faces_count) {
                    if (this.current_index === 0  && line.length > 0 && this.accepted_first_lines.includes(line[0])) {
                        this.vertices_count = parseInt(line[1]);
                        this.faces_count = parseInt(line[2]);
                    } else {
                        this.vertices_count = parseInt(line[0]);
                        this.faces_count = parseInt(line[1]);
                    }
                } else if (this.vertex_index < this.vertices_count) {
                    const x = parseFloat(line[0]), y = parseFloat(line[1]), z = parseFloat(line[2]);
                    this.model.addVertex([x, y, z]);
                    this.vertex_index++;
                } else {
                    const sides_count = parseInt(line[0]);
                    this.model.addFace(this.he_index);
                    for (let i = 1; i<=sides_count; i++){
                        let previous = this.he_index-1;
                        let next = this.he_index+1;
                        const v_index = parseInt(line[i]);

                        if(i === 1) previous = this.he_index+(sides_count-1);
                        if(i === sides_count) next = this.he_index-(sides_count-1);

                        this.model.addHalfEdge([v_index, -1, this.face_index, next, previous]);
                        this.model.updateVertexStart(v_index, this.he_index);
                        this.he_index++;
                    }
                    this.face_index++;
                }
            }
            this.current_index++;
        }

        if(isEof) {
            this.completeTwins();
            this.calculateFacesNormals();
            //this.calculateVerticesNormals();
            this.model.determineBounds();
            this.model.setMatrices();
            this.finishLoad();
            this.model.loadedCallback();
            return;
        }

        this.navigator.readSomeLines(index+lines.length, (err, index, lines, isEof) => {
            this.linesHandler(err, index,lines, isEof)
        })
    }

    validateFile(first_line){
        return this.accepted_first_lines.includes(first_line.split(' ').filter(Boolean)[0].trim());
    }

    finishLoad(){
        this.model.updateStatus('SUCCESS', 'Model Loaded');
    }
}
