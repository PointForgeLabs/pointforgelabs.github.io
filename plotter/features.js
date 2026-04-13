/* ===== NEW: 3D Surface Simulation ===== */
var SURFACES={
sine:{n:'Sine Waves',fn:function(x,y,p){return Math.sin(x*p.freq*4)*Math.cos(y*p.freq*4)*.5;}},
terrain:{n:'Terrain',fn:function(x,y,p){var f=p.freq*3;return Math.sin(x*f*2.1+.3)*Math.cos(y*f*1.7+.8)*.4+Math.sin((x+y)*f*3.3)*.2+Math.cos(x*f*5.7-y*f*4.3)*.1;}},
saddleSurf:{n:'Saddle',fn:function(x,y,p){return(x*x-y*y)*p.freq*.5;}},
fabric:{n:'Fabric',fn:function(x,y,p){var f=p.freq*5;return Math.sin(x*f)*Math.sin(y*f)*.3+Math.sin((x+y)*f*1.4)*.2;}},
peaks:{n:'Peaks',fn:function(x,y,p){var d1=x*x+y*y,d2=(x-.5)*(x-.5)+(y-.3)*(y-.3),d3=(x+.4)*(x+.4)+(y+.3)*(y+.3);return Math.exp(-d1*3)*p.freq+Math.exp(-d2*5)*p.freq*.7-Math.exp(-d3*4)*p.freq*.5;}},
ripple:{n:'Ripple',fn:function(x,y,p){var d=Math.sqrt(x*x+y*y);return Math.sin(d*p.freq*10)/(1+d*3);}}
};

function surfaceField(nx,ny,sfType,sfParams){
  var x=(nx-.5)*2,y=(ny-.5)*2;var fn=SURFACES[sfType].fn;var e=.01;
  var hc=fn(x,y,sfParams),hx=fn(x+e,y,sfParams),hy=fn(x,y+e,sfParams);
  var dx=(hx-hc)/e,dy=(hy-hc)/e;
  return{a:Math.atan2(-dx,dy)+sfParams.twist*.5,m:Math.min(1,Math.sqrt(dx*dx+dy*dy)*.5),h:hc};
}

function perspScale(ny,elev,dist){
  var y3d=ny-.5;var z=dist+y3d*Math.sin(elev);
  return Math.max(.15,dist/Math.max(.1,z));
}

/* ===== NEW: Density Masking ===== */
function densityMask(nx,ny,mType,mp){
  var dx,dy,d;
  switch(mType){
    case'circle':dx=nx-.5-mp.cx;dy=ny-.5-mp.cy;d=Math.sqrt(dx*dx+dy*dy);return d<mp.rad?1:0;
    case'ring':dx=nx-.5-mp.cx;dy=ny-.5-mp.cy;d=Math.sqrt(dx*dx+dy*dy);return(d>mp.rad*.4&&d<mp.rad)?1:0;
    case'noise':var f=mp.freq*8;var v=Math.sin(nx*f*6.28+mp.seed*.1)*Math.cos(ny*f*6.28+mp.seed*.37)+Math.sin((nx+ny)*f*4.1+mp.seed*.73)*.5;return(v+1)/2;
    case'grad_h':return nx;
    case'grad_v':return ny;
    case'radial':dx=nx-.5-mp.cx;dy=ny-.5-mp.cy;return 1-Math.min(1,Math.sqrt(dx*dx+dy*dy)/Math.max(.01,mp.rad));
    case'diamond':dx=Math.abs(nx-.5-mp.cx);dy=Math.abs(ny-.5-mp.cy);return(dx+dy)<mp.rad?1:0;
    case'stripes':return Math.sin(nx*mp.freq*30)>0?1:0;
    case'checker':var f2=mp.freq*8;return(Math.floor(nx*f2)+Math.floor(ny*f2))%2===0?1:0;
    default:return 1;
  }
}
var MASK_TYPES=[{id:'circle',n:'Circle'},{id:'ring',n:'Ring'},{id:'noise',n:'Noise'},{id:'grad_h',n:'H Gradient'},{id:'grad_v',n:'V Gradient'},{id:'radial',n:'Radial'},{id:'diamond',n:'Diamond'},{id:'stripes',n:'Stripes'},{id:'checker',n:'Checker'}];

/* ===== NEW: Particle Physics ===== */
function applyPhysics(seeds,iters,repulsion,cw,ch,mx,gravEn,gravX,gravY,gravStr){
  var n=seeds.length;if(n>2000)return seeds;
  var cellSize=Math.max(20,Math.sqrt(cw*ch/n)*1.5);
  for(var iter=0;iter<iters;iter++){
    var grid={};
    for(var i=0;i<n;i++){var gx=Math.floor(seeds[i].x/cellSize),gy=Math.floor(seeds[i].y/cellSize);var key=gx+','+gy;if(!grid[key])grid[key]=[];grid[key].push(i);}
    for(var i=0;i<n;i++){
      var fx=0,fy=0,si=seeds[i];
      var gx=Math.floor(si.x/cellSize),gy=Math.floor(si.y/cellSize);
      for(var dx=-1;dx<=1;dx++)for(var dy=-1;dy<=1;dy++){
        var cell=grid[(gx+dx)+','+(gy+dy)];if(!cell)continue;
        for(var j=0;j<cell.length;j++){if(cell[j]===i)continue;var sj=seeds[cell[j]];
          var ddx=si.x-sj.x,ddy=si.y-sj.y;var d=Math.sqrt(ddx*ddx+ddy*ddy)+.1;
          if(d<cellSize){var f=repulsion/(d*d);fx+=ddx/d*f;fy+=ddy/d*f;}}}
      if(gravEn){var gdx=gravX*cw-si.x,gdy=gravY*ch-si.y;var gd=Math.sqrt(gdx*gdx+gdy*gdy)+1;fx+=gdx/gd*gravStr;fy+=gdy/gd*gravStr;}
      seeds[i]={x:Math.max(mx,Math.min(cw-mx,si.x+fx*.3)),y:Math.max(mx,Math.min(ch-mx,si.y+fy*.3))};
    }
  }
  return seeds;
}

/* ===== NEW: Field Math Operators ===== */
function combineFields(f1,f2,op,strength){
  return function(nx,ny){
    var a=f1(nx,ny),b=f2(nx,ny);
    switch(op){
      case'add':return{a:a.a+b.a*strength,m:Math.min(1,a.m+b.m*strength)};
      case'multiply':return{a:a.a*(1+b.a*strength*.5),m:a.m*(b.m*strength+(1-strength))};
      case'modulate':return{a:a.a+Math.sin(b.a)*strength*2,m:a.m*(.5+b.m*.5)};
      case'max':return Math.abs(a.m)>Math.abs(b.m*strength)?a:{a:b.a,m:b.m*strength};
      case'screen':var ma=1-(1-a.m)*(1-b.m*strength);return{a:a.a+b.a*strength*.5,m:ma};
      case'warp':return{a:a.a+b.m*strength*Math.PI,m:a.m};
      case'curl_add':var e=.005;var bx1=f2(nx+e,ny),bx2=f2(nx-e,ny),by1=f2(nx,ny+e),by2=f2(nx,ny-e);var curl=(by1.m-by2.m-bx1.m+bx2.m)/(4*e);return{a:a.a+curl*strength*10,m:a.m};
      default:return a;
    }
  };
}
var FIELD_OPS=[{id:'add',n:'Add'},{id:'multiply',n:'Multiply'},{id:'modulate',n:'Modulate'},{id:'max',n:'Max'},{id:'screen',n:'Screen'},{id:'warp',n:'Warp'},{id:'curl_add',n:'Curl Add'}];

/* ===== NEW: Spatial Blend Masks ===== */
function spatialBlend(nx,ny,bType,amt,freq,sd2){
  switch(bType){
    case'uniform':return amt;
    case'linear_h':return nx;
    case'linear_v':return ny;
    case'radial':var dx=nx-.5,dy=ny-.5;return Math.min(1,Math.sqrt(dx*dx+dy*dy)*2);
    case'radial_inv':var dx2=nx-.5,dy2=ny-.5;return 1-Math.min(1,Math.sqrt(dx2*dx2+dy2*dy2)*2);
    case'noise':return(Math.sin(nx*freq*30+sd2*.1)*Math.cos(ny*freq*30+sd2*.5)+1)/2;
    default:return amt;
  }
}
var BLEND_MASKS=[{id:'uniform',n:'Uniform'},{id:'linear_h',n:'H Gradient'},{id:'linear_v',n:'V Gradient'},{id:'radial',n:'Radial Out'},{id:'radial_inv',n:'Radial In'},{id:'noise',n:'Noise'}];

/* ===== NEW: Shape Morphing ===== */
function getMorphFactor(nx,ny,mag,mode){
  if(mode==='magnitude')return Math.min(1,Math.max(0,mag));
  if(mode==='distance'){var dx=nx-.5,dy=ny-.5;return Math.min(1,Math.sqrt(dx*dx+dy*dy)*2);}
  if(mode==='angle')return(Math.atan2(ny-.5,nx-.5)/Math.PI+1)/2;
  return mag;
}

function morphedShape(cx,cy,ang,w,hv,factor,shA,shB){
  var ar=1+factor*1.5;
  var wm=w*(1+(factor-.5)*.6),hm=hv*(1+((.5-factor))*.6);
  if(factor<.5)return SHAPES[shA].f(cx,cy,ang,Math.max(1,wm),Math.max(.5,hm));
  return SHAPES[shB].f(cx,cy,ang,Math.max(1,wm),Math.max(.5,hm));
}

/* ===== NEW: Symmetry Transform ===== */
function transformPath(pathStr,fn){return pathStr.replace(/([ML])\s*([-\d.]+)\s*,\s*([-\d.]+)/g,function(m,cmd,x,y){var pt=fn(parseFloat(x),parseFloat(y));return cmd+pt.x.toFixed(1)+","+pt.y.toFixed(1);});}
function applySymmetry(shapes,mode,cW,cH){
  if(mode==='none')return shapes;
  var result=shapes.slice();var cx=cW/2,cy=cH/2;
  if(mode==='mirror-x'){
    for(var i=0,len=shapes.length;i<len;i++)result.push({p:transformPath(shapes[i].p,function(x,y){return{x:cW-x,y:y};}),c:shapes[i].c,fl:shapes[i].fl});
  }else if(mode==='mirror-y'){
    for(var i=0,len=shapes.length;i<len;i++)result.push({p:transformPath(shapes[i].p,function(x,y){return{x:x,y:cH-y};}),c:shapes[i].c,fl:shapes[i].fl});
  }else if(mode==='mirror-xy'){
    for(var i=0,len=shapes.length;i<len;i++){var s=shapes[i];
      result.push({p:transformPath(s.p,function(x,y){return{x:cW-x,y:y};}),c:s.c,fl:s.fl});
      result.push({p:transformPath(s.p,function(x,y){return{x:x,y:cH-y};}),c:s.c,fl:s.fl});
      result.push({p:transformPath(s.p,function(x,y){return{x:cW-x,y:cH-y};}),c:s.c,fl:s.fl});}
  }else{
    var n=parseInt(mode);if(isNaN(n)||n<2)return result;
    for(var k=1;k<n;k++){var angle=(k/n)*Math.PI*2,cosA=Math.cos(angle),sinA=Math.sin(angle);
      for(var i=0,len=shapes.length;i<len;i++)result.push({p:transformPath(shapes[i].p,function(x,y){var dx=x-cx,dy=y-cy;return{x:cx+dx*cosA-dy*sinA,y:cy+dx*sinA+dy*cosA};}),c:shapes[i].c,fl:shapes[i].fl});}
  }
  return result;
}
var SYMMETRY_MODES=[{id:'none',n:'None'},{id:'mirror-x',n:'Mirror ↔'},{id:'mirror-y',n:'Mirror ↕'},{id:'mirror-xy',n:'Mirror ✦'},{id:'3',n:'3-Fold'},{id:'4',n:'4-Fold'},{id:'6',n:'6-Fold'},{id:'8',n:'8-Fold'}];

/* ===== NEW: Spirograph Engine ===== */
var SPIRO_PRESETS=[
  {n:'Classic',R:1,r:.38,d:.6,loops:20},
  {n:'Star Burst',R:1,r:.25,d:.9,loops:12},
  {n:'Flower',R:1,r:.5,d:.5,loops:10},
  {n:'Tight Weave',R:1,r:.15,d:.8,loops:30},
  {n:'Petals',R:1,r:.33,d:1,loops:15},
  {n:'Galaxy',R:1,r:.42,d:.3,loops:25}
];
function renderSpirograph(sp,cW,cH,shapeFn,colors,rng,shW,shH,fm){
  var R=sp.R,r=sp.r,d=sp.d,iters=sp.iters||5000,loops=sp.loops||20;
  var shapes=[],scale=Math.min(cW,cH)*.38,prev=null;
  var isEpi=sp.epi;
  for(var i=0;i<iters;i++){
    var t=(i/iters)*Math.PI*2*loops;
    var x,y;
    if(isEpi){var sum=R+r;x=sum*Math.cos(t)-d*Math.cos(sum/r*t);y=sum*Math.sin(t)-d*Math.sin(sum/r*t);}
    else{var diff=R-r;x=diff*Math.cos(t)+d*Math.cos(diff/r*t);y=diff*Math.sin(t)-d*Math.sin(diff/r*t);}
    var sx=cW/2+x*scale,sy=cH/2+y*scale;
    if(sx>2&&sx<cW-2&&sy>2&&sy<cH-2){
      var ci=Math.floor((i/iters)*colors.length)%colors.length;
      var ang=prev?Math.atan2(sy-prev.y,sx-prev.x):0;
      var w=shW*(.5+rng()*.5),hv=shH*(.5+rng()*.5);
      shapes.push({p:shapeFn(sx,sy,ang,Math.max(1,w),Math.max(.5,hv)),c:colors[ci],fl:fm!=='stroke'});
    }
    prev={x:sx,y:sy};
  }
  return shapes;
}

/* ===== NEW: Text to Paths ===== */
function renderTextToImage(text,fontSize,fontFamily,cW,cH){
  var cv=document.createElement('canvas');cv.width=cW;cv.height=cH;
  var ctx=cv.getContext('2d');ctx.fillStyle='#000';ctx.fillRect(0,0,cW,cH);
  ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='bold '+fontSize+'px '+fontFamily;
  /* Handle multi-line: split on newline */
  var lines=text.split('\n');var lh=fontSize*1.15;var y0=cH/2-(lines.length-1)*lh/2;
  for(var i=0;i<lines.length;i++)ctx.fillText(lines[i],cW/2,y0+i*lh);
  /* Convert to image data compatible with processImage output */
  var id=ctx.getImageData(0,0,cW,cH).data;var w=cW,h=cH;
  var lum=new Float32Array(w*h);for(var i2=0;i2<w*h;i2++)lum[i2]=(0.299*id[i2*4]+0.587*id[i2*4+1]+0.114*id[i2*4+2])/255;
  var gx=new Float32Array(w*h),gy=new Float32Array(w*h),em=new Float32Array(w*h);var mx=0;
  for(var y=1;y<h-1;y++)for(var x=1;x<w-1;x++){var idx=y*w+x;
    var sx=-lum[(y-1)*w+x-1]-2*lum[y*w+x-1]-lum[(y+1)*w+x-1]+lum[(y-1)*w+x+1]+2*lum[y*w+x+1]+lum[(y+1)*w+x+1];
    var sy2=-lum[(y-1)*w+x-1]-2*lum[(y-1)*w+x]-lum[(y-1)*w+x+1]+lum[(y+1)*w+x-1]+2*lum[(y+1)*w+x]+lum[(y+1)*w+x+1];
    gx[idx]=sx;gy[idx]=sy2;var mg=Math.sqrt(sx*sx+sy2*sy2);em[idx]=mg;if(mg>mx)mx=mg;}
  if(mx>0)for(var i3=0;i3<w*h;i3++)em[i3]/=mx;
  return{lum:lum,gx:gx,gy:gy,em:em,w:w,h:h};
}

