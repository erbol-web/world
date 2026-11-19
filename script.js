(function(){
if(!window.THREE){
 console.error("Three.js не загрузился");
 return;
}

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,3000);
camera.position.set(0,115,260);

const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
document.getElementById("app").appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff,.16));
const light=new THREE.PointLight(0xffffff,5,0);
scene.add(light);

/* stars */
const starGeo=new THREE.BufferGeometry();
const starPos=new Float32Array(6000*3);

for(let i=0;i<6000;i++){
 const r=700+Math.random()*1800;
 const a=Math.random()*Math.PI*2;
 const b=Math.acos(2*Math.random()-1);

 starPos[i*3]=r*Math.sin(b)*Math.cos(a);
 starPos[i*3+1]=r*Math.cos(b);
 starPos[i*3+2]=r*Math.sin(b)*Math.sin(a);
}

starGeo.setAttribute(
 "position",
 new THREE.BufferAttribute(starPos,3)
);

scene.add(
 new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({
   color:0xffffff,
   size:1.25
  })
 )
);

/* sun */
const sun=new THREE.Mesh(
 new THREE.SphereGeometry(12,48,48),
 new THREE.MeshBasicMaterial({
  color:0xffb52e
 })
);

scene.add(sun);

const sunGlow=new THREE.Mesh(
 new THREE.SphereGeometry(16,48,48),
 new THREE.MeshBasicMaterial({
  color:0xff6a00,
  transparent:true,
  opacity:.18,
  side:THREE.BackSide
 })
);

scene.add(sunGlow);

const sunHalo1=new THREE.Mesh(
 new THREE.SphereGeometry(20,48,48),
 new THREE.MeshBasicMaterial({
  color:0xff8a18,
  transparent:true,
  opacity:.055,
  side:THREE.BackSide,
  depthWrite:false
 })
);

scene.add(sunHalo1);

const sunHalo2=new THREE.Mesh(
 new THREE.SphereGeometry(27,48,48),
 new THREE.MeshBasicMaterial({
  color:0xff5a00,
  transparent:true,
  opacity:.025,
  side:THREE.BackSide,
  depthWrite:false
 })
);

scene.add(sunHalo2);

/* planet texture generator */
function makeTexture(type){
 const c=document.createElement("canvas");
 c.width=1024;
 c.height=512;

 const x=c.getContext("2d");

 const bands={
  mercury:["#555","#888","#606060","#777","#4d4d4d"],
  venus:["#9e6835","#d29a58","#a96f37","#dfad6a","#98602f"],
  earth:["#063c72","#0b568d","#0b4277","#0d6091","#083b70"],
  mars:["#7c2d20","#ad4630","#873323","#bc5035","#762a20"],
  jupiter:["#9d6a4d","#d1a57a","#825541","#e0c096","#a87352","#d5ad83"],
  saturn:["#a98b61","#d6c18f","#967b56","#dfcc9e","#b09468"],
  uranus:["#4c9da0","#75c1c0","#5aaeb0","#83cbca","#4b9b9e"],
  neptune:["#193887","#2857b4","#18327c","#3568c7","#17347f"]
 }[type];

 for(let y=0;y<512;y++){
  const band=Math.floor(y/512*bands.length);
  const wave=Math.sin(y*.055)*7+Math.sin(y*.013)*5;

  x.fillStyle=bands[band];
  x.fillRect(0,y,1024,1);

  x.globalAlpha=.10;
  x.fillStyle="#ffffff";
  x.fillRect(0,y+wave,1024,1);
  x.globalAlpha=1;
 }

 /* Fine atmospheric / surface detail */
 for(let i=0;i<900;i++){
  const px=Math.random()*1024;
  const py=Math.random()*512;
  const r=.5+Math.random()*3.5;

  if(type==="earth"){
   x.fillStyle=Math.random()>.55
    ?"rgba(255,255,255,.055)"
    :"rgba(0,0,0,.06)";
  }else{
   x.fillStyle=Math.random()>.5
    ?"rgba(255,255,255,.045)"
    :"rgba(0,0,0,.055)";
  }

  x.beginPath();
  x.arc(px,py,r,0,Math.PI*2);
  x.fill();
 }

 /* Planet-specific details */
 if(type==="mercury"){
  for(let i=0;i<180;i++){
   const px=Math.random()*1024,py=Math.random()*512,r=1+Math.random()*9;

   x.fillStyle=`rgba(35,35,35,${.12+Math.random()*.25})`;

   x.beginPath();
   x.arc(px,py,r,0,Math.PI*2);
   x.fill();

   x.strokeStyle="rgba(190,190,190,.12)";
   x.lineWidth=.7;
   x.stroke();
  }
 }

 if(type==="venus"){
  for(let i=0;i<75;i++){
   const y=Math.random()*512;

   x.strokeStyle=`rgba(255,220,170,${.08+Math.random()*.12})`;
   x.lineWidth=3+Math.random()*8;

   x.beginPath();
   x.moveTo(0,y);
   x.bezierCurveTo(280,y-35,700,y+35,1024,y-10);
   x.stroke();
  }
 }

 if(type==="earth"){
  x.fillStyle="#1d713c";

  const land=[
   [175,150,100,65],
   [250,250,120,72],
   [365,165,70,90],
   [475,285,130,60],
   [620,175,115,72],
   [735,295,105,75],
   [845,175,80,52],
   [910,365,60,35],
   [95,330,75,40]
  ];

  land.forEach(a=>{
   x.beginPath();
   x.ellipse(a[0],a[1],a[2],a[3],0,0,Math.PI*2);
   x.fill();
  });

  x.fillStyle="#2e9149";

  for(let i=0;i<70;i++){
   x.beginPath();
   x.ellipse(
    Math.random()*1024,
    30+Math.random()*452,
    5+Math.random()*20,
    3+Math.random()*12,
    0,
    0,
    Math.PI*2
   );
   x.fill();
  }

  x.fillStyle="rgba(255,255,255,.65)";
  x.fillRect(0,0,1024,16);
  x.fillRect(0,496,1024,16);
 }

 if(type==="mars"){
  for(let i=0;i<230;i++){
   x.fillStyle="rgba(45,18,10,.18)";

   x.beginPath();
   x.arc(
    Math.random()*1024,
    Math.random()*512,
    1+Math.random()*7,
    0,
    Math.PI*2
   );

   x.fill();
  }

  x.fillStyle="rgba(235,190,160,.3)";
  x.fillRect(0,0,1024,22);
  x.fillRect(0,490,1024,22);
 }

 if(type==="jupiter"){
  x.fillStyle="rgba(145,62,38,.78)";

  x.beginPath();
  x.ellipse(745,354,72,31,0,0,Math.PI*2);
  x.fill();

  x.strokeStyle="rgba(255,220,190,.25)";
  x.lineWidth=3;

  x.beginPath();
  x.ellipse(745,354,82,37,0,0,Math.PI*2);
  x.stroke();
 }

 if(type==="saturn"){
  for(let i=0;i<35;i++){
   const y=Math.random()*512;

   x.strokeStyle="rgba(255,240,190,.10)";
   x.lineWidth=1+Math.random()*3;

   x.beginPath();
   x.moveTo(0,y);
   x.bezierCurveTo(300,y+15,700,y-15,1024,y);
   x.stroke();
  }
 }

 if(type==="uranus"){
  for(let i=0;i<35;i++){
   const y=Math.random()*512;

   x.strokeStyle="rgba(255,255,255,.10)";
   x.lineWidth=1+Math.random()*2;

   x.beginPath();
   x.moveTo(0,y);
   x.lineTo(1024,y+Math.random()*10-5);
   x.stroke();
  }
 }

 if(type==="neptune"){
  for(let i=0;i<75;i++){
   const y=Math.random()*512;

   x.strokeStyle="rgba(130,185,255,.13)";
   x.lineWidth=1+Math.random()*4;

   x.beginPath();
   x.moveTo(0,y);
   x.bezierCurveTo(300,y+25,700,y-25,1024,y);
   x.stroke();
  }
 }

 const t=new THREE.CanvasTexture(c);
 t.colorSpace=THREE.SRGBColorSpace;

 return t;
}


const data=[
 ["Mercury",2,22,"mercury",.020,"4,879 km","57.9M km","59 days","88 days","The smallest planet and the closest planet to the Sun."],
 ["Venus",3.1,32,"venus",.015,"12,104 km","108.2M km","243 days","225 days","A hot world covered by a dense atmosphere."],
 ["Earth",3.5,44,"earth",.012,"12,742 km","149.6M km","24 hours","365 days","Our home planet and the only known world with life."],
 ["Mars",2.8,56,"mars",.010,"6,779 km","227.9M km","24.6 hours","687 days","The red planet with a cold desert surface."],
 ["Jupiter",8,78,"jupiter",.006,"139,820 km","778.5M km","9.9 hours","11.86 years","The largest planet in the Solar System."],
 ["Saturn",7,105,"saturn",.004,"116,460 km","1.43B km","10.7 hours","29.4 years","A gas giant famous for its spectacular ring system."],
 ["Uranus",5,130,"uranus",.003,"50,724 km","2.87B km","17.2 hours","84 years","An ice giant rotating almost on its side."],
 ["Neptune",4.8,155,"neptune",.002,"49,244 km","4.50B km","16.1 hours","164.8 years","The farthest major planet from the Sun."]
];

const planets=[];

function orbit(r){
 const pts=[];

 for(let i=0;i<=128;i++){
  const a=i/128*Math.PI*2;
  pts.push(
   new THREE.Vector3(
    Math.cos(a)*r,
    0,
    Math.sin(a)*r
   )
  );
 }

 scene.add(
  new THREE.Line(
   new THREE.BufferGeometry().setFromPoints(pts),
   new THREE.LineBasicMaterial({
    color:0x444655,
    transparent:true,
    opacity:.4
   })
  )
 );
}

data.forEach((p,i)=>{

 orbit(p[2]);

 const planetMaterial=
  new THREE.MeshStandardMaterial({
   map:makeTexture(p[3]),
   roughness:.88,
   metalness:0
  });

 if(p[0]==="Saturn"){
  planetMaterial.color.set(0xe1c994);
  planetMaterial.emissive.set(0x33230f);
  planetMaterial.emissiveIntensity=.20;
 }

 const mesh=new THREE.Mesh(
  new THREE.SphereGeometry(p[1],48,48),
  planetMaterial
 );

 const angle=i/data.length*Math.PI*2+.2;

 mesh.position.set(
  Math.cos(angle)*p[2],
  0,
  Math.sin(angle)*p[2]
 );

 mesh.userData={p,angle};

 scene.add(mesh);
 planets.push(mesh);

 if(p[0]==="Saturn"){

  const ringGroup=new THREE.Group();

  const bands=[
   [9.00,9.12,0x8b7754,.24],
   [9.20,9.34,0xc8b581,.45],
   [9.43,9.58,0xe3d3a7,.60],
   [9.68,9.80,0x806b4c,.22],
   [9.90,10.08,0xd2bd89,.50],
   [10.18,10.30,0xeadcb2,.56],
   [10.42,10.55,0x806b4c,.22],
   [10.67,10.84,0xd3c08e,.48],
   [10.96,11.10,0xe9dbb0,.55],
   [11.20,11.34,0x796448,.22],
   [11.46,11.66,0xd0b987,.48],
   [11.78,11.90,0xeadbb0,.52],
   [12.04,12.18,0x786449,.21],
   [12.30,12.52,0xd3bf8d,.47],
   [12.66,12.80,0xe6d5a5,.50],
   [12.96,13.12,0x806b4c,.20],
   [13.28,13.50,0xd1ba85,.44],
   [13.66,13.82,0xe4d19f,.48],
   [13.98,14.12,0x806b4b,.19],
   [14.28,14.52,0xcdb57e,.40],
   [14.66,14.88,0xdfca96,.43]
  ];

  bands.forEach(b=>{

   const ring=new THREE.Mesh(
    new THREE.RingGeometry(b[0],b[1],256),
    new THREE.MeshBasicMaterial({
     color:b[2],
     side:THREE.DoubleSide,
     transparent:true,
     opacity:b[3],
     depthWrite:false
    })
   );

   ring.rotation.x=Math.PI/2.35;
   ringGroup.add(ring);
  });

  mesh.add(ringGroup);
 }

 if(p[0]==="Earth"){

  const atmosphere=new THREE.Mesh(
   new THREE.SphereGeometry(
    p[1]*1.055,
    48,
    48
   ),
   new THREE.MeshBasicMaterial({
    color:0x4ea7ff,
    transparent:true,
    opacity:.11,
    side:THREE.BackSide,
    depthWrite:false
   })
  );

  mesh.add(atmosphere);
 }
});


/* camera controls */

let yaw=0,pitch=.42,distance=260,drag=false,moved=false,px=0,py=0;
let selectedPlanet=null;
let flying=false;
let cameraLookTarget=new THREE.Vector3(0,0,0);

function cameraUpdate(){

 pitch=Math.max(
  -1.45,
  Math.min(1.45,pitch)
 );

 const direction=new THREE.Vector3(
  Math.sin(yaw)*Math.cos(pitch),
  Math.sin(pitch),
  Math.cos(yaw)*Math.cos(pitch)
 );

 camera.position.copy(
  direction.multiplyScalar(distance)
 );

 camera.lookAt(cameraLookTarget);
}

function flyToPlanet(planet){
 selectedPlanet=planet;
 flying=true;
}

function selectPlanetByName(name){

 const planet=
  planets.find(
   m=>m.userData.p[0]===name
  );

 if(!planet)return;

 const p=planet.userData.p;

 document.getElementById("n").textContent=p[0];
 document.getElementById("d").textContent=p[9];
 document.getElementById("di").textContent=p[5];
 document.getElementById("ds").textContent=p[6];
 document.getElementById("da").textContent=p[7];
 document.getElementById("yr").textContent=p[8];

 info.classList.add("active");
 flyToPlanet(planet);

 document.querySelectorAll("#planetNav button").forEach(btn=>{
  btn.classList.toggle(
   "active",
   btn.dataset.planet===name
  );
 });
}

document.querySelectorAll("#planetNav button").forEach(btn=>{
 btn.addEventListener("click",()=>{
  selectPlanetByName(btn.dataset.planet);
 });
});

renderer.domElement.addEventListener("pointerdown",e=>{
 drag=true;
 moved=false;
 flying=false;
 selectedPlanet=null;
 px=e.clientX;
 py=e.clientY;
 renderer.domElement.setPointerCapture(e.pointerId);
});

renderer.domElement.addEventListener("pointermove",e=>{

 if(!drag)return;

 const dx=e.clientX-px;
 const dy=e.clientY-py;

 if(Math.abs(dx)+Math.abs(dy)>4)moved=true;

 px=e.clientX;
 py=e.clientY;

 yaw-=dx*.006;
 pitch+=dy*.004;

 cameraUpdate();
});

renderer.domElement.addEventListener("pointerup",e=>{
 drag=false;
 renderer.domElement.releasePointerCapture(e.pointerId);
});

renderer.domElement.addEventListener("wheel",e=>{

 e.preventDefault();

 flying=false;
 selectedPlanet=null;

 distance*=Math.exp(e.deltaY*.001);

 distance=Math.max(
  18,
  Math.min(800,distance)
 );

 cameraUpdate();

},{passive:false});


/* info */

const ray=new THREE.Raycaster();
const mouse=new THREE.Vector2();
const info=document.getElementById("info");

renderer.domElement.addEventListener("click",e=>{

 if(moved)return;

 mouse.x=e.clientX/innerWidth*2-1;
 mouse.y=-(e.clientY/innerHeight)*2+1;

 ray.setFromCamera(mouse,camera);

 const hit=ray.intersectObjects(planets)[0];

 if(!hit)return;

 const p=hit.object.userData.p;

 document.getElementById("n").textContent=p[0];
 document.getElementById("d").textContent=p[9];
 document.getElementById("di").textContent=p[5];
 document.getElementById("ds").textContent=p[6];
 document.getElementById("da").textContent=p[7];
 document.getElementById("yr").textContent=p[8];

 info.classList.add("active");

 flyToPlanet(hit.object);

 document.querySelectorAll("#planetNav button").forEach(btn=>{
  btn.classList.toggle(
   "active",
   btn.dataset.planet===p[0]
  );
 });
});

document.querySelector(".close").onclick=()=>{

 info.classList.remove("active");

 flying=false;
 selectedPlanet=null;

 document.querySelectorAll("#planetNav button").forEach(
  btn=>btn.classList.remove("active")
 );

 cameraLookTarget.set(0,0,0);

 distance=260;

 cameraUpdate();
};


/* animation */

function animate(){

 requestAnimationFrame(animate);

 sun.rotation.y+=.002;

 sunGlow.scale.setScalar(
  1+Math.sin(Date.now()*.0018)*.012
 );

 sunHalo1.scale.setScalar(
  1+Math.sin(Date.now()*.0012)*.025
 );

 sunHalo2.scale.setScalar(
  1+Math.sin(Date.now()*.0009)*.04
 );

 planets.forEach(m=>{

  m.rotation.y+=.004;

  m.userData.angle+=m.userData.p[4];

  m.position.x=
   Math.cos(m.userData.angle)*
   m.userData.p[2];

  m.position.z=
   Math.sin(m.userData.angle)*
   m.userData.p[2];
 });

 if(flying && selectedPlanet){

  const target=
   selectedPlanet.position.clone();

  /* Close enough to clearly see the planet, but leave it fully visible */

  const planetRadius=
   selectedPlanet.userData.p[1];

  const targetDistance=
   Math.max(
    planetRadius*5.2,
    14
   );

  const direction=new THREE.Vector3(
   Math.sin(yaw)*Math.cos(pitch),
   Math.sin(pitch)*.65,
   Math.cos(yaw)*Math.cos(pitch)
  ).normalize();

  const desiredPosition=
   target.clone().add(
    direction.multiplyScalar(targetDistance)
   );

  camera.position.lerp(
   desiredPosition,
   .055
  );

  cameraLookTarget.lerp(
   target,
   .075
  );

  camera.lookAt(cameraLookTarget);

  if(
   camera.position.distanceTo(
    desiredPosition
   )<.8
  ){
   flying=false;
  }

 }else{
  cameraUpdate();
 }

 renderer.render(
  scene,
  camera
 );
}

cameraUpdate();
animate();

window.addEventListener("resize",()=>{

 camera.aspect=
  innerWidth/innerHeight;

 camera.updateProjectionMatrix();

 renderer.setSize(
  innerWidth,
  innerHeight
);

});


(function(){

 const screen=
  document.getElementById("loadingScreen");

 const progress=
  document.getElementById("loadingProgress");

 const percent=
  document.getElementById("loadingPercent");

 const status=
  document.getElementById("loadingStatus");

 const detail=
  document.getElementById("loadingDetail");

 const stages=[
  [18,"INITIALIZING","ESTABLISHING DEEP-SPACE LINK..."],
  [36,"CALIBRATING","CALIBRATING NAVIGATION SYSTEM..."],
  [57,"SCANNING","SCANNING PLANETARY OBJECTS..."],
  [76,"LOADING","LOADING SOLAR SYSTEM..."],
  [91,"SYNCING","SYNCHRONIZING ORBITAL DATA..."],
  [100,"READY","SYSTEM ONLINE"]
 ];

 let value=0;
 let stage=0;

 function tick(){

  value+=Math.max(
   .45,
   (100-value)*.035
  );

  if(value>100)value=100;

  while(
   stage<stages.length-1 &&
   value>=stages[stage+1][0]
  )stage++;

  progress.style.width=value+"%";
  percent.textContent=Math.floor(value)+"%";
  status.textContent=stages[stage][1];
  detail.textContent=stages[stage][2];

  if(value<100){

   requestAnimationFrame(tick);

  }else{

   setTimeout(()=>{

    screen.classList.add("hidden");

    setTimeout(
     ()=>screen.remove(),
     1200
    );

   },450);
  }
 }

 requestAnimationFrame(tick);

})();
})();