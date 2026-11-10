let pw;
for (const p of ['/tmp/jt/node_modules/playwright-core','/usr/local/lib/pnpm/5/.pnpm/playwright-core@1.59.1/node_modules/playwright-core','playwright-core']) { try { pw=require(p); break; } catch(e) {} }
if (!pw) throw new Error('playwright-core not found');
const {chromium}=pw;
const fs=require('fs'),{execSync}=require('child_process');
const URL='http://localhost:8766/sim/app/';
const BK=JSON.parse(fs.readFileSync('/workspace/NWH-User-Backup-2026-10-17.json'));
execSync('rm -rf /workspace/sim/app && mkdir -p /workspace/sim/app && cp /workspace/nwh-boiler-log/index.html /workspace/nwh-boiler-log/sw.js /workspace/nwh-boiler-log/manifest.json /workspace/nwh-boiler-log/icon-192.png /workspace/nwh-boiler-log/icon-512.png /workspace/sim/app/');
(async()=>{
  const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});
  const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,serviceWorkers:'block'});
  const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(e.message));
  const E=(f,a)=>pg.evaluate(f,a);
  const open=async(u)=>{await pg.goto(u);await pg.waitForTimeout(700);if(await pg.$('#pinInput:visible')){await pg.fill('#pinInput','5295');await pg.click('text=Unlock');await pg.waitForTimeout(800);}};
  await open(URL);
  await E(bk=>{for(const k of ['nwhWork','nwhAocs','nwhSettings','nwhSchema']) if(bk.data[k]!=null) localStorage.setItem(k,JSON.stringify(bk.data[k]));},BK);
  await pg.reload(); await open(URL);
  console.log('ver', await E(()=>APP_VER));
  await E(()=>showScreen('home')); await pg.waitForTimeout(500);
  const homeHas=await E(()=>/Boiler 1 Manual/.test(document.getElementById('home').innerText) && /Ensure wood feed/.test(document.body.innerText)===false);
  // startup procedure should still exist in eq home, unchanged
  await E(()=>showScreen('eqHome')); await pg.waitForTimeout(400);
  const eqText=await E(()=>document.getElementById('eqHome').innerText);
  console.log('eq has manual link', /Boiler 1 Manual/.test(eqText));
  console.log('custom startup intact', await E(()=>{const p=eqProcs().find(x=>x.id==='eq-b1-startup'); const t=p.steps.map(s=>s.text); return JSON.stringify(t)===JSON.stringify(EQ_B1_START.steps.map(s=>s.text)) && t[0].startsWith('Ensure wood feed selector') && t[4].includes('650') && t[5].includes('Turn alarm off');}));
  await E(()=>showScreen('more')); await pg.waitForTimeout(400);
  console.log('more has manual', await E(()=>/Boiler 1 Manual/.test(document.getElementById('more').innerText)));
  await E(()=>manOpen('more')); await pg.waitForTimeout(500);
  console.log('screen', await E(()=>document.querySelector('.screen.active').id+' '+document.getElementById('hdrVer').textContent));
  const body=await E(()=>document.getElementById('manBody').innerText);
  const checks=[
    'IV. STARTUP AND OPERATION','A. GENERAL','B. PRESTART CHECKLIST; WOOD AND GAS',
    'Proper boiler water level and control settings','13. Adequate wood fuel supply',
    "PRESTART CHECKLIST, WOOD & GAS (Cont'd.)",
    'cleaning the reactor and nozzle prior to system start',
    'The pre-purge of the control cycle lasts 58 seconds',
    'TD-2 should be reset to cold start setting for cold starts.',
    '(Note: Hammer mill not energized)',
    'Push reset on control programmer (inside free standing panel).',
    "VII. TROUBLE SHOOTING","B. GASIFIER WON'T START",
    'pyroysis reactions occur','Quadernary air ports',
    'VIII. SYSTEM COMPONENTS GLOSSARY'
  ];
  console.log('missing phrases', checks.filter(t=>!body.includes(t)).join(' | ')||'none');
  // checklists
  const preN=await E(()=>document.querySelectorAll('.man-ck[data-ck="pre"] .man-item').length);
  const failN=await E(()=>document.querySelectorAll('.man-ck[data-ck="fail"] .man-item').length);
  console.log('checklist counts', 'pre='+preN,'fail='+failN);
  const before=await E(()=>localStorage.nwhWork);
  await E(()=>{document.querySelectorAll('.man-ck[data-ck="pre"] input').forEach(i=>{i.checked=true;i.dispatchEvent(new Event('change',{bubbles:true}));});});
  console.log('pre checked', await E(()=>Object.values(manCk.pre).filter(Boolean).length));
  await E(()=>manReset('pre'));
  console.log('pre after reset', await E(()=>Object.values(manCk.pre||{}).filter(Boolean).length));
  await E(()=>{document.querySelectorAll('.man-ck[data-ck="fail"] input')[0].click();});
  console.log('work unchanged', await E(w=>localStorage.nwhWork===w, before));
  // search
  await pg.fill('#manQ','flame failure'); await pg.waitForTimeout(200);
  console.log('search', await E(()=>{
    const vis=[...document.querySelectorAll('.man-sec')].filter(s=>s.offsetHeight>0).map(s=>s.getAttribute('data-id'));
    const hid=[...document.querySelectorAll('.man-sec')].filter(s=>s.hidden || s.offsetHeight===0).length;
    return 'visible='+vis.join(',')+' marks='+document.querySelectorAll('#manBody mark').length;
  }));
  await pg.fill('#manQ',''); await pg.waitForTimeout(200);
  // screenshots: open prestart and glossary
  await E(()=>{document.querySelectorAll('.man-sec').forEach(s=>s.open=true); document.querySelector('[data-id="ivb"]').scrollIntoView();});
  await pg.screenshot({path:'/workspace/nwh-build/v351/manual-prestart.png'});
  await E(()=>document.getElementById('b1man').scrollTop=0);
  await pg.evaluate(()=>document.querySelector('#b1man .scr-head').scrollIntoView());
  await pg.screenshot({path:'/workspace/nwh-build/v351/manual-light.png', fullPage:true});
  console.log('hscroll light', await E(()=>document.documentElement.scrollWidth>innerWidth+1));
  await E(()=>document.documentElement.classList.add('dark'));
  await pg.waitForTimeout(300);
  await pg.screenshot({path:'/workspace/nwh-build/v351/manual-dark.png', fullPage:true});
  console.log('hscroll dark', await E(()=>document.documentElement.scrollWidth>innerWidth+1));
  await E(()=>document.documentElement.classList.remove('dark'));
  await E(()=>showScreen('home')); await pg.waitForTimeout(400);
  await pg.screenshot({path:'/workspace/nwh-build/v351/home-link.png'});
  console.log('home has manual btn', await E(()=>!!document.querySelector('#home [onclick*=\"manOpen\"]') || /Boiler 1 Manual/.test(document.getElementById('home').innerText)));
  console.log('errors', errs.slice(0,8).join(' | ')||'none');
  await b.close();
})();
