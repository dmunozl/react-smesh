import AbstractFileHandler from "./AbstractFileHandler";

export default class NoFileHandler extends AbstractFileHandler{
    loadData(){
        this.model.updateStatus('ERROR', `${this.file_extension} extension not supported`);
    }
}
