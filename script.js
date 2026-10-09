(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var S={p:0,mx:0,my:0};
  var hasG=window.gsap&&window.ScrollTrigger;
  if(hasG&&!reduce){
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('js');
    gsap.to('.hl',{opacity:1,y:0,startAt:{y:36},duration:.9,stagger:.14,ease:'power3.out',delay:.15});
    gsap.to(S,{p:1,ease:'none',scrollTrigger:{trigger:document.documentElement,start:'top top',end:'bottom bottom',scrub:1.2}});
    ScrollTrigger.batch('.row,.skills>div',{start:'top 88%',once:true,
      onEnter:function(b){gsap.fromTo(b,{opacity:.0},{opacity:1,duration:.7,stagger:.08})}});
  }
  if(!window.THREE)return;
  var cv=document.getElementById('c'),R;
  try{R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:false})}catch(e){cv.style.display='none';return}
  var cs=getComputedStyle(document.documentElement);
  var ac=new THREE.Color(cs.getPropertyValue('--ac').trim()),ac2=new THREE.Color(cs.getPropertyValue('--ac2').trim());
  R.setPixelRatio(Math.min(devicePixelRatio,1.75));
  var sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,100);cam.position.z=7;
  var g=new THREE.Group();sc.add(g);
  var kg=new THREE.TorusKnotGeometry(1.5,.42,240,20);
  var knot=new THREE.Points(kg,new THREE.PointsMaterial({color:ac,size:.028,transparent:true,opacity:.95}));
  var wire=new THREE.Mesh(kg,new THREE.MeshBasicMaterial({color:ac2,wireframe:true,transparent:true,opacity:.07}));
  g.add(knot);g.add(wire);
  var N=700,pos=new Float32Array(N*3);
  for(var i=0;i<N;i++){var r=7+Math.random()*9,a=Math.random()*6.283,b=Math.acos(2*Math.random()-1);
    pos[i*3]=r*Math.sin(b)*Math.cos(a);pos[i*3+1]=r*Math.sin(b)*Math.sin(a);pos[i*3+2]=r*Math.cos(b)}
  var sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  var stars=new THREE.Points(sg,new THREE.PointsMaterial({color:ac2,size:.05,transparent:true,opacity:.6}));sc.add(stars);
  function size(){var w=innerWidth,h=innerHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();g.scale.setScalar(w<720?.7:1)}
  size();addEventListener('resize',size);
  if(!reduce)addEventListener('pointermove',function(e){S.mx=e.clientX/innerWidth-.5;S.my=e.clientY/innerHeight-.5});
  var t0=performance.now(),wide=function(){return innerWidth>=720?2.4:0.6};
  function frame(){
    var t=(performance.now()-t0)/1000;
    var p=S.p;
    g.rotation.y=t*.12+p*7;g.rotation.x=.3+p*2.2;
    g.position.x=Math.sin(p*6.283*1.5)*wide()+(innerWidth>=720?1.6*(1-Math.min(p*8,1)):0);
    stars.rotation.y=t*.01+p*1.2;
    cam.position.z=7-p*2.6;
    cam.position.x+=(S.mx*1.2-cam.position.x)*.05;cam.position.y+=(-S.my*.8-cam.position.y)*.05;
    cam.lookAt(0,0,0);
    R.render(sc,cam);
    if(!reduce)requestAnimationFrame(frame);
  }
  frame();
  if(reduce){addEventListener('scroll',function(){requestAnimationFrame(function(){S.p=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight);frame()})},{passive:true})}
})();
