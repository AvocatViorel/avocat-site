const $=(id)=>document.getElementById(id);
let LANG='ro';

document.querySelectorAll('.tab').forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    LANG=b.dataset.lang;
    loadAll();
  });
});

async function jget(url){
  const r=await fetch(url,{cache:'no-store'});
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}
async function jpost(url, data){
  const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}
const pretty=(o)=>JSON.stringify(o,null,2);

async function loadAll(){
  const site=await jget('/api/site?lang='+LANG);
  const countries=await jget('/api/countries');
  const articles=await jget('/api/articles');

  $('phone').value=site.contact.phone||'';
  $('email').value=site.contact.email||'';
  $('website').value=site.contact.website||'';
  $('viber').value=site.contact.viber||'';

  $('heroTitle').value=site.strings.heroTitle||'';
  $('heroSub').value=site.strings.heroSub||'';
  $('aboutText').value=site.strings.aboutText||'';
  $('servicesSub').value=site.strings.servicesSub||'';
  $('diasporaSub').value=site.strings.diasporaSub||'';

  $('countriesJson').value=pretty(countries);
  $('articlesJson').value=pretty(articles);
}

function parseJson(txt){
  try{return JSON.parse(txt);}catch(e){throw new Error('JSON invalid: '+e.message);}
}

async function saveAll(){
  await jpost('/api/save',{
    lang: LANG,
    site:{
      contact:{
        phone:$('phone').value.trim(),
        email:$('email').value.trim(),
        website:$('website').value.trim(),
        viber:$('viber').value.trim(),
      },
      strings:{
        heroTitle:$('heroTitle').value,
        heroSub:$('heroSub').value,
        aboutText:$('aboutText').value,
        servicesSub:$('servicesSub').value,
        diasporaSub:$('diasporaSub').value,
      }
    },
    countries: parseJson($('countriesJson').value),
    articles: parseJson($('articlesJson').value),
  });
  alert('Salvat ✅');
}

async function resetAll(){
  await jpost('/api/reset',{confirm:true});
  await loadAll();
  alert('Reset ✅');
}

$('loadBtn').onclick=()=>loadAll().catch(e=>alert(e.message||String(e)));
$('saveBtn').onclick=()=>saveAll().catch(e=>alert(e.message||String(e)));
$('resetBtn').onclick=()=>resetAll().catch(e=>alert(e.message||String(e)));

loadAll().catch(()=>{});
