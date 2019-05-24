import DirectLightRenderer from './Renderers/MainRenderers/DirectLightRenderer'

class RendererFactory {
  getRenderer(render_type){
    switch(render_type){
      case 'FaceRender':
        return DirectLightRenderer;
      case 'VertexRender':
        return DirectLightRenderer;
      default:
        return null
    }
  }
}

const instance = new RendererFactory();
Object.freeze(instance);

export default instance