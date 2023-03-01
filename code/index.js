import { Scene, Triangle, WebGLRenderer, Shader } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';
import Circle from './lib/circle.js';
import {tilemap1} from './lib/tilemap1.js';
import { tilemap2 } from './lib/tilemap2.js';
import { tilemap3 } from './lib/tilemap3.js';
import Rectangle from './lib/rectangle.js';



console.log(tilemap1.length,tilemap1[0].length); 

//setting canvas width and height 
let canvasWidth = window.innerWidth-20;
let canvasHeight = window.innerHeight-20;

//instantiating a renderer object for webgl canvas 
const renderer = new WebGLRenderer();

//Modulo counter and mazes setup which cycles through maze configuration on click. 
let mazeConfig = 0;
let mazes = [tilemap1,tilemap2,tilemap3];

//setting size of the webgl canvas
renderer.setSize(canvasWidth, canvasHeight);

//injecting the webgl canvas onto the HTML page
document.body.appendChild(renderer.domElement);

//setting up a shader and linking our webgl program with the glsl shader 
const shader = new Shader(
	renderer.glContext(),
	vertexShaderSrc,
	fragmentShaderSrc
);
shader.use();

//creation of scene object 
const scene = new Scene();


/* Mouse Event Handling Starts*/

//Mode used to know whether mouseclicks are valid 
let mode = 0; 
//to signify movement after pacman latches onto the mouse
let move = 0;

//initial value of pacman before it latches onto the mouse
let startX = 0;
let startY = 0;

//To signify whether the pacman is latched onto the mouse or not 
let pacHit = false ;

//click event 
document.addEventListener("click", event => {
    /*if block which deals when the click is done 2nd time after 
    latching onto it or the click involved with dropping the pacman */
        if(move){
            //reset all the variables for the next click
            //check whether the pacman is landing on a valid location
            //if valid then drop it onto the required position. Compute required pixel value of a grid coordinate and use that. 
            //if not then return back to the old position which is stored in the variable. 
                move=!move; 
                pacHit=0; 
                let flag = 1; 
                let c = null; 
                for(let i = 0 ; i<scene.primitives.length ; i++){
                    c  = getGridIndex(pacman.transform.translate[0]+pacman.centroidX,
                        pacman.transform.translate[1]+pacman.centroidY,
                        pixelVals,15);
                    if(c[0]!=-1 || c[1]!=-1){
                        flag = 0; 
                        break;

                    }  
                }
                if(flag===1){

                }
                else{
                    console.log(grid[c[0]][c[1]]);
                    if(grid[c[0]][c[1]]!=0)
                    {
                        pacman.transform.setTranslate(pixelVals[c[0]][c[1]][0]-pacman.transform.translate[0]-pacman.centroidX,
                        pixelVals[c[0]][c[1]][1]-pacman.transform.translate[1]-pacman.centroidY  );
                        // moved=true;
                    }
                    else{
                        pacman.transform.setTranslate(startX-pacman.transform.translate[0],
                            startY-pacman.transform.translate[1]);
                    }
                
                }

            }
        /* else if deals with pacman hit detection by mouse i.e if we clicked onto pacman or not*/
        else if(mode==1){
            //check whether the current screen coordinates "almost" match the pacman coordinates
            //if yes enable the state of hit and then latch the pacman on to mouse. 
            let val = [event.clientX-renderer.getCanvas().style.left,event.clientY-renderer.getCanvas().style.top];
           
            pacHit = isPacman(val[0],val[1],20); 
            console.log(pacHit)
            if(pacHit){
                console.log("PAC HIT")
                move=!move;
                startX = pacman.transform.translate[0];
                startY = pacman.transform.translate[1];
            }
            
    
        }
    
})
document.addEventListener('mousemove', (event) => {
    //This deals with mouse movement when pacman is latched onto it. That is the click made before this was on the pacman
    if(mode==1){
        if(pacHit){
            let newVal=[event.clientX-renderer.getCanvas().style.left,event.clientY-renderer.getCanvas().style.top];
                pacman.transform.setTranslate(newVal[0]-pacman.transform.translate[0]-pacman.centroidX,newVal[1]-pacman.transform.translate[1]-pacman.centroidY,0);
                console.log(event)

        }
    }
});
/* Mouse Event Handling Ends*/


document.addEventListener("keydown", event => {
    eventHandler(event);
})

/*Initialising maze and pacman*/ 

/* color palette for triangle */ 
let colTri = [[1,0.5,0,1],[1,0,0,1],[0.7,1,0,1],[0.5,1,1,1]];

/* Maze Addition */ 
let grid = mazes[mazeConfig];

let tileLength = 0;
let tileHeight = 0;

let diameter = 0;
let offsetX = 0;
let offsetY = 0;



let pixelVals = []
let tolerance = 0;
let pacman = null;
let pelletList = [];
let powerPelletsList = [];
let onPowerPellet = false; 

let pacX = 0;
let pacY = 0;
/* initialise function for grid */ 

function addPrimitives(grid){
    //looks at the grid value and based on it add primitives. 
    pixelVals = [];
    scene.primitives.length = 0;
    pelletList = [];
    powerPelletsList = [];
    tileLength = 25;
    tileHeight = 25; 

    diameter = Math.min(tileHeight,tileLength); 
    offsetX = tileLength;
    offsetY = tileHeight; 
    
    let y = 0; 
    let count = 0;
    let pacX = 0;
    let pacY = 0;
    pacman = null;
    tolerance = 0; 

    for(let row = 0; row<grid.length ; row++){
        let temp = []
        for(let column = 0; column<grid[0].length;column++){
            temp.push([]);
        }
        pixelVals.push(temp);
    }
    
    let k = 0 ;
    
    for(let row = 0; row<grid.length ; row++){
        let x = 0 ; 
        for(let column = 0; column<grid[0].length;column++){
            if(grid[row][column]==0){
                    let square = new Rectangle(tileLength/2+x*offsetX,tileHeight/2+y*offsetY,[0.5,0,0.5,1],false,tileLength,tileHeight);
                    scene.add(square); 
                    pixelVals[row][column] = [square.centroidX,square.centroidY];
            }
            if(grid[row][column]==1){
                
                let dot = new Circle(tileLength/2+x*offsetX,tileHeight/2+y*offsetY,diameter/10,0,360,'pellets',[0,0,0,1]);
                pelletList.push(dot);
                scene.add(dot); 
                if(count==0){
                    pacX =tileLength/2+x*offsetX;
                    pacY =tileHeight/2+y*offsetY;
                    count = 1 ;
                    
                }
                pixelVals[row][column] = [dot.centroidX,dot.centroidY];
               
            
            }
            if(grid[row][column]==2){
               
                let v1 = [x*offsetX,y*offsetY+tileHeight]
                let v2 = [tileLength+x*offsetX,y*offsetY+tileHeight]
                let v3 = [tileLength/2+x*offsetX,y*offsetY]
                let triangle = new Triangle(v1,v2,v3,
                    colTri[k],tileLength/2+x*offsetX,tileHeight/2+y*offsetY);  
                
                k++;  
                pixelVals[row][column] = [triangle.centroidX,triangle.centroidY];
                scene.add(triangle);
            }
            if(grid[row][column]==3){
                let dot = new Circle(tileLength/2+x*offsetX,tileHeight/2+y*offsetY,diameter/3,0,360,'powerPellets',[1,0,0,1]);
                scene.add(dot);
                powerPelletsList.push(dot);
                pixelVals[row][column] = [dot.centroidX,dot.centroidY];
            }
            x++;
        }
        y++;
    }
        
    /* Pacman */
    pacman = new Circle(
        pacX,pacY,diameter/2,45,315,'pacman'
    )
    
    scene.add(pacman);
    console.log(pacman)
    
    //making sure that pacman rotation point is on the centroid and not elsewhere
    pacman.transform.setRotationPoint(pacX,pacY,0);
    pacman.transform.setRotationPoint(pacX,pacY,0);
    
    tolerance = 1e-5;
}
let moved = true; 
addPrimitives(grid)
/* Keyboard Event Handling Begins*/ 
function eventHandler(event){
    console.log(event);
    let c = -1
    let X = -1;
    let Y = -1; 
    let newX = 0;
    let newY = 0;
    /* For each case of movement we need to find out whether the movement is permitted or not. This is done
    with the help of pixelValues and gridValues having a 1 to 1 correspondance and using them to find out where pacman is going.
    If it is going to a wall don't let it go. 
    Anyother case it will go and trigger the moved variable
    The moved variable will allow us to color a pellet or trigger a power pellet action 
    Again we will use the 1 to 1 correspondance between pixelValue and grid to determine kind of pellet and act 
    accordingly */
        if(event.key==='ArrowLeft'){
            console.log(pacman.transform.translate);
             newX = pacman.centroidX+pacman.transform.translate[0]-offsetX;
             newY = pacman.centroidY+pacman.transform.translate[1];
            c = checkStatusOfGrid(newX,newY,pixelVals,tolerance=1e-5);
            
            if(c===0){
                console.log("in Wall");
                moved = false; 
            }
            else if(c===1){
                pacman.transform.setTranslate(-offsetX,0);
                pacman.transform.setRotationAngle(-180*Math.PI/180);
                X= newX+offsetX; 
                Y= newY;
                moved =true; 
            } 
            else if(c===3){
                //power pellets 
                pacman.transform.setTranslate(-offsetX,0);
                pacman.transform.setRotationAngle(-180*Math.PI/180);
                X= newX+offsetX; 
                Y= newY;
                moved =true; 
          

            }
            else{
                //triangle 
                X= newX+offsetX; 
                Y= newY;
                pacman.transform.setTranslate(-offsetX,0);
                pacman.transform.setRotationAngle(-180*Math.PI/180);
                moved =true; 
            }
           
            //x axis left 
        }
        else if(event.key==='ArrowRight'){
            newX = pacman.centroidX+pacman.transform.translate[0]+offsetX;
            newY = pacman.centroidY+pacman.transform.translate[1];
            //x axis right
            console.log(pacman.transform.translate);
            c = checkStatusOfGrid(newX,newY,pixelVals,tolerance=1e-5);
            if(c===0){
                console.log("in Wall");
                moved=false;
            }
       
            else if(c==1){
                pacman.transform.setTranslate(offsetX,0);
                pacman.transform.setRotationAngle(0*Math.PI/180);
                X= newX-offsetX; 
                Y= newY;
                moved =true; 
   
            }
            else if(c===3){
                pacman.transform.setTranslate(offsetX,0);
                pacman.transform.setRotationAngle(0*Math.PI/180);
                X= newX-offsetX; 
                Y= newY;
                moved =true; 

            }
            else{
                X= newX-offsetX; 
                Y= newY;
                pacman.transform.setTranslate(offsetX,0);
                pacman.transform.setRotationAngle(0*Math.PI/180);
                moved =true; 
            }
            
        }  

        else if(event.key==='ArrowDown') {
            newX = pacman.centroidX+pacman.transform.translate[0];
            newY = pacman.centroidY+pacman.transform.translate[1]+offsetY;
            c = checkStatusOfGrid(newX,newY,pixelVals,tolerance=1e-5);
            if(c===0){
                console.log("in Wall");
                moved = false; 
            }
       
            else if(c===1){
                pacman.transform.setTranslate(0,+offsetY);
                pacman.transform.setRotationAngle(90*Math.PI/180);
                X= newX; 
                Y= newY-offsetY;
                moved = true; 
            }
            else if(c===3){
                pacman.transform.setTranslate(0,+offsetY);
                pacman.transform.setRotationAngle(90*Math.PI/180);
                X= newX; 
                Y= newY-offsetY;
                moved =true; 
               

            }
            else{
                X= newX; 
                Y= newY-offsetY;
                pacman.transform.setTranslate(0,+offsetY);
                pacman.transform.setRotationAngle(90*Math.PI/180);
                moved =true; 
            }
         
            //y axis down
        }
        else if(event.key==='ArrowUp'){
            newX = pacman.centroidX+pacman.transform.translate[0];
            newY = pacman.centroidY+pacman.transform.translate[1]-offsetY;
            c = checkStatusOfGrid(newX,newY,pixelVals,tolerance=1e-5);
            if(c===0){
                console.log("in Wall");
                moved = false; 
            }
           
            else if(c===1){
                pacman.transform.setTranslate(0,-offsetY);
                pacman.transform.setRotationAngle(-90*Math.PI/180);
                
                X= newX; 
                Y= newY+offsetY;
                moved =true; 
            }

            else if(c===3){
                pacman.transform.setTranslate(0,-offsetY);
                pacman.transform.setRotationAngle(-90*Math.PI/180);
                X= newX; 
                Y= newY+offsetY;
                moved =true; 

            }
            else{
                X= newX; 
                Y= newY+offsetY;
                pacman.transform.setTranslate(0,-offsetY);
                pacman.transform.setRotationAngle(-90*Math.PI/180);
                moved =true; 
            }
   
            //y axis up 
        }
        /* In case of pacman rotation it is simple as we have already set rotation axis properly. A simple rotation
        about the axis will get the job done */
        else if(event.key==='('){
            c = checkStatusOfGrid(pacman.centroidX+pacman.transform.translate[0],pacman.transform.translate[1]+pacman.centroidY,pixelVals,tolerance=1e-5);
            if(!onPowerPellet){
                pacman.transform.rotationByAngle(-45*Math.PI/180);
            }
            
        }
            //anticlockwise
        else if(event.key===')'){
            c = checkStatusOfGrid(pacman.centroidX+pacman.transform.translate[0],pacman.centroidY+pacman.transform.translate[1],pixelVals,tolerance=1e-5);
            if(!onPowerPellet){
                pacman.transform.rotationByAngle(45*Math.PI/180);
            }
            
        } 
            //clockwise
        else if(event.key==='['){
            rotateMaze(-90*Math.PI/180,grid);
        }
            //maze acw 
        else if(event.key===']'){
            rotateMaze(90*Math.PI/180,grid);
        }
            //maze cw
        /* Cycles through maze configuration using a modulo counter */ 
        else if(event.key=== 'c'){
            mazeConfig++;
            mazeConfig=mazeConfig%3;
            console.log(mazeConfig, "MAZE CONFIG");
            addPrimitives(mazes[mazeConfig]);
            grid = mazes[mazeConfig];
        }
        /* Trigger Modify mode */
        else if(event.key==='m'){
            c = checkStatusOfGrid(pacman.transform.translate[0]+pacman.centroidX,pacman.transform.translate[1]+pacman.centroidY,pixelVals,tolerance=1e-5);
            if(pacman.transform.scale[0]===1 && pacman.transform.scale[1]===1){
                mode = !mode; 
                
            }
            else{
                moved=true;
            }
            
        }
        else{
            c = checkStatusOfGrid(pacman.transform.translate[0]+pacman.centroidX,pacman.transform.translate[1]+pacman.centroidY,pixelVals,tolerance=1e-5);

        }


    if(moved){
        if(c===3){
            console.log(tolerance);
            for(let i = 0 ; i<powerPelletsList.length ; i++){
                if(Math.abs(powerPelletsList[i].centroidX-newX) <tolerance && Math.abs(powerPelletsList[i].centroidY-newY)<tolerance ){
                     if(!powerPelletsList[i].visited){
                        changeTriangleColor();
                        powerPelletsList[i].visited = true; 
                        pacman.transform.setScale(1.5,1.5,1);
                        
                     }
                }
             }
           
        }
        else
        {
            
             resetTriangleColor();
             pacman.transform.setScale(1,1,1)
             
             
        }
        for(let i = 0 ; i<pelletList.length ; i++){
            if(Math.abs(pelletList[i].centroidX-X) <tolerance && Math.abs(pelletList[i].centroidY-Y)<tolerance ){
                 pelletList[i].color = [0,1,0,1];
                 pelletList[i].visited = true; 
            }
         }
        
    }

}
/* For translation interaction with grid */
function checkStatusOfGrid(x,y,pixelVals,tolerance = 1e-5){
    for(let row = 0; row<pixelVals.length ; row++){
        for(let column = 0; column<pixelVals[0].length;column++){
            if(Math.abs(pixelVals[row][column][0]-x) <tolerance && Math.abs(pixelVals[row][column][1]-y)<tolerance){
                return grid[row][column]; 
            }
        }
}}
/* For mouse interaction with pacman */

function isPacman(x,y,tolerance=0.5e-1){
    
    for(let i = 0 ; i<scene.primitives.length ; i++){
        if(scene.primitives[i].type==='pacman'){
            let pacX= scene.primitives[i].centroidX +scene.primitives[i].transform.translate[0];
            let pacY= scene.primitives[i].centroidY +scene.primitives[i].transform.translate[1];
            if(Math.abs(pacX-x) <tolerance && Math.abs(pacY-y)<tolerance){
                return true; 
            }
        }
    }

} 
function getGridIndex(x,y,pixelVals,tolerance = 5e-2){
   
    for(let row = 0; row<pixelVals.length ; row++){
        for(let column = 0; column<pixelVals[0].length;column++){
            if(Math.abs(pixelVals[row][column][0]-x) <tolerance && Math.abs(pixelVals[row][column][1]-y)<tolerance){
                return [row,column];
            }
        }
    }
    return [-1,-1];
}
/* Maze Rotation */

function rotateMaze(angle){
    /* Intially swap all dimensional values.
       Update the grid value based on orientation of rotation 
       Precompute the new pixel values for the new 1-1 mapping of grid and pixel values 
       For each primitive 
        if(triangle) apply only item translation to new point using rotateItem()
        if(pacman) apply rotation about its own axis and then translation using rotateItem()
        if(triangle) apply translation on it but update the rotation point of the triangle to center of the maze
        for everything else apply rotation after setting rotation point to center of the maze
         and apply corresponding translation to update centroid values
       Update the old pixelVals matrix to the updated one.
    */


    let t_dash = canvasWidth;
    canvasWidth = canvasHeight;
    canvasHeight = t_dash; 

    let isCW = 1; 

    let t = tileLength; 

    
    tileLength = tileHeight; 
    tileHeight = t; 
    if(angle>0){
        grid = rotateMatrix90Degrees(grid);

    }
        
    else {
        grid = rotateMatrix90DegreesAntiClockwise(grid);
        isCW=0;
    }
    diameter = Math.min(tileHeight,tileLength); 
    t = offsetX; 
    offsetX = offsetY; 
    offsetY = t; 
    let newPixel = computeClipFromGrid(grid); 
    console.log(newPixel)
    for(let i = 0 ; i<scene.primitives.length;i++){

        if(scene.primitives[i].type==='pacman'){
            scene.primitives[i].transform.rotationByAngle(angle); 
            rotateItem(scene.primitives[i],newPixel,isCW);  
       

        }
        else if(scene.primitives[i].type==='triangle'){
            scene.primitives[i].transform.setRotationPoint((grid.length*tileLength)/2,(grid[0].length*tileHeight)/2,0);
            rotateItem(scene.primitives[i],newPixel,isCW);  
        }
        else{
            scene.primitives[i].transform.setRotationPoint((grid.length*tileLength)/2,(grid[0].length*tileHeight)/2,0);
            scene.primitives[i].transform.rotationByAngle(angle); 
            rotateItem(scene.primitives[i],newPixel,isCW);  
        }
           
    }
    pixelVals = newPixel;
    
}
function rotateItem(element,newpixelVals,isCW=true){
    //use old clip val to find element in corresponding grid 
    //create new clip matrix 
    //find corresponding coordinate in rotated clip val; 
    //update all elements centroids based on new pixelVals; 
    //translate element to that grid coordinate;  
    let x = 0;
    let y = 0; 
   
    x = element.centroidX;
    y = element.centroidY; 
    
    if(element.type==='pacman'){
        x= element.centroidX +element.transform.translate[0];
        y= element.centroidY +element.transform.translate[1];
    }
    
    let pixelValsOld = pixelVals; 
    let r = -1;
    let c = -1;
    //find coordinates of object 
    for(let row = 0; row<pixelValsOld.length ; row++){
        for(let column = 0; column<pixelValsOld[0].length;column++){
            if(Math.abs(pixelValsOld[row][column][0]-x) <tolerance && Math.abs(pixelValsOld[row][column][1]-y)<tolerance){
                r = row;
                c = column; 
            }
        }
    }
   

    //recompute clip vals; 
    let targetX = -1;
    let targetY = -1; 
    //then translate to the index; 
    if(isCW){
         targetX = c;
         targetY = pixelValsOld.length-r-1;
    }
    else{
        targetX = pixelValsOld[0].length-c-1;
        targetY = r; 

    }
   
    let newX = newpixelVals[targetX][targetY][0];
    let newY = newpixelVals[targetX][targetY][1];
    let diffX = newX-x;
    let diffY = newY-y; 
    if(element.type==='triangle' ){
        element.transform.setTranslate(diffX,diffY,0);
        element.centroidX = newX;
        element.centroidY = newY; 
    }
    if(element.type==='pacman'){
        element.transform.setTranslate(diffX,diffY);
    }
    else{
        
        element.centroidX = newX;
        element.centroidY = newY; 
    }
    
}

function computeClipFromGrid(grid){
    //helper method which simply does the pixelVals matrix computation similar to initialisation 
    let newpixelVals = []; 
    for(let row = 0; row<grid.length ; row++){
        let temp = [];
        for(let column = 0; column<grid[0].length;column++){
            temp.push([]);
        }
        newpixelVals.push(temp);
    }
    let y = 0;

    for(let row = 0; row<grid.length ; row++){
        let x = 0 ; 
        for(let column = 0; column<grid[0].length;column++){
            if(grid[row][column]==0){
                    newpixelVals[row][column] = [tileLength/2+x*offsetX,tileHeight/2+y*offsetY];
            }
            if(grid[row][column]==1){
                newpixelVals[row][column] = [tileLength/2+x*offsetX,tileHeight/2+y*offsetY];
            }
            if(grid[row][column]==2){
                newpixelVals[row][column] = [tileLength/2+x*offsetX,tileHeight/2+y*offsetY];
            }
            if(grid[row][column]==3){     
                newpixelVals[row][column] = [tileLength/2+x*offsetX,tileHeight/2+y*offsetY];
            }
            x++;
        }
        y++;
    }
    return newpixelVals; 
    
}

function rotateMatrix90Degrees(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    const rotatedMatrix = new Array(n);
    for (let i = 0; i < n; i++) {
      rotatedMatrix[i] = new Array(m);
      for (let j = 0; j < m; j++) {
        rotatedMatrix[i][j] = matrix[m - j - 1][i];
      }
    }
    return rotatedMatrix;
  }
function rotateMatrix90DegreesAntiClockwise(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    const rotatedMatrix = new Array(n);
    for (let i = 0; i < n; i++) {
      rotatedMatrix[i] = new Array(m);
      for (let j = 0; j < m; j++) {
        rotatedMatrix[i][j] = matrix[j][n - i - 1];
      }
    }
    return rotatedMatrix;
  }


/* function for traingle color with power pellet */ 
function changeTriangleColor(){
    for(let i = 0; i<scene.primitives.length ; i++){
        if(scene.primitives[i].type =='triangle'){
            scene.primitives[i].color=scene.primitives[i].powerColor;
        }
    }

}
function resetTriangleColor(){
    onPowerPellet = false; 
    for(let i = 0; i<scene.primitives.length ; i++){
        if(scene.primitives[i].type =='triangle'){
            scene.primitives[i].color=scene.primitives[i].backupCol;
        }
    }

}


/* Game Loop */ 

renderer.setAnimationLoop(animation);

function animation() 
{
	renderer.clear(0.9, 0.9, 0.9, 1);
	renderer.render(scene, shader);
}







