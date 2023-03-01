
import { Transform } from "./transform.js";
export default class Circle{

    constructor(centroidX,centroidY,radius=0.03,cut1=45,cut2=315,type='circle',color=[1,1,0,1],visited=false){
        this.type = type;
        this.centroidX = centroidX;
        this.centroidY = centroidY;
        this.radius = radius; 
        let arr = [];
        //get vertex for triangles for each angle and add it to the vertextList for webgl 
        //cut1 and cut2 used to specify which region to not push vertex. 
        for(let i = 0.0 ; i<= 360; i++){
            if(i>=cut1 && i<=cut2){
                let j = i*Math.PI/180;
                let j_1 = (i+1)*Math.PI/180; 
                arr.push(centroidX);
                arr.push(centroidY);
                arr.push(0);

                arr.push(centroidX+radius*Math.cos(j));
                arr.push(centroidY+radius*Math.sin(j));
                arr.push(0);

                arr.push(centroidX+radius*Math.cos(j_1));
                arr.push(centroidY+radius*Math.sin(j_1));
                arr.push(0);   
            }
            
        }
        this.vertexPositions = new Float32Array(arr);
        this.color = color;
        this.visited = visited; 
        this.transform = new Transform();

    }
}