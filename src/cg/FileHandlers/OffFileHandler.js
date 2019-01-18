import LineNavigator from "line-navigator";

export default class OffFileHandler{
    constructor(file){
        this.file_extension = file.name.split('.').pop();
        this.file = file;
    }

    getModelData(){
        let navigator = new LineNavigator(this.file);
        navigator.readSomeLines(0, (err, index, lines) => {
            console.log('getModelData not implemented');
        })
    }
}
