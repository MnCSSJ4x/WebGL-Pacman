export const vertexShaderSrc = `      
	attribute vec3 aPosition;
	uniform vec3 uResolution;
    uniform mat4 uModelMatrix;
    attribute vec3 aColor; 
	void main () {     
		vec3 normalised = (uModelMatrix*vec4(aPosition, 1.0)).xyz/uResolution;
		vec3 twoNormalised = normalised*2.0;
		vec3 clip = twoNormalised -1.0;        
		gl_Position =  vec4(clip*vec3(1,-1,1),1.0);
        gl_PointSize = 10.0; 
	}                          
`;