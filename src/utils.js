import React from 'react';

// main renderer icons
import FaceRenderIcon from './icons/face_render_icon'
import VertexRenderIcon from './icons/vertex_render_icon'
import FlatRenderIcon from './icons/flat_render_icon'
import NoRenderIcon from './icons/no_render_icon'
// secondary renderers icons
import WireFrameRenderIcon from './icons/wireframe_render_icon'
import VertexCloudRenderIcon from './icons/vertexcloud_render_icon'
import FaceNormalsRenderIcon from './icons/facenormals_render_icon'
import VertexNormalsRenderIcon from './icons/vertexnormals_render_icon'

const getIconComponent = (key) => {
    let icon_dict = {
        'FaceRender':<FaceRenderIcon/>,
        'VertexRender':<VertexRenderIcon/>,
        'FlatRender':<FlatRenderIcon/>,
        'NoRender':<NoRenderIcon/>,
        'WireFrame':<WireFrameRenderIcon/>,
        'VertexCloud':<VertexCloudRenderIcon/>,
        'FaceNormals':<FaceNormalsRenderIcon/>,
        'VertexNormals':<VertexNormalsRenderIcon/>,
    };
    return icon_dict[key]
};

export {
    getIconComponent
}