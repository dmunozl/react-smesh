export default {

    main_renderers:[
        {key:'FaceRender', type:'btn-faces', tooltip:'Faces Light', active:''},
        {key:'VertexRender', type:'btn-vertex', tooltip:'Vertices Light', active:''},
        {key:'FlatRender', type:'', tooltip:'Flat Color' , active:''},
        {key:'NoRender', type:'', tooltip:'No Render' , active:''},
    ],

    secondary_renderers:[
        {key:'WireFrame', text:'WireFrame', checked:''},
        {key:'VertexCloud', text:'Vertex Cloud', checked:''},
        {key:'FaceNormals', text:'Face Normals', checked:''},
        {key:'VertexNormals', text:'Vertex Normals', checked:''},
        {key:'NoRender', text:'Nuevo', checked:''}
    ],

    polygon_selections: [
        {key: 'InternalAngles', value:'angle', text:'By Internal Angles'},
        {key: 'Polygons Area', value:'area', text: 'By Polygons Area'},
        {key: 'By ID', value:'id', text: 'By ID'}
    ]
}