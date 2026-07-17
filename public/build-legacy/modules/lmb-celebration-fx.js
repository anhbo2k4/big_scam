/**
 * Celebration FX Module — lazy loaded after core JS
 * Contains: explosion effects, confetti, screen flash, unbox animations,
 *           prize fly animation, celebration overlay
 * Depends on: state, FX_PROFILE, fxScaledCount (from main file global scope)
 */

function mkRing(cx, cy, pur) {
  if (FX_PROFILE.tier === 'low' && Math.random() > 0.6) return;
  var r = document.createElement('div');
  r.className = "explosion-ring".concat(pur ? ' pur' : '');
  r.style.cssText = "left:".concat(cx, "px;top:").concat(cy, "px;");
  document.body.appendChild(r);
  setTimeout(function () {
    return r.remove();
  }, 800);
}
function burst(cx, cy, big) {
  if (!state.gameSettings.showCelebrationEffects) return;
  var n = big ? fxScaledCount(16, 8) : fxScaledCount(10, 5);
  var cols = big ? ['#f59e0b', '#fbbf24', '#fde68a', '#f97316', '#fff', '#fcd34d', '#a78bfa'] : ['#7c3aed', '#a855f7', '#c084fc', '#e879f9', '#fff'];
  var frag = document.createDocumentFragment();
  var _loop = function _loop() {
    var ang = i / n * Math.PI * 2 + Math.random() * 0.3;
    var spd = big ? 95 + Math.random() * 175 : 55 + Math.random() * 105;
    var p = document.createElement('div');
    p.className = 'bp';
    var sz = big ? "".concat(5 + Math.random() * 11, "px") : "".concat(4 + Math.random() * 6, "px");
    var br = Math.random() > 0.35 ? '50%' : '3px';
    p.style.cssText = "left:".concat(cx, "px;top:").concat(cy, "px;width:").concat(sz, ";height:").concat(sz, ";--br:").concat(br, ";--col:").concat(cols[Math.floor(Math.random() * cols.length)], ";--tx:").concat(Math.cos(ang) * spd, "px;--ty:").concat(Math.sin(ang) * spd - (big ? 88 : 42), "px;--dur:").concat(big ? 0.92 + Math.random() * 0.38 : 0.6 + Math.random() * 0.28, "s;margin-left:calc(-").concat(sz, "/2);margin-top:calc(-").concat(sz, "/2);");
    frag.appendChild(p);
    setTimeout(function () {
      return p.remove();
    }, 1600);
  };
  for (var i = 0; i < n; i += 1) {
    _loop();
  }
  document.body.appendChild(frag);
}
function mkConf(n) {
  var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (!force && !state.gameSettings.showCelebrationEffects) return;
  if (state.gameSettings.popupShowConfetti === false) return;
  var count = Math.min(fxScaledCount(n, 10), 24);
  var cols = ['#7c3aed', '#a855f7', '#f59e0b', '#ec4899', '#22c55e', '#3b82f6', '#f97316', '#fbbf24', '#fff', '#e879f9'];
  var frag = document.createDocumentFragment();
  var _loop2 = function _loop2() {
    var p = document.createElement('div');
    p.className = 'cf';
    var w = 6 + Math.random() * 9;
    var h = 11 + Math.random() * 13;
    p.style.cssText = "left:".concat(3 + Math.random() * 94, "%;--col:").concat(cols[Math.floor(Math.random() * cols.length)], ";--w:").concat(w, "px;--h:").concat(h, "px;--br:").concat(['3px', '50%', '2px'][Math.floor(Math.random() * 3)], ";--dur:").concat(1.5 + Math.random() * 1.6, "s;--del:").concat(Math.random() * 0.7, "s;--r0:").concat(Math.random() * 360, "deg;--r1:").concat(360 + Math.random() * 720, "deg;--dx:").concat((Math.random() - 0.5) * 260, "px;");
    frag.appendChild(p);
    setTimeout(function () {
      return p.remove();
    }, 3400);
  };
  for (var i = 0; i < count; i += 1) {
    _loop2();
  }
  document.body.appendChild(frag);
}
function screenShake() {
  if (!FX_PROFILE.allowShake) return;
  document.body.classList.add('fx-shake');
  setTimeout(function () {
    return document.body.classList.remove('fx-shake');
  }, 420);
}
function mkCoreFlash(cx, cy, pur) {
  var core = document.createElement('div');
  core.className = "fx-core".concat(pur ? ' pur' : '');
  core.style.left = "".concat(cx, "px");
  core.style.top = "".concat(cy, "px");
  document.body.appendChild(core);
  setTimeout(function () {
    return core.remove();
  }, 900);
}
function mkShockwave(cx, cy, pur) {
  var delayMs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  setTimeout(function () {
    var s = document.createElement('div');
    s.className = "fx-shock".concat(pur ? ' pur' : '');
    s.style.left = "".concat(cx, "px");
    s.style.top = "".concat(cy, "px");
    document.body.appendChild(s);
    setTimeout(function () {
      return s.remove();
    }, 1100);
  }, delayMs);
}
function mkRays(cx, cy, pur) {
  var count = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 14;
  var n = Math.min(fxScaledCount(count, 5), count);
  var frag = document.createDocumentFragment();
  var _loop3 = function _loop3() {
    var ray = document.createElement('div');
    ray.className = "fx-ray".concat(pur ? ' pur' : '');
    ray.style.setProperty('--x', "".concat(cx, "px"));
    ray.style.setProperty('--y', "".concat(cy, "px"));
    ray.style.setProperty('--rot', "".concat(360 / n * i + Math.random() * 8, "deg"));
    ray.style.setProperty('--h', "".concat(80 + Math.random() * 140, "px"));
    ray.style.setProperty('--w', "".concat(2 + Math.random() * 3, "px"));
    frag.appendChild(ray);
    setTimeout(function () {
      return ray.remove();
    }, 950);
  };
  for (var i = 0; i < n; i += 1) {
    _loop3();
  }
  document.body.appendChild(frag);
}
function mkSparks(cx, cy, pur) {
  var count = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 42;
  var n = Math.min(fxScaledCount(count, 8), 14);
  var cols = pur ? ['#a855f7', '#c084fc', '#e9d5ff', '#ffffff'] : ['#f59e0b', '#fde68a', '#f97316', '#ffffff', '#fbbf24'];
  var frag = document.createDocumentFragment();
  var _loop4 = function _loop4() {
    var ang = i / n * Math.PI * 2 + Math.random() * 0.4;
    var dist = 60 + Math.random() * 220;
    var sp = document.createElement('div');
    sp.className = 'fx-spark';
    sp.style.setProperty('--x', "".concat(cx, "px"));
    sp.style.setProperty('--y', "".concat(cy, "px"));
    sp.style.setProperty('--tx', "".concat(Math.cos(ang) * dist, "px"));
    sp.style.setProperty('--ty', "".concat(Math.sin(ang) * dist - 30, "px"));
    sp.style.setProperty('--dur', "".concat(0.55 + Math.random() * 0.45, "s"));
    sp.style.setProperty('--sz', "".concat(3 + Math.random() * 8, "px"));
    sp.style.setProperty('--col', cols[Math.floor(Math.random() * cols.length)]);
    frag.appendChild(sp);
    setTimeout(function () {
      return sp.remove();
    }, 1050);
  };
  for (var i = 0; i < n; i += 1) {
    _loop4();
  }
  document.body.appendChild(frag);
}
function megaExplosion(cx, cy, pur) {
  var force = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (!force && !state.gameSettings.showCelebrationEffects) return;
  screenShake();
  mkCoreFlash(cx, cy, pur);
  mkShockwave(cx, cy, pur, 0);
  mkRays(cx, cy, pur, FX_PROFILE.tier === 'low' ? 6 : 8);
  mkSparks(cx, cy, pur, FX_PROFILE.tier === 'low' ? 12 : 18);
}
function ensureOpenBoxAnimStyles() {
  if (document.getElementById('lmb-openbox-anim-style')) return;
  var s = document.createElement('style');
  s.id = 'lmb-openbox-anim-style';
  s.textContent = "\n    @keyframes lmbBoxShake {\n      0%  {transform:translate3d(0,0,0) rotate(0)}\n      7%  {transform:translate3d(-10px,4px,0) rotate(-5deg)}\n      15% {transform:translate3d(10px,-3px,0) rotate(5deg)}\n      24% {transform:translate3d(-9px,5px,0) rotate(-4.5deg)}\n      33% {transform:translate3d(8px,-4px,0) rotate(4deg)}\n      44% {transform:translate3d(-6px,3px,0) rotate(-3deg)}\n      56% {transform:translate3d(6px,-3px,0) rotate(3deg)}\n      68% {transform:translate3d(-4px,2px,0) rotate(-2deg)}\n      80% {transform:translate3d(2px,-1px,0) rotate(1deg)}\n      90% {transform:translate3d(-1px,1px,0) rotate(-.5deg)}\n      100%{transform:translate3d(0,0,0) rotate(0)}\n    }\n    @keyframes boxFlip {\n      0%{transform:rotateY(0deg) translateZ(0)}\n      50%{transform:rotateY(160deg) translateZ(0)}\n      100%{transform:rotateY(360deg) translateZ(0)}\n    }\n    @keyframes boxBounce {\n      0%{transform:translateY(0) scale(1)}\n      35%{transform:translateY(-18px) scale(1.02)}\n      62%{transform:translateY(0) scale(.98)}\n      100%{transform:translateY(-6px) scale(1)}\n    }\n    @keyframes boxExplode {\n      0%{transform:scale(1)}\n      30%{transform:scale(1.08)}\n      55%{transform:scale(.9)}\n      100%{transform:scale(1.18)}\n    }\n    @keyframes boxFadePulse {\n      0%{opacity:1;transform:scale(1)}\n      40%{opacity:.58;transform:scale(1.05)}\n      100%{opacity:1;transform:scale(1)}\n    }\n    @keyframes boxSpin3d {\n      0%{transform:rotateX(0deg) rotateY(0deg)}\n      100%{transform:rotateX(360deg) rotateY(360deg)}\n    }\n    @keyframes boxWarp {\n      0%{transform:skewX(0deg) scale(1)}\n      40%{transform:skewX(-14deg) scale(1.05)}\n      80%{transform:skewX(10deg) scale(.98)}\n      100%{transform:skewX(0deg) scale(1)}\n    }\n    @keyframes lmbAuraNormal {\n      0%,100%{box-shadow:0 0 20px 8px rgba(124,58,237,.32)}\n      50%{box-shadow:0 0 50px 20px rgba(124,58,237,.58),0 0 80px 32px rgba(124,58,237,.22)}\n    }\n    @keyframes lmbAuraVip {\n      0%,100%{box-shadow:0 0 30px 10px rgba(245,158,11,.38)}\n      50%    {box-shadow:0 0 60px 26px rgba(245,158,11,.65),0 0 100px 46px rgba(253,224,71,.2)}\n    }\n    @keyframes lmbVipRevealSlam {\n      0%  {opacity:0;transform:translateX(-90px) scaleX(.5) skewX(-20deg) translateZ(0)}\n      8%  {opacity:.5;transform:translateX(-30px) scaleX(.82) skewX(-8deg) translateZ(0)}\n      17% {opacity:1;transform:translateX(12px) scaleX(1.08) skewX(4deg) translateZ(0)}\n      26% {transform:translateX(-4px) scaleX(.98) skewX(-1.5deg) translateZ(0)}\n      36% {opacity:1;transform:translateX(1px) scaleX(1.01) skewX(.3deg) translateZ(0)}\n      46% {opacity:1;transform:translateX(0) scaleX(1) skewX(0) translateZ(0)}\n      68% {opacity:1;transform:translateX(0) scale(1) translateZ(0)}\n      82% {opacity:.6;transform:translateY(-16px) scale(1.05) translateZ(0)}\n      100%{opacity:0;transform:translateY(-42px) scale(1.12) translateZ(0)}\n    }\n    @keyframes lmbVipRing {\n      0%  {transform:translate(-50%,-50%) scale(.3) translateZ(0);opacity:1}\n      22% {transform:translate(-50%,-50%) scale(.7) translateZ(0);opacity:.88}\n      48% {transform:translate(-50%,-50%) scale(1.15) translateZ(0);opacity:.65}\n      72% {transform:translate(-50%,-50%) scale(1.85) translateZ(0);opacity:.28}\n      100%{transform:translate(-50%,-50%) scale(2.5) translateZ(0);opacity:0}\n    }\n    @keyframes lmbScreenFlash {\n      0%{opacity:0}5%{opacity:.8}13%{opacity:1}30%{opacity:.6}100%{opacity:0}\n    }\n    @keyframes lmbSparkFly {\n      0%  {transform:translate3d(0,0,0) scale(1);opacity:1}\n      45% {opacity:.65}\n      100%{transform:translate3d(var(--dx),var(--dy),0) scale(0);opacity:0}\n    }\n    @keyframes lmbBeamShoot {\n      0%  {transform:rotate(var(--angle)) scaleX(0) translateZ(0);opacity:1}\n      22% {transform:rotate(var(--angle)) scaleX(.32) translateZ(0);opacity:.88}\n      100%{transform:rotate(var(--angle)) scaleX(1) translateZ(0);opacity:0}\n    }\n    @keyframes lmbScanLine {\n      0%  {top:0;opacity:0}\n      6%  {opacity:1}\n      94% {opacity:1}\n      100%{top:100%;opacity:0}\n    }\n    @keyframes lmbCardGlow {\n      0%  {opacity:0;box-shadow:0 0 0 0 var(--gc)}\n      16% {opacity:.6;box-shadow:0 0 38px 14px var(--gc)}\n      32% {opacity:1;box-shadow:0 0 62px 26px var(--gc)}\n      54% {opacity:1;box-shadow:0 0 88px 38px var(--gc)}\n      76% {opacity:.5;box-shadow:0 0 108px 50px var(--gc)}\n      100%{opacity:0;box-shadow:0 0 130px 65px transparent}\n    }\n    @keyframes lmbLidPop {\n      0%   {transform:translateX(-50%) translateY(0) rotate(0) translateZ(0);opacity:1}\n      6%   {transform:translateX(-50%) translateY(-5%) rotate(-1.5deg) translateZ(0);opacity:1}\n      12%  {transform:translateX(-50%) translateY(-1%) rotate(1deg) translateZ(0);opacity:1}\n      19%  {transform:translateX(-50%) translateY(-8%) rotate(-2deg) translateZ(0);opacity:1}\n      26%  {transform:translateX(-50%) translateY(-3%) rotate(1.5deg) translateZ(0);opacity:1}\n      33%  {transform:translateX(-50%) translateY(-11%) rotate(-2.5deg) translateZ(0);opacity:1}\n      38%  {transform:translateX(-50%) translateY(-5%) rotate(2deg) translateZ(0);opacity:1}\n      52%  {transform:translateX(-50%) translateY(-34%) rotate(-14deg) translateZ(0);opacity:1}\n      70%  {transform:translateX(-50%) translateY(-72%) rotate(-28deg) translateZ(0);opacity:.85}\n      86%  {transform:translateX(-50%) translateY(-100%) rotate(-36deg) translateZ(0);opacity:.35}\n      100% {transform:translateX(-50%) translateY(-130%) rotate(-42deg) translateZ(0);opacity:0}\n    }\n    @keyframes lmbBodyKick {\n      0%   {transform:translateX(-50%) scaleX(1) translateZ(0);opacity:1}\n      8%   {transform:translateX(-50%) translateY(-1%) scaleX(1.01) translateZ(0);opacity:1}\n      16%  {transform:translateX(-50%) translateY(.5%) scaleX(1) translateZ(0);opacity:1}\n      24%  {transform:translateX(-50%) translateY(-1.5%) scaleX(1.02) translateZ(0);opacity:1}\n      32%  {transform:translateX(-50%) translateY(.3%) scaleX(1) translateZ(0);opacity:1}\n      50%  {transform:translateX(-50%) scale(1.14) translateZ(0);opacity:1}\n      75%  {transform:translateX(-50%) scale(1.1) translateZ(0);opacity:.7}\n      100% {transform:translateX(-50%) scale(1.05) translateZ(0);opacity:0}\n    }\n    @keyframes lmbCoreBurst {\n      0%  {transform:translate(-50%,-50%) scale(.1) translateZ(0);opacity:1}\n      40% {transform:translate(-50%,-50%) scale(3.8) translateZ(0);opacity:.88}\n      100%{transform:translate(-50%,-50%) scale(6.5) translateZ(0);opacity:0}\n    }\n    @keyframes lmbLidPopVip {\n      0%   {transform:translateX(-50%) translateY(0) rotate(0) translateZ(0);opacity:1}\n      4%   {transform:translateX(-50%) translateY(-3%) rotate(-1.5deg) translateZ(0);opacity:1}\n      8%   {transform:translateX(-50%) translateY(-1%) rotate(1deg) translateZ(0);opacity:1}\n      13%  {transform:translateX(-50%) translateY(-9%) rotate(-3deg) translateZ(0);opacity:1}\n      18%  {transform:translateX(-50%) translateY(-3%) rotate(2deg) translateZ(0);opacity:1}\n      23%  {transform:translateX(-50%) translateY(-14%) rotate(-4deg) translateZ(0);opacity:1}\n      28%  {transform:translateX(-50%) translateY(-5%) rotate(3deg) translateZ(0);opacity:1}\n      34%  {transform:translateX(-50%) translateY(-18%) rotate(-4.5deg) translateZ(0);opacity:1}\n      46%  {transform:translateX(-50%) translateY(-42%) rotate(-18deg) translateZ(0);opacity:1}\n      60%  {transform:translateX(-50%) translateY(-88%) rotate(-34deg) translateZ(0);opacity:.93}\n      74%  {transform:translateX(-50%) translateY(-140%) rotate(-48deg) translateZ(0);opacity:.64}\n      88%  {transform:translateX(-50%) translateY(-190%) rotate(-58deg) translateZ(0);opacity:.2}\n      100% {transform:translateX(-50%) translateY(-235%) rotate(-66deg) translateZ(0);opacity:0}\n    }\n    @keyframes lmbBodyKickVip {\n      0%   {transform:translateX(-50%) scale(1) translateZ(0);opacity:1}\n      5%   {transform:translateX(-50%) scale(1.01) rotate(.3deg) translateZ(0);opacity:1}\n      11%  {transform:translateX(-50%) scale(1.02) rotate(-.2deg) translateZ(0);opacity:1}\n      17%  {transform:translateX(-50%) scale(1.01) rotate(.4deg) translateZ(0);opacity:1}\n      23%  {transform:translateX(-50%) scale(1.03) rotate(-.3deg) translateZ(0);opacity:1}\n      29%  {transform:translateX(-50%) scale(1.02) rotate(.5deg) translateZ(0);opacity:1}\n      34%  {transform:translateX(-50%) scale(1.07) translateZ(0);opacity:1}\n      48%  {transform:translateX(-50%) scale(1.28) translateZ(0);opacity:1}\n      62%  {transform:translateX(-50%) scale(1.36) translateZ(0);opacity:.88}\n      76%  {transform:translateX(-50%) scale(1.24) translateZ(0);opacity:.54}\n      90%  {transform:translateX(-50%) scale(1.14) translateZ(0);opacity:.22}\n      100% {transform:translateX(-50%) scale(1.08) translateZ(0);opacity:0}\n    }\n    @keyframes lmbCoreBurstVip {\n      0%  {transform:translate(-50%,-50%) scale(.05) translateZ(0);opacity:1}\n      7%  {transform:translate(-50%,-50%) scale(.9) translateZ(0);opacity:1}\n      16% {transform:translate(-50%,-50%) scale(2.4) translateZ(0);opacity:1}\n      28% {transform:translate(-50%,-50%) scale(4.5) translateZ(0);opacity:.94}\n      42% {transform:translate(-50%,-50%) scale(7.0) translateZ(0);opacity:.76}\n      60% {transform:translate(-50%,-50%) scale(9.5) translateZ(0);opacity:.45}\n      80% {transform:translate(-50%,-50%) scale(11.8) translateZ(0);opacity:.15}\n      100%{transform:translate(-50%,-50%) scale(14) translateZ(0);opacity:0}\n    }\n    .lmb-unbox-wrap{position:fixed;z-index:520;pointer-events:none;transform-style:preserve-3d;will-change:transform}\n    .lmb-unbox-lid,.lmb-unbox-body{position:absolute;left:50%;transform:translateX(-50%) translateZ(0);border-radius:14px;border:1px solid rgba(255,255,255,.28);box-shadow:0 12px 36px rgba(0,0,0,.52);will-change:transform,opacity;backface-visibility:hidden}\n    .lmb-unbox-lid{top:0;width:78%;height:33%;background:linear-gradient(145deg,rgba(124,58,237,.95),rgba(46,16,101,.97));animation:lmbLidPop .94s cubic-bezier(.18,.88,.24,1) forwards}\n    .lmb-unbox-body{bottom:0;width:100%;height:75%;background:linear-gradient(145deg,rgba(245,158,11,.92),rgba(180,83,9,.94));animation:lmbBodyKick .94s cubic-bezier(.18,.88,.24,1) forwards}\n    .lmb-unbox-core{position:absolute;left:50%;top:48%;transform:translate(-50%,-50%) translateZ(0);width:24%;height:24%;border-radius:50%;background:radial-gradient(circle,#fff,rgba(245,158,11,.85),transparent);will-change:transform,opacity;backface-visibility:hidden;animation:lmbCoreBurst 1.08s ease-out forwards}\n    .lmb-unbox-wrap.vip .lmb-unbox-lid{width:80%;background:linear-gradient(145deg,rgba(253,224,71,1),rgba(217,119,6,.98));border-color:rgba(253,224,71,.65);box-shadow:0 0 44px rgba(245,158,11,.9),0 12px 36px rgba(0,0,0,.5);animation:lmbLidPopVip 1.85s cubic-bezier(.22,.68,.36,1) forwards}\n    .lmb-unbox-wrap.vip .lmb-unbox-body{background:linear-gradient(145deg,rgba(251,191,36,.97),rgba(154,94,5,.94));border-color:rgba(253,224,71,.45);box-shadow:0 0 32px rgba(245,158,11,.65),0 12px 36px rgba(0,0,0,.5);animation:lmbBodyKickVip 1.85s cubic-bezier(.22,.68,.36,1) forwards}\n    .lmb-unbox-wrap.vip .lmb-unbox-core{width:40%;height:40%;background:radial-gradient(circle,#fff 0%,rgba(253,224,71,.96) 18%,rgba(245,158,11,.65) 45%,transparent);will-change:transform,opacity;animation:lmbCoreBurstVip 2.15s cubic-bezier(.16,.73,.32,1) forwards}\n    .lmb-unbox-wrap.unlucky .lmb-unbox-lid{animation:lmbLidPop .5s ease-out forwards;opacity:.5}\n    .lmb-unbox-wrap.unlucky .lmb-unbox-body{animation:lmbBodyKick .5s ease-out forwards;opacity:.5}\n    .lmb-unbox-wrap.unlucky .lmb-unbox-core{animation:lmbCoreBurst .5s ease-out forwards;opacity:.38}\n    .lmb-reveal-wrap{position:fixed;pointer-events:none;z-index:538;text-align:center}\n    .lmb-vrtext{display:block;margin:6px 0;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#fff;\n      text-shadow:0 0 28px rgba(245,158,11,1),0 0 55px rgba(253,224,71,.9),0 0 110px rgba(245,158,11,.5),0 3px 18px rgba(0,0,0,1);\n      will-change:transform,opacity;backface-visibility:hidden;animation:lmbVipRevealSlam 1400ms cubic-bezier(.14,.86,.24,1) forwards}\n    .lmb-vrtext.line0{font-size:14px;color:#fde68a}\n    .lmb-vrtext.line1{font-size:18px}\n    .lmb-vrtext.line2{font-size:21px}\n    .lmb-vrtext.line3{font-size:25px;letter-spacing:.18em;\n      text-shadow:0 0 35px rgba(245,158,11,1),0 0 70px rgba(253,224,71,1),0 0 140px rgba(245,158,11,.6),0 0 220px rgba(255,200,0,.3),0 4px 22px rgba(0,0,0,1)}\n    .lmb-vip-ring{position:fixed;pointer-events:none;z-index:516;border-radius:50%;border:2px solid rgba(245,158,11,.85);box-shadow:0 0 55px rgba(245,158,11,.7),inset 0 0 30px rgba(245,158,11,.3);will-change:transform,opacity;backface-visibility:hidden;animation:lmbVipRing 2s cubic-bezier(.25,.46,.45,.94) forwards}\n    .lmb-screen-flash{position:fixed;pointer-events:none;z-index:548;left:0;top:0;width:100vw;height:100vh;will-change:opacity;animation:lmbScreenFlash 1.1s ease-out forwards}\n    .lmb-sf-gold  {background:radial-gradient(ellipse at 50% 42%,rgba(253,224,71,.92) 0%,rgba(245,158,11,.52) 20%,rgba(124,58,237,.2) 45%,transparent 64%)}\n    .lmb-sf-white {background:radial-gradient(ellipse at 50% 42%,rgba(255,255,255,.98) 0%,rgba(253,224,71,.65) 16%,rgba(245,158,11,.38) 36%,transparent 56%)}\n    .lmb-sf-purple{background:radial-gradient(ellipse at 50% 42%,rgba(255,255,255,.75) 0%,rgba(192,132,252,.45) 26%,transparent 52%)}\n    .lmb-spark{position:fixed;pointer-events:none;z-index:524;border-radius:50%;will-change:transform,opacity;backface-visibility:hidden;animation:lmbSparkFly var(--dur) ease-out forwards}\n    .lmb-beam{position:fixed;pointer-events:none;z-index:518;transform-origin:left center;will-change:transform,opacity;backface-visibility:hidden;animation:lmbBeamShoot var(--dur) ease-out forwards}\n    .lmb-scan-wrap{position:fixed;pointer-events:none;z-index:521;overflow:hidden;border-radius:12px}\n    .lmb-scan-el{position:absolute;left:0;width:100%;height:3px;\n      background:linear-gradient(90deg,transparent,rgba(124,58,237,.92),rgba(245,158,11,1),rgba(253,224,71,.9),rgba(245,158,11,1),rgba(124,58,237,.92),transparent);\n      box-shadow:0 0 18px rgba(124,58,237,.9),0 0 36px rgba(245,158,11,.6),0 0 6px rgba(255,255,255,.8);\n      will-change:top,opacity;animation:lmbScanLine var(--dur,1.8s) linear forwards}\n    .lmb-card-glow{position:fixed;pointer-events:none;z-index:515;border-radius:20px;will-change:opacity,box-shadow;animation:lmbCardGlow var(--dur) ease-out forwards}\n  ";
  document.head.appendChild(s);
}
function spawnUnboxFX(rect, level) {
  var lv = (level || 'NORMAL').toUpperCase();
  var wrap = document.createElement('div');
  wrap.className = "lmb-unbox-wrap".concat(lv === 'VIP' ? ' vip' : lv === 'UNLUCKY' ? ' unlucky' : '');
  Object.assign(wrap.style, {
    left: "".concat(rect.left, "px"),
    top: "".concat(rect.top, "px"),
    width: "".concat(rect.width, "px"),
    height: "".concat(rect.height, "px")
  });
  wrap.innerHTML = '<div class="lmb-unbox-lid"></div><div class="lmb-unbox-body"></div><div class="lmb-unbox-core"></div>';
  document.body.appendChild(wrap);
  var dur = lv === 'VIP' ? 2500 : lv === 'UNLUCKY' ? 620 : 1150;
  setTimeout(function () {
    return wrap.remove();
  }, dur);
}
function spawnScanLine(rect, speed) {
  var wrap = document.createElement('div');
  wrap.className = 'lmb-scan-wrap';
  Object.assign(wrap.style, {
    left: "".concat(rect.left, "px"),
    top: "".concat(rect.top, "px"),
    width: "".concat(rect.width, "px"),
    height: "".concat(rect.height, "px")
  });
  var line = document.createElement('div');
  line.className = 'lmb-scan-el';
  var dur = speed || 1700;
  line.style.setProperty('--dur', "".concat(dur, "ms"));
  wrap.appendChild(line);
  document.body.appendChild(wrap);
  setTimeout(function () {
    return wrap.remove();
  }, dur + 120);
}
function spawnSparks(cx, cy, count, isVip) {
  var n = Math.min(fxScaledCount(count, 6), 16);
  var colors = isVip ? ['#fbbf24', '#fcd34d', '#ffffff', '#f59e0b', '#fde68a', '#fdba74', '#fef08a', '#fff7ed'] : ['#a78bfa', '#7c3aed', '#ffffff', '#c4b5fd', '#e9d5ff', '#ddd6fe', '#ede9fe'];
  var frag = document.createDocumentFragment();
  var _loop5 = function _loop5() {
    var el = document.createElement('div');
    el.className = 'lmb-spark';
    var angle = Math.random() * Math.PI * 2;
    var dist = 85 + Math.random() * (isVip ? 260 : 160);
    var dur = 420 + Math.random() * 580;
    var sz = isVip ? 5 + Math.random() * 6 : 3 + Math.random() * 4.5;
    var color = colors[Math.floor(Math.random() * colors.length)];
    Object.assign(el.style, {
      left: "".concat(cx - sz / 2, "px"),
      top: "".concat(cy - sz / 2, "px"),
      width: "".concat(sz, "px"),
      height: "".concat(sz, "px"),
      background: color,
      boxShadow: "0 0 ".concat(sz * 2.8, "px ").concat(color),
      '--dx': "".concat(Math.cos(angle) * dist, "px"),
      '--dy': "".concat(Math.sin(angle) * dist, "px"),
      '--dur': "".concat(dur, "ms")
    });
    frag.appendChild(el);
    setTimeout(function () {
      return el.remove();
    }, dur + 90);
  };
  for (var i = 0; i < n; i += 1) {
    _loop5();
  }
  document.body.appendChild(frag);
}
function spawnScreenFlash(type) {
  if (FX_PROFILE.tier === 'low') return;
  if (FX_PROFILE.tier === 'medium' && type === 'white') return;
  var el = document.createElement('div');
  el.className = "lmb-screen-flash lmb-sf-".concat(type || 'purple');
  document.body.appendChild(el);
  setTimeout(function () {
    return el.remove();
  }, 1250);
}
function spawnCardGlow(rect, isVip) {
  var el = document.createElement('div');
  el.className = 'lmb-card-glow';
  var pad = isVip ? 34 : 18;
  var dur = isVip ? 3400 : 1900;
  var gc = isVip ? 'rgba(245,158,11,.8)' : 'rgba(167,139,250,.68)';
  Object.assign(el.style, {
    left: "".concat(rect.left - pad, "px"),
    top: "".concat(rect.top - pad, "px"),
    width: "".concat(rect.width + pad * 2, "px"),
    height: "".concat(rect.height + pad * 2, "px"),
    border: "3px solid ".concat(gc),
    '--gc': gc,
    '--dur': "".concat(dur, "ms")
  });
  document.body.appendChild(el);
  setTimeout(function () {
    return el.remove();
  }, dur + 130);
}
function spawnVipGlowRings(rect) {
  var cx = rect.left + rect.width / 2;
  var cy = rect.top + rect.height / 2;
  var baseSizes = [rect.width * 1.6, rect.width * 2.4, rect.width * 3.4, rect.width * 4.8];
  var ringLimit = FX_PROFILE.tier === 'high' ? 4 : FX_PROFILE.tier === 'medium' ? 3 : 2;
  baseSizes.slice(0, ringLimit).forEach(function (size, i) {
    var el = document.createElement('div');
    el.className = 'lmb-vip-ring';
    Object.assign(el.style, {
      left: "".concat(cx, "px"),
      top: "".concat(cy, "px"),
      width: "".concat(size, "px"),
      height: "".concat(size, "px"),
      animationDelay: "".concat(i * 360, "ms")
    });
    document.body.appendChild(el);
    setTimeout(function () {
      return el.remove();
    }, 2600 + i * 360);
  });
}
function spawnLightBeams(cx, cy, count, isVip) {
  if (!FX_PROFILE.allowBeams) return;
  var n = Math.min(fxScaledCount(count, 4), 10);
  var baseLen = isVip ? 360 : 200;
  var frag = document.createDocumentFragment();
  var _loop6 = function _loop6() {
    var el = document.createElement('div');
    el.className = 'lmb-beam';
    var angle = i / n * 360 + Math.random() * (360 / n) * 0.5;
    var dur = 450 + Math.random() * 380;
    var w = baseLen + Math.random() * 180;
    var h = isVip ? 3 + Math.random() * 3.5 : 2 + Math.random() * 2.5;
    Object.assign(el.style, {
      left: "".concat(cx, "px"),
      top: "".concat(cy - h / 2, "px"),
      width: "".concat(w, "px"),
      height: "".concat(h, "px"),
      background: isVip ? "linear-gradient(90deg,rgba(255,255,255,.98),rgba(253,224,71,.82),rgba(245,158,11,.45),transparent)" : "linear-gradient(90deg,rgba(255,255,255,.9),rgba(216,180,254,.75),rgba(124,58,237,.4),transparent)",
      boxShadow: isVip ? "0 0 ".concat(h * 5, "px rgba(245,158,11,.85),0 0 ").concat(h * 10, "px rgba(253,224,71,.45)") : "0 0 ".concat(h * 5, "px rgba(124,58,237,.8)"),
      '--angle': "".concat(angle, "deg"),
      '--dur': "".concat(dur, "ms")
    });
    frag.appendChild(el);
    setTimeout(function () {
      return el.remove();
    }, dur + 65);
  };
  for (var i = 0; i < n; i += 1) {
    _loop6();
  }
  document.body.appendChild(frag);
}
function spawnBoxBurst(rect, isVip) {
  if (!state.gameSettings.showCelebrationEffects) return;
  var ox = rect.left + rect.width / 2;
  var oy = rect.top + rect.height * 0.28;
  var count = isVip ? Math.min(fxScaledCount(44, 14), 56) : Math.min(fxScaledCount(28, 10), 42);
  var vipCols = ['#f59e0b', '#fbbf24', '#fde68a', '#fff', '#fdba74', '#fcd34d', '#fef08a', '#fb923c', '#facc15', '#fef3c7'];
  var normCols = ['#7c3aed', '#a855f7', '#c084fc', '#ec4899', '#22c55e', '#38bdf8', '#f59e0b', '#fff', '#e879f9', '#fbbf24', '#f97316'];
  var cols = isVip ? vipCols : normCols;
  var frag = document.createDocumentFragment();
  var _loop7 = function _loop7() {
    var el = document.createElement('div');
    el.className = 'bp';
    var ang = -Math.PI * (0.05 + Math.random() * 0.9);
    var spd = isVip ? 100 + Math.random() * 300 : 80 + Math.random() * 220;
    var tx = Math.cos(ang) * spd;
    var ty = Math.sin(ang) * spd;
    var sz = isVip ? "".concat(5 + Math.random() * 12, "px") : "".concat(3 + Math.random() * 9, "px");
    var br = Math.random() > 0.45 ? '2px' : '50%';
    var col = cols[Math.floor(Math.random() * cols.length)];
    var dur = (isVip ? 0.7 : 0.55) + Math.random() * 0.75;
    var delMs = Math.floor(Math.random() * 160);
    el.style.cssText = "left:".concat(ox, "px;top:").concat(oy, "px;width:").concat(sz, ";height:").concat(sz, ";--br:").concat(br, ";--col:").concat(col, ";--tx:").concat(tx, "px;--ty:").concat(ty, "px;--dur:").concat(dur, "s;margin-left:calc(-").concat(sz, "/2);margin-top:calc(-").concat(sz, "/2);animation-delay:").concat(delMs, "ms;");
    frag.appendChild(el);
    setTimeout(function () {
      return el.remove();
    }, Math.ceil(dur * 1000) + delMs + 260);
  };
  for (var i = 0; i < count; i++) {
    _loop7();
  }
  document.body.appendChild(frag);
}
function spawnVipRevealTexts(rect) {
  if (!FX_PROFILE.allowVipText) return null;
  var wrap = document.createElement('div');
  wrap.className = 'lmb-reveal-wrap';
  var textW = Math.min(560, window.innerWidth - 16);
  Object.assign(wrap.style, {
    left: "".concat(rect.left + rect.width / 2, "px"),
    top: "".concat(Math.max(rect.top - 32, 46), "px"),
    transform: 'translateX(-50%)',
    width: "".concat(textW, "px")
  });
  var lines = [{
    t: "\u26A0\uFE0F PH\xC1T HI\u1EC6N V\u1EACT PH\u1EA8M \u0110\u1EB6C BI\u1EC6T",
    d: 0,
    cls: 'line0'
  }, {
    t: "\uD83D\uDC8E V\u1EACT PH\u1EA8M C\u1EA8C K\u1EF2 QU\xDD HI\u1ECEM!",
    d: 520,
    cls: 'line1'
  }, {
    t: "\uD83C\uDF1F PH\u1EA6N TH\u01AF\u1EDENG VIP CAO C\u1EA4P!",
    d: 1100,
    cls: 'line2'
  }, {
    t: "\uD83D\uDD25 J A C K P O T  V I P !",
    d: 1720,
    cls: 'line3'
  }].slice(0, FX_PROFILE.tier === 'high' ? 4 : FX_PROFILE.tier === 'medium' ? 3 : 2);
  lines.forEach(function (_ref) {
    var t = _ref.t,
      d = _ref.d,
      cls = _ref.cls;
    var el = document.createElement('div');
    el.className = "lmb-vrtext ".concat(cls);
    el.textContent = t;
    el.style.animationDelay = "".concat(d, "ms");
    wrap.appendChild(el);
  });
  document.body.appendChild(wrap);
  return wrap;
}
function playPrizeFlyAnimation(rect, prize) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var preferImage = !!String((prize === null || prize === void 0 ? void 0 : prize.image) || '').trim();
  var icon = String((prize === null || prize === void 0 ? void 0 : prize.icon) || "\uD83C\uDF81");
  var unlucky = !!opts.unlucky;
  var startSize = preferImage ? 84 : 72;
  var endSize = preferImage ? 108 : 92;
  var startX = rect.left + rect.width / 2 - startSize / 2;
  var startY = rect.top + rect.height * 0.33 - startSize / 2;
  var endX = window.innerWidth / 2 - endSize / 2;
  var endY = window.innerHeight / 2 - endSize / 2;
  var el = document.createElement('div');
  el.style.cssText = "position:fixed;z-index:540;left:".concat(startX, "px;top:").concat(startY, "px;width:").concat(startSize, "px;height:").concat(startSize, "px;display:flex;align-items:center;justify-content:center;pointer-events:none;opacity:1;transform:translateZ(0);");
  if (preferImage) {
    var img = document.createElement('img');
    img.src = String(prize.image).trim();
    img.alt = (prize === null || prize === void 0 ? void 0 : prize.name) || 'Phan thuong';
    img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:16px;border:1px solid rgba(255,255,255,.42);box-shadow:0 12px 28px rgba(0,0,0,.45),0 0 28px ".concat(unlucky ? 'rgba(96,165,250,.35)' : 'rgba(251,191,36,.34)', ";");
    el.appendChild(img);
  } else {
    var span = document.createElement('span');
    span.textContent = icon;
    span.style.cssText = "font-size:".concat(startSize, "px;line-height:1;filter:drop-shadow(0 0 18px ").concat(unlucky ? 'rgba(96,165,250,.55)' : 'rgba(251,191,36,.62)', ");");
    el.appendChild(span);
  }
  document.body.appendChild(el);
  return new Promise(function (resolve) {
    var dx = endX - startX;
    var dy = endY - startY;
    var sx = endSize / startSize;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.transition = 'transform .76s cubic-bezier(.22,1,.36,1), opacity .32s ease .52s';
        el.style.transform = "translate(".concat(dx, "px, ").concat(dy, "px) scale(").concat(sx, ") translateZ(0)");
        el.style.opacity = '0';
      });
    });
    setTimeout(function () {
      el.remove();
      resolve();
    }, 860);
  });
}
function playCelebrationOverlay(prize) {
  var countdownSec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
  var overlay = document.getElementById('celebrate');
  if (!overlay) return Promise.resolve();
  var iconEl = document.getElementById('celebrateIcon');
  var rarityEl = document.getElementById('celebrateRarity');
  var nameEl = document.getElementById('celebrateName');
  var valueEl = document.getElementById('celebrateValue');
  var imgWrapEl = document.getElementById('celebrateMedia');
  var countdownEl = document.getElementById('celebrateCountdown');
  var ringEl = document.getElementById('celebrateCountdownCircle');
  if (nameEl) nameEl.textContent = (prize === null || prize === void 0 ? void 0 : prize.name) || "Ph\u1EA7n th\u01B0\u1EDFng";
  var val = Number((prize === null || prize === void 0 ? void 0 : prize.value) || 0);
  var cur = String((prize === null || prize === void 0 ? void 0 : prize.currency) || state.sessionCurrency || 'VND').toUpperCase();
  if (valueEl) {
    if (val > 0) {
      var amt = val.toLocaleString('vi-VN');
      valueEl.textContent = cur === 'USD' ? "+$".concat(amt, " USD") : cur === 'NDT' ? "+\xA5".concat(amt, " NDT") : "+".concat(amt, " VN\u0110");
    } else {
      valueEl.textContent = "Qu\xE0 hi\u1EC7n v\u1EADt \u0111\u1EB7c bi\u1EC7t";
    }
  }
  var level = String((prize === null || prize === void 0 ? void 0 : prize.level) || '').toUpperCase();
  var tag = level === 'VIP' || prize !== null && prize !== void 0 && prize.isSpecial ? 'VIP REWARD' : 'LUCKY REWARD';
  if (rarityEl) rarityEl.textContent = tag;
  if (iconEl) {
    iconEl.innerHTML = renderPrizeVisualHtml(prize === null || prize === void 0 ? void 0 : prize.image, (prize === null || prize === void 0 ? void 0 : prize.icon) || "\uD83C\uDF81", 'celebrate-media-img', (prize === null || prize === void 0 ? void 0 : prize.name) || "Ph\u1EA7n th\u01B0\u1EDFng");
  }
  if (imgWrapEl) {
    imgWrapEl.classList.toggle('has-image', !!String((prize === null || prize === void 0 ? void 0 : prize.image) || '').trim());
  }
  overlay.style.display = 'flex';
  overlay.classList.add('show');
  mkConf(42, true);
  var C = 94.2;
  var left = Math.max(1, Number(countdownSec) || 4);
  if (countdownEl) countdownEl.textContent = String(left);
  if (ringEl) {
    ringEl.classList.add('active');
    ringEl.style.strokeDashoffset = '0';
  }
  return new Promise(function (resolve) {
    var done = false;
    var _close = function close() {
      if (done) return;
      done = true;
      if (state._celebrateTimer) {
        clearInterval(state._celebrateTimer);
        state._celebrateTimer = null;
      }
      overlay.classList.remove('show');
      overlay.style.display = 'none';
      if (ringEl) {
        ringEl.classList.remove('active');
        ringEl.style.strokeDashoffset = '0';
      }
      overlay.removeEventListener('click', _close);
      resolve();
    };
    overlay.addEventListener('click', _close);
    state._celebrateTimer = setInterval(function () {
      left -= 1;
      if (countdownEl) countdownEl.textContent = String(Math.max(0, left));
      if (ringEl) ringEl.style.strokeDashoffset = "".concat(((countdownSec - left) / countdownSec * C).toFixed(2));
      if (left <= 0) _close();
    }, 1000);
  });
}