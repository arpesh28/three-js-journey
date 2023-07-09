varying vec2 vUv;

void main()
{
    //  Pattern 3
    // float strength = vUv.x;

    //  Pattern 4
    // float strength = vUv.y;

    //  Pattern 5
    // float strength = 1.0 - vUv.y;
    
    //  Pattern 6
    // float strength = vUv.y * 8.0;
     
    //  Pattern 7
    // float strength = mod(vUv.y*10.0,1.0);

    //  Pattern 8
    float strength = step(0.5,mod(vUv.y*10.0,1.0));

    

    gl_FragColor = vec4(strength,strength, strength, 1.0);
}