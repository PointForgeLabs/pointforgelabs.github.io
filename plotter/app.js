/* ===== Main Component ===== */
function PlotterStudio(){
  /* Source & Field */
  var _src=us('math'),src=_src[0],setSrc=_src[1];
  var _mf=us('spiral'),mf=_mf[0],setMf=_mf[1];
  var _tw=us(1),tw=_tw[0],setTw=_tw[1];
  var _fr=us(.5),fr=_fr[0],setFr=_fr[1];
  var _oc=us(3),oc=_oc[0],setOc=_oc[1];
  var _fcx=us(0),fcx=_fcx[0],setFcx=_fcx[1];
  var _fcy=us(0),fcy=_fcy[0],setFcy=_fcy[1];
  var _sd=us(42),sd=_sd[0],setSd=_sd[1];

  /* Image */
  var _imgSrc=us(null),imgSrc=_imgSrc[0],setImgSrc=_imgSrc[1];
  var _imgD=us(null),imgD=_imgD[0],setImgD=_imgD[1];
  var _imgEl=us(null),imgEl=_imgEl[0],setImgEl=_imgEl[1];
  var _iMode=us('edge'),iMode=_iMode[0],setIMode=_iMode[1];
  var _iEw=us(.8),iEw=_iEw[0],setIEw=_iEw[1];
  var _iBi=us(1),iBi=_iBi[0],setIBi=_iBi[1];
  var _iCb=us(1),iCb=_iCb[0],setICb=_iCb[1];
  var _iAo=us(0),iAo=_iAo[0],setIAo=_iAo[1];
  var _iRes=us(200),iRes=_iRes[0],setIRes=_iRes[1];
  var _showRef=us(false),showRef=_showRef[0],setShowRef=_showRef[1];
  var _blendAmt=us(.5),blendAmt=_blendAmt[0],setBlendAmt=_blendAmt[1];
  var _blMask=us('uniform'),blMask=_blMask[0],setBlMask=_blMask[1];
  var _blFreq=us(.5),blFreq=_blFreq[0],setBlFreq=_blFreq[1];

  /* Shape & Render */
  var _sh=us('rect'),sh=_sh[0],setSh=_sh[1];
  var _fm=us('stroke'),fm=_fm[0],setFm=_fm[1];
  var _pc=us(400),pc=_pc[0],setPc=_pc[1];
  var _sl=us(2.5),sl=_sl[0],setSl2=_sl[1];
  var _ms=us(100),ms=_ms[0],setMs=_ms[1];
  var _sw=us(14),sw=_sw[0],setSw=_sw[1];
  var _sh2=us(5),sh2=_sh2[0],setSh3=_sh2[1];
  var _ss=us(9),ss=_ss[0],setSs=_ss[1];
  var _sv=us(.4),sv=_sv[0],setSv=_sv[1];
  var _jt=us(.15),jt=_jt[0],setJt=_jt[1];
  var _mg=us(.03),mg=_mg[0],setMg=_mg[1];
  var _sp=us('halton'),sp=_sp[0],setSp=_sp[1];
  var _stW=us(.5),stW=_stW[0],setStW=_stW[1];
  var _df=us(true),df=_df[0],setDf=_df[1];

  /* Color */
  var _cols=us(['#222222','#555555','#888888','#bbbbbb','#eeeeee']),cols=_cols[0],setCols=_cols[1];
  var _eIdx=us(null),eIdx=_eIdx[0],setEIdx=_eIdx[1];
  var _cCnt=us(5),cCnt=_cCnt[0],setCCnt=_cCnt[1];
  var _harm=us('analogous'),harm=_harm[0],setHarm=_harm[1];
  var _bHue=us(200),bHue=_bHue[0],setBHue=_bHue[1];

  /* Layout */
  var _dm=us(true),dm=_dm[0],setDm=_dm[1];
  var _tab=us('field'),tab=_tab[0],setTab=_tab[1];
  var _paper=us('8x10'),paper=_paper[0],setPaper=_paper[1];
  var _orient=us('portrait'),orient=_orient[0],setOrient=_orient[1];

  /* NEW: Attractor */
  var _aType=us('lorenz'),aType=_aType[0],setAType=_aType[1];
  var _aIters=us(30000),aIters=_aIters[0],setAIters=_aIters[1];
  var _aDt=us(.005),aDt=_aDt[0],setADt=_aDt[1];
  var _aScale=us(.8),aScale=_aScale[0],setAScale=_aScale[1];
  var _aRotX=us(.3),aRotX=_aRotX[0],setARotX=_aRotX[1];
  var _aRotY=us(0),aRotY=_aRotY[0],setARotY=_aRotY[1];
  var _aP1=us(10),aP1=_aP1[0],setAP1=_aP1[1];
  var _aP2=us(28),aP2=_aP2[0],setAP2=_aP2[1];
  var _aP3=us(2.667),aP3=_aP3[0],setAP3=_aP3[1];
  var _aP4=us(.7),aP4=_aP4[0],setAP4=_aP4[1];
  var _aSkip=us(2),aSkip=_aSkip[0],setASkip=_aSkip[1];

  /* NEW: 3D Surface */
  var _sfType=us('sine'),sfType=_sfType[0],setSfType=_sfType[1];
  var _sfFreq=us(1),sfFreq=_sfFreq[0],setSfFreq=_sfFreq[1];
  var _sfElev=us(.4),sfElev=_sfElev[0],setSfElev=_sfElev[1];
  var _sfDist=us(2),sfDist=_sfDist[0],setSfDist=_sfDist[1];
  var _sfTwist=us(0),sfTwist=_sfTwist[0],setSfTwist=_sfTwist[1];

  /* NEW: Density Mask */
  var _mkEn=us(false),mkEn=_mkEn[0],setMkEn=_mkEn[1];
  var _mkType=us('circle'),mkType=_mkType[0],setMkType=_mkType[1];
  var _mkCx=us(0),mkCx=_mkCx[0],setMkCx=_mkCx[1];
  var _mkCy=us(0),mkCy=_mkCy[0],setMkCy=_mkCy[1];
  var _mkRad=us(.35),mkRad=_mkRad[0],setMkRad=_mkRad[1];
  var _mkFreq=us(.5),mkFreq=_mkFreq[0],setMkFreq=_mkFreq[1];
  var _mkThresh=us(.3),mkThresh=_mkThresh[0],setMkThresh=_mkThresh[1];
  var _mkInv=us(false),mkInv=_mkInv[0],setMkInv=_mkInv[1];

  /* NEW: Shape Morphing */
  var _moEn=us(false),moEn=_moEn[0],setMoEn=_moEn[1];
  var _moEnd=us('circle'),moEnd=_moEnd[0],setMoEnd=_moEnd[1];
  var _moMode=us('magnitude'),moMode=_moMode[0],setMoMode=_moMode[1];

  /* NEW: Particle Physics */
  var _phEn=us(false),phEn=_phEn[0],setPhEn=_phEn[1];
  var _phRep=us(5),phRep=_phRep[0],setPhRep=_phRep[1];
  var _phIters=us(3),phIters=_phIters[0],setPhIters=_phIters[1];
  var _phGrav=us(false),phGrav=_phGrav[0],setPhGrav=_phGrav[1];
  var _phGravX=us(.5),phGravX=_phGravX[0],setPhGravX=_phGravX[1];
  var _phGravY=us(.5),phGravY=_phGravY[0],setPhGravY=_phGravY[1];
  var _phGravStr=us(1),phGravStr=_phGravStr[0],setPhGravStr=_phGravStr[1];

  /* NEW: Field Operator */
  var _foEn=us(false),foEn=_foEn[0],setFoEn=_foEn[1];
  var _foOp=us('add'),foOp=_foOp[0],setFoOp=_foOp[1];
  var _foField=us('noise'),foField=_foField[0],setFoField=_foField[1];
  var _foTw=us(1),foTw=_foTw[0],setFoTw=_foTw[1];
  var _foFr=us(.5),foFr=_foFr[0],setFoFr=_foFr[1];
  var _foStr=us(.5),foStr=_foStr[0],setFoStr=_foStr[1];

  /* NEW: Symmetry */
  var _symMode=us('none'),symMode=_symMode[0],setSymMode=_symMode[1];

  /* NEW: Spirograph */
  var _spR=us(1),spR=_spR[0],setSpR=_spR[1];
  var _spr=us(.38),spr=_spr[0],setSpr=_spr[1];
  var _spD=us(.6),spD=_spD[0],setSpD=_spD[1];
  var _spLoops=us(20),spLoops=_spLoops[0],setSpLoops=_spLoops[1];
  var _spIters=us(5000),spIters=_spIters[0],setSpIters=_spIters[1];
  var _spEpi=us(false),spEpi=_spEpi[0],setSpEpi=_spEpi[1];

  /* NEW: Text */
  var _txtVal=us('HELLO'),txtVal=_txtVal[0],setTxtVal=_txtVal[1];
  var _txtSize=us(180),txtSize=_txtSize[0],setTxtSize=_txtSize[1];
  var _txtFont=us('Arial Black'),txtFont=_txtFont[0],setTxtFont=_txtFont[1];
  var _txtD=us(null),txtD=_txtD[0],setTxtD=_txtD[1];

  var pp=PAPERS[paper]||PAPERS['8x10'];
  var cW=orient==='landscape'?Math.max(pp.w,pp.h):Math.min(pp.w,pp.h);
  var cH=orient==='landscape'?Math.min(pp.w,pp.h):Math.max(pp.w,pp.h);
  var canvasRef=ur(null),dataRef=ur([]),fileRef=ur(null);

  /* Sync attractor params when type changes */
  ue(function(){var a=ATTRACTORS[aType];if(a.pd[0])setAP1(a.pd[0].v);if(a.pd[1])setAP2(a.pd[1].v);if(a.pd[2])setAP3(a.pd[2].v);if(a.pd[3])setAP4(a.pd[3].v);},[aType]);

  var handleFile=uc(function(file){if(!file)return;var reader=new FileReader();reader.onload=function(e){setImgSrc(e.target.result);var img=new Image();img.onload=function(){setImgEl(img);var s=iRes/Math.max(img.width,img.height);setImgD(processImage(img,Math.floor(img.width*s),Math.floor(img.height*s)));};img.src=e.target.result;};reader.readAsDataURL(file);},[iRes]);
  ue(function(){if(imgEl){var s=iRes/Math.max(imgEl.width,imgEl.height);setImgD(processImage(imgEl,Math.floor(imgEl.width*s),Math.floor(imgEl.height*s)));}},[iRes,imgEl]);
  ue(function(){if(cols.length<cCnt){var rng=makeRng(sd+77);setCols(function(p){return p.concat(genPal(bHue,harm,cCnt-p.length,rng)).slice(0,cCnt);});}else if(cols.length>cCnt)setCols(function(p){return p.slice(0,cCnt);});},[cCnt]);

  /* Re-render text when text params or canvas size changes */
  ue(function(){if(src==='text'&&txtVal.trim()){setTxtD(renderTextToImage(txtVal,txtSize,txtFont,Math.floor(cW*.5),Math.floor(cH*.5)));}},[txtVal,txtSize,txtFont,cW,cH,src]);

  var buildField=uc(function(){
    var mp={tw:tw,fr:fr,oc:oc,cx:fcx,cy:fcy,sd:sd};
    var mfn=function(nx,ny){return mathFields[mf](nx,ny,mp);};

    /* Text source — uses text bitmap as image field */
    if(src==='text'){
      if(!txtD)return mfn;
      var tip={mode:'edge',ew:1.2,bi:1,cb:1,ao:0};
      var txtFn=function(nx,ny){return imgField(nx,ny,txtD,tip);};
      if(foEn){var fop={tw:foTw,fr:foFr,oc:3,cx:0,cy:0,sd:sd};var f2=function(nx,ny){return mathFields[foField](nx,ny,fop);};return combineFields(txtFn,f2,foOp,foStr);}
      return txtFn;
    }

    /* Surface source */
    if(src==='surface3d'){
      var sfp={freq:sfFreq,twist:sfTwist};
      var sfFn=function(nx,ny){return surfaceField(nx,ny,sfType,sfp);};
      if(foEn){var fop={tw:foTw,fr:foFr,oc:3,cx:0,cy:0,sd:sd};var f2=function(nx,ny){return mathFields[foField](nx,ny,fop);};return combineFields(sfFn,f2,foOp,foStr);}
      return sfFn;
    }

    /* Math source */
    if(src==='math'){
      if(foEn){var fop={tw:foTw,fr:foFr,oc:3,cx:0,cy:0,sd:sd};var f2=function(nx,ny){return mathFields[foField](nx,ny,fop);};return combineFields(mfn,f2,foOp,foStr);}
      return mfn;
    }

    /* Image source */
    var ip={mode:iMode,ew:iEw,bi:iBi,cb:iCb,ao:iAo};
    if(src==='image'){
      if(!imgD)return mfn;
      var imgFn=function(nx,ny){return imgField(nx,ny,imgD,ip);};
      if(foEn){var fop={tw:foTw,fr:foFr,oc:3,cx:0,cy:0,sd:sd};var f2=function(nx,ny){return mathFields[foField](nx,ny,fop);};return combineFields(imgFn,f2,foOp,foStr);}
      return imgFn;
    }

    /* Blend source with spatial mask */
    if(!imgD)return mfn;
    return function(nx,ny){
      var m2=mfn(nx,ny);var im=imgField(nx,ny,imgD,ip);
      var t=spatialBlend(nx,ny,blMask,blendAmt,blFreq,sd);
      var da=im.a-m2.a;while(da>Math.PI)da-=Math.PI*2;while(da<-Math.PI)da+=Math.PI*2;
      var blended={a:m2.a+da*t,m:m2.m*(1-t)+im.m*t};
      if(foEn){var fop={tw:foTw,fr:foFr,oc:3,cx:0,cy:0,sd:sd};var f2=mathFields[foField](nx,ny,fop);var b=f2;switch(foOp){case'add':return{a:blended.a+b.a*foStr,m:Math.min(1,blended.m+b.m*foStr)};case'multiply':return{a:blended.a*(1+b.a*foStr*.5),m:blended.m*(b.m*foStr+(1-foStr))};default:return{a:blended.a+Math.sin(b.a)*foStr*2,m:blended.m*(.5+b.m*.5)};}}
      return blended;
    };
  },[src,mf,tw,fr,oc,fcx,fcy,sd,imgD,iMode,iEw,iBi,iCb,iAo,blendAmt,blMask,blFreq,foEn,foOp,foField,foTw,foFr,foStr,sfType,sfFreq,sfElev,sfDist,sfTwist,txtD]);

  /* Main render effect */
  ue(function(){
    var rng=makeRng(sd);var shapes;
    if(src==='spirograph'){
      var shapeFn=SHAPES[sh]?SHAPES[sh].f:sRect;
      shapes=renderSpirograph({R:spR,r:spr,d:spD,iters:spIters,loops:spLoops,epi:spEpi},cW,cH,shapeFn,cols,rng,sw,sh2,fm);
    }else if(src==='attractor'){
      var ap={p1:aP1,p2:aP2,p3:aP3,p4:aP4};
      var shapeFn=SHAPES[sh]?SHAPES[sh].f:sRect;
      shapes=renderAttractor(aType,ap,aIters,aDt,aScale,aRotX,aRotY,cW,cH,shapeFn,cols,rng,sw,sh2,fm,aSkip);
    }else{
      var fieldFn=buildField();var shapeFn=SHAPES[sh]?SHAPES[sh].f:sRect;
      var useDensity=(src!=='math'&&src!=='surface3d');
      var tp={pc:pc,sl:sl,ms:ms,sw:sw,sh:sh2,ss:ss,sv:sv,jt:jt,mg:mg,sp:sp,fm:fm,df:useDensity?df:false,
        phEn:phEn,phRep:phRep,phIters:phIters,phGrav:phGrav,phGravX:phGravX,phGravY:phGravY,phGravStr:phGravStr,
        isSurf:src==='surface3d',sfElev:sfElev,sfDist:sfDist};
      var maskCfg=mkEn?{en:true,type:mkType,cx:mkCx,cy:mkCy,rad:mkRad,freq:mkFreq,thresh:mkThresh,inv:mkInv,seed:sd}:null;
      /* For text source, add text bitmap as density mask so particles fill the text */
      if(src==='text'&&txtD&&!mkEn){tp.df=true;}
      var morphCfg=moEn?{en:true,shA:sh,shB:moEnd,mode:moMode}:null;
      shapes=doTrace(fieldFn,tp,cW,cH,rng,shapeFn,cols,maskCfg,morphCfg);
    }
    /* Apply symmetry */
    if(symMode!=='none')shapes=applySymmetry(shapes,symMode,cW,cH);
    dataRef.current=shapes;

    var cv=canvasRef.current;if(!cv)return;
    var ctx=cv.getContext('2d');var dpr=window.devicePixelRatio||1;
    var maxD=540;var sc=Math.min(maxD/cW,(maxD*.88)/cH);
    var dW=cW*sc,dH=cH*sc;cv.style.width=dW+'px';cv.style.height=dH+'px';
    cv.width=dW*dpr;cv.height=dH*dpr;ctx.setTransform(dpr*sc,0,0,dpr*sc,0,0);
    ctx.fillStyle=dm?'#111':'#f7f5f0';ctx.fillRect(0,0,cW,cH);
    if(showRef&&imgEl){ctx.globalAlpha=.15;var is2=Math.min(cW/imgEl.width,cH/imgEl.height);var iw=imgEl.width*is2,ih=imgEl.height*is2;ctx.drawImage(imgEl,(cW-iw)/2,(cH-ih)/2,iw,ih);ctx.globalAlpha=1;}
    ctx.lineWidth=stW;ctx.lineCap='round';ctx.lineJoin='round';
    for(var i=0;i<shapes.length;i++){var s=shapes[i];var p2=new Path2D(s.p);
      if(fm==='fill'){ctx.fillStyle=s.c;ctx.fill(p2);ctx.strokeStyle='#000';ctx.lineWidth=stW*.3;ctx.stroke(p2);}
      else if(fm==='both'){ctx.fillStyle=s.c+'88';ctx.fill(p2);ctx.strokeStyle=s.c;ctx.lineWidth=stW;ctx.stroke(p2);}
      else{ctx.strokeStyle=s.c;ctx.lineWidth=stW;ctx.stroke(p2);}}
  },[buildField,sd,sh,fm,pc,sl,ms,sw,sh2,ss,sv,jt,mg,sp,stW,df,cols,dm,cW,cH,showRef,imgEl,src,
    aType,aIters,aDt,aScale,aRotX,aRotY,aP1,aP2,aP3,aP4,aSkip,
    sfType,sfFreq,sfElev,sfDist,sfTwist,
    mkEn,mkType,mkCx,mkCy,mkRad,mkFreq,mkThresh,mkInv,
    moEn,moEnd,moMode,phEn,phRep,phIters,phGrav,phGravX,phGravY,phGravStr,
    symMode,spR,spr,spD,spLoops,spIters,spEpi,txtD]);

  function exportSVG(plotter){
    var shapes=dataRef.current;var body='';
    for(var i=0;i<shapes.length;i++){var s=shapes[i];
      if(plotter)body+='  <path d="'+s.p+'" fill="none" stroke="black" stroke-width="'+stW+'" stroke-linecap="round" stroke-linejoin="round"/>\n';
      else{var fill=fm==='stroke'?'none':s.c+(fm==='both'?'88':'');var stroke=fm==='fill'?'#000':s.c;
        body+='  <path d="'+s.p+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+(fm==='fill'?stW*.3:stW)+'" stroke-linecap="round" stroke-linejoin="round"/>\n';}}
    var bg=plotter?'':'  <rect width="'+cW+'" height="'+cH+'" fill="'+(dm?'#111':'#f7f5f0')+'"/>\n';
    var svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+cW+'" height="'+cH+'" viewBox="0 0 '+cW+' '+cH+'">\n'+bg+body+'</svg>';
    var blob=new Blob([svg],{type:'image/svg+xml'});var url=URL.createObjectURL(blob);
    var a=document.createElement('a');a.href=url;a.download='plotter-'+src+'-'+sd+'.svg';a.click();URL.revokeObjectURL(url);
  }

  var handleDrop=uc(function(e){e.preventDefault();handleFile(e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0]);},[handleFile]);

  /* Button styles */
  var b={padding:'4px 0',fontSize:9.5,border:'1px solid #2a2a2a',background:'transparent',color:'#777',cursor:'pointer',fontFamily:'inherit',letterSpacing:.3,flex:1};
  var ba=Object.assign({},b,{borderColor:'#666',color:'#ccc',background:'#ffffff08'});
  var bSm=Object.assign({},b,{padding:'4px 2px',fontSize:9});
  var baSm=Object.assign({},ba,{padding:'4px 2px',fontSize:9});
  function btn(label,active,onClick,extra){return h("button",{onClick:onClick,style:active?Object.assign({},ba,extra||{}):Object.assign({},b,extra||{})},label);}
  function togBtn(label,active,onClick){return h("button",{onClick:onClick,style:Object.assign({},active?ba:b,{width:'100%',padding:'6px 0',marginBottom:4})},label);}

  /* ===== FIELD TAB ===== */
  var fieldTab=h(React.Fragment,null,
    h(Lbl,null,"Source"),
    h("div",{style:{display:'flex',gap:3,marginBottom:8,flexWrap:'wrap'}},
      [['math','Math'],['image','Image'],['blend','Blend'],['attractor','Attractor'],['surface3d','3D Surface'],['spirograph','Spirograph'],['text','Text']].map(function(e){return h("button",{key:e[0],onClick:function(){setSrc(e[0]);},style:src===e[0]?ba:b},e[1]);})
    ),

    /* Attractor controls */
    src==='attractor'?h(React.Fragment,null,
      h(Lbl,null,"Attractor Type"),
      h("div",{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2,marginBottom:6}},
        Object.entries(ATTRACTORS).map(function(e){return h("button",{key:e[0],onClick:function(){setAType(e[0]);},style:aType===e[0]?baSm:bSm},e[1].n);})
      ),
      h(Lbl,null,"Parameters"),
      ATTRACTORS[aType].pd[0]?h(Sl,{l:ATTRACTORS[aType].pd[0].n,v:aP1,min:ATTRACTORS[aType].pd[0].min,max:ATTRACTORS[aType].pd[0].max,step:ATTRACTORS[aType].pd[0].s,set:setAP1}):null,
      ATTRACTORS[aType].pd[1]?h(Sl,{l:ATTRACTORS[aType].pd[1].n,v:aP2,min:ATTRACTORS[aType].pd[1].min,max:ATTRACTORS[aType].pd[1].max,step:ATTRACTORS[aType].pd[1].s,set:setAP2}):null,
      ATTRACTORS[aType].pd[2]?h(Sl,{l:ATTRACTORS[aType].pd[2].n,v:aP3,min:ATTRACTORS[aType].pd[2].min,max:ATTRACTORS[aType].pd[2].max,step:ATTRACTORS[aType].pd[2].s,set:setAP3}):null,
      ATTRACTORS[aType].pd[3]?h(Sl,{l:ATTRACTORS[aType].pd[3].n,v:aP4,min:ATTRACTORS[aType].pd[3].min,max:ATTRACTORS[aType].pd[3].max,step:ATTRACTORS[aType].pd[3].s,set:setAP4}):null,
      h(Lbl,null,"Rendering"),
      h(Sl,{l:"Iterations",v:aIters,min:1000,max:100000,step:1000,set:setAIters}),
      h(Sl,{l:"Time Step",v:aDt,min:.001,max:.02,step:.001,set:setADt}),
      h(Sl,{l:"Skip",v:aSkip,min:1,max:20,set:setASkip}),
      h(Sl,{l:"Scale",v:aScale,min:.2,max:2,step:.05,set:setAScale}),
      ATTRACTORS[aType].is3d?h(React.Fragment,null,
        h(Sl,{l:"Rotate X",v:aRotX,min:-1.5,max:1.5,step:.05,set:setARotX}),
        h(Sl,{l:"Rotate Y",v:aRotY,min:-1.5,max:1.5,step:.05,set:setARotY})
      ):null
    ):null,

    /* 3D Surface controls */
    src==='surface3d'?h(React.Fragment,null,
      h(Lbl,null,"Surface Type"),
      h("div",{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2,marginBottom:6}},
        Object.entries(SURFACES).map(function(e){return h("button",{key:e[0],onClick:function(){setSfType(e[0]);},style:sfType===e[0]?baSm:bSm},e[1].n);})
      ),
      h(Sl,{l:"Frequency",v:sfFreq,min:.1,max:3,step:.05,set:setSfFreq}),
      h(Sl,{l:"Twist",v:sfTwist,min:-3,max:3,step:.1,set:setSfTwist}),
      h(Lbl,null,"Perspective"),
      h(Sl,{l:"Elevation",v:sfElev,min:0,max:1.5,step:.05,set:setSfElev}),
      h(Sl,{l:"Distance",v:sfDist,min:.5,max:5,step:.1,set:setSfDist})
    ):null,

    /* Spirograph controls */
    src==='spirograph'?h(React.Fragment,null,
      h(Lbl,null,"Presets"),
      h("div",{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2,marginBottom:6}},
        SPIRO_PRESETS.map(function(p){return h("button",{key:p.n,onClick:function(){setSpR(p.R);setSpr(p.r);setSpD(p.d);setSpLoops(p.loops);},style:bSm},p.n);})
      ),
      h(Lbl,null,"Type"),
      h("div",{style:{display:'flex',gap:3,marginBottom:6}},
        h("button",{onClick:function(){setSpEpi(false);},style:spEpi?b:ba},"Hypotrochoid"),
        h("button",{onClick:function(){setSpEpi(true);},style:spEpi?ba:b},"Epitrochoid")
      ),
      h(Lbl,null,"Parameters"),
      h(Sl,{l:"Outer R",v:spR,min:.2,max:2,step:.02,set:setSpR}),
      h(Sl,{l:"Inner r",v:spr,min:.05,max:1,step:.01,set:setSpr}),
      h(Sl,{l:"Pen Dist",v:spD,min:.05,max:1.5,step:.02,set:setSpD}),
      h(Sl,{l:"Loops",v:spLoops,min:2,max:60,set:setSpLoops}),
      h(Sl,{l:"Points",v:spIters,min:500,max:20000,step:500,set:setSpIters})
    ):null,

    /* Text controls */
    src==='text'?h(React.Fragment,null,
      h(Lbl,null,"Text"),
      h("input",{type:"text",value:txtVal,onChange:function(e){setTxtVal(e.target.value);},style:{width:'100%',padding:'6px 8px',background:'#141414',border:'1px solid #333',color:'#ccc',fontFamily:'inherit',fontSize:13,marginBottom:6,boxSizing:'border-box'}}),
      h(Sl,{l:"Font Size",v:txtSize,min:40,max:400,step:5,set:setTxtSize}),
      h(Lbl,null,"Font"),
      h("div",{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2,marginBottom:6}},
        ['Arial Black','Georgia','Impact','Courier New','Comic Sans MS','Times New Roman'].map(function(f){return h("button",{key:f,onClick:function(){setTxtFont(f);},style:Object.assign({},txtFont===f?baSm:bSm,{fontSize:8})},f);})
      ),
      h("p",{style:{fontSize:9,color:'#444',lineHeight:1.5,marginTop:4}},"Text is rendered as a flow field. Particles trace through the letter shapes. Try different math field operators!")
    ):null,

    /* Math field controls */
    (src==='math'||src==='blend')?h(React.Fragment,null,
      h(Lbl,null,"Math Field"),
      h("div",{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2,marginBottom:6}},
        Object.entries(FIELD_NAMES).map(function(e){return h("button",{key:e[0],onClick:function(){setMf(e[0]);},style:mf===e[0]?baSm:bSm},e[1]);})
      ),
      h(Sl,{l:"Twist",v:tw,min:.1,max:4,step:.05,set:setTw}),
      h(Sl,{l:"Frequency",v:fr,min:.1,max:3,step:.05,set:setFr}),
      h(Sl,{l:"Octaves",v:oc,min:1,max:6,set:setOc}),
      h(Sl,{l:"Center X",v:fcx,min:-.4,max:.4,step:.02,set:setFcx}),
      h(Sl,{l:"Center Y",v:fcy,min:-.4,max:.4,step:.02,set:setFcy})
    ):null,

    /* Image controls */
    (src==='image'||src==='blend')?h(React.Fragment,null,
      h(Lbl,null,"Image"),
      h("div",{onDrop:handleDrop,onDragOver:function(e){e.preventDefault();},onClick:function(){fileRef.current&&fileRef.current.click();},
        style:{border:'2px dashed #333',padding:imgSrc?3:18,textAlign:'center',cursor:'pointer',marginBottom:6,background:'#0c0c0c',fontSize:10,color:'#555',lineHeight:1.5,overflow:'hidden'}},
        imgSrc?h("img",{src:imgSrc,style:{width:'100%',height:'auto',display:'block',opacity:.8}}):"Drop image or click",
        h("input",{ref:fileRef,type:"file",accept:"image/*",style:{display:'none'},onChange:function(e){handleFile(e.target.files&&e.target.files[0]);}})
      ),
      imgSrc?h("button",{onClick:function(){setImgSrc(null);setImgD(null);setImgEl(null);},style:Object.assign({},b,{width:'100%',padding:'4px 0',marginBottom:5,color:'#a55',borderColor:'#a5555540'})},"Remove"):null,
      h(Sl,{l:"Process Res",v:iRes,min:50,max:500,step:10,set:setIRes}),
      h(Lbl,null,"Field Mode"),
      h("div",{style:{display:'flex',flexDirection:'column',gap:2,marginBottom:5}},
        IMG_MODES.map(function(m){return h("button",{key:m.id,onClick:function(){setIMode(m.id);},style:Object.assign({},iMode===m.id?ba:b,{padding:'5px 7px',textAlign:'left'})},
          h("span",{style:{fontSize:9.5,fontWeight:iMode===m.id?'bold':'normal'}},m.n),
          h("span",{style:{fontSize:8,color:'#555',marginLeft:6}},m.d));})
      ),
      h(Sl,{l:"Edge Weight",v:iEw,min:0,max:2,step:.05,set:setIEw}),
      h(Sl,{l:"Brightness",v:iBi,min:.1,max:3,step:.05,set:setIBi}),
      h(Sl,{l:"Contrast",v:iCb,min:0,max:4,step:.1,set:setICb}),
      h(Sl,{l:"Angle Offset",v:iAo,min:-3.14,max:3.14,step:.05,set:setIAo}),
      h("div",{style:{display:'flex',gap:3,marginBottom:3}},
        togBtn(df?'Density: Image':'Density: Uniform',df,function(){setDf(function(d){return!d;});}),
        togBtn(showRef?'Ref: On':'Ref: Off',showRef,function(){setShowRef(function(s){return!s;});})
      )
    ):null,

    /* Blend controls */
    src==='blend'?h(React.Fragment,null,
      h(Lbl,null,"Spatial Blend"),
      h("div",{style:{display:'flex',gap:2,flexWrap:'wrap',marginBottom:4}},
        BLEND_MASKS.map(function(m){return h("button",{key:m.id,onClick:function(){setBlMask(m.id);},style:Object.assign({},blMask===m.id?baSm:bSm,{padding:'3px 4px'})},m.n);})
      ),
      h(Sl,{l:"Blend Amount",v:blendAmt,min:0,max:1,step:.02,set:setBlendAmt}),
      blMask==='noise'?h(Sl,{l:"Noise Freq",v:blFreq,min:.1,max:2,step:.05,set:setBlFreq}):null
    ):null,

    /* Field Operator (visible for math/image/blend/surface3d) */
    src!=='attractor'?h(React.Fragment,null,
      h(Lbl,null,"Field Operator"),
      togBtn(foEn?'Operator: ON':'Operator: OFF',foEn,function(){setFoEn(function(v){return!v;});}),
      foEn?h(React.Fragment,null,
        h("div",{style:{display:'flex',gap:2,flexWrap:'wrap',marginBottom:4}},
          FIELD_OPS.map(function(o){return h("button",{key:o.id,onClick:function(){setFoOp(o.id);},style:Object.assign({},foOp===o.id?baSm:bSm,{padding:'3px 4px'})},o.n);})
        ),
        h(Lbl,null,"2nd Field"),
        h("div",{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2,marginBottom:4}},
          Object.entries(FIELD_NAMES).map(function(e){return h("button",{key:e[0],onClick:function(){setFoField(e[0]);},style:foField===e[0]?baSm:bSm},e[1]);})
        ),
        h(Sl,{l:"Strength",v:foStr,min:0,max:2,step:.05,set:setFoStr}),
        h(Sl,{l:"Twist 2",v:foTw,min:.1,max:4,step:.05,set:setFoTw}),
        h(Sl,{l:"Freq 2",v:foFr,min:.1,max:3,step:.05,set:setFoFr})
      ):null
    ):null,

    /* Seed */
    h(Lbl,null,"Seed"),
    h(Sl,{l:"Seed",v:sd,min:0,max:9999,set:setSd}),
    h("button",{onClick:function(){setSd(Math.floor(Math.random()*9999));},style:Object.assign({},b,{width:'100%',padding:'6px 0',color:'#aaa',borderColor:'#333'})},"Randomize")
  );

  
/* ===== SHAPE TAB ===== */
  var shapeTab=h(React.Fragment,null,
    h(Lbl,null,"Shape"),
    h("div",{style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:2,marginBottom:6}},
      Object.entries(SHAPES).map(function(e){return h("button",{key:e[0],onClick:function(){setSh(e[0]);},style:sh===e[0]?baSm:bSm},e[1].n);})
    ),
    h(Lbl,null,"Shape Morphing"),
    togBtn(moEn?'Morph: ON':'Morph: OFF',moEn,function(){setMoEn(function(v){return!v;});}),
    moEn?h(React.Fragment,null,
      h("div",{style:{fontSize:9,color:'#666',marginBottom:3}},sh+" → "+moEnd),
      h(Lbl,null,"End Shape"),
      h("div",{style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:2,marginBottom:4}},
        Object.entries(SHAPES).map(function(e){return h("button",{key:e[0],onClick:function(){setMoEnd(e[0]);},style:moEnd===e[0]?baSm:bSm},e[1].n);})
      ),
      h(Lbl,null,"Morph By"),
      h("div",{style:{display:'flex',gap:3,marginBottom:6}},
        ['magnitude','distance','angle'].map(function(m){return h("button",{key:m,onClick:function(){setMoMode(m);},style:Object.assign({},moMode===m?ba:b,{textTransform:'capitalize',fontSize:9})},m);})
      )
    ):null,

    h(Lbl,null,"Symmetry"),
    h("div",{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2,marginBottom:6}},
      SYMMETRY_MODES.map(function(m){return h("button",{key:m.id,onClick:function(){setSymMode(m.id);},style:symMode===m.id?baSm:bSm},m.n);})
    ),

    h(Lbl,null,"Render"),
    h("div",{style:{display:'flex',gap:3,marginBottom:6}},
      ['fill','stroke','both'].map(function(m){return h("button",{key:m,onClick:function(){setFm(m);},style:Object.assign({},fm===m?ba:b,{textTransform:'capitalize'})},m);})
    ),

    h(Lbl,null,"Particles"),
    h(Sl,{l:"Count",v:pc,min:20,max:2000,step:10,set:setPc}),
    h(Sl,{l:"Step",v:sl,min:.5,max:10,step:.25,set:setSl2}),
    h(Sl,{l:"Max Steps",v:ms,min:10,max:300,set:setMs}),

    h(Lbl,null,"Seeding"),
    h("div",{style:{display:'flex',gap:3,marginBottom:6}},
      ['grid','random','halton','radial'].map(function(s){return h("button",{key:s,onClick:function(){setSp(s);},style:Object.assign({},sp===s?ba:b,{textTransform:'capitalize',fontSize:9})},s);})
    ),

    h(Lbl,null,"Particle Physics"),
    togBtn(phEn?'Physics: ON':'Physics: OFF',phEn,function(){setPhEn(function(v){return!v;});}),
    phEn?h(React.Fragment,null,
      h(Sl,{l:"Repulsion",v:phRep,min:.5,max:30,step:.5,set:setPhRep}),
      h(Sl,{l:"Iterations",v:phIters,min:1,max:20,set:setPhIters}),
      togBtn(phGrav?'Gravity: ON':'Gravity: OFF',phGrav,function(){setPhGrav(function(v){return!v;});}),
      phGrav?h(React.Fragment,null,
        h(Sl,{l:"Grav X",v:phGravX,min:0,max:1,step:.02,set:setPhGravX}),
        h(Sl,{l:"Grav Y",v:phGravY,min:0,max:1,step:.02,set:setPhGravY}),
        h(Sl,{l:"Grav Str",v:phGravStr,min:.1,max:10,step:.1,set:setPhGravStr})
      ):null
    ):null,

    h(Lbl,null,"Size"),
    h(Sl,{l:"Width",v:sw,min:2,max:50,set:setSw}),
    h(Sl,{l:"Height",v:sh2,min:1,max:25,set:setSh3}),
    h(Sl,{l:"Spacing",v:ss,min:2,max:30,set:setSs}),
    h(Sl,{l:"Size Var",v:sv,min:0,max:1,step:.05,set:setSv}),
    h(Sl,{l:"Jitter",v:jt,min:0,max:1,step:.05,set:setJt}),
    h(Sl,{l:"Margin",v:mg,min:0,max:.15,step:.01,set:setMg}),
    h(Sl,{l:"Stroke W",v:stW,min:.1,max:2,step:.1,set:setStW})
  );

  /* ===== MASK TAB ===== */
  var maskTab=h(React.Fragment,null,
    h(Lbl,null,"Density Mask"),
    togBtn(mkEn?'Mask: ON':'Mask: OFF',mkEn,function(){setMkEn(function(v){return!v;});}),
    mkEn?h(React.Fragment,null,
      h(Lbl,null,"Mask Type"),
      h("div",{style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:2,marginBottom:6}},
        MASK_TYPES.map(function(m){return h("button",{key:m.id,onClick:function(){setMkType(m.id);},style:mkType===m.id?baSm:bSm},m.n);})
      ),
      h(Sl,{l:"Center X",v:mkCx,min:-.4,max:.4,step:.02,set:setMkCx}),
      h(Sl,{l:"Center Y",v:mkCy,min:-.4,max:.4,step:.02,set:setMkCy}),
      h(Sl,{l:"Radius",v:mkRad,min:.05,max:.8,step:.01,set:setMkRad}),
      h(Sl,{l:"Frequency",v:mkFreq,min:.1,max:2,step:.05,set:setMkFreq}),
      h(Sl,{l:"Threshold",v:mkThresh,min:0,max:1,step:.02,set:setMkThresh}),
      togBtn(mkInv?'Inverted':'Normal',mkInv,function(){setMkInv(function(v){return!v;});})
    ):null,
    !mkEn?h("p",{style:{fontSize:9,color:'#444',lineHeight:1.6,marginTop:8}},"Enable density masking to control where shapes appear. The flow field stays the same, but shapes only render where the mask allows."):null
  );

  /* ===== COLOR TAB ===== */
  var colorTab=h(React.Fragment,null,
    h(Lbl,null,"Palette"),
    h("div",{style:{display:'flex',gap:5,alignItems:'center',marginBottom:8,flexWrap:'wrap'}},
      cols.map(function(c,i){return h("div",{key:i,onClick:function(){setEIdx(eIdx===i?null:i);},style:{width:22,height:22,background:c,border:eIdx===i?'2px solid #fff':'2px solid #333',borderRadius:3,cursor:'pointer',flexShrink:0}});})
    ),
    eIdx!==null&&eIdx<cols.length?h("div",{style:{marginBottom:8,padding:7,border:'1px solid #333',background:'#141414'}},
      h("div",{style:{fontSize:9,color:'#666',marginBottom:3}},"Color "+(eIdx+1)),
      h("input",{type:"color",value:cols[eIdx],onChange:function(e){var n=cols.slice();n[eIdx]=e.target.value;setCols(n);},style:{width:'100%',height:28,border:'none',background:'transparent',cursor:'pointer'}}),
      h("div",{style:{fontSize:9,color:'#555',marginTop:1}},cols[eIdx])
    ):null,
    h(Sl,{l:"Count",v:cCnt,min:1,max:5,set:setCCnt}),
    h(Lbl,null,"Generate"),
    h(Sl,{l:"Base Hue",v:bHue,min:0,max:360,set:setBHue}),
    h("div",{style:{width:'100%',height:7,borderRadius:2,marginBottom:5,background:"linear-gradient(to right,"+[0,60,120,180,240,300,360].map(function(hv){return"hsl("+hv+",70%,50%)";}).join(',')+")"}}),
    h("div",{style:{display:'flex',gap:2,flexWrap:'wrap',marginBottom:5}},
      HARMS.map(function(hv){return h("button",{key:hv,onClick:function(){setHarm(hv);},style:Object.assign({},harm===hv?ba:b,{padding:'3px 3px',fontSize:9,textTransform:'capitalize'})},hv);})
    ),
    h("button",{onClick:function(){var rng=makeRng(sd+Date.now()%1000);setCols(genPal(bHue,harm,cCnt,rng));},style:Object.assign({},b,{width:'100%',padding:'6px 0',color:'#ccc',borderColor:'#555',marginBottom:8})},"Generate"),
    h(Lbl,null,"Presets"),
    h("div",{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3}},
      PALS.map(function(p){return h("button",{key:p.n,onClick:function(){setCols(p.c.slice(0,cCnt));},style:Object.assign({},b,{padding:'5px 3px',display:'flex',flexDirection:'column',alignItems:'center',gap:2})},
        h("div",{style:{display:'flex',gap:1}},p.c.slice(0,5).map(function(c,i){return h("div",{key:i,style:{width:10,height:10,background:c,borderRadius:1}});})),
        h("span",{style:{fontSize:8}},p.n));})
    )
  );

  /* ===== EXPORT TAB ===== */
  var exportTab=h(React.Fragment,null,
    h(Lbl,null,"Paper"),
    h("div",{style:{display:'flex',gap:3,flexWrap:'wrap',marginBottom:4}},
      Object.keys(PAPERS).map(function(s){return h("button",{key:s,onClick:function(){setPaper(s);},style:Object.assign({},paper===s?ba:b,{flex:'none',padding:'3px 5px',fontSize:9})},s);})
    ),
    h("div",{style:{fontSize:9,color:'#555',marginBottom:6}},cW+"x"+cH+"pts ("+(cW/72).toFixed(1)+'"x'+(cH/72).toFixed(1)+'")'),
    h(Lbl,null,"Orientation"),
    h("div",{style:{display:'flex',gap:3,marginBottom:8}},
      ['portrait','landscape'].map(function(o){return h("button",{key:o,onClick:function(){setOrient(o);},style:Object.assign({},orient===o?ba:b,{textTransform:'capitalize'})},o);})
    ),
    h(Lbl,null,"Preview"),
    h("button",{onClick:function(){setDm(function(d){return!d;});},style:Object.assign({},b,{width:'100%',padding:'6px 0',marginBottom:8})},dm?'Light Preview':'Dark Preview'),
    h(Lbl,null,"Download"),
    h("button",{onClick:function(){exportSVG(false);},style:{width:'100%',padding:'10px 0',background:'#ccc',border:'none',color:'#111',cursor:'pointer',fontFamily:'inherit',fontSize:11,fontWeight:500,letterSpacing:1,textTransform:'uppercase',marginBottom:4}},"Color SVG"),
    h("button",{onClick:function(){exportSVG(true);},style:Object.assign({},b,{width:'100%',padding:'10px 0',color:'#aaa',borderColor:'#444'})},"Plotter SVG"),
    h("p",{style:{fontSize:9,color:'#444',lineHeight:1.5,marginTop:8}},"Color: fills + palette. Plotter: black outlines only.")
  );

  /* ===== MAIN LAYOUT ===== */
  var TABS=[['field','Field'],['shape','Shape'],['mask','Mask'],['color','Color'],['out','Export']];

  return h("div",{style:{minHeight:'100vh',height:'100vh',background:'#0e0e0e',color:'#bbb',fontFamily:"'DM Mono','SF Mono',monospace",display:'flex',flexDirection:'column'}},
    /* Header */
    h("div",{style:{padding:'9px 16px',borderBottom:'1px solid #222',display:'flex',alignItems:'center',justifyContent:'space-between',background:'#0a0a0a'}},
      h("div",{style:{display:'flex',alignItems:'baseline',gap:8}},
        h("span",{style:{fontFamily:"'Instrument Serif',serif",fontSize:20,color:'#ccc'}},"Plotter Studio"),
        h("span",{style:{fontSize:9,color:'#444',textTransform:'uppercase',letterSpacing:2}},"Full")
      ),
      h("span",{style:{fontSize:10,color:'#444'}},dataRef.current.length.toLocaleString()+" shapes")
    ),
    /* Body */
    h("div",{style:{display:'flex',flex:1,overflow:'hidden'}},
      /* Sidebar */
      h("div",{style:{width:258,minWidth:258,borderRight:'1px solid #222',background:'#0a0a0a',display:'flex',flexDirection:'column',overflow:'hidden'}},
        /* Tabs */
        h("div",{style:{display:'flex',borderBottom:'1px solid #222'}},
          TABS.map(function(e){return h("button",{key:e[0],onClick:function(){setTab(e[0]);},style:{flex:1,padding:'7px 0',fontSize:9,fontFamily:'inherit',background:tab===e[0]?'#141414':'transparent',color:tab===e[0]?'#ccc':'#444',border:'none',borderBottom:tab===e[0]?'2px solid #888':'2px solid transparent',cursor:'pointer',textTransform:'uppercase',letterSpacing:1}},e[1]);})
        ),
        /* Tab content */
        h("div",{style:{flex:1,overflowY:'auto',padding:10}},
          tab==='field'?fieldTab:null,
          tab==='shape'?shapeTab:null,
          tab==='mask'?maskTab:null,
          tab==='color'?colorTab:null,
          tab==='out'?exportTab:null
        )
      ),
      /* Canvas area */
      h("div",{style:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',background:'#0c0c0c',overflow:'auto',padding:16}},
        h("div",{style:{boxShadow:dm?'0 0 0 1px #222, 0 20px 60px rgba(0,0,0,.6)':'0 0 0 1px #ddd, 0 20px 60px rgba(0,0,0,.2)',lineHeight:0}},
          h("canvas",{ref:canvasRef})
        )
      )
    )
  );
}

/* Mount */
ReactDOM.createRoot(document.getElementById('root')).render(h(PlotterStudio));
