import { vec4 } from 'https://cdn.skypack.dev/gl-matrix';

import {Transform} from './transform.js';

export default class Rectangle
{
	constructor(centroidX, centroidY, color, isSquare=false, width=0.25, height=0.5)
	{

		this.type = 'rectangle';
	
		this.centroidX = centroidX;
		this.centroidY = centroidY;
		this.width = width;
		this.height = height;
		this.color = color;
		

		if (isSquare){
            this.height = this.width;
        }
		//6 vertex required for 2 triangles to define the rectangle/square 
		this.vertexPositions = new Float32Array([
			//  x , y,  z
            this.centroidX - this.width/2, this.centroidY + this.height/2, 0.0,
			this.centroidX + this.width/2, this.centroidY + this.height/2, 0.0,
			this.centroidX + this.width/2, this.centroidY - this.height/2, 0.0,
            this.centroidX + this.width/2, this.centroidY - this.height/2, 0.0,
			this.centroidX - this.width/2, this.centroidY - this.height/2, 0.0,
            this.centroidX - this.width/2, this.centroidY + this.height/2, 0.0,
		]);

		this.color = color;
		this.transform = new Transform(0,0);
	}
};