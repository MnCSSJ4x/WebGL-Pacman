export class WebGLRenderer 
{
	constructor() 
	{
		this.domElement = document.createElement("canvas");
		this.gl =
			this.domElement.getContext("webgl",{preserveDrawingBuffer: true}) ||
			this.domElement.getContext("experimental-webgl");

		if (!this.gl) throw new Error("WebGL is not supported");

		this.setSize(50, 50);
		this.clear(1.0, 1.0, 1.0, 1.0);
		// this.resolution = new Float32Array([this.domElement.width,this.domElement.height,1.0]);
	}


	setSize(width, height) 
	{
		//w-x=h-y
		this.domElement.width = width;
		this.domElement.height = height;
		// let val = Math.min(this.domElement.width,this.domElement.height);
		this.gl.viewport(0, 0, this.domElement.width, this.domElement.height);
		this.resolution = new Float32Array([this.gl.canvas.width,this.gl.canvas.height,1.0]);
	}

	clear(r, g, b, a) 
	{
		this.gl.clearColor(r, g, b, a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	setAnimationLoop(animation) 
	{
		function renderLoop() {
			animation();
			window.requestAnimationFrame(renderLoop);
		}

		renderLoop();
	}

	// render function executes all the time
	// can be thought of as the main game loop
	// @param {scene} - Scene to render
	// @param {shader} - Shader to use
	// for each primitive in the scene, updates the transform matrix and renders the primitve
	render(scene, shader) 
	{
		let resolution = this.resolution;
		scene.primitives.forEach(function (primitive) {
		
			primitive.transform.updateModelTransformMatrix();

			shader.bindArrayBuffer(
				shader.vertexAttributesBuffer,
				primitive.vertexPositions
			);

			shader.fillAttributeData(
				"aPosition",
				primitive.vertexPositions,
				3,
				3 * primitive.vertexPositions.BYTES_PER_ELEMENT,
				0
			);
			
			shader.setUniform3f("uResolution", resolution);
			shader.setUniform4f("uColor", primitive.color);
			shader.setUniformMatrix4fv("uModelMatrix", primitive.transform.modelTransformMatrix);

			// Draw
			// if(primitive.type === 'pellets' || primitive.type ==='powerPellets'){
			// 	shader.drawArrays(primitive.vertexPositions.length/3,0);
				
			// }

				shader.drawArrays(primitive.vertexPositions.length / 3);
			
			
		});
	}


	glContext() 
	{
		return this.gl;
	}

	getCanvas() 
	{
		return this.domElement;
	}


	// gets mouse click reduced to the form of clip space
	// uses the mouseEvent target attribute to calculate the mouse position in clip space of webGL canvas
	mouseToClipCoord(mouseX,mouseY) 
	{
		// convert the position from pixels to 0.0 to 1.0
		mouseX =  mouseX / this.domElement.width;
		mouseY =  mouseY / this.domElement.height;

		mouseX = mouseX * 2 - 1;
		mouseY = mouseY * 2 - 1;

		// flip the axis	
		mouseY = -mouseY; // Coordinates in clip space

		return [mouseX, mouseY]
		// TO DO 
	}	
}
