/* ═══════════════════════════════════════════════
   SCENE — fond animé (ciel étoilé, montagnes, particules)
   ═══════════════════════════════════════════════ */
(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var cvMain = document.getElementById('cv-main');
  var ctx = cvMain.getContext('2d');
  var cvPt = document.getElementById('cv-parts');
  var ctxPt = cvPt.getContext('2d');
  var W = 0, H = 0;
  var parallaxX = 0, parallaxY = 0, targetX = 0, targetY = 0;

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    cvMain.width = W; cvMain.height = H;
    cvPt.width = W; cvPt.height = H;
    drawStaticBg();
  }

  var STAR_COUNT = reducedMotion ? 60 : 150;
  var stars = [];
  for (var i = 0; i < STAR_COUNT; i++) {
    stars.push({ x: Math.random(), y: Math.random()*0.62, r: 0.3+Math.random()*1.4,
      a: 0.25+Math.random()*0.75, tw: Math.random()*6.28, tws: 0.006+Math.random()*0.018,
      col: Math.random()<0.15?'#ECC97A':Math.random()<0.2?'#F2C4D0':'#ffffff' });
  }

  var meteors = [];
  function newMeteor() {
    return { x:0.05+Math.random()*0.75, y:0.02+Math.random()*0.22, prog:0,
      speed:0.005+Math.random()*0.004, len:0.08+Math.random()*0.08,
      delay:4+Math.random()*10, active:false };
  }
  if (!reducedMotion) for (var m = 0; m < 2; m++) meteors.push(newMeteor());

  var trees = [];
  for (var ti = 0; ti < 14; ti++) {
    var side = ti<5?0:ti<10?1:2;
    trees.push({ xr:side===0?0.02+Math.random()*0.16:side===1?0.82+Math.random()*0.16:0.18+Math.random()*0.64,
      yr:0.72+Math.random()*0.05, hr:0.065+Math.random()*0.09, wr:0.024+Math.random()*0.018,
      layer:side===2?1:0, sway:Math.random()*6.28, swayS:0.003+Math.random()*0.005 });
  }

  function drawTree(c,x,y,h,w) {
    c.beginPath();c.rect(x-w*0.07,y,w*0.14,h*0.28);c.fill();
    c.beginPath();c.moveTo(x,y-h*0.52);c.lineTo(x-w*0.5,y+h*0.08);c.lineTo(x+w*0.5,y+h*0.08);c.closePath();c.fill();
    c.beginPath();c.moveTo(x,y-h*0.76);c.lineTo(x-w*0.38,y-h*0.14);c.lineTo(x+w*0.38,y-h*0.14);c.closePath();c.fill();
    c.beginPath();c.moveTo(x,y-h);c.lineTo(x-w*0.25,y-h*0.44);c.lineTo(x+w*0.25,y-h*0.44);c.closePath();c.fill();
  }

  var cityLights = [];
  for (var ci = 0; ci < 30; ci++) {
    cityLights.push({ xr:Math.random(), yr:0.755+Math.random()*0.045, r:0.5+Math.random()*1.4,
      a:0.2+Math.random()*0.45, tw:Math.random()*6.28, tws:0.01+Math.random()*0.04,
      col:Math.random()<0.4?'#ECC97A':Math.random()<0.5?'#F2C4D0':'#C8456C' });
  }

  var SYMS=['♥','✦','·','◇'], COLS=['rgba(200,69,108,','rgba(212,168,83,','rgba(242,196,208,'];
  var PART_COUNT = reducedMotion ? 18 : 45;
  var parts=[];
  function newPart() {
    var hrt=Math.random()<0.18;
    return { x:Math.random()*W, y:H+20+Math.random()*50, vx:(Math.random()-0.5)*0.45, vy:-(0.32+Math.random()*0.75),
      alpha:0.08+Math.random()*0.52, size:hrt?10+Math.random()*18:3+Math.random()*12,
      sym:hrt?'♥':SYMS[Math.floor(Math.random()*SYMS.length)],
      col:COLS[Math.floor(Math.random()*COLS.length)],
      ang:Math.random()*6.28, twist:(Math.random()-0.5)*0.012,
      drift:Math.random()*6.28, driftS:0.006+Math.random()*0.008 };
  }
  for (var pi=0;pi<PART_COUNT;pi++){var p=newPart();p.y=Math.random()*H;parts.push(p);}

  var bgCanvas=document.createElement('canvas'), bgCtx=bgCanvas.getContext('2d');
  function drawStaticBg() {
    bgCanvas.width=W;bgCanvas.height=H;
    var sky=bgCtx.createLinearGradient(0,0,0,H*0.82);
    sky.addColorStop(0,'#050108');sky.addColorStop(0.28,'#0D0412');sky.addColorStop(0.55,'#1A0820');
    sky.addColorStop(0.75,'#2D1020');sky.addColorStop(0.9,'#3D1428');sky.addColorStop(1,'#4A1830');
    bgCtx.fillStyle=sky;bgCtx.fillRect(0,0,W,H);
    var hg=bgCtx.createLinearGradient(0,H*0.68,0,H*0.82);
    hg.addColorStop(0,'rgba(123,26,58,0)');hg.addColorStop(0.5,'rgba(123,26,58,0.1)');hg.addColorStop(1,'rgba(200,69,108,0.07)');
    bgCtx.fillStyle=hg;bgCtx.fillRect(0,H*0.68,W,H*0.15);
    function drawMtn(yBase,color,f1,f2,seed) {
      bgCtx.beginPath();bgCtx.moveTo(0,H);
      for(var px=0;px<=W+6;px+=6){bgCtx.lineTo(px,yBase*H+Math.sin(px*f1+seed)*0.065*H+Math.cos(px*f2+seed*1.4)*0.02*H);}
      bgCtx.lineTo(W,H);bgCtx.closePath();bgCtx.fillStyle=color;bgCtx.fill();
    }
    drawMtn(0.62,'rgba(28,7,16,0.78)',0.0024,0.0013,0.5);
    drawMtn(0.66,'rgba(18,5,11,0.9)',0.0034,0.0018,1.2);
    var soil=bgCtx.createLinearGradient(0,H*0.72,0,H);
    soil.addColorStop(0,'#1A0810');soil.addColorStop(0.4,'#110508');soil.addColorStop(1,'#090305');
    bgCtx.fillStyle=soil;bgCtx.fillRect(0,H*0.72,W,H*0.28);
    var fg3=bgCtx.createLinearGradient(0,H*0.91,0,H);
    fg3.addColorStop(0,'rgba(4,1,2,0)');fg3.addColorStop(1,'rgba(4,1,2,0.94)');
    bgCtx.fillStyle=fg3;bgCtx.fillRect(0,H*0.91,W,H*0.09);
  }

  var tick=0, running=true;
  function loop() {
    if (!running) return;
    tick+=0.014; var t=tick;
    parallaxX += (targetX - parallaxX) * 0.04;
    parallaxY += (targetY - parallaxY) * 0.04;
    ctx.clearRect(0,0,W,H);
    ctx.save();
    ctx.translate(parallaxX*10, parallaxY*6);
    ctx.drawImage(bgCanvas,-parallaxX*10,-parallaxY*6);
    for(var si=0;si<stars.length;si++){var s=stars[si];s.tw+=s.tws;ctx.globalAlpha=s.a*(0.55+Math.sin(s.tw)*0.45);ctx.fillStyle=s.col;ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r,0,6.28);ctx.fill();}
    ctx.globalAlpha=1;
    for(var mi=0;mi<meteors.length;mi++){var me=meteors[mi];me.delay-=0.016;if(me.delay<=0&&!me.active)me.active=true;if(me.active){me.prog+=me.speed;var alpha=me.prog<0.12?me.prog/0.12:me.prog>0.72?(1-me.prog)/0.28:1;alpha=Math.max(0,Math.min(1,alpha));var ex=me.x*W+me.prog*me.len*W,ey=me.y*H+me.prog*me.len*H*0.38,sx=ex-me.len*W*0.35,sy=ey-me.len*H*0.13;var mg=ctx.createLinearGradient(sx,sy,ex,ey);mg.addColorStop(0,'rgba(242,196,208,0)');mg.addColorStop(1,'rgba(242,196,208,'+(alpha*0.88)+')');ctx.strokeStyle=mg;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.stroke();if(me.prog>=1)meteors[mi]=newMeteor();}}
    var lx=W*0.72,ly=H*0.17;
    var lhalo=ctx.createRadialGradient(lx,ly,18,lx,ly,88);lhalo.addColorStop(0,'rgba(212,168,83,0.11)');lhalo.addColorStop(0.5,'rgba(212,168,83,0.04)');lhalo.addColorStop(1,'rgba(212,168,83,0)');ctx.fillStyle=lhalo;ctx.beginPath();ctx.arc(lx,ly,88,0,6.28);ctx.fill();
    ctx.save();ctx.shadowColor='rgba(212,168,83,0.55)';ctx.shadowBlur=18;var lg=ctx.createRadialGradient(lx-5,ly-5,2,lx,ly,26);lg.addColorStop(0,'#FFF5DC');lg.addColorStop(0.6,'#ECC97A');lg.addColorStop(1,'#C89A3A');ctx.fillStyle=lg;ctx.beginPath();ctx.arc(lx,ly,26,0,6.28);ctx.fill();ctx.restore();
    ctx.fillStyle='rgba(13,4,8,0.56)';ctx.beginPath();ctx.arc(lx+9,ly-3,24,0,6.28);ctx.fill();
    var bands=[{cy:0.22,c1:'rgba(123,26,58,',c2:'rgba(165,32,80,',amp:0.05,sp:0.18},{cy:0.27,c1:'rgba(165,32,80,',c2:'rgba(200,69,108,',amp:0.04,sp:0.14}];
    for(var bi=0;bi<bands.length;bi++){var b=bands[bi];var wave=Math.sin(t*b.sp)*b.amp*H;var cy=b.cy*H+wave;var hh=0.04*H;var al=0.04+Math.sin(t*0.38+bi)*0.015;var ag=ctx.createLinearGradient(0,cy-hh,0,cy+hh);ag.addColorStop(0,b.c1+'0)');ag.addColorStop(0.5,b.c2+al+')');ag.addColorStop(1,b.c1+'0)');ctx.fillStyle=ag;ctx.fillRect(0,cy-hh,W,hh*2);}
    ctx.fillStyle='rgba(11,3,7,0.88)';for(var tri=0;tri<trees.length;tri++){var tr=trees[tri];if(tr.layer!==1)continue;tr.sway+=tr.swayS;ctx.save();ctx.translate(Math.sin(tr.sway)*1.5,0);drawTree(ctx,tr.xr*W,tr.yr*H,tr.hr*H,tr.wr*W);ctx.restore();}
    var ry=H*0.775;var rg=ctx.createLinearGradient(0,ry-14,0,ry+28);rg.addColorStop(0,'rgba(123,26,58,0.16)');rg.addColorStop(0.5,'rgba(200,69,108,0.07)');rg.addColorStop(1,'rgba(13,4,8,0)');ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(0,ry);for(var rx2=0;rx2<=W;rx2+=8){ctx.lineTo(rx2,ry+Math.sin(rx2*0.014+t*0.85)*3);}ctx.lineTo(W,ry+28);ctx.lineTo(0,ry+28);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(6,1,3,0.97)';for(var trfi=0;trfi<trees.length;trfi++){var trf=trees[trfi];if(trf.layer!==0)continue;trf.sway+=trf.swayS;ctx.save();ctx.translate(Math.sin(trf.sway)*2,0);drawTree(ctx,trf.xr*W,trf.yr*H,trf.hr*H*1.18,trf.wr*W*1.12);ctx.restore();}
    for(var cii=0;cii<cityLights.length;cii++){var cl=cityLights[cii];cl.tw+=cl.tws;ctx.globalAlpha=cl.a*(0.58+Math.sin(cl.tw)*0.42);ctx.fillStyle=cl.col;ctx.beginPath();ctx.arc(cl.xr*W,cl.yr*H,cl.r,0,6.28);ctx.fill();}
    ctx.globalAlpha=1;
    ctx.restore();
    ctxPt.clearRect(0,0,W,H);
    for(var ppi=0;ppi<parts.length;ppi++){var pp=parts[ppi];pp.drift+=pp.driftS;pp.x+=pp.vx+Math.sin(pp.drift)*0.33;pp.y+=pp.vy;pp.ang+=pp.twist;if(pp.y<-80){parts[ppi]=newPart();continue;}ctxPt.globalAlpha=pp.alpha;ctxPt.font=pp.size+'px serif';ctxPt.fillStyle=pp.col+'0.9)';ctxPt.save();ctxPt.translate(pp.x,pp.y);ctxPt.rotate(pp.ang);ctxPt.fillText(pp.sym,0,0);ctxPt.restore();}
    ctxPt.globalAlpha=1;
    requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(loop);
  });

  if (!reducedMotion) {
    window.addEventListener('pointermove', function (e) {
      targetX = (e.clientX / W - 0.5);
      targetY = (e.clientY / H - 0.5);
    });
  }

  resize();
  window.addEventListener('resize', resize);
  loop();
})();
