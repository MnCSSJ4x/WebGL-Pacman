import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export class Transform
{
	constructor()
	{
		//translation
		this.translate = vec3.create();
		vec3.set(this.translate, 0, 0, 0);

		//translation to origin 
		this.shiftOrigin = vec3.create();
		vec3.set(this.shiftOrigin, 0, 0, 0);

		//scale
		this.scale = vec3.create();
		vec3.set(this.scale, 1, 1, 1);
		
		//rotation about axis
		this.rotationAngle = 0;
		this.rotationAxis = vec3.create();
		vec3.set(this.rotationAxis, 0, 0, 1);
		
		//rotation at a point other than origin 
		this.rotationPoint = vec3.create();
		vec3.set(this.rotationPoint,0,0,0); 
		this.rotationReset = vec3.create();
		vec3.set(this.rotationReset,0,0,0); 
		
		//matrix of transformation 
		this.modelTransformMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);

		this.updateModelTransformMatrix();
	}
	setTranslate(x,y){
		vec3.set(this.translate, this.translate[0]+x, this.translate[1]+y, 0);

	}
	setCoordinate(x,y){
		vec3.set(this.translate, x, y, 0);
	}
	getTranslate(){
		return this.translate; 
	}
	rotationByAngle(angle){
		this.rotationAngle+=angle; 

	}
	setRotationAngle(angle){
		this.rotationAngle = angle;
	}
	setRotationAxis(x, y, z) {
		vec3.set(this.rotationAxis, x, y, z);
	}
	
	setRotationPoint(x, y, z) {
		this.rotationPoint = [x, y, z];
	}

	setScale(x, y, z) {
		vec3.set(this.scale, x, y, z);
	}
	updateModelTransformMatrix()
	{
		
		// 1. Reset the transformation matrix
		mat4.identity(this.modelTransformMatrix);
		// 2. Use the current transformations values to calculate the latest transformation matrix
		// translation
		this.matTranslation = mat4.create();
		mat4.translate(this.matTranslation, this.modelTransformMatrix, this.translate);

		//rotation about known point 
		this.matRotation = mat4.create();
		let temp = vec3.create();
		vec3.set(temp, this.rotationPoint[0], this.rotationPoint[1], this.rotationPoint[2]);
		//translate to origin 
		mat4.translate(this.matRotation, this.modelTransformMatrix, temp);
		mat4.rotate(this.matRotation, this.matRotation, this.rotationAngle, this.rotationAxis);
		vec3.set(temp, -this.rotationPoint[0], -this.rotationPoint[1], -this.rotationPoint[2]);
		mat4.translate(this.matRotation, this.matRotation, temp);

		// Scaling
		this.matScaling = mat4.create();
		temp = vec3.create();
		vec3.set(temp, this.rotationPoint[0], this.rotationPoint[1], this.rotationPoint[2]);
		mat4.translate(this.matScaling, this.modelTransformMatrix, temp);
		mat4.scale(this.matScaling, this.matScaling, this.scale);
		vec3.set(temp, -this.rotationPoint[0], -this.rotationPoint[1], -this.rotationPoint[2]);
		mat4.translate(this.matScaling, this.matScaling, temp);

		// Linear transformation
		mat4.multiply(this.modelTransformMatrix, this.matTranslation, this.matScaling);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, this.matRotation);
	}	
}