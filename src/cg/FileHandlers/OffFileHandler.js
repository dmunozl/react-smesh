import LineNavigator from "line-navigator";

export default class OffFileHandler{
    constructor(file){
        this.file = file;
    }


    getModelData(setDataCallback){
        const model_data = {
            'status': 'LOADING'
        };

        let navigator = new LineNavigator(this.file);

        function checkHeader(header) {
            const accepted_headers = ['OFF', 'COFF', 'OFFC'];
            return accepted_headers.indexOf(header) > -1
        }

        function extractLinesData(lines, index){
            for (let i = 0; i < lines.length; i ++){
                const line_index = index + i;
                const line = lines[i];

                if (line === '' || line[0] === '#'){
                    continue
                }

                const processed_line = line.replace(/\t/g, ' ').split(' ').filter(Boolean);

                // --- CHECK HEADER (AND EXTRACT HEADER INFO IF PRESENT)---
                if (line_index === 0){
                    const header = processed_line[0].trim();
                    if(!checkHeader(header)){
                        model_data['status'] = 'ERROR';
                        model_data['error_message'] = "Invalid OFF file";
                        return
                    }

                    if (processed_line.length > 1){
                        model_data['vertices_count'] = parseInt(processed_line[1]);
                        model_data['faces_count'] = parseInt(processed_line[2]);
                        model_data['vertex_index'] = 0;
                        model_data['face_index'] = 0;
                        model_data['extracted_header'] = true;
                        model_data['vertices'] = []
                    }
                    continue
                }
                // --- GET HEADER INFO ---
                if (!model_data['extracted_header']){
                    // --- Count Info ---
                    model_data['vertices_count'] = parseInt(processed_line[0]);
                    model_data['faces_count'] = parseInt(processed_line[0]);
                    // --- Index Info ---
                    model_data['vertex_index'] = 0;
                    model_data['face_index'] = 0;
                    model_data['he_index'] = 0;
                    // --- Status Info ---
                    model_data['extracted_header'] = true;
                    // --- Actual Model Info ---
                    model_data['vertices'] = [];
                    model_data['vertices_start'] = [];
                    model_data['faces'] = [];
                    model_data['half_edges'] = [];
                    model_data['bounds'] = [];
                    continue
                }

                // --- GET VERTICES ---
                if (!model_data['extracted_vertices']){
                    const x = parseFloat(processed_line[0]);
                    const y = parseFloat(processed_line[1]);
                    const z = parseFloat(processed_line[2]);
                    model_data['vertices'].push([x, y, z]);
                    model_data['vertices_start'].push([]);
                    model_data['vertex_index'] += 1;

                    if (model_data['vertex_index'] === model_data['vertices_count']){
                        model_data['extracted_vertices'] = true
                    }

                    if (model_data['bounds'].length < 1) {
                        model_data['bounds'].push(x);
                        model_data['bounds'].push(y);
                        model_data['bounds'].push(z);
                        model_data['bounds'].push(x);
                        model_data['bounds'].push(y);
                        model_data['bounds'].push(z);
                    }

                    if (model_data['bounds'][0] > x) {model_data['bounds'][0] = x}
                    if (model_data['bounds'][3] < x) {model_data['bounds'][3] = x}

                    if (model_data['bounds'][1] > y) {model_data['bounds'][1] = y}
                    if (model_data['bounds'][4] < y) {model_data['bounds'][4] = y}

                    if (model_data['bounds'][2] > z) {model_data['bounds'][2] = z}
                    if (model_data['bounds'][5] < z) {model_data['bounds'][5] = z}

                    continue
                }

                // --- GET FACES ---
                if (!model_data['extracted_faces']){
                    const sides_count = parseInt(processed_line[0]);
                    model_data['faces'].push(model_data['he_index']);

                    for (let j = 1; j<=sides_count; j++){
                        let previous = model_data['he_index'] - 1;
                        let next = model_data['he_index'] + 1;
                        const vertex_index = parseInt(processed_line[j]);

                        if (j === 1)
                            previous = model_data['he_index'] + (sides_count-1);

                        if (j === sides_count)
                            next = model_data['he_index'] - (sides_count-1);

                        model_data['half_edges'].push([vertex_index, -1, model_data['face_index'], next, previous]);
                        model_data['vertices_start'][vertex_index].push(model_data['he_index']);
                        model_data['he_index'] += 1
                    }
                    model_data['face_index'] += 1;
                }
            }
        }

        navigator.readSomeLines(0, function linesReadHandler(err, index, lines, isEof, progress){
            extractLinesData(lines, index);

            if (isEof || model_data['status'] === 'ERROR') {
                if(model_data['status'] === 'LOADING') {
                    model_data['status'] = 'SUCCESS'
                }
                setDataCallback(model_data);
                return
            }
            navigator.readSomeLines(index + lines.length, linesReadHandler)
        });
    }
}
