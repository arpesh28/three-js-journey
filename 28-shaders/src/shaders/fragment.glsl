  uniform vec3 uColor;
  uniform sampler2D uTexture; //  sampler2D is a type for textures
  uniform float uElevation;

  // varying float vRandom;
  varying vec2 vUv;
  varying float vElevation;

  void main() {

    vec4 textureColor = texture2D(uTexture,vUv);
    textureColor.rgb *= vElevation*2.0+uElevation;

    gl_FragColor = textureColor ; 
  }