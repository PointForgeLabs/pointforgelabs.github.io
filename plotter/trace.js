/* ===== Modified doTrace with masking, morphing, physics ===== */
function doTrace(fieldFn,tp,cw,ch,rng,shapeFn,colors,maskCfg,morphCfg){
  var out=[],mx=tp.mg*Math.min(cw,ch),seeds=[];
  if(tp.sp==='grid'){var cols2=Math.ceil(Math.sqrt(tp.pc*cw/ch)),rows=Math.ceil(tp.pc/cols2);for(var r=0;r<rows;r++)for(var c=0;c<cols2;c++)seeds.push({x:mx+(c+.5)/cols2*(cw-mx*2),y:mx+(r+.5)/rows*(ch-mx*2)});}
  else if(tp.sp==='random'){for(var i=0;i<tp.pc;i++)seeds.push({x:mx+rng()*(cw-mx*2),y:mx+rng()*(ch-mx*2)});}
  else if(tp.sp==='radial'){var cx2=cw/2,cy2=ch/2,rings=Math.ceil(Math.sqrt(tp.pc/3)),maxR=Math.min(cw,ch)/2-mx;for(var ri=0;ri<rings;ri++){var rad=(ri+1)/rings*maxR,per=Math.max(3,Math.floor(tp.pc/rings));for(var ii=0;ii<per;ii++){var aa=(ii/per)*Math.PI*2+ri*.5;seeds.push({x:cx2+Math.cos(aa)*rad,y:cy2+Math.sin(aa)*rad});}}}
  else{for(var i2=0;i2<tp.pc;i2++){var hx=0,hy=0,fb=.5,fi=i2+1;while(fi>0){hx+=fb*(fi%2);fi=Math.floor(fi/2);fb/=2;}fb=1/3;fi=i2+1;while(fi>0){hy+=fb*(fi%3);fi=Math.floor(fi/3);fb/=3;}seeds.push({x:mx+hx*(cw-mx*2),y:mx+hy*(ch-mx*2)});}}

  /* Particle physics */
  if(tp.phEn&&tp.phRep>0)seeds=applyPhysics(seeds,tp.phIters,tp.phRep,cw,ch,mx,tp.phGrav,tp.phGravX,tp.phGravY,tp.phGravStr);

  /* Surface perspective */
  var isSurf=tp.isSurf;

  for(var si=0;si<seeds.length;si++){
    var seed=seeds[si],x=seed.x,y=seed.y,dist=tp.ss*rng(),ci=Math.floor(rng()*colors.length);
    for(var step=0;step<tp.ms;step++){
      var nx=x/cw,ny=y/ch;
      if(nx<0||nx>1||ny<0||ny>1||x<mx||x>cw-mx||y<mx||y>ch-mx)break;
      var field=fieldFn(nx,ny);var angle=field.a,mag=field.m;
      dist+=tp.sl;
      if(dist>=tp.ss){
        if(tp.df&&mag<.08){dist=0;x+=Math.cos(angle)*tp.sl;y+=Math.sin(angle)*tp.sl;continue;}

        /* Density mask check */
        if(maskCfg&&maskCfg.en){
          var mv=densityMask(nx,ny,maskCfg.type,maskCfg);
          if(maskCfg.inv)mv=1-mv;
          if(mv<maskCfg.thresh){dist=0;x+=Math.cos(angle)*tp.sl;y+=Math.sin(angle)*tp.sl;continue;}
        }

        dist=0;var sc2=tp.df?mag:(1-tp.sv+tp.sv*mag);
        var perspSc=isSurf?perspScale(ny,tp.sfElev,tp.sfDist):1;
        var w=tp.sw*sc2*(.6+rng()*.8)*perspSc,hv=tp.sh*sc2*(.6+rng()*.8)*perspSc;
        var jx=(rng()-.5)*tp.jt*tp.sw,jy=(rng()-.5)*tp.jt*tp.sh;
        if(w>.5&&hv>.5){
          var path;
          if(morphCfg&&morphCfg.en){
            var mf2=getMorphFactor(nx,ny,mag,morphCfg.mode);
            path=morphedShape(x+jx,y+jy,angle,Math.max(1,w),Math.max(.5,hv),mf2,morphCfg.shA,morphCfg.shB);
          }else{
            path=shapeFn(x+jx,y+jy,angle,Math.max(1,w),Math.max(.5,hv));
          }
          out.push({p:path,c:colors[ci],fl:tp.fm!=='stroke'});
        }
      }
      x+=Math.cos(angle)*tp.sl;y+=Math.sin(angle)*tp.sl;
    }
  }
  return out;
}

/* ===== UI Components ===== */
function Sl(props){return h("div",{style:{marginBottom:4}},h("div",{style:{display:'flex',justifyContent:'space-between',marginBottom:1}},h("span",{style:{fontSize:9.5,color:'#777'}},props.l),h("span",{style:{fontSize:9.5,color:'#aaa'}},props.step&&props.step<1?props.v.toFixed(2):props.v)),h("input",{type:"range",min:props.min,max:props.max,step:props.step||1,value:props.v,onChange:function(e){props.set(Number(e.target.value));},style:{width:'100%',accentColor:'#888',height:3,cursor:'pointer'}}));}
function Lbl(props){return h("div",{style:{fontSize:8.5,color:'#444',textTransform:'uppercase',letterSpacing:2,marginBottom:5,marginTop:8}},props.children);}

