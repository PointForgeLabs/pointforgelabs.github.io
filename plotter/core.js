"use strict";
var h=React.createElement,us=React.useState,ur=React.useRef,ue=React.useEffect,uc=React.useCallback;

/* ===== PRNG & Color Utils ===== */
function makeRng(s){var v=Math.abs(s)||1;return function(){v=(v*16807)%2147483647;return(v-1)/2147483646};}
function hslHex(h2,s,l){h2=((h2%360)+360)%360;s/=100;l/=100;var a=s*Math.min(l,1-l);var f=function(n){var k=(n+h2/30)%12;return l-a*Math.max(Math.min(k-3,9-k,1),-1);};var t=function(v){return Math.round(v*255).toString(16).padStart(2,'0');};return"#"+t(f(0))+t(f(8))+t(f(4));}
function genPal(hue,harm,n,rng){var hs=[];if(harm==='analogous')for(var i=0;i<n;i++)hs.push(hue-30+i*(60/Math.max(1,n-1)));else if(harm==='complementary'){hs.push(hue,hue+180);for(var i=2;i<n;i++)hs.push(hue+180+(i-1)*25);}else if(harm==='triadic'){hs.push(hue,hue+120,hue+240);for(var i=3;i<n;i++)hs.push(hue+60*i);}else if(harm==='split'){hs.push(hue,hue+150,hue+210);for(var i=3;i<n;i++)hs.push(hue+30*i);}else{hs.push(hue,hue+90,hue+180,hue+270);if(n>4)hs.push(hue+45);}return hs.slice(0,n).map(function(h3){return hslHex(h3,55+rng()*30,35+rng()*35);});}

var PALS=[{n:"Ocean",c:["#0a4a7a","#1a8cba","#44c8c4","#8be0d8","#c4f0eb"]},{n:"Sunset",c:["#d4423a","#e87040","#f0a050","#f8cc5a","#fce890"]},{n:"Forest",c:["#1a3c28","#2d6a3c","#4a9a50","#7ac060","#b0e080"]},{n:"Coral",c:["#6b1d3a","#c44060","#e87080","#f0a0a0","#f8d0c8"]},{n:"Night",c:["#0a0a2e","#1a1a5e","#3a3a9e","#6a6ace","#9a9af0"]},{n:"Earth",c:["#3a2510","#6a4a28","#a07040","#c89860","#e0c090"]},{n:"Neon",c:["#ff0080","#ff4040","#ffaa00","#00ff88","#00ccff"]},{n:"Mono",c:["#111111","#444444","#777777","#aaaaaa","#dddddd"]}];
var HARMS=['analogous','complementary','triadic','split','tetradic'];
var PAPERS={'A5':{w:420,h:595},'A4':{w:595,h:842},'A3':{w:842,h:1191},'Letter':{w:612,h:792},'Legal':{w:612,h:1008},'6x6':{w:432,h:432},'8x8':{w:576,h:576},'8x10':{w:576,h:720},'10x10':{w:720,h:720},'11x14':{w:792,h:1008},'12x12':{w:864,h:864}};

/* ===== Math Fields ===== */
var mathFields={
spiral:function(x,y,p){var dx=x-.5-p.cx,dy=y-.5-p.cy,d=Math.sqrt(dx*dx+dy*dy);return{a:Math.atan2(dy,dx)+Math.PI/2+d*p.tw*6,m:.5+d*.5};},
noise:function(x,y,p){var f=p.fr*8;var v=0,am=1,fr=f,ma=0;for(var o=0;o<Math.max(1,p.oc);o++){v+=am*(Math.sin(x*fr*6.28+p.sd*.1)*Math.cos(y*fr*6.28+p.sd*.37)+Math.sin((x+y)*fr*4.1+p.sd*.73)*.5);ma+=am;am*=.5;fr*=2;}return{a:(v/ma)*Math.PI*2*p.tw,m:.5+Math.abs(v/ma)*.5};},
vortex:function(x,y,p){var dx=x-.5-p.cx,dy=y-.5-p.cy,d=Math.sqrt(dx*dx+dy*dy)+.001,fo=1/(1+d*3);return{a:Math.atan2(dy,dx)+Math.PI/2*fo*p.tw*4+d*p.fr*10,m:fo};},
radial:function(x,y,p){var dx=x-.5-p.cx,dy=y-.5-p.cy;return{a:Math.atan2(dy,dx)+p.tw*Math.PI,m:.3+Math.sqrt(dx*dx+dy*dy)};},
wave:function(x,y,p){var f=p.fr*12,a2=p.tw*2;return{a:Math.sin(y*f+p.sd*.1)*a2+Math.cos(x*f*.7+p.sd*.3)*a2*.5,m:.5+Math.abs(Math.sin(y*f))*.5};},
dipole:function(x,y,p){var sp=.15*p.fr,cx2=.5+p.cx,cy2=.5+p.cy;var dx1=x-(cx2-sp),dy1=y-cy2,dx2=x-(cx2+sp),dy2=y-cy2;var d1=Math.sqrt(dx1*dx1+dy1*dy1)+.01,d2=Math.sqrt(dx2*dx2+dy2*dy2)+.01;var st=p.tw*3;var fx=st*dx1/(d1*d1*d1)-st*dx2/(d2*d2*d2),fy=st*dy1/(d1*d1*d1)-st*dy2/(d2*d2*d2);return{a:Math.atan2(fy,fx),m:Math.min(1,Math.sqrt(fx*fx+fy*fy)*2)};},
saddle:function(x,y,p){var dx=x-.5-p.cx,dy=y-.5-p.cy,st=p.tw*5;var fx=dy*st+Math.sin(x*p.fr*15)*.1,fy=dx*st;return{a:Math.atan2(fy,fx),m:Math.sqrt(fx*fx+fy*fy)};},
curl:function(x,y,p){var e=.005,f=p.fr*6;var n2=function(px,py){return Math.sin(px*f*6.28+p.sd*.2)*Math.cos(py*f*6.28+p.sd*.5)+Math.sin((px*.7+py*1.3)*f*4+p.sd*.8)*.5;};var dx2=(n2(x+e,y)-n2(x-e,y))/(2*e),dy2=(n2(x,y+e)-n2(x,y-e))/(2*e);return{a:Math.atan2(-dx2,dy2)*p.tw,m:Math.sqrt(dx2*dx2+dy2*dy2)*.5};},
attractor:function(x,y,p){var cx2=.5+p.cx,cy2=.5+p.cy;var fx=0,fy=0;for(var i=0;i<3;i++){var ax=cx2+Math.cos(i/3*Math.PI*2)*.2*p.fr,ay=cy2+Math.sin(i/3*Math.PI*2)*.2*p.fr;var dx2=ax-x,dy2=ay-y,d=Math.sqrt(dx2*dx2+dy2*dy2)+.01;var st=p.tw/(d*d)*.01;fx+=dx2*st;fy+=dy2*st;}return{a:Math.atan2(fy,fx),m:Math.min(1,Math.sqrt(fx*fx+fy*fy)*5)};},
gridwarp:function(x,y,p){var f=p.fr*5,w=p.tw*1.5;return{a:Math.floor(x*f)%2===0?Math.sin(y*f*2+p.sd*.1)*w:Math.cos(x*f*2+p.sd*.3)*w+Math.PI/2,m:.5+Math.sin(x*f+y*f)*.3};},
mesh:function(x,y,p){var f=p.fr*10;var w1=Math.sin(x*f+p.sd*.1),w2=Math.sin(y*f+p.sd*.3);return{a:(w1+w2*.5)*p.tw*2,m:.3+(Math.abs(w1)+Math.abs(w2))*.35};},
topo:function(x,y,p){var f=p.fr*6;var el=function(px,py){return Math.sin(px*f*4+p.sd*.2)*Math.cos(py*f*3+p.sd*.5)*.5+Math.sin((px*2+py*3)*f*2+p.sd)*.3;};var e=.003;var dx2=(el(x+e,y)-el(x-e,y))/(2*e),dy2=(el(x,y+e)-el(x,y-e))/(2*e);return{a:Math.atan2(-dx2,dy2)+p.tw*.5,m:.3+Math.sqrt(dx2*dx2+dy2*dy2)*.3};}
};
var FIELD_NAMES={spiral:"Spiral",noise:"Noise",vortex:"Vortex",radial:"Radial",wave:"Wave",dipole:"Dipole",saddle:"Saddle",curl:"Curl Noise",attractor:"Attractor",gridwarp:"Grid Warp",mesh:"Mesh",topo:"Topo"};

/* ===== Image Processing ===== */
function processImage(img,tw,th){var cv=document.createElement('canvas');cv.width=tw;cv.height=th;var cx=cv.getContext('2d');var sc=Math.min(tw/img.width,th/img.height);var dw=img.width*sc,dh=img.height*sc,ox=(tw-dw)/2,oy=(th-dh)/2;cx.fillStyle='#808080';cx.fillRect(0,0,tw,th);cx.drawImage(img,ox,oy,dw,dh);var id=cx.getImageData(0,0,tw,th).data;var w=tw,h2=th;var lum=new Float32Array(w*h2);for(var i=0;i<w*h2;i++)lum[i]=(0.299*id[i*4]+0.587*id[i*4+1]+0.114*id[i*4+2])/255;var tmp=new Float32Array(w*h2),bl=new Float32Array(w*h2);var k=[1,4,6,4,1],ks=16;for(var y2=0;y2<h2;y2++)for(var x2=0;x2<w;x2++){var s=0;for(var j=-2;j<=2;j++)s+=lum[y2*w+Math.max(0,Math.min(w-1,x2+j))]*k[j+2];tmp[y2*w+x2]=s/ks;}for(var y2=0;y2<h2;y2++)for(var x2=0;x2<w;x2++){var s=0;for(var j=-2;j<=2;j++)s+=tmp[Math.max(0,Math.min(h2-1,y2+j))*w+x2]*k[j+2];bl[y2*w+x2]=s/ks;}var gx=new Float32Array(w*h2),gy=new Float32Array(w*h2),em=new Float32Array(w*h2);var mx2=0;for(var y2=1;y2<h2-1;y2++)for(var x2=1;x2<w-1;x2++){var i=y2*w+x2;var sx=-bl[(y2-1)*w+x2-1]-2*bl[y2*w+x2-1]-bl[(y2+1)*w+x2-1]+bl[(y2-1)*w+x2+1]+2*bl[y2*w+x2+1]+bl[(y2+1)*w+x2+1];var sy=-bl[(y2-1)*w+x2-1]-2*bl[(y2-1)*w+x2]-bl[(y2-1)*w+x2+1]+bl[(y2+1)*w+x2-1]+2*bl[(y2+1)*w+x2]+bl[(y2+1)*w+x2+1];gx[i]=sx;gy[i]=sy;var mg=Math.sqrt(sx*sx+sy*sy);em[i]=mg;if(mg>mx2)mx2=mg;}if(mx2>0)for(var i=0;i<w*h2;i++)em[i]/=mx2;return{lum:bl,gx:gx,gy:gy,em:em,w:w,h:h2};}

var IMG_MODES=[{id:'edge',n:'Edge Follow',d:'Trace contours'},{id:'gradient',n:'Gradient',d:'Flow with brightness'},{id:'brightness',n:'Brightness',d:'Light maps to angle'},{id:'contour',n:'Contour',d:'Topo bands'},{id:'stipple',n:'Stipple',d:'Density from dark'},{id:'hybrid',n:'Hybrid',d:'Edge + brightness'}];

function imgField(nx,ny,id,ip){var px=Math.floor(nx*(id.w-1)),py=Math.floor(ny*(id.h-1));var idx=Math.max(0,Math.min(py*id.w+px,id.w*id.h-1));var b=id.lum[idx],gx2=id.gx[idx],gy2=id.gy[idx],e=id.em[idx],ga=Math.atan2(gy2,gx2);var ang,mag;if(ip.mode==='edge'){ang=ga+Math.PI/2+ip.ao;mag=e*ip.ew+(1-e)*.05;}else if(ip.mode==='gradient'){ang=ga+ip.ao;mag=e*ip.ew+.1;}else if(ip.mode==='brightness'){var bb=Math.pow(b,1/(1+ip.cb));ang=bb*Math.PI*2*ip.bi+ip.ao;mag=.3+e*ip.ew*.7;}else if(ip.mode==='contour'){ang=ga+Math.PI/2+ip.ao;var band=Math.sin(b*Math.PI*(4+ip.cb*8));mag=Math.abs(band)*.5+e*ip.ew*.5;}else if(ip.mode==='stipple'){ang=Math.sin(nx*47.3+ny*91.7)*Math.PI*2+ip.ao;mag=(1-b)*ip.bi;}else{if(e>.15){ang=ga+Math.PI/2+ip.ao;mag=e*ip.ew;}else{ang=Math.pow(b,1/(1+ip.cb))*Math.PI*2*ip.bi+ip.ao;mag=.1+(1-b)*.3;}}return{a:ang,m:Math.max(.01,Math.min(1,mag))};}

/* ===== Shape Functions ===== */
function sRect(cx,cy,ang,w,h2){var co=Math.cos(ang),si=Math.sin(ang),hw=w/2,hh=h2/2;var p=[{x:-hw,y:-hh},{x:hw,y:-hh},{x:hw,y:hh},{x:-hw,y:hh}].map(function(v){return{x:cx+v.x*co-v.y*si,y:cy+v.x*si+v.y*co};});return"M"+p[0].x.toFixed(1)+","+p[0].y.toFixed(1)+p.slice(1).map(function(v){return"L"+v.x.toFixed(1)+","+v.y.toFixed(1);}).join('')+"Z";}
function sCirc(cx,cy,ang,w,h2){var r=Math.max(w,h2)/2;var d="M"+(cx+r).toFixed(1)+","+cy.toFixed(1);for(var i=1;i<=16;i++){var a2=(i/16)*Math.PI*2;d+="L"+(cx+Math.cos(a2)*r).toFixed(1)+","+(cy+Math.sin(a2)*r).toFixed(1);}return d+"Z";}
function sEllip(cx,cy,ang,w,h2){var co=Math.cos(ang),si=Math.sin(ang),hw=w/2,hh=h2/2;var d='';for(var i=0;i<=20;i++){var a2=(i/20)*Math.PI*2;var px=Math.cos(a2)*hw,py=Math.sin(a2)*hh;d+=(i===0?'M':'L')+(cx+px*co-py*si).toFixed(1)+","+(cy+px*si+py*co).toFixed(1);}return d+"Z";}
function sTri(cx,cy,ang,w,h2){var co=Math.cos(ang),si=Math.sin(ang);var p=[{x:0,y:-h2*.55},{x:w*.5,y:h2*.45},{x:-w*.5,y:h2*.45}].map(function(v){return{x:cx+v.x*co-v.y*si,y:cy+v.x*si+v.y*co};});return"M"+p[0].x.toFixed(1)+","+p[0].y.toFixed(1)+p.slice(1).map(function(v){return"L"+v.x.toFixed(1)+","+v.y.toFixed(1);}).join('')+"Z";}
function sHex(cx,cy,ang,w,h2){var r=Math.max(w,h2)/2;var d='';for(var i=0;i<=6;i++){var a2=ang+(i/6)*Math.PI*2;d+=(i===0?'M':'L')+(cx+Math.cos(a2)*r).toFixed(1)+","+(cy+Math.sin(a2)*r).toFixed(1);}return d+"Z";}
function sDia(cx,cy,ang,w,h2){var co=Math.cos(ang),si=Math.sin(ang),hw=w/2,hh=h2/2;var p=[{x:0,y:-hh},{x:hw,y:0},{x:0,y:hh},{x:-hw,y:0}].map(function(v){return{x:cx+v.x*co-v.y*si,y:cy+v.x*si+v.y*co};});return"M"+p[0].x.toFixed(1)+","+p[0].y.toFixed(1)+p.slice(1).map(function(v){return"L"+v.x.toFixed(1)+","+v.y.toFixed(1);}).join('')+"Z";}
function sLine(cx,cy,ang,w){var co=Math.cos(ang),si=Math.sin(ang),hw=w/2;return"M"+(cx-co*hw).toFixed(1)+","+(cy-si*hw).toFixed(1)+"L"+(cx+co*hw).toFixed(1)+","+(cy+si*hw).toFixed(1);}
function sDot(cx,cy,ang,w,h2){var r=Math.max(w,h2)/4;var d="M"+(cx+r).toFixed(1)+","+cy.toFixed(1);for(var i=1;i<=10;i++){var a2=(i/10)*Math.PI*2;d+="L"+(cx+Math.cos(a2)*r).toFixed(1)+","+(cy+Math.sin(a2)*r).toFixed(1);}return d+"Z";}
function sStar(cx,cy,ang,w,h2){var r=Math.max(w,h2)/2;var d='';for(var i=0;i<=10;i++){var a2=ang+(i/10)*Math.PI*2;var rd=i%2===0?r:r*.4;d+=(i===0?'M':'L')+(cx+Math.cos(a2)*rd).toFixed(1)+","+(cy+Math.sin(a2)*rd).toFixed(1);}return d+"Z";}
var SHAPES={rect:{n:"Rect",f:sRect},circle:{n:"Circle",f:sCirc},ellipse:{n:"Ellipse",f:sEllip},tri:{n:"Tri",f:sTri},hex:{n:"Hex",f:sHex},diamond:{n:"Diamond",f:sDia},line:{n:"Line",f:sLine},dot:{n:"Dot",f:sDot},star:{n:"Star",f:sStar}};
var SHAPE_KEYS=Object.keys(SHAPES);

/* ===== NEW: Strange Attractors ===== */
var ATTRACTORS={
lorenz:{n:'Lorenz',is3d:true,init:{x:.1,y:0,z:0},range:{x:[-25,25],y:[-35,35],z:[0,55]},
  step:function(x,y,z,p,dt){var sigma=p.p1,rho=p.p2,beta=p.p3;return{x:x+sigma*(y-x)*dt,y:y+(x*(rho-z)-y)*dt,z:z+(x*y-beta*z)*dt};},
  pd:[{n:'Sigma',k:'p1',v:10,min:1,max:30,s:.5},{n:'Rho',k:'p2',v:28,min:10,max:50,s:.5},{n:'Beta',k:'p3',v:2.667,min:.5,max:8,s:.1}]},
rossler:{n:'Rössler',is3d:true,init:{x:1,y:1,z:1},range:{x:[-15,15],y:[-15,15],z:[0,30]},
  step:function(x,y,z,p,dt){return{x:x+(-y-z)*dt,y:y+(x+p.p1*y)*dt,z:z+(p.p2+z*(x-p.p3))*dt};},
  pd:[{n:'a',k:'p1',v:.2,min:0,max:1,s:.01},{n:'b',k:'p2',v:.2,min:0,max:1,s:.01},{n:'c',k:'p3',v:5.7,min:1,max:20,s:.1}]},
clifford:{n:'Clifford',is3d:false,init:{x:.1,y:.1,z:0},range:{x:[-3,3],y:[-3,3],z:[0,0]},
  step:function(x,y,z,p){return{x:Math.sin(p.p1*y)+p.p3*Math.cos(p.p1*x),y:Math.sin(p.p2*x)+p.p4*Math.cos(p.p2*y),z:0};},
  pd:[{n:'a',k:'p1',v:-1.4,min:-3,max:3,s:.05},{n:'b',k:'p2',v:1.6,min:-3,max:3,s:.05},{n:'c',k:'p3',v:1.0,min:-3,max:3,s:.05},{n:'d',k:'p4',v:.7,min:-3,max:3,s:.05}]},
dejong:{n:'De Jong',is3d:false,init:{x:.1,y:.1,z:0},range:{x:[-2.5,2.5],y:[-2.5,2.5],z:[0,0]},
  step:function(x,y,z,p){return{x:Math.sin(p.p1*y)-Math.cos(p.p2*x),y:Math.sin(p.p3*x)-Math.cos(p.p4*y),z:0};},
  pd:[{n:'a',k:'p1',v:-2.24,min:-4,max:4,s:.05},{n:'b',k:'p2',v:.43,min:-4,max:4,s:.05},{n:'c',k:'p3',v:-.65,min:-4,max:4,s:.05},{n:'d',k:'p4',v:-2.43,min:-4,max:4,s:.05}]}
};

function renderAttractor(aType,ap,iters,dt,scale,rotX,rotY,cW,cH,shapeFn,colors,rng,shW,shH,fm,skipN){
  var a=ATTRACTORS[aType],shapes=[];
  var pt={x:a.init.x,y:a.init.y,z:a.init.z};
  for(var i=0;i<500;i++)pt=a.step(pt.x,pt.y,pt.z,ap,dt);
  var cosX=Math.cos(rotX),sinX=Math.sin(rotX),cosY=Math.cos(rotY),sinY=Math.sin(rotY);
  var rx=a.range.x,ry=a.range.y,rz=a.range.z;
  var rxc=(rx[0]+rx[1])/2,ryc=(ry[0]+ry[1])/2,rzc=(rz[0]+rz[1])/2;
  var rxs=(rx[1]-rx[0])/2||1,rys=(ry[1]-ry[0])/2||1,rzs=(rz[1]-rz[0])/2||1;
  var skip=Math.max(1,skipN);var prev=null;
  for(var i=0;i<iters;i++){
    pt=a.step(pt.x,pt.y,pt.z,ap,dt);
    if(isNaN(pt.x)||isNaN(pt.y)||Math.abs(pt.x)>1e6)break;
    if(i%skip!==0)continue;
    var nx=(pt.x-rxc)/rxs,ny=(pt.y-ryc)/rys,nz=(pt.z-rzc)/rzs;
    var y1=ny*cosX-nz*sinX,z1=ny*sinX+nz*cosX;
    var x1=nx*cosY+z1*sinY;
    var sx=cW/2+x1*scale*Math.min(cW,cH)/3;
    var sy=cH/2+y1*scale*Math.min(cW,cH)/3;
    if(sx>5&&sx<cW-5&&sy>5&&sy<cH-5){
      var ci=Math.floor(rng()*colors.length);
      var ang=prev?Math.atan2(sy-prev.y,sx-prev.x):rng()*Math.PI*2;
      var w=shW*(.4+rng()*.6),hv=shH*(.4+rng()*.6);
      shapes.push({p:shapeFn(sx,sy,ang,Math.max(1,w),Math.max(.5,hv)),c:colors[ci],fl:fm!=='stroke'});
    }
    prev={x:sx,y:sy};
  }
  return shapes;
}

