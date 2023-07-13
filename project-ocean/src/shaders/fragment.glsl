uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

varying float vElevation;
varying vec3 vFogPosition;

void main() {

    float distance = length(vFogPosition);
    float fogFactor = (distance - uFogNear)/(uFogFar-uFogNear);
    fogFactor = clamp(fogFactor, 0.0, 1.0);

    float mixedStrength = (vElevation+uColorOffset)*uColorMultiplier;
    vec3 mixedColor = mix(uDepthColor,uSurfaceColor,mixedStrength);
    vec4 originalColor = vec4(mixedColor,1.0);

    vec4 finalColor = mix(originalColor,vec4(uFogColor,1.0),fogFactor);
    gl_FragColor = finalColor;


}