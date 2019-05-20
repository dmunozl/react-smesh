export const vertexShader = `#version 300 es

in vec4 a_position;
in vec3 a_normal;
in vec4 a_color;

uniform mat4 u_worldViewProjection;
uniform mat4 u_world;

out vec3 v_normal;
out vec4 v_color;

void main() {
  gl_Position = u_worldViewProjection * a_position;
  v_normal = mat3(u_world) * a_normal;
  v_color = a_color;
}
`;

export const fragmentShader = `#version 300 es

precision mediump float;

in vec3 v_normal;
in vec4 v_color;

uniform vec3 u_reverseLightDirection;

out vec4 outColor;

void main() {
  vec3 normal = normalize(v_normal);
  float light = dot(normal, u_reverseLightDirection);

  outColor = v_color;
  outColor.rgb *= light;
}
`;