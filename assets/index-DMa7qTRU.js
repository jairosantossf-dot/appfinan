(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const n of l)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(l){const n={};return l.integrity&&(n.integrity=l.integrity),l.referrerPolicy&&(n.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?n.credentials="include":l.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(l){if(l.ep)return;l.ep=!0;const n=a(l);fetch(l.href,n)}})();const Oe=[{id:"summary",label:"Resumen",icon:"📊"},{id:"income",label:"Ingresos",icon:"💰"},{id:"expenses",label:"Gastos",icon:"💸"},{id:"debts",label:"Deudas",icon:"💳"},{id:"business",label:"Negocios",icon:"🏢"},{id:"savings",label:"Ahorro",icon:"🎯"},{id:"settings",label:"Ajustes",icon:"⚙️"}];let re="summary",se=null;function Re(e){se=e;const t=document.getElementById("main-nav"),a=document.createElement("div");a.className="nav-inner",Oe.forEach(s=>{const l=document.createElement("button");l.className="nav-tab"+(s.id===re?" active":""),l.dataset.tab=s.id,l.setAttribute("role","tab"),l.setAttribute("aria-selected",String(s.id===re)),l.innerHTML=`
      <span class="nav-tab-icon" aria-hidden="true">${s.icon}</span>
      <span>${s.label}</span>
    `,a.appendChild(l)}),t.appendChild(a),t.addEventListener("click",s=>{const l=s.target.closest("[data-tab]");l&&Y(l.dataset.tab)})}function Y(e){re=e,document.querySelectorAll(".nav-tab").forEach(t=>{const a=t.dataset.tab===e;t.classList.toggle("active",a),t.setAttribute("aria-selected",String(a))}),document.querySelectorAll(".tab-panel").forEach(t=>{t.classList.toggle("active",t.dataset.panel===e)}),se==null||se(e)}const Ge=[{id:"cat-vivienda",name:"Vivienda",icon:"🏠",color:"#6366f1",type:"fixed"},{id:"cat-servicios",name:"Servicios",icon:"💡",color:"#8b5cf6",type:"fixed"},{id:"cat-alimentacion",name:"Alimentación",icon:"🛒",color:"#10b981",type:"variable"},{id:"cat-transporte",name:"Transporte",icon:"🚗",color:"#3b82f6",type:"variable"},{id:"cat-salud",name:"Salud",icon:"🏥",color:"#ef4444",type:"variable"},{id:"cat-educacion",name:"Educación",icon:"📚",color:"#f59e0b",type:"variable"},{id:"cat-entretenimiento",name:"Entretenimiento",icon:"🎬",color:"#ec4899",type:"variable"},{id:"cat-ropa",name:"Ropa",icon:"👕",color:"#14b8a6",type:"variable"},{id:"cat-otros",name:"Otros",icon:"📦",color:"#64748b",type:"variable"}],ce=[{code:"USD",symbol:"$",locale:"en-US",name:"Dólar estadounidense"},{code:"EUR",symbol:"€",locale:"de-DE",name:"Euro"},{code:"MXN",symbol:"$",locale:"es-MX",name:"Peso mexicano"},{code:"COP",symbol:"$",locale:"es-CO",name:"Peso colombiano"},{code:"ARS",symbol:"$",locale:"es-AR",name:"Peso argentino"},{code:"CLP",symbol:"$",locale:"es-CL",name:"Peso chileno"},{code:"PEN",symbol:"S/",locale:"es-PE",name:"Sol peruano"},{code:"BRL",symbol:"R$",locale:"pt-BR",name:"Real brasileño"},{code:"GTQ",symbol:"Q",locale:"es-GT",name:"Quetzal guatemalteco"},{code:"HNL",symbol:"L",locale:"es-HN",name:"Lempira hondureño"},{code:"BOB",symbol:"Bs",locale:"es-BO",name:"Boliviano"},{code:"PYG",symbol:"₲",locale:"es-PY",name:"Guaraní paraguayo"},{code:"UYU",symbol:"$",locale:"es-UY",name:"Peso uruguayo"},{code:"VES",symbol:"Bs",locale:"es-VE",name:"Bolívar venezolano"}],de=[{id:"g1",label:"Índigo",value:"linear-gradient(135deg,#667eea,#764ba2)"},{id:"g2",label:"Esmeralda",value:"linear-gradient(135deg,#11998e,#38ef7d)"},{id:"g3",label:"Coral",value:"linear-gradient(135deg,#f093fb,#f5576c)"},{id:"g4",label:"Océano",value:"linear-gradient(135deg,#4facfe,#00f2fe)"},{id:"g5",label:"Naranja",value:"linear-gradient(135deg,#f7971e,#ffd200)"},{id:"g6",label:"Noche",value:"linear-gradient(135deg,#2c3e50,#4ca1af)"},{id:"g7",label:"Rosa",value:"linear-gradient(135deg,#ff758c,#ff7eb3)"},{id:"g8",label:"Verde",value:"linear-gradient(135deg,#56ab2f,#a8e063)"}],W=["#6366f1","#8b5cf6","#ec4899","#ef4444","#f97316","#f59e0b","#10b981","#14b8a6","#3b82f6","#06b6d4","#84cc16","#64748b","#0ea5e9","#a855f7","#e11d48"];function ue(){const e=new Date().toISOString();return{meta:{version:1,createdAt:e,lastModified:e},profile:{name:"",onboardingCompleted:!1,currency:{code:"USD",symbol:"$",locale:"en-US"},distributionRule:{live:60,debts:10,save:30}},incomeSourceTypes:[],expenseCategories:Ge.map(t=>({...t})),incomes:[],expenses:[],creditCards:[],loans:[],businesses:[],savingsGoals:[]}}const Le="finanzas-v1";let _=null;const He=new Set;function ve(){try{const e=localStorage.getItem(Le);_=e?JSON.parse(e):ue()}catch{_=ue()}}function be(){_.meta.lastModified=new Date().toISOString();try{localStorage.setItem(Le,JSON.stringify(_))}catch(e){console.error("Error guardando datos:",e)}}function ge(){He.forEach(e=>e(_))}function g(){return _||ve(),_}function f(e){_||ve(),typeof e=="function"?e(_):Object.assign(_,e),be(),ge()}function Ve(){return JSON.stringify(g(),null,2)}function Ue(e){const t=JSON.parse(e);if(!t.meta||!t.profile)throw new Error("Archivo no válido: faltan campos requeridos.");_=t,be(),ge()}function Ye(){_=ue(),be(),ge()}function T(){return`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function m(e){const{code:t,locale:a}=g().profile.currency;try{return new Intl.NumberFormat(a,{style:"currency",currency:t,minimumFractionDigits:2,maximumFractionDigits:2}).format(e??0)}catch{return`$${Number(e??0).toFixed(2)}`}}ve();function We(e=""){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Q(){const{profile:e}=g(),t=document.getElementById("header-meta");t&&(t.innerHTML=e.name?`<span class="header-user">${We(e.name)}</span>`:"")}const z=[{id:"welcome",title:"¡Bienvenido!",subtitle:"En unos pasos configuramos tu perfil."},{id:"currency",title:"¿Cuál es tu moneda?",subtitle:"Puedes cambiarla después en Ajustes."},{id:"distribution",title:"Tu regla de distribución",subtitle:"Define cómo repartir tus ingresos. Los tres valores deben sumar 100 %."}];let C=0,ne=null,w=null;function Je(e){if(g().profile.onboardingCompleted){e==null||e();return}ne=e,C=0,fe()}function fe(){var e;w&&w.remove(),w=document.createElement("div"),w.className="onboarding-overlay",w.innerHTML=`
    <div class="onboarding-card">
      <div class="onboarding-step-indicator">
        ${z.map((t,a)=>`<div class="step-dot${a===C?" active":""}"></div>`).join("")}
      </div>
      <div>
        <h2 class="onboarding-title">${z[C].title}</h2>
        <p class="onboarding-subtitle">${z[C].subtitle}</p>
      </div>
      <div class="onboarding-body" id="onboarding-body"></div>
      <div class="onboarding-footer">
        <button class="btn btn-ghost" id="ob-skip">Saltar</button>
        <div style="display:flex;gap:var(--sp-2);">
          ${C>0?'<button class="btn btn-outline" id="ob-back">Atrás</button>':""}
          <button class="btn btn-primary" id="ob-next">
            ${C===z.length-1?"Empezar":"Siguiente"}
          </button>
        </div>
      </div>
    </div>
  `,Xe(w.querySelector("#onboarding-body")),w.querySelector("#ob-skip").addEventListener("click",ke),w.querySelector("#ob-next").addEventListener("click",Ze),(e=w.querySelector("#ob-back"))==null||e.addEventListener("click",et),document.body.appendChild(w)}function Xe(e){const t=g(),a=z[C].id;if(a==="welcome"&&(e.innerHTML=`
      <div class="field-group">
        <label class="field-label" for="ob-name">Tu nombre <span style="color:var(--text-muted);font-weight:400;">(opcional)</span></label>
        <input class="field-input" type="text" id="ob-name" placeholder="Ej: María García"
               value="${tt(t.profile.name)}" autocomplete="name" />
      </div>
    `,e.querySelector("#ob-name").focus()),a==="currency"&&(e.innerHTML=`
      <div class="field-group">
        <label class="field-label" for="ob-currency">Moneda</label>
        <select class="field-input field-select" id="ob-currency">
          ${ce.map(s=>`
            <option value="${s.code}" ${s.code===t.profile.currency.code?"selected":""}>
              ${s.symbol} — ${s.name} (${s.code})
            </option>
          `).join("")}
        </select>
      </div>
    `),a==="distribution"){const{live:s,debts:l,save:n}=t.profile.distributionRule;e.innerHTML=`
      <div class="dist-inputs">
        <div class="field-group">
          <label class="field-label"><span class="dist-dot" style="background:var(--clr-primary)"></span>Vivir</label>
          <div class="input-wrap-suffix">
            <input class="field-input" type="number" id="ob-live" min="0" max="100" value="${s}">
            <span class="input-suffix">%</span>
          </div>
        </div>
        <div class="field-group">
          <label class="field-label"><span class="dist-dot" style="background:var(--clr-warning)"></span>Deudas</label>
          <div class="input-wrap-suffix">
            <input class="field-input" type="number" id="ob-debts" min="0" max="100" value="${l}">
            <span class="input-suffix">%</span>
          </div>
        </div>
        <div class="field-group">
          <label class="field-label"><span class="dist-dot" style="background:var(--clr-success)"></span>Ahorrar</label>
          <div class="input-wrap-suffix">
            <input class="field-input" type="number" id="ob-save" min="0" max="100" value="${n}">
            <span class="input-suffix">%</span>
          </div>
        </div>
      </div>
      <div class="dist-bar-wrap">
        <div class="dist-bar" id="ob-dist-bar">
          <div class="dist-segment" id="ob-bar-live"  style="width:${s}%;background:var(--clr-primary)">${s>8?s+"%":""}</div>
          <div class="dist-segment" id="ob-bar-debts" style="width:${l}%;background:var(--clr-warning)">${l>8?l+"%":""}</div>
          <div class="dist-segment" id="ob-bar-save"  style="width:${n}%;background:var(--clr-success)">${n>8?n+"%":""}</div>
        </div>
        <p class="dist-sum ok" id="ob-dist-sum">Total: ${s+l+n}%</p>
      </div>
    `,["ob-live","ob-debts","ob-save"].forEach(i=>{e.querySelector(`#${i}`).addEventListener("input",Qe)})}}function Qe(){var i,o,c;const e=Number(((i=document.getElementById("ob-live"))==null?void 0:i.value)||0),t=Number(((o=document.getElementById("ob-debts"))==null?void 0:o.value)||0),a=Number(((c=document.getElementById("ob-save"))==null?void 0:c.value)||0),s=e+t+a,l=(r,d,u)=>{const v=document.getElementById(r);v&&(v.style.width=u+"%",v.textContent=u>8?u+"%":"")};l("ob-bar-live",e,e),l("ob-bar-debts",t,t),l("ob-bar-save",a,a);const n=document.getElementById("ob-dist-sum");n&&(n.textContent=`Total: ${s}%`,n.className=`dist-sum ${s===100?"ok":"err"}`)}function Ke(){var t,a,s,l,n;const e=z[C].id;if(e==="welcome"){const i=((t=document.getElementById("ob-name"))==null?void 0:t.value.trim())||"";f(o=>{o.profile.name=i}),document.getElementById("header-meta").textContent=i||""}if(e==="currency"){const i=(a=document.getElementById("ob-currency"))==null?void 0:a.value,o=ce.find(c=>c.code===i);o&&f(c=>{c.profile.currency={code:o.code,symbol:o.symbol,locale:o.locale}})}if(e==="distribution"){const i=Number(((s=document.getElementById("ob-live"))==null?void 0:s.value)||0),o=Number(((l=document.getElementById("ob-debts"))==null?void 0:l.value)||0),c=Number(((n=document.getElementById("ob-save"))==null?void 0:n.value)||0);if(i+o+c!==100)return document.getElementById("ob-dist-sum").textContent="Los porcentajes deben sumar 100%",document.getElementById("ob-dist-sum").className="dist-sum err",!1;f(r=>{r.profile.distributionRule={live:i,debts:o,save:c}})}return!0}function Ze(){Ke()&&(C<z.length-1?(C++,fe()):ke())}function et(){C>0&&(C--,fe())}function ke(){f(e=>{e.profile.onboardingCompleted=!0}),w==null||w.remove(),w=null,ne==null||ne()}function tt(e=""){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function at(e,t,a=""){const s=window.devicePixelRatio||1,l=e.clientWidth||200;e.width=l*s,e.height=l*s;const n=e.getContext("2d");n.scale(s,s);const i=l/2,o=l/2,c=l/2-4,r=c*.65,d=t.reduce((v,b)=>v+Math.max(0,b.value),0);if(d===0){n.beginPath(),n.arc(i,o,c,0,Math.PI*2),n.arc(i,o,r,0,Math.PI*2,!0);const v=window.matchMedia("(prefers-color-scheme:dark)").matches;n.fillStyle=v?"#334155":"#e2e8f0",n.fill(),n.fillStyle="#94a3b8",n.font=`600 ${l*.1}px -apple-system, sans-serif`,n.textAlign="center",n.textBaseline="middle",n.fillText("Sin datos",i,o);return}let u=-Math.PI/2;if(t.forEach(v=>{const b=v.value/d*Math.PI*2;n.beginPath(),n.moveTo(i,o),n.arc(i,o,c,u,u+b),n.arc(i,o,r,u+b,u,!0),n.closePath(),n.fillStyle=v.color,n.fill(),u+=b}),a){const v=window.matchMedia("(prefers-color-scheme:dark)").matches;n.fillStyle=v?"#f1f5f9":"#0f172a",n.font=`700 ${l*.13}px -apple-system, sans-serif`,n.textAlign="center",n.textBaseline="middle",n.fillText(a,i,o)}}let G=st();function st(){const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function nt(e){const[t,a]=e.split("-").map(Number),s=new Date(t,a-2,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function lt(e){const[t,a]=e.split("-").map(Number),s=new Date(t,a,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function it(e){const[t,a]=e.split("-");return new Intl.DateTimeFormat("es",{month:"long",year:"numeric"}).format(new Date(+t,+a-1,1))}function ot(e){return e.charAt(0).toUpperCase()+e.slice(1)}function q(e,t){return t>0?Math.round(e/t*100):0}function $e(e=""){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ct(e){const{incomes:t,expenses:a,creditCards:s,loans:l,savingsGoals:n,incomeSourceTypes:i}=g(),o=t.filter(y=>y.date.startsWith(e)).reduce((y,$)=>y+$.amount,0),c=a.filter(y=>y.date.startsWith(e)).reduce((y,$)=>y+$.amount,0),r=s.reduce((y,$)=>y+($.movements||[]).filter(S=>S.type==="payment"&&S.date.startsWith(e)).reduce((S,E)=>S+E.amount,0),0),d=l.reduce((y,$)=>y+($.payments||[]).filter(S=>S.date.startsWith(e)).reduce((S,E)=>S+E.amount,0),0),u=r+d,v=n.reduce((y,$)=>y+($.contributions||[]).filter(S=>S.date.startsWith(e)).reduce((S,E)=>S+E.amount,0),0),b=o-c-u-v,h=Object.fromEntries(i.map(y=>[y.id,y.name])),k={};t.filter(y=>y.date.startsWith(e)).forEach(y=>{const $=h[y.sourceTypeId]||"Sin fuente";k[$]=(k[$]||0)+y.amount});const{expenseCategories:N}=g(),O=Object.fromEntries(N.map(y=>[y.id,y])),R={};return a.filter(y=>y.date.startsWith(e)).forEach(y=>{var E;const $=O[y.categoryId],S=($==null?void 0:$.name)||"Sin categoría";R[S]={amt:(((E=R[S])==null?void 0:E.amt)||0)+y.amount,color:($==null?void 0:$.color)||"#64748b",icon:($==null?void 0:$.icon)||"📦"}}),{totalIncome:o,totalExpenses:c,totalDebt:u,totalSavings:v,freeBalance:b,bySrc:k,byCat:R}}function rt(e,t){const{totalIncome:a,totalExpenses:s,totalDebt:l,totalSavings:n,freeBalance:i}=e,o=[];if(a===0)return o;const c=q(s,a),r=q(l,a),d=q(n,a);if(c>t.live?o.push({type:"danger",text:`Gastos al <strong>${c}%</strong> de tus ingresos — superan tu límite de vivir (${t.live}%)`}):c>t.live*.9?o.push({type:"warning",text:`Gastos al <strong>${c}%</strong> — cerca del límite de vivir (${t.live}%)`}):o.push({type:"success",text:`Gastos bajo control: <strong>${c}%</strong> de tus ingresos (límite ${t.live}%)`}),l===0&&t.debts>0?o.push({type:"info",text:`Sin pagos de deuda este mes (regla: ${t.debts}% = ${m(a*t.debts/100)})`}):r>t.debts?o.push({type:"danger",text:`Pagos de deuda al <strong>${r}%</strong> — superan tu regla (${t.debts}%)`}):o.push({type:"success",text:`Pagos de deuda al <strong>${r}%</strong> de tus ingresos (regla ${t.debts}%)`}),d>=t.save)o.push({type:"success",text:`¡Meta de ahorro cumplida! Ahorraste <strong>${d}%</strong> (meta ${t.save}%)`});else if(n>0){const u=m(t.save/100*a-n);o.push({type:"warning",text:`Ahorro al <strong>${d}%</strong> — faltan <strong>${u}</strong> para la meta (${t.save}%)`})}else o.push({type:"danger",text:`Sin ahorros registrados este mes (meta: ${t.save}% = ${m(a*t.save/100)})`});return i>0?o.push({type:"info",text:`Tienes <strong>${m(i)}</strong> libres tras aplicar tu regla de distribución`}):i<0&&o.push({type:"danger",text:`Balance negativo: gastaste / pagaste <strong>${m(Math.abs(i))}</strong> más de lo que ingresó`}),o}const dt={success:"✓",warning:"⚠",danger:"✕",info:"ℹ"};function ut(){const e=document.getElementById("panel-summary");e.innerHTML="";const t=document.createElement("div");t.className="module-wrap",e.appendChild(t),me(t)}function me(e){var $,S;const a=g().profile.distributionRule,s=ct(G),l=rt(s,a),{totalIncome:n,totalExpenses:i,totalDebt:o,totalSavings:c,freeBalance:r,bySrc:d,byCat:u}=s,v=n===0&&i===0&&o===0&&c===0,b=Math.max(0,r),h=r<0?Math.abs(r):0,k=n>0?[{label:"Vivir",value:i,color:J("--clr-primary")||"#6366f1"},{label:"Deudas",value:o,color:J("--clr-warning")||"#f59e0b"},{label:"Ahorro",value:c,color:J("--clr-success")||"#10b981"},{label:"Libre",value:b,color:J("--clr-info")||"#3b82f6"},{label:"Exceso",value:h,color:J("--clr-danger")||"#ef4444"}].filter(E=>E.value>0):[],N=q(i,n),O=q(o,n),R=q(c,n),y=r>0?q(r,n):0;e.innerHTML=`
    <div class="mod-top-row">
      <div>
        <h1 class="module-title">Resumen</h1>
        <p class="module-subtitle">Tu panorama financiero del mes</p>
      </div>
    </div>

    <div class="month-nav">
      <button class="btn btn-ghost btn-sm" id="sum-prev">‹</button>
      <span class="month-label">${ot(it(G))}</span>
      <button class="btn btn-ghost btn-sm" id="sum-next">›</button>
    </div>

    ${v?mt():`
      <!-- Metrics -->
      <div class="sum-metrics">
        <div class="sum-metric income-border">
          <p class="sum-metric-lbl">💰 Ingresos</p>
          <p class="sum-metric-val income-clr">${m(n)}</p>
        </div>
        <div class="sum-metric expense-border">
          <p class="sum-metric-lbl">💸 Gastos</p>
          <p class="sum-metric-val expense-clr">${m(i)}</p>
          <p class="sum-metric-pct">${N}% de ingresos</p>
        </div>
        <div class="sum-metric warning-border">
          <p class="sum-metric-lbl">💳 Cuotas deuda</p>
          <p class="sum-metric-val" style="color:var(--clr-warning)">${m(o)}</p>
          <p class="sum-metric-pct">${O}% de ingresos</p>
        </div>
        <div class="sum-metric success-border">
          <p class="sum-metric-lbl">🎯 Ahorro</p>
          <p class="sum-metric-val income-clr">${m(c)}</p>
          <p class="sum-metric-pct">${R}% de ingresos</p>
        </div>
        <div class="sum-metric ${r>=0?"info-border":"danger-border"}">
          <p class="sum-metric-lbl">📊 Balance libre</p>
          <p class="sum-metric-val ${r>=0?"":"expense-clr"}"
            style="${r>=0?"color:var(--clr-info)":""}">
            ${r>=0?"+":""}${m(r)}
          </p>
        </div>
      </div>

      <!-- Chart + Rule -->
      <div class="sum-chart-section">
        <div class="sum-chart-wrap">
          <canvas id="summary-donut" class="donut-canvas"></canvas>
          <div class="donut-center-label">
            <p class="donut-center-val">${m(n)}</p>
            <p class="donut-center-sub">ingresos</p>
          </div>
        </div>
        <div class="sum-rule-wrap">
          <p class="sum-rule-title">Distribución real vs. tu regla</p>
          <div class="sum-rule-table">
            ${te("Vivir","#6366f1",a.live,N,i>0)}
            ${te("Deudas","#f59e0b",a.debts,O,o>0)}
            ${te("Ahorro","#10b981",a.save,R,c>0)}
            ${y>0?te("Libre","#3b82f6","—",y,!0):""}
            ${h>0?`
              <div class="sum-rule-row">
                <span class="sum-rule-dot" style="background:#ef4444"></span>
                <span class="sum-rule-label" style="color:var(--clr-danger)">Exceso</span>
                <span class="sum-rule-target" style="color:var(--text-muted)">—</span>
                <span class="sum-rule-actual expense-clr">${q(h,n)}%</span>
                <span class="sum-rule-status">⚠️</span>
              </div>`:""}
          </div>
        </div>
      </div>

      <!-- Alerts -->
      ${l.length?`
        <div class="alerts-section">
          <h2 class="alerts-title">Alertas</h2>
          <div class="alerts-list">
            ${l.map(E=>`
              <div class="alert-item alert-${E.type}">
                <span class="alert-icon">${dt[E.type]}</span>
                <p class="alert-text">${E.text}</p>
              </div>`).join("")}
          </div>
        </div>`:""}

      <!-- Income by source -->
      ${Object.keys(d).length?`
        <div class="card card-sm">
          <p class="breakdown-title">Ingresos por fuente</p>
          ${Object.entries(d).sort((E,M)=>M[1]-E[1]).map(([E,M])=>`
            <div class="breakdown-row">
              <span class="breakdown-icon">💸</span>
              <span class="breakdown-name">${$e(E)}</span>
              <div class="breakdown-bar-wrap">
                <div class="breakdown-bar income-bar" style="width:${q(M,n)}%"></div>
              </div>
              <span class="breakdown-pct">${q(M,n)}%</span>
              <span class="breakdown-amt income-clr">${m(M)}</span>
            </div>`).join("")}
        </div>`:""}

      <!-- Expenses by category -->
      ${Object.keys(u).length?`
        <div class="card card-sm">
          <p class="breakdown-title">Gastos por categoría</p>
          ${Object.entries(u).sort((E,M)=>M[1].amt-E[1].amt).map(([E,M])=>`
            <div class="breakdown-row">
              <span class="breakdown-icon">${M.icon}</span>
              <span class="breakdown-name">${$e(E)}</span>
              <div class="breakdown-bar-wrap">
                <div class="breakdown-bar" style="width:${q(M.amt,i)}%;background:${M.color}"></div>
              </div>
              <span class="breakdown-pct">${q(M.amt,i)}%</span>
              <span class="breakdown-amt expense-clr">${m(M.amt)}</span>
            </div>`).join("")}
        </div>`:""}
    `}
  `,!v&&n>0&&requestAnimationFrame(()=>{const E=document.getElementById("summary-donut");E&&at(E,k)}),e.querySelector("#sum-prev").addEventListener("click",()=>{G=nt(G),me(e)}),e.querySelector("#sum-next").addEventListener("click",()=>{G=lt(G),me(e)}),($=e.querySelector("#sum-go-income"))==null||$.addEventListener("click",()=>Y("income")),(S=e.querySelector("#sum-go-expenses"))==null||S.addEventListener("click",()=>Y("expenses"))}function te(e,t,a,s,l){const n=typeof a=="number"?a:null;let i="";return n!==null&&l&&(i=s<=n?"✓":"⚠️"),`<div class="sum-rule-row">
    <span class="sum-rule-dot" style="background:${t}"></span>
    <span class="sum-rule-label">${e}</span>
    <span class="sum-rule-target">${n!==null?n+"%":"—"}</span>
    <span class="sum-rule-actual" style="color:${t}">${l?s+"%":"—"}</span>
    <span class="sum-rule-status">${i}</span>
  </div>`}function mt(){return`<div class="sum-no-data">
    <div class="empty-state-icon">📊</div>
    <h3 class="empty-state-title">Sin datos para este mes</h3>
    <p class="empty-state-desc">Registra ingresos y gastos para ver tu resumen financiero.</p>
    <div style="display:flex;gap:var(--sp-3);justify-content:center;flex-wrap:wrap;">
      <button class="btn btn-primary" id="sum-go-income">+ Agregar ingresos</button>
      <button class="btn btn-outline" id="sum-go-expenses">+ Agregar gastos</button>
    </div>
  </div>`}function J(e){return getComputedStyle(document.documentElement).getPropertyValue(e).trim()||null}function x({title:e,size:t="",onClose:a}={},s){const l=document.createElement("div");l.className="modal-overlay";const n=document.createElement("div");n.className=`modal${t?" modal-"+t:""}`;const i=document.createElement("div");i.className="modal-header",i.innerHTML=`<h3 class="modal-title">${e}</h3>`;const o=document.createElement("button");o.className="btn-icon modal-close-btn",o.setAttribute("aria-label","Cerrar"),o.textContent="✕",i.appendChild(o);const c=document.createElement("div");c.className="modal-body",n.appendChild(i),n.appendChild(c),l.appendChild(n),document.body.appendChild(l);let r=!1;const d=()=>{r||(r=!0,l.classList.add("closing"),document.removeEventListener("keydown",u),setTimeout(()=>{l.remove(),a==null||a()},200))};function u(v){v.key==="Escape"&&d()}return o.addEventListener("click",d),l.addEventListener("click",v=>{v.target===l&&d()}),document.addEventListener("keydown",u),requestAnimationFrame(()=>l.classList.add("open")),s==null||s(c,d),{overlay:l,modal:n,body:c,close:d}}function L({title:e,message:t,confirmLabel:a="Confirmar",danger:s=!1}={}){return new Promise(l=>{x({title:e,size:"sm",onClose:()=>l(!1)},(n,i)=>{n.innerHTML=`
        <p style="color:var(--text-secondary);line-height:1.6;">${t}</p>
        <div class="modal-footer" style="border:none;padding:0;margin-top:var(--sp-2);">
          <button class="btn btn-ghost" id="cdCancel">Cancelar</button>
          <button class="btn ${s?"btn-danger":"btn-primary"}" id="cdOk">${a}</button>
        </div>
      `,n.querySelector("#cdCancel").addEventListener("click",()=>{i(),l(!1)}),n.querySelector("#cdOk").addEventListener("click",()=>{i(),l(!0)})})})}let X=null;function pt(){return X||(X=document.createElement("div"),X.className="toast-container",document.body.appendChild(X)),X}const vt={success:"✓",error:"✕",info:"ℹ",warning:"⚠"};function p(e,t="success",a=3e3){const s=pt(),l=document.createElement("div");l.className=`toast toast-${t}`,l.innerHTML=`
    <span class="toast-icon">${vt[t]??"•"}</span>
    <span>${e}</span>
  `,s.appendChild(l),requestAnimationFrame(()=>{requestAnimationFrame(()=>l.classList.add("show"))}),setTimeout(()=>{l.classList.remove("show"),setTimeout(()=>l.remove(),300)},a)}let A=bt();function bt(){const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function gt(e){const[t,a]=e.split("-").map(Number),s=new Date(t,a-2,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function ft(e){const[t,a]=e.split("-").map(Number),s=new Date(t,a,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function yt(e){const[t,a]=e.split("-");return new Intl.DateTimeFormat("es",{month:"long",year:"numeric"}).format(new Date(+t,+a-1,1))}function ht(e){if(!e)return"";try{return new Intl.DateTimeFormat("es",{day:"2-digit",month:"short"}).format(new Date(e+"T00:00:00"))}catch{return e}}function $t(e){return e.charAt(0).toUpperCase()+e.slice(1)}function le(e=""){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Et(){const e=document.getElementById("panel-income");e.innerHTML="";const t=document.createElement("div");t.className="module-wrap",e.appendChild(t),K(t),t.addEventListener("click",a=>{const s=a.target.closest("[data-del-inc]");s&&Lt(s.dataset.delInc,t)})}function K(e){var o;const{incomeSourceTypes:t,incomes:a,profile:s}=g(),l=a.filter(c=>c.date.startsWith(A)).sort((c,r)=>r.date.localeCompare(c.date)),n=l.reduce((c,r)=>c+(r.amount||0),0),i=!t.length;e.innerHTML=`
    <div class="mod-top-row">
      <div>
        <h1 class="module-title">Ingresos</h1>
        <p class="module-subtitle">Registra lo que entra cada mes</p>
      </div>
      <button class="btn btn-primary" id="btn-add-inc">+ Agregar</button>
    </div>

    <div class="month-nav">
      <button class="btn btn-ghost btn-sm month-prev" id="btn-prev">‹</button>
      <span class="month-label">${$t(yt(A))}</span>
      <button class="btn btn-ghost btn-sm month-next" id="btn-next">›</button>
    </div>

    ${i?`
      <div class="card warn-card">
        <span>⚠️</span>
        <div>
          <p class="warn-title">Sin fuentes de ingreso</p>
          <p class="warn-desc">Agrega fuentes en Ajustes para poder registrar ingresos.</p>
        </div>
        <button class="btn btn-outline btn-sm" id="btn-cfg-src">Ir a Ajustes</button>
      </div>`:""}

    <div class="summary-strip">
      <div class="summary-stat">
        <p class="summary-label">Total del mes</p>
        <p class="summary-value income-clr">${m(n)}</p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Registros</p>
        <p class="summary-value">${l.length}</p>
      </div>
    </div>

    ${St(l,t)}

    <div id="inc-list">${xt(l,t)}</div>
  `,e.querySelector("#btn-add-inc").addEventListener("click",()=>wt(e)),e.querySelector("#btn-prev").addEventListener("click",()=>{A=gt(A),K(e)}),e.querySelector("#btn-next").addEventListener("click",()=>{A=ft(A),K(e)}),(o=e.querySelector("#btn-cfg-src"))==null||o.addEventListener("click",()=>Y("settings"))}function St(e,t){if(!e.length||!t.length)return"";const a={};e.forEach(i=>{a[i.sourceTypeId]=(a[i.sourceTypeId]||0)+i.amount});const s=Object.values(a).reduce((i,o)=>i+o,0),l=Object.fromEntries(t.map(i=>[i.id,i.name]));return`<div class="card card-sm breakdown-card">
    <p class="breakdown-title">Por fuente</p>
    ${Object.entries(a).sort((i,o)=>o[1]-i[1]).map(([i,o])=>{const c=s?Math.round(o/s*100):0;return`<div class="breakdown-row">
        <span class="breakdown-name">${le(l[i]||"Sin fuente")}</span>
        <div class="breakdown-bar-wrap">
          <div class="breakdown-bar income-bar" style="width:${c}%"></div>
        </div>
        <span class="breakdown-pct">${c}%</span>
        <span class="breakdown-amt income-clr">${m(o)}</span>
      </div>`}).join("")}
  </div>`}function xt(e,t){if(!e.length)return`<div class="empty-state">
      <div class="empty-state-icon">💰</div>
      <h3 class="empty-state-title">Sin ingresos este mes</h3>
      <p class="empty-state-desc">Pulsa "+ Agregar" para registrar tu primer ingreso del mes.</p>
    </div>`;const a=Object.fromEntries(t.map(s=>[s.id,s.name]));return`<div class="transaction-list">
    ${e.map(s=>`
      <div class="transaction-item">
        <div class="t-icon income-icon-bg">💸</div>
        <div class="t-body">
          <p class="t-name">${le(s.description||a[s.sourceTypeId]||"Ingreso")}</p>
          <p class="t-meta">
            <span class="badge badge-primary">${le(a[s.sourceTypeId]||"Sin fuente")}</span>
            <span class="t-date">${ht(s.date)}</span>
          </p>
        </div>
        <div class="t-right">
          <span class="t-amount income-clr">+${m(s.amount)}</span>
          <button class="btn-icon btn-icon-danger" data-del-inc="${s.id}" title="Eliminar">🗑️</button>
        </div>
      </div>`).join("")}
  </div>`}function wt(e){const t=g(),a=t.incomeSourceTypes;if(!a.length){p("Primero agrega fuentes de ingreso en Ajustes","warning"),Y("settings");return}const s=new Date().toISOString().slice(0,10),l=s.startsWith(A)?s:A+"-01";x({title:"Nuevo ingreso"},(n,i)=>{n.innerHTML=`
      <div class="field-group">
        <label class="field-label" for="inc-src">Fuente de ingreso</label>
        <select class="field-input field-select" id="inc-src">
          ${a.map(o=>`<option value="${o.id}">${le(o.name)}</option>`).join("")}
        </select>
      </div>
      <div class="field-group">
        <label class="field-label" for="inc-amt">Monto</label>
        <div class="input-wrap-suffix">
          <input class="field-input" type="number" id="inc-amt" min="0.01" step="0.01" placeholder="0.00" />
          <span class="input-suffix">${t.profile.currency.code}</span>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="inc-desc">Descripción
          <span style="color:var(--text-muted);font-weight:400">(opcional)</span>
        </label>
        <input class="field-input" type="text" id="inc-desc"
          placeholder="Ej: Pago quincenal, Bono, Proyecto X…" />
      </div>
      <div class="field-group">
        <label class="field-label" for="inc-date">Fecha</label>
        <input class="field-input" type="date" id="inc-date" value="${l}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="inc-cancel">Cancelar</button>
        <button class="btn btn-primary" id="inc-save">Agregar ingreso</button>
      </div>
    `,n.querySelector("#inc-cancel").addEventListener("click",i),n.querySelector("#inc-save").addEventListener("click",()=>{const o=n.querySelector("#inc-src").value,c=parseFloat(n.querySelector("#inc-amt").value),r=n.querySelector("#inc-desc").value.trim(),d=n.querySelector("#inc-date").value;if(!c||c<=0){n.querySelector("#inc-amt").focus(),p("Ingresa un monto mayor a 0","error");return}if(!d){p("Selecciona una fecha","error");return}f(u=>{u.incomes.push({id:T(),sourceTypeId:o,amount:c,description:r,date:d,createdAt:new Date().toISOString()})}),A=d.slice(0,7),p("Ingreso registrado ✓"),i(),K(e)}),n.querySelector("#inc-amt").focus()})}function Lt(e,t){L({title:"Eliminar ingreso",message:"¿Eliminar este ingreso? La acción no se puede deshacer.",confirmLabel:"Eliminar",danger:!0}).then(a=>{a&&(f(s=>{s.incomes=s.incomes.filter(l=>l.id!==e)}),p("Ingreso eliminado"),K(t))})}let j=kt(),B="all";function kt(){const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function Mt(e){const[t,a]=e.split("-").map(Number),s=new Date(t,a-2,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function qt(e){const[t,a]=e.split("-").map(Number),s=new Date(t,a,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function Ct(e){const[t,a]=e.split("-");return new Intl.DateTimeFormat("es",{month:"long",year:"numeric"}).format(new Date(+t,+a-1,1))}function _t(e){if(!e)return"";try{return new Intl.DateTimeFormat("es",{day:"2-digit",month:"short"}).format(new Date(e+"T00:00:00"))}catch{return e}}function It(e){return e.charAt(0).toUpperCase()+e.slice(1)}function ie(e=""){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Tt(){const e=document.getElementById("panel-expenses");e.innerHTML="";const t=document.createElement("div");t.className="module-wrap",e.appendChild(t),H(t),t.addEventListener("click",a=>{const s=a.target.closest("[data-del-exp]");s&&Dt(s.dataset.delExp,t)})}function H(e){const{expenseCategories:t,expenses:a}=g(),s=a.filter(c=>c.date.startsWith(j)).sort((c,r)=>r.date.localeCompare(c.date)),l=B==="all"?s:s.filter(c=>c.type===B),n=s.reduce((c,r)=>c+(r.amount||0),0),i=s.filter(c=>c.type==="fixed").reduce((c,r)=>c+r.amount,0),o=s.filter(c=>c.type==="variable").reduce((c,r)=>c+r.amount,0);e.innerHTML=`
    <div class="mod-top-row">
      <div>
        <h1 class="module-title">Gastos</h1>
        <p class="module-subtitle">Controla en qué se va tu dinero cada mes</p>
      </div>
      <button class="btn btn-primary" id="btn-add-exp">+ Agregar</button>
    </div>

    <div class="month-nav">
      <button class="btn btn-ghost btn-sm" id="btn-prev">‹</button>
      <span class="month-label">${It(Ct(j))}</span>
      <button class="btn btn-ghost btn-sm" id="btn-next">›</button>
    </div>

    <div class="summary-strip">
      <div class="summary-stat">
        <p class="summary-label">Total</p>
        <p class="summary-value expense-clr">${m(n)}</p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Fijos</p>
        <p class="summary-value">${m(i)}</p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Variables</p>
        <p class="summary-value">${m(o)}</p>
      </div>
    </div>

    ${At(s,t)}

    <div class="type-tabs" role="tablist">
      <button class="type-tab ${B==="all"?"active":""}" data-filter="all">Todos</button>
      <button class="type-tab ${B==="fixed"?"active":""}" data-filter="fixed">Fijos</button>
      <button class="type-tab ${B==="variable"?"active":""}" data-filter="variable">Variables</button>
    </div>

    <div id="exp-list">${jt(l,t)}</div>
  `,e.querySelector("#btn-add-exp").addEventListener("click",()=>Pt(e)),e.querySelector("#btn-prev").addEventListener("click",()=>{j=Mt(j),H(e)}),e.querySelector("#btn-next").addEventListener("click",()=>{j=qt(j),H(e)}),e.querySelectorAll(".type-tab").forEach(c=>{c.addEventListener("click",()=>{B=c.dataset.filter,H(e)})})}function At(e,t){if(!e.length)return"";const a={};e.forEach(i=>{a[i.categoryId]=(a[i.categoryId]||0)+i.amount});const s=Object.values(a).reduce((i,o)=>i+o,0),l=Object.fromEntries(t.map(i=>[i.id,i]));return`<div class="card card-sm breakdown-card">
    <p class="breakdown-title">Por categoría</p>
    ${Object.entries(a).sort((i,o)=>o[1]-i[1]).slice(0,6).map(([i,o])=>{const c=l[i]||{name:"Sin categoría",icon:"📦",color:"#64748b"},r=s?Math.round(o/s*100):0;return`<div class="breakdown-row">
        <span class="breakdown-icon">${c.icon}</span>
        <span class="breakdown-name">${ie(c.name)}</span>
        <div class="breakdown-bar-wrap">
          <div class="breakdown-bar" style="width:${r}%;background:${c.color}"></div>
        </div>
        <span class="breakdown-pct">${r}%</span>
        <span class="breakdown-amt expense-clr">${m(o)}</span>
      </div>`}).join("")}
  </div>`}function jt(e,t){if(!e.length)return`<div class="empty-state">
      <div class="empty-state-icon">💸</div>
      <h3 class="empty-state-title">Sin gastos</h3>
      <p class="empty-state-desc">${{all:'Sin gastos este mes. Pulsa "+ Agregar" para empezar.',fixed:"No hay gastos fijos registrados este mes.",variable:"No hay gastos variables registrados este mes."}[B]}</p>
    </div>`;const a=Object.fromEntries(t.map(s=>[s.id,s]));return`<div class="transaction-list">
    ${e.map(s=>{const l=a[s.categoryId]||{name:"Sin categoría",icon:"📦",color:"#64748b"},n=s.type==="fixed"?"Fijo":"Variable",i=s.type==="fixed"?"badge-info":"badge-muted";return`<div class="transaction-item">
        <div class="t-icon" style="background:${l.color}20;color:${l.color};">${l.icon}</div>
        <div class="t-body">
          <p class="t-name">${ie(s.description||l.name)}</p>
          <p class="t-meta">
            <span class="badge ${i}">${n}</span>
            <span class="badge badge-muted">${ie(l.name)}</span>
            <span class="t-date">${_t(s.date)}</span>
          </p>
        </div>
        <div class="t-right">
          <span class="t-amount expense-clr">-${m(s.amount)}</span>
          <button class="btn-icon btn-icon-danger" data-del-exp="${s.id}" title="Eliminar">🗑️</button>
        </div>
      </div>`}).join("")}
  </div>`}function Pt(e){const t=g(),{expenseCategories:a}=t,s=new Date().toISOString().slice(0,10),l=s.startsWith(j)?s:j+"-01";x({title:"Nuevo gasto"},(n,i)=>{n.innerHTML=`
      <div class="field-group">
        <label class="field-label">Tipo de gasto</label>
        <div class="type-toggle" id="exp-type-toggle">
          <button class="type-toggle-btn active" data-type="variable">Variable</button>
          <button class="type-toggle-btn" data-type="fixed">Fijo</button>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="exp-cat">Categoría</label>
        <select class="field-input field-select" id="exp-cat">
          ${a.map(c=>`<option value="${c.id}">${c.icon} ${ie(c.name)}</option>`).join("")}
        </select>
      </div>
      <div class="field-group">
        <label class="field-label" for="exp-amt">Monto</label>
        <div class="input-wrap-suffix">
          <input class="field-input" type="number" id="exp-amt" min="0.01" step="0.01" placeholder="0.00" />
          <span class="input-suffix">${t.profile.currency.code}</span>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="exp-desc">Descripción
          <span style="color:var(--text-muted);font-weight:400">(opcional)</span>
        </label>
        <input class="field-input" type="text" id="exp-desc"
          placeholder="Ej: Renta, Supermercado, Netflix…" />
      </div>
      <div class="field-group">
        <label class="field-label" for="exp-date">Fecha</label>
        <input class="field-input" type="date" id="exp-date" value="${l}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="exp-cancel">Cancelar</button>
        <button class="btn btn-primary" id="exp-save">Agregar gasto</button>
      </div>
    `;let o="variable";n.querySelector("#exp-type-toggle").addEventListener("click",c=>{const r=c.target.closest(".type-toggle-btn");r&&(o=r.dataset.type,n.querySelectorAll(".type-toggle-btn").forEach(d=>d.classList.toggle("active",d===r)))}),n.querySelector("#exp-cancel").addEventListener("click",i),n.querySelector("#exp-save").addEventListener("click",()=>{const c=n.querySelector("#exp-cat").value,r=parseFloat(n.querySelector("#exp-amt").value),d=n.querySelector("#exp-desc").value.trim(),u=n.querySelector("#exp-date").value;if(!r||r<=0){n.querySelector("#exp-amt").focus(),p("Ingresa un monto mayor a 0","error");return}if(!u){p("Selecciona una fecha","error");return}f(v=>{v.expenses.push({id:T(),categoryId:c,amount:r,description:d,date:u,type:o,createdAt:new Date().toISOString()})}),j=u.slice(0,7),p("Gasto registrado ✓"),i(),H(e)}),n.querySelector("#exp-amt").focus()})}function Dt(e,t){L({title:"Eliminar gasto",message:"¿Eliminar este gasto? La acción no se puede deshacer.",confirmLabel:"Eliminar",danger:!0}).then(a=>{a&&(f(s=>{s.expenses=s.expenses.filter(l=>l.id!==e)}),p("Gasto eliminado"),H(t))})}let ae="cards";function Nt(){const e=document.getElementById("panel-debts");e.innerHTML="";const t=document.createElement("div");t.className="module-wrap",e.appendChild(t),P(t),t.addEventListener("click",a=>{const s=a.target.closest("[data-view-cc]"),l=a.target.closest("[data-edit-cc]"),n=a.target.closest("[data-del-cc]"),i=a.target.closest("[data-pay-loan]"),o=a.target.closest("[data-edit-loan]"),c=a.target.closest("[data-del-loan]"),r=a.target.closest("[data-del-lp]");if(s&&Ft(s.dataset.viewCc,t),l&&qe(l.dataset.editCc,t),n&&Rt(n.dataset.delCc,t),i&&Vt(i.dataset.payLoan,t),o&&Ce(o.dataset.editLoan,t),c&&Ut(c.dataset.delLoan,t),r){const[d,u]=r.dataset.delLp.split("|");Yt(d,u,t)}})}function P(e){var n,i;const{creditCards:t,loans:a}=g(),s=t.reduce((o,c)=>o+oe(c).used,0)+a.reduce((o,c)=>o+ye(c).remaining,0),l=t.reduce((o,c)=>o+oe(c).minPayment,0)+a.reduce((o,c)=>o+(c.monthlyPayment||0),0);e.innerHTML=`
    <div class="mod-top-row">
      <div>
        <h1 class="module-title">Deudas</h1>
        <p class="module-subtitle">Tarjetas de crédito y préstamos</p>
      </div>
    </div>

    <div class="summary-strip">
      <div class="summary-stat">
        <p class="summary-label">Deuda total</p>
        <p class="summary-value expense-clr">${m(s)}</p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Pago mensual est.</p>
        <p class="summary-value">${m(l)}</p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Tarjetas / Préstamos</p>
        <p class="summary-value">${t.length} / ${a.length}</p>
      </div>
    </div>

    <div class="debt-sub-tabs">
      <button class="debt-sub-tab ${ae==="cards"?"active":""}" data-sub="cards">💳 Tarjetas</button>
      <button class="debt-sub-tab ${ae==="loans"?"active":""}" data-sub="loans">📋 Préstamos</button>
    </div>

    <div id="debt-content">
      ${ae==="cards"?Bt(t):Gt(a)}
    </div>
  `,e.querySelectorAll(".debt-sub-tab").forEach(o=>o.addEventListener("click",()=>{ae=o.dataset.sub,P(e)})),(n=e.querySelector("#btn-add-cc"))==null||n.addEventListener("click",()=>qe(null,e)),(i=e.querySelector("#btn-add-loan"))==null||i.addEventListener("click",()=>Ce(null,e))}function oe(e){const t=e.movements||[],a=t.filter(c=>c.type==="charge").reduce((c,r)=>c+r.amount,0),s=t.filter(c=>c.type==="payment").reduce((c,r)=>c+r.amount,0),l=Math.max(0,a-s),n=Math.max(0,(e.limit||0)-l),i=e.limit?Math.min(100,Math.round(l/e.limit*100)):0,o=e.minimumPaymentPct?l*(e.minimumPaymentPct/100):e.minimumPaymentFixed||0;return{charged:a,paid:s,used:l,available:n,pct:i,minPayment:o}}function Me(e){var t;return((t=de.find(a=>a.id===e))==null?void 0:t.value)??de[0].value}function Bt(e){return e.length?`
    <div class="cc-toolbar">
      <button class="btn btn-primary btn-sm" id="btn-add-cc">+ Agregar tarjeta</button>
    </div>
    <div class="cc-grid">
      ${e.map(t=>zt(t)).join("")}
    </div>`:`<div class="empty-state">
      <div class="empty-state-icon">💳</div>
      <h3 class="empty-state-title">Sin tarjetas</h3>
      <p class="empty-state-desc">Agrega tu primera tarjeta de crédito para controlar límites, saldos y fechas de pago.</p>
      <button class="btn btn-primary" id="btn-add-cc">+ Agregar tarjeta</button>
    </div>`}function zt(e){const{used:t,available:a,pct:s,minPayment:l}=oe(e),n=s>=80?"danger":s>=60?"warning":"",i=Me(e.gradient);return`
    <div class="cc-item" data-cc-id="${e.id}">
      <!-- Visual card -->
      <div class="cc-visual" style="background:${i}">
        <div class="cc-visual-top">
          <span class="cc-visual-name">${I(e.name)}</span>
          <span class="cc-visual-chip">◉</span>
        </div>
        <div class="cc-visual-number">•••• •••• •••• ${I(e.lastFour||"????")}</div>
        <div class="cc-visual-bottom">
          <div>
            <p class="cc-visual-lbl">Disponible</p>
            <p class="cc-visual-val">${m(a)}</p>
          </div>
          <div style="text-align:right">
            <p class="cc-visual-lbl">Límite</p>
            <p class="cc-visual-val">${m(e.limit||0)}</p>
          </div>
        </div>
      </div>

      <!-- Usage bar -->
      <div class="cc-usage-wrap">
        <div class="cc-usage-track">
          <div class="cc-usage-fill ${n}" style="width:${s}%"></div>
        </div>
        <span class="cc-usage-label">${s}% usado · ${m(t)} de ${m(e.limit||0)}</span>
      </div>

      <!-- Stats strip -->
      <div class="cc-stats-strip">
        <div class="cc-stat">
          <p class="cc-stat-lbl">Pago mínimo</p>
          <p class="cc-stat-val">${m(l)}</p>
        </div>
        <div class="cc-stat">
          <p class="cc-stat-lbl">Tasa anual</p>
          <p class="cc-stat-val">${e.interestRate||0}%</p>
        </div>
        <div class="cc-stat">
          <p class="cc-stat-lbl">Corte</p>
          <p class="cc-stat-val">Día ${e.cutoffDay||"—"}</p>
        </div>
        <div class="cc-stat">
          <p class="cc-stat-lbl">Pago</p>
          <p class="cc-stat-val">Día ${e.paymentDueDay||"—"}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="cc-actions">
        <button class="btn btn-outline btn-sm" data-view-cc="${e.id}">📋 Movimientos</button>
        <button class="btn-icon" data-edit-cc="${e.id}" title="Editar tarjeta">✏️</button>
        <button class="btn-icon btn-icon-danger" data-del-cc="${e.id}" title="Eliminar tarjeta">🗑️</button>
      </div>
    </div>`}function qe(e,t){const a=e?g().creditCards.find(n=>n.id===e):null,s=!!a;let l=(a==null?void 0:a.gradient)??"g1";x({title:s?"Editar tarjeta":"Nueva tarjeta de crédito",size:"lg"},(n,i)=>{n.innerHTML=`
      <div class="field-group">
        <label class="field-label" for="cc-name">Nombre de la tarjeta</label>
        <input class="field-input" type="text" id="cc-name" placeholder="Ej: Visa Oro, Mastercard Platinum…"
          value="${I((a==null?void 0:a.name)||"")}" />
      </div>
      <div class="cc-form-row">
        <div class="field-group">
          <label class="field-label" for="cc-last4">Últimos 4 dígitos</label>
          <input class="field-input" type="text" id="cc-last4" maxlength="4"
            placeholder="1234" value="${I((a==null?void 0:a.lastFour)||"")}" />
        </div>
        <div class="field-group">
          <label class="field-label" for="cc-limit">Límite de crédito</label>
          <input class="field-input" type="number" id="cc-limit" min="0" step="0.01"
            placeholder="0.00" value="${(a==null?void 0:a.limit)??""}" />
        </div>
      </div>
      <div class="cc-form-row">
        <div class="field-group">
          <label class="field-label" for="cc-rate">Tasa anual (%)</label>
          <input class="field-input" type="number" id="cc-rate" min="0" step="0.1"
            placeholder="0" value="${(a==null?void 0:a.interestRate)??""}" />
        </div>
        <div class="field-group">
          <label class="field-label" for="cc-minpct">Pago mínimo (%)</label>
          <input class="field-input" type="number" id="cc-minpct" min="0" max="100" step="0.5"
            placeholder="5" value="${(a==null?void 0:a.minimumPaymentPct)??""}" />
        </div>
      </div>
      <div class="cc-form-row">
        <div class="field-group">
          <label class="field-label" for="cc-cutoff">Día de corte</label>
          <input class="field-input" type="number" id="cc-cutoff" min="1" max="31"
            placeholder="15" value="${(a==null?void 0:a.cutoffDay)??""}" />
        </div>
        <div class="field-group">
          <label class="field-label" for="cc-due">Día de pago</label>
          <input class="field-input" type="number" id="cc-due" min="1" max="31"
            placeholder="5" value="${(a==null?void 0:a.paymentDueDay)??""}" />
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">Color de la tarjeta</label>
        <div class="gradient-grid" id="gradient-grid">
          ${de.map(o=>`
            <button class="gradient-swatch${o.id===l?" selected":""}"
              style="background:${o.value}" data-gid="${o.id}" title="${o.label}" type="button"></button>
          `).join("")}
        </div>
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="cc-cancel">Cancelar</button>
        <button class="btn btn-primary" id="cc-save">${s?"Guardar cambios":"Agregar tarjeta"}</button>
      </div>
    `,n.querySelector("#gradient-grid").addEventListener("click",o=>{const c=o.target.closest(".gradient-swatch");c&&(l=c.dataset.gid,n.querySelectorAll(".gradient-swatch").forEach(r=>r.classList.toggle("selected",r===c)))}),n.querySelector("#cc-cancel").addEventListener("click",i),n.querySelector("#cc-save").addEventListener("click",()=>{const o=n.querySelector("#cc-name").value.trim(),c=n.querySelector("#cc-last4").value.trim(),r=parseFloat(n.querySelector("#cc-limit").value)||0,d=parseFloat(n.querySelector("#cc-rate").value)||0,u=parseFloat(n.querySelector("#cc-minpct").value)||0,v=parseInt(n.querySelector("#cc-cutoff").value)||0,b=parseInt(n.querySelector("#cc-due").value)||0;if(!o){n.querySelector("#cc-name").focus(),p("Ingresa el nombre","error");return}const h={name:o,lastFour:c,limit:r,interestRate:d,minimumPaymentPct:u,minimumPaymentFixed:0,cutoffDay:v,paymentDueDay:b,gradient:l};s?(f(k=>{const N=k.creditCards.find(O=>O.id===e);N&&Object.assign(N,h)}),p("Tarjeta actualizada")):(f(k=>{k.creditCards.push({id:T(),...h,movements:[]})}),p("Tarjeta agregada")),i(),P(t)}),n.querySelector("#cc-name").focus()})}function Ft(e,t){const a=g().creditCards.find(l=>l.id===e);if(!a)return;const s=Me(a.gradient);x({title:a.name,size:"lg"},(l,n)=>{function i(){const o=g().creditCards.find(h=>h.id===e);if(!o){n();return}const{used:c,available:r,pct:d,minPayment:u}=oe(o),v=d>=80?"danger":d>=60?"warning":"",b=[...o.movements||[]].sort((h,k)=>k.date.localeCompare(h.date));l.innerHTML=`
        <div class="cc-modal-mini" style="background:${s}">
          <span class="cc-modal-mini-name">${I(o.name)}</span>
          <span class="cc-modal-mini-num">•••• ${I(o.lastFour||"????")}</span>
        </div>
        <div class="cc-modal-stats">
          <div class="cc-modal-stat">
            <p class="cc-stat-lbl">Límite</p>
            <p class="cc-stat-val">${m(o.limit||0)}</p>
          </div>
          <div class="cc-modal-stat">
            <p class="cc-stat-lbl">Usado</p>
            <p class="cc-stat-val expense-clr">${m(c)}</p>
          </div>
          <div class="cc-modal-stat">
            <p class="cc-stat-lbl">Disponible</p>
            <p class="cc-stat-val income-clr">${m(r)}</p>
          </div>
          <div class="cc-modal-stat">
            <p class="cc-stat-lbl">Pago mínimo</p>
            <p class="cc-stat-val">${m(u)}</p>
          </div>
        </div>
        <div class="cc-usage-wrap" style="margin:0">
          <div class="cc-usage-track">
            <div class="cc-usage-fill ${v}" style="width:${d}%"></div>
          </div>
          <span class="cc-usage-label">${d}% usado</span>
        </div>
        <div class="mov-actions-row">
          <button class="btn btn-sm" style="flex:1;background:var(--clr-danger-light);color:var(--clr-danger);border:1.5px solid var(--clr-danger)" id="mov-charge">+ Cargo</button>
          <button class="btn btn-primary btn-sm" style="flex:1" id="mov-payment">+ Pago</button>
        </div>
        <div class="movements-list">
          ${b.length?b.map(h=>`
            <div class="movement-row">
              <span class="mov-dot ${h.type==="charge"?"charge":"payment"}"></span>
              <div class="mov-body">
                <span class="mov-desc">${I(h.description||(h.type==="charge"?"Cargo":"Pago"))}</span>
                <span class="mov-date">${_e(h.date)}</span>
              </div>
              <span class="mov-amt ${h.type==="charge"?"expense-clr":"income-clr"}">
                ${h.type==="charge"?"−":"+"}${m(h.amount)}
              </span>
              <button class="btn-icon btn-icon-danger" data-del-mov="${e}|${h.id}" title="Eliminar">✕</button>
            </div>`).join(""):'<p class="mov-empty">Sin movimientos registrados aún.</p>'}
        </div>
      `}l.addEventListener("click",o=>{o.target.closest("#mov-charge")&&Ee(e,"charge",i),o.target.closest("#mov-payment")&&Ee(e,"payment",i);const c=o.target.closest("[data-del-mov]");if(c){const[r,d]=c.dataset.delMov.split("|");Ot(r,d,i,t)}}),i()})}function Ee(e,t,a){const s=new Date().toISOString().slice(0,10);x({title:t==="charge"?"Nuevo cargo":"Registrar pago",size:"sm"},(l,n)=>{l.innerHTML=`
      <div class="field-group">
        <label class="field-label" for="mov-amt">Monto</label>
        <div class="input-wrap-suffix">
          <input class="field-input" type="number" id="mov-amt" min="0.01" step="0.01" placeholder="0.00" />
          <span class="input-suffix">${g().profile.currency.code}</span>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="mov-desc">Descripción
          <span style="color:var(--text-muted);font-weight:400">(opcional)</span>
        </label>
        <input class="field-input" type="text" id="mov-desc"
          placeholder="${t==="charge"?"Ej: Supermercado, Netflix…":"Ej: Pago mensual…"}" />
      </div>
      <div class="field-group">
        <label class="field-label" for="mov-date">Fecha</label>
        <input class="field-input" type="date" id="mov-date" value="${s}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="mov-cancel">Cancelar</button>
        <button class="btn ${t==="charge"?"btn-danger":"btn-primary"}" id="mov-save">
          ${t==="charge"?"Agregar cargo":"Registrar pago"}
        </button>
      </div>
    `,l.querySelector("#mov-cancel").addEventListener("click",n),l.querySelector("#mov-save").addEventListener("click",()=>{const i=parseFloat(l.querySelector("#mov-amt").value),o=l.querySelector("#mov-desc").value.trim(),c=l.querySelector("#mov-date").value;if(!i||i<=0){l.querySelector("#mov-amt").focus(),p("Ingresa un monto válido","error");return}if(!c){p("Selecciona una fecha","error");return}f(r=>{const d=r.creditCards.find(u=>u.id===e);d&&d.movements.push({id:T(),type:t,amount:i,description:o,date:c})}),p(t==="charge"?"Cargo registrado":"Pago registrado ✓"),n(),a==null||a()}),l.querySelector("#mov-amt").focus()})}function Ot(e,t,a,s){L({title:"Eliminar movimiento",message:"¿Eliminar este movimiento?",confirmLabel:"Eliminar",danger:!0}).then(l=>{l&&(f(n=>{const i=n.creditCards.find(o=>o.id===e);i&&(i.movements=i.movements.filter(o=>o.id!==t))}),p("Movimiento eliminado"),a==null||a(),s&&P(s))})}function Rt(e,t){const a=g().creditCards.find(s=>s.id===e);a&&L({title:"Eliminar tarjeta",message:`¿Eliminar "<strong>${I(a.name)}</strong>" y todos sus movimientos?`,confirmLabel:"Eliminar",danger:!0}).then(s=>{s&&(f(l=>{l.creditCards=l.creditCards.filter(n=>n.id!==e)}),p("Tarjeta eliminada"),P(t))})}function ye(e){const t=(e.payments||[]).reduce((l,n)=>l+(n.amount||0),0),a=Math.max(0,(e.originalAmount||0)-t),s=e.originalAmount?Math.min(100,Math.round(t/e.originalAmount*100)):0;return{paid:t,remaining:a,pct:s}}function Gt(e){return e.length?`
    <div class="cc-toolbar">
      <button class="btn btn-primary btn-sm" id="btn-add-loan">+ Agregar préstamo</button>
    </div>
    <div class="loans-list">
      ${e.map(t=>Ht(t)).join("")}
    </div>`:`<div class="empty-state">
      <div class="empty-state-icon">📋</div>
      <h3 class="empty-state-title">Sin préstamos</h3>
      <p class="empty-state-desc">Agrega un préstamo para rastrear cuánto has pagado y cuánto falta.</p>
      <button class="btn btn-primary" id="btn-add-loan">+ Agregar préstamo</button>
    </div>`}function Ht(e){const{paid:t,remaining:a,pct:s}=ye(e),l=s>=100?"complete":s>=60?"good":"",n=[...e.payments||[]].sort((i,o)=>o.date.localeCompare(i.date));return`
    <div class="loan-card card">
      <div class="loan-header">
        <div class="loan-title-wrap">
          <h3 class="loan-name">${I(e.name)}</h3>
          <div style="display:flex;gap:var(--sp-2);flex-wrap:wrap;margin-top:var(--sp-1)">
            ${e.interestRate?`<span class="badge badge-warning">${e.interestRate}% anual</span>`:""}
            ${s>=100?'<span class="badge badge-success">✓ Saldado</span>':""}
          </div>
        </div>
        <div class="item-actions">
          <button class="btn btn-primary btn-sm" data-pay-loan="${e.id}">+ Pago</button>
          <button class="btn-icon" data-edit-loan="${e.id}" title="Editar">✏️</button>
          <button class="btn-icon btn-icon-danger" data-del-loan="${e.id}" title="Eliminar">🗑️</button>
        </div>
      </div>

      <div class="loan-progress-wrap">
        <div class="loan-bar-track">
          <div class="loan-bar-fill ${l}" style="width:${s}%"></div>
        </div>
        <span class="loan-bar-pct">${s}% pagado</span>
      </div>

      <div class="loan-stats-strip">
        <div class="loan-stat">
          <p class="cc-stat-lbl">Deuda original</p>
          <p class="cc-stat-val">${m(e.originalAmount||0)}</p>
        </div>
        <div class="loan-stat">
          <p class="cc-stat-lbl">Pagado</p>
          <p class="cc-stat-val income-clr">${m(t)}</p>
        </div>
        <div class="loan-stat">
          <p class="cc-stat-lbl">Pendiente</p>
          <p class="cc-stat-val expense-clr">${m(a)}</p>
        </div>
        ${e.monthlyPayment?`
        <div class="loan-stat">
          <p class="cc-stat-lbl">Cuota mensual</p>
          <p class="cc-stat-val">${m(e.monthlyPayment)}</p>
        </div>`:""}
      </div>

      ${n.length?`
        <details class="loan-history">
          <summary class="loan-history-summary">Historial de pagos (${n.length})</summary>
          <div class="loan-payments-list">
            ${n.map(i=>`
              <div class="loan-payment-row">
                <span class="loan-pay-dot"></span>
                <span class="loan-pay-note">${I(i.note||"Pago")}</span>
                <span class="loan-pay-date">${_e(i.date)}</span>
                <span class="income-clr loan-pay-amt">+${m(i.amount)}</span>
                <button class="btn-icon btn-icon-danger" data-del-lp="${e.id}|${i.id}" title="Eliminar">✕</button>
              </div>`).join("")}
          </div>
        </details>`:""}
    </div>`}function Ce(e,t){const a=e?g().loans.find(l=>l.id===e):null,s=!!a;x({title:s?"Editar préstamo":"Nuevo préstamo"},(l,n)=>{l.innerHTML=`
      <div class="field-group">
        <label class="field-label" for="ln-name">Nombre</label>
        <input class="field-input" type="text" id="ln-name"
          placeholder="Ej: Préstamo personal, Crédito auto…"
          value="${I((a==null?void 0:a.name)||"")}" />
      </div>
      <div class="cc-form-row">
        <div class="field-group">
          <label class="field-label" for="ln-orig">Monto original</label>
          <input class="field-input" type="number" id="ln-orig" min="0" step="0.01"
            placeholder="0.00" value="${(a==null?void 0:a.originalAmount)??""}" />
        </div>
        <div class="field-group">
          <label class="field-label" for="ln-monthly">Cuota mensual</label>
          <input class="field-input" type="number" id="ln-monthly" min="0" step="0.01"
            placeholder="0.00" value="${(a==null?void 0:a.monthlyPayment)??""}" />
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="ln-rate">Tasa de interés anual (%) <span style="color:var(--text-muted);font-weight:400">(opcional)</span></label>
        <input class="field-input" type="number" id="ln-rate" min="0" step="0.1"
          placeholder="0" value="${(a==null?void 0:a.interestRate)??""}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="ln-cancel">Cancelar</button>
        <button class="btn btn-primary" id="ln-save">${s?"Guardar cambios":"Agregar préstamo"}</button>
      </div>
    `,l.querySelector("#ln-cancel").addEventListener("click",n),l.querySelector("#ln-save").addEventListener("click",()=>{const i=l.querySelector("#ln-name").value.trim(),o=parseFloat(l.querySelector("#ln-orig").value)||0,c=parseFloat(l.querySelector("#ln-monthly").value)||0,r=parseFloat(l.querySelector("#ln-rate").value)||0;if(!i){l.querySelector("#ln-name").focus(),p("Ingresa el nombre","error");return}if(!o){p("Ingresa el monto del préstamo","error");return}const d={name:i,originalAmount:o,monthlyPayment:c,interestRate:r};s?(f(u=>{const v=u.loans.find(b=>b.id===e);v&&Object.assign(v,d)}),p("Préstamo actualizado")):(f(u=>{u.loans.push({id:T(),...d,payments:[]})}),p("Préstamo agregado")),n(),P(t)}),l.querySelector("#ln-name").focus()})}function Vt(e,t){const a=g().loans.find(n=>n.id===e);if(!a)return;const{remaining:s}=ye(a),l=new Date().toISOString().slice(0,10);x({title:`Pago — ${a.name}`,size:"sm"},(n,i)=>{n.innerHTML=`
      <p style="font-size:.875rem;color:var(--text-secondary);margin-bottom:var(--sp-2);">
        Pendiente: <strong>${m(s)}</strong>
        ${a.monthlyPayment?`· Cuota: <strong>${m(a.monthlyPayment)}</strong>`:""}
      </p>
      <div class="field-group">
        <label class="field-label" for="lp-amt">Monto del pago</label>
        <input class="field-input" type="number" id="lp-amt" min="0.01" step="0.01"
          placeholder="${a.monthlyPayment||"0.00"}"
          value="${a.monthlyPayment||""}" />
      </div>
      <div class="field-group">
        <label class="field-label" for="lp-note">Nota <span style="color:var(--text-muted);font-weight:400">(opcional)</span></label>
        <input class="field-input" type="text" id="lp-note" placeholder="Ej: Cuota de junio…" />
      </div>
      <div class="field-group">
        <label class="field-label" for="lp-date">Fecha</label>
        <input class="field-input" type="date" id="lp-date" value="${l}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="lp-cancel">Cancelar</button>
        <button class="btn btn-primary" id="lp-save">Registrar pago</button>
      </div>
    `,n.querySelector("#lp-cancel").addEventListener("click",i),n.querySelector("#lp-save").addEventListener("click",()=>{const o=parseFloat(n.querySelector("#lp-amt").value),c=n.querySelector("#lp-note").value.trim(),r=n.querySelector("#lp-date").value;if(!o||o<=0){n.querySelector("#lp-amt").focus(),p("Ingresa un monto válido","error");return}if(!r){p("Selecciona una fecha","error");return}f(d=>{const u=d.loans.find(v=>v.id===e);u&&u.payments.push({id:T(),amount:o,note:c,date:r})}),p("Pago registrado ✓"),i(),P(t)}),n.querySelector("#lp-amt").focus()})}function Ut(e,t){const a=g().loans.find(s=>s.id===e);a&&L({title:"Eliminar préstamo",message:`¿Eliminar "<strong>${I(a.name)}</strong>" y todo su historial de pagos?`,confirmLabel:"Eliminar",danger:!0}).then(s=>{s&&(f(l=>{l.loans=l.loans.filter(n=>n.id!==e)}),p("Préstamo eliminado"),P(t))})}function Yt(e,t,a){L({title:"Eliminar pago",message:"¿Eliminar este pago del historial?",confirmLabel:"Eliminar",danger:!0}).then(s=>{s&&(f(l=>{const n=l.loans.find(i=>i.id===e);n&&(n.payments=n.payments.filter(i=>i.id!==t))}),p("Pago eliminado"),P(a))})}function _e(e){if(!e)return"";try{return new Intl.DateTimeFormat("es",{day:"2-digit",month:"short"}).format(new Date(e+"T00:00:00"))}catch{return e}}function I(e=""){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ie(){const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function Wt(e){const[t,a]=e.split("-").map(Number),s=new Date(t,a-2,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function Jt(e){const[t,a]=e.split("-").map(Number),s=new Date(t,a,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function Xt(e){const[t,a]=e.split("-");return new Intl.DateTimeFormat("es",{month:"long",year:"numeric"}).format(new Date(+t,+a-1,1))}function Qt(e){return e.charAt(0).toUpperCase()+e.slice(1)}function Kt(e){if(!e)return"";try{return new Intl.DateTimeFormat("es",{day:"2-digit",month:"short"}).format(new Date(e+"T00:00:00"))}catch{return e}}function F(e=""){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function V(e,t=null){const a=(e.movements||[]).filter(i=>!t||i.date.startsWith(t)),s=a.filter(i=>i.type==="income").reduce((i,o)=>i+(o.amount||0),0),l=a.filter(i=>i.type==="expense").reduce((i,o)=>i+(o.amount||0),0),n=s-l;return{totalIncome:s,totalExpense:l,balance:n,count:a.length}}function Zt(){const e=document.getElementById("panel-business");e.innerHTML="";const t=document.createElement("div");t.className="module-wrap",e.appendChild(t),U(t),t.addEventListener("click",a=>{const s=a.target.closest("[data-view-biz]"),l=a.target.closest("[data-edit-biz]"),n=a.target.closest("[data-del-biz]");s&&aa(s.dataset.viewBiz,t),l&&Te(l.dataset.editBiz,t),n&&na(n.dataset.delBiz,t)})}function U(e){const{businesses:t}=g(),a=Ie(),s=t.reduce((o,c)=>o+V(c).totalIncome,0),l=t.reduce((o,c)=>o+V(c).totalExpense,0),n=s-l,i=t.reduce((o,c)=>o+V(c,a).balance,0);e.innerHTML=`
    <div class="mod-top-row">
      <div>
        <h1 class="module-title">Negocios</h1>
        <p class="module-subtitle">Ingresos y gastos por negocio</p>
      </div>
      <button class="btn btn-primary" id="btn-add-biz">+ Nuevo negocio</button>
    </div>

    ${t.length?`
    <div class="summary-strip">
      <div class="summary-stat">
        <p class="summary-label">Balance total</p>
        <p class="summary-value ${n>=0?"income-clr":"expense-clr"}">
          ${n>=0?"+":""}${m(n)}
        </p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Ingresos totales</p>
        <p class="summary-value income-clr">${m(s)}</p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Gastos totales</p>
        <p class="summary-value expense-clr">${m(l)}</p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Balance este mes</p>
        <p class="summary-value ${i>=0?"income-clr":"expense-clr"}">
          ${i>=0?"+":""}${m(i)}
        </p>
      </div>
    </div>`:""}

    <div id="biz-grid">
      ${t.length?`<div class="biz-grid">${t.map(o=>ta(o,a)).join("")}</div>`:ea()}
    </div>
  `,e.querySelector("#btn-add-biz").addEventListener("click",()=>Te(null,e))}function ea(){return`<div class="empty-state">
    <div class="empty-state-icon">🏢</div>
    <h3 class="empty-state-title">Sin negocios</h3>
    <p class="empty-state-desc">
      Crea un negocio para registrar sus ingresos y gastos por separado de tus finanzas personales.
    </p>
  </div>`}function ta(e,t){const a=V(e),s=V(e,t),l=e.color||"#6366f1",n=a.balance>=0;return`
    <div class="biz-card" style="--biz-clr:${l}">
      <div class="biz-card-head">
        <span class="biz-card-icon">${e.icon||"🏢"}</span>
        <div class="biz-card-name-wrap">
          <h3 class="biz-card-name">${F(e.name)}</h3>
          <span class="biz-card-count">${a.count} movimiento${a.count!==1?"s":""}</span>
        </div>
        <span class="biz-card-balance ${n?"income-clr":"expense-clr"}">
          ${n?"+":""}${m(a.balance)}
        </span>
      </div>

      <div class="biz-alltime-bar">
        <div class="biz-bar-track">
          ${a.totalIncome+a.totalExpense>0?`
            <div class="biz-bar-inc"
              style="width:${Math.round(a.totalIncome/(a.totalIncome+a.totalExpense)*100)}%"></div>
          `:'<div class="biz-bar-empty"></div>'}
        </div>
      </div>

      <div class="biz-totals">
        <div class="biz-total-item">
          <span class="biz-total-lbl">↑ Ingresos</span>
          <span class="biz-total-val income-clr">${m(a.totalIncome)}</span>
        </div>
        <div class="biz-total-item">
          <span class="biz-total-lbl">↓ Gastos</span>
          <span class="biz-total-val expense-clr">${m(a.totalExpense)}</span>
        </div>
      </div>

      <div class="biz-month-strip">
        <span class="biz-month-lbl">Este mes</span>
        <span class="biz-month-vals">
          <span class="income-clr">+${m(s.totalIncome)}</span>
          <span style="color:var(--text-muted)">·</span>
          <span class="expense-clr">-${m(s.totalExpense)}</span>
          <span style="color:var(--text-muted)">·</span>
          <strong class="${s.balance>=0?"income-clr":"expense-clr"}">
            ${s.balance>=0?"+":""}${m(s.balance)}
          </strong>
        </span>
      </div>

      <div class="biz-actions">
        <button class="btn btn-outline btn-sm" style="flex:1" data-view-biz="${e.id}">
          📋 Ver movimientos
        </button>
        <button class="btn-icon" data-edit-biz="${e.id}" title="Editar negocio">✏️</button>
        <button class="btn-icon btn-icon-danger" data-del-biz="${e.id}" title="Eliminar negocio">🗑️</button>
      </div>
    </div>`}function Te(e,t){const a=e?g().businesses.find(n=>n.id===e):null,s=!!a;let l=(a==null?void 0:a.color)??W[0];x({title:s?"Editar negocio":"Nuevo negocio"},(n,i)=>{n.innerHTML=`
      <div class="field-group">
        <label class="field-label" for="biz-name">Nombre del negocio</label>
        <input class="field-input" type="text" id="biz-name"
          placeholder="Ej: Panadería El Sol, Tienda Online…"
          value="${F((a==null?void 0:a.name)||"")}" />
      </div>
      <div class="field-group">
        <label class="field-label" for="biz-icon">Ícono (emoji)</label>
        <input class="field-input" type="text" id="biz-icon" maxlength="4"
          placeholder="🏢" value="${F((a==null?void 0:a.icon)||"")}"
          style="font-size:1.4rem;width:72px;text-align:center;" />
      </div>
      <div class="field-group">
        <label class="field-label">Color de acento</label>
        <div class="color-grid" id="biz-color-grid">
          ${W.map(o=>`
            <button class="color-swatch${o===l?" selected":""}"
              style="background:${o}" data-color="${o}" type="button"></button>
          `).join("")}
        </div>
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="biz-cancel">Cancelar</button>
        <button class="btn btn-primary" id="biz-save">${s?"Guardar cambios":"Crear negocio"}</button>
      </div>
    `,n.querySelector("#biz-color-grid").addEventListener("click",o=>{const c=o.target.closest(".color-swatch");c&&(l=c.dataset.color,n.querySelectorAll(".color-swatch").forEach(r=>r.classList.toggle("selected",r===c)))}),n.querySelector("#biz-cancel").addEventListener("click",i),n.querySelector("#biz-save").addEventListener("click",()=>{const o=n.querySelector("#biz-name").value.trim(),c=n.querySelector("#biz-icon").value.trim()||"🏢";if(!o){n.querySelector("#biz-name").focus(),p("Ingresa el nombre del negocio","error");return}s?(f(r=>{const d=r.businesses.find(u=>u.id===e);d&&Object.assign(d,{name:o,icon:c,color:l})}),p("Negocio actualizado")):(f(r=>{r.businesses.push({id:T(),name:o,icon:c,color:l,movements:[]})}),p("Negocio creado ✓")),i(),U(t)}),n.querySelector("#biz-name").focus()})}function aa(e,t){const a=g().businesses.find(l=>l.id===e);if(!a)return;let s=Ie();x({title:`${a.icon||"🏢"} ${a.name}`,size:"lg"},(l,n)=>{l.addEventListener("click",o=>{if(o.target.closest("#biz-prev")){s=Wt(s),i();return}if(o.target.closest("#biz-next")){s=Jt(s),i();return}if(o.target.closest("#biz-add-inc")){Se(e,"income",s,()=>{i(),U(t)});return}if(o.target.closest("#biz-add-exp")){Se(e,"expense",s,()=>{i(),U(t)});return}const c=o.target.closest("[data-del-bm]");if(c){const[r,d]=c.dataset.delBm.split("|");sa(r,d,()=>{i(),U(t)})}});function i(){const o=g().businesses.find(b=>b.id===e);if(!o){n();return}const c=[...o.movements||[]].filter(b=>b.date.startsWith(s)).sort((b,h)=>h.date.localeCompare(b.date)),r=c.filter(b=>b.type==="income").reduce((b,h)=>b+h.amount,0),d=c.filter(b=>b.type==="expense").reduce((b,h)=>b+h.amount,0),u=r-d,v=o.color||"#6366f1";l.innerHTML=`
        <div class="biz-modal-banner" style="background:${v}18;border-left:4px solid ${v};">
          <span style="font-size:2rem">${o.icon||"🏢"}</span>
          <div>
            <p style="font-weight:600">${F(o.name)}</p>
            <p style="font-size:.8rem;color:var(--text-muted)">${V(o).count} movimientos en total</p>
          </div>
        </div>

        <div class="month-nav" style="justify-content:center;">
          <button class="btn btn-ghost btn-sm" id="biz-prev">‹</button>
          <span class="month-label">${Qt(Xt(s))}</span>
          <button class="btn btn-ghost btn-sm" id="biz-next">›</button>
        </div>

        <div class="cc-modal-stats">
          <div class="cc-modal-stat">
            <p class="cc-stat-lbl">Ingresos</p>
            <p class="cc-stat-val income-clr">${m(r)}</p>
          </div>
          <div class="cc-modal-stat">
            <p class="cc-stat-lbl">Gastos</p>
            <p class="cc-stat-val expense-clr">${m(d)}</p>
          </div>
          <div class="cc-modal-stat">
            <p class="cc-stat-lbl">Balance</p>
            <p class="cc-stat-val ${u>=0?"income-clr":"expense-clr"}">
              ${u>=0?"+":""}${m(u)}
            </p>
          </div>
        </div>

        <div class="mov-actions-row">
          <button class="btn btn-sm biz-btn-inc" id="biz-add-inc" style="flex:1;">
            + Ingreso
          </button>
          <button class="btn btn-sm biz-btn-exp" id="biz-add-exp" style="flex:1;">
            + Gasto
          </button>
        </div>

        <div class="movements-list">
          ${c.length?c.map(b=>`
              <div class="movement-row">
                <span class="mov-dot ${b.type==="income"?"payment":"charge"}"></span>
                <div class="mov-body" style="flex-direction:column;align-items:flex-start;gap:2px;">
                  <span class="mov-desc">${F(b.description||(b.type==="income"?"Ingreso":"Gasto"))}</span>
                  <span style="display:flex;gap:var(--sp-2);align-items:center">
                    ${b.category?`<span class="badge badge-muted" style="font-size:.7rem">${F(b.category)}</span>`:""}
                    <span class="mov-date">${Kt(b.date)}</span>
                  </span>
                </div>
                <span class="mov-amt ${b.type==="income"?"income-clr":"expense-clr"}">
                  ${b.type==="income"?"+":"−"}${m(b.amount)}
                </span>
                <button class="btn-icon btn-icon-danger" data-del-bm="${e}|${b.id}" title="Eliminar">✕</button>
              </div>`).join(""):'<p class="mov-empty">Sin movimientos este mes.</p>'}
        </div>
      `}i()})}function Se(e,t,a,s){const l=new Date().toISOString().slice(0,10),n=l.startsWith(a)?l:a+"-01",i=t==="income";x({title:i?"Nuevo ingreso del negocio":"Nuevo gasto del negocio",size:"sm"},(o,c)=>{o.innerHTML=`
      <div class="field-group">
        <label class="field-label" for="bm-amt">Monto</label>
        <div class="input-wrap-suffix">
          <input class="field-input" type="number" id="bm-amt" min="0.01" step="0.01" placeholder="0.00" />
          <span class="input-suffix">${g().profile.currency.code}</span>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="bm-desc">Descripción
          <span style="color:var(--text-muted);font-weight:400">(opcional)</span>
        </label>
        <input class="field-input" type="text" id="bm-desc"
          placeholder="${i?"Ej: Ventas del día, Pedido…":"Ej: Materiales, Salario, Renta…"}" />
      </div>
      <div class="field-group">
        <label class="field-label" for="bm-cat">Categoría
          <span style="color:var(--text-muted);font-weight:400">(texto libre, opcional)</span>
        </label>
        <input class="field-input" type="text" id="bm-cat"
          placeholder="${i?"Ej: Ventas, Servicios…":"Ej: Materiales, Operativo…"}" />
      </div>
      <div class="field-group">
        <label class="field-label" for="bm-date">Fecha</label>
        <input class="field-input" type="date" id="bm-date" value="${n}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="bm-cancel">Cancelar</button>
        <button class="btn ${i?"btn-primary":"btn-danger"}" id="bm-save">
          ${i?"Agregar ingreso":"Agregar gasto"}
        </button>
      </div>
    `,o.querySelector("#bm-cancel").addEventListener("click",c),o.querySelector("#bm-save").addEventListener("click",()=>{const r=parseFloat(o.querySelector("#bm-amt").value),d=o.querySelector("#bm-desc").value.trim(),u=o.querySelector("#bm-cat").value.trim(),v=o.querySelector("#bm-date").value;if(!r||r<=0){o.querySelector("#bm-amt").focus(),p("Ingresa un monto válido","error");return}if(!v){p("Selecciona una fecha","error");return}f(b=>{const h=b.businesses.find(k=>k.id===e);h&&h.movements.push({id:T(),type:t,amount:r,description:d,category:u,date:v,createdAt:new Date().toISOString()})}),p(i?"Ingreso registrado ✓":"Gasto registrado"),c(),s==null||s()}),o.querySelector("#bm-amt").focus()})}function sa(e,t,a){L({title:"Eliminar movimiento",message:"¿Eliminar este movimiento del negocio?",confirmLabel:"Eliminar",danger:!0}).then(s=>{s&&(f(l=>{const n=l.businesses.find(i=>i.id===e);n&&(n.movements=n.movements.filter(i=>i.id!==t))}),p("Movimiento eliminado"),a==null||a())})}function na(e,t){const a=g().businesses.find(s=>s.id===e);a&&L({title:"Eliminar negocio",message:`¿Eliminar "<strong>${F(a.name)}</strong>" y todos sus movimientos (${(a.movements||[]).length})?`,confirmLabel:"Eliminar",danger:!0}).then(s=>{s&&(f(l=>{l.businesses=l.businesses.filter(n=>n.id!==e)}),p("Negocio eliminado"),U(t))})}function la(){const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function ia(e){const[t,a]=e.split("-");return new Intl.DateTimeFormat("es",{month:"long",year:"numeric"}).format(new Date(+t,+a-1,1))}function oa(e){return e.charAt(0).toUpperCase()+e.slice(1)}function ca(e){if(!e)return"";try{return new Intl.DateTimeFormat("es",{day:"2-digit",month:"short"}).format(new Date(e+"T00:00:00"))}catch{return e}}function Z(e=""){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ae(e){return(e.contributions||[]).reduce((t,a)=>t+(a.amount||0),0)}function je(e,t){return(e.contributions||[]).filter(a=>a.date.startsWith(t)).reduce((a,s)=>a+(s.amount||0),0)}function ra(){const e=document.getElementById("panel-savings");e.innerHTML="";const t=document.createElement("div");t.className="module-wrap",e.appendChild(t),ee(t),t.addEventListener("click",a=>{const s=a.target.closest("[data-aport]"),l=a.target.closest("[data-edit-goal]"),n=a.target.closest("[data-del-goal]"),i=a.target.closest("[data-del-contrib]");if(s&&ua(s.dataset.aport,t),l&&Pe(l.dataset.editGoal,t),n&&pa(n.dataset.delGoal,t),i){const[o,c]=i.dataset.delContrib.split("|");ma(o,c,t)}})}function ee(e){const t=g(),{savingsGoals:a,incomes:s,profile:l}=t,n=la(),i=s.filter(u=>u.date.startsWith(n)).reduce((u,v)=>u+v.amount,0),o=i*(l.distributionRule.save/100),c=a.reduce((u,v)=>u+je(v,n),0),r=o>0?Math.min(100,Math.round(c/o*100)):0,d=i>0;e.innerHTML=`
    <div class="mod-top-row">
      <div>
        <h1 class="module-title">Ahorro</h1>
        <p class="module-subtitle">Metas y progreso de ahorro</p>
      </div>
      <button class="btn btn-primary" id="btn-add-goal">+ Nueva meta</button>
    </div>

    <!-- Global goal strip -->
    <div class="card sav-global-card">
      <div class="sav-global-header">
        <div>
          <p class="sav-global-title">Meta global del mes</p>
          <p class="sav-global-sub">
            ${oa(ia(n))} · ${l.distributionRule.save}% de tus ingresos
          </p>
        </div>
        <div class="sav-global-amounts">
          <span class="sav-global-saved">${m(c)}</span>
          <span class="sav-global-sep"> / </span>
          <span class="sav-global-target">${d?m(o):"—"}</span>
        </div>
      </div>
      ${d?`
        <div class="sav-global-bar-wrap">
          <div class="sav-bar-track">
            <div class="sav-bar-fill ${r>=100?"complete":r>=60?"good":""}"
              style="width:${r}%"></div>
          </div>
          <span class="sav-bar-pct">${r}%</span>
        </div>
        <p class="sav-global-status ${r>=100?"status-ok":r>=60?"status-warn":"status-low"}">
          ${r>=100?"✓ ¡Meta de ahorro del mes cumplida!":r>0?`Faltan ${m(Math.max(0,o-c))} para la meta del mes`:"Aún no has aportado a tus metas este mes"}
        </p>
      `:`
        <p class="sav-global-status status-low">
          Registra ingresos del mes para calcular tu meta de ahorro.
        </p>
      `}
    </div>

    <!-- Goals grid -->
    <div id="goals-grid">
      ${a.length?`<div class="goals-grid">${a.map(u=>da(u,n)).join("")}</div>`:`<div class="empty-state">
            <div class="empty-state-icon">🎯</div>
            <h3 class="empty-state-title">Sin metas de ahorro</h3>
            <p class="empty-state-desc">Crea tu primera meta (fondo de emergencia, vacaciones, equipo…) y registra tus aportes.</p>
          </div>`}
    </div>
  `,e.querySelector("#btn-add-goal").addEventListener("click",()=>Pe(null,e))}function da(e,t){const a=Ae(e),s=e.targetAmount||0,l=s>0?Math.min(100,Math.round(a/s*100)):0,n=e.color||"#6366f1",i=l>=100,o=je(e,t),c=[...e.contributions||[]].sort((r,d)=>d.date.localeCompare(r.date));return`
    <div class="goal-card" style="--goal-clr:${n}">
      <div class="goal-card-head">
        <span class="goal-icon">${e.icon||"🎯"}</span>
        <div class="goal-title-wrap">
          <h3 class="goal-name">${Z(e.name)}</h3>
          ${i?'<span class="badge badge-success">✓ Completada</span>':""}
        </div>
        <div class="item-actions">
          <button class="btn-icon" data-edit-goal="${e.id}" title="Editar">✏️</button>
          <button class="btn-icon btn-icon-danger" data-del-goal="${e.id}" title="Eliminar">🗑️</button>
        </div>
      </div>

      <div class="goal-amounts">
        <span class="goal-current" style="color:${n}">${m(a)}</span>
        <span class="goal-sep">de</span>
        <span class="goal-target">${m(s)}</span>
      </div>

      <div class="sav-global-bar-wrap">
        <div class="sav-bar-track">
          <div class="sav-bar-fill ${i?"complete":l>=60?"good":""}"
            style="width:${l}%;background:${n}"></div>
        </div>
        <span class="sav-bar-pct">${l}%</span>
      </div>

      ${o>0?`
        <p class="goal-month-note">
          Aportado este mes: <strong class="income-clr">${m(o)}</strong>
        </p>`:""}

      <button class="btn btn-primary btn-sm" style="width:100%;background:${n};border:none" data-aport="${e.id}">
        + Aportar
      </button>

      ${c.length?`
        <details class="goal-history">
          <summary class="loan-history-summary">Historial (${c.length})</summary>
          <div class="loan-payments-list" style="margin-top:var(--sp-3)">
            ${c.map(r=>`
              <div class="loan-payment-row">
                <span class="loan-pay-dot" style="background:${n}"></span>
                <span class="loan-pay-note">${Z(r.note||"Aporte")}</span>
                <span class="loan-pay-date">${ca(r.date)}</span>
                <span class="income-clr loan-pay-amt">+${m(r.amount)}</span>
                <button class="btn-icon btn-icon-danger" data-del-contrib="${e.id}|${r.id}" title="Eliminar">✕</button>
              </div>`).join("")}
          </div>
        </details>`:""}
    </div>`}function Pe(e,t){const a=e?g().savingsGoals.find(n=>n.id===e):null,s=!!a;let l=(a==null?void 0:a.color)??W[5];x({title:s?"Editar meta":"Nueva meta de ahorro"},(n,i)=>{n.innerHTML=`
      <div class="field-group">
        <label class="field-label" for="goal-name">Nombre de la meta</label>
        <input class="field-input" type="text" id="goal-name"
          placeholder="Ej: Fondo de emergencia, Vacaciones, MacBook…"
          value="${Z((a==null?void 0:a.name)||"")}" />
      </div>
      <div class="cc-form-row">
        <div class="field-group">
          <label class="field-label" for="goal-icon">Ícono (emoji)</label>
          <input class="field-input" type="text" id="goal-icon" maxlength="4"
            placeholder="🎯" value="${Z((a==null?void 0:a.icon)||"")}"
            style="font-size:1.3rem;width:72px;text-align:center;" />
        </div>
        <div class="field-group">
          <label class="field-label" for="goal-target">Monto objetivo</label>
          <input class="field-input" type="number" id="goal-target" min="0.01" step="0.01"
            placeholder="0.00" value="${(a==null?void 0:a.targetAmount)??""}" />
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">Color</label>
        <div class="color-grid" id="goal-color-grid">
          ${W.map(o=>`
            <button class="color-swatch${o===l?" selected":""}"
              style="background:${o}" data-color="${o}" type="button"></button>
          `).join("")}
        </div>
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="goal-cancel">Cancelar</button>
        <button class="btn btn-primary" id="goal-save">${s?"Guardar cambios":"Crear meta"}</button>
      </div>
    `,n.querySelector("#goal-color-grid").addEventListener("click",o=>{const c=o.target.closest(".color-swatch");c&&(l=c.dataset.color,n.querySelectorAll(".color-swatch").forEach(r=>r.classList.toggle("selected",r===c)))}),n.querySelector("#goal-cancel").addEventListener("click",i),n.querySelector("#goal-save").addEventListener("click",()=>{const o=n.querySelector("#goal-name").value.trim(),c=n.querySelector("#goal-icon").value.trim()||"🎯",r=parseFloat(n.querySelector("#goal-target").value);if(!o){n.querySelector("#goal-name").focus(),p("Ingresa el nombre de la meta","error");return}if(!r||r<=0){n.querySelector("#goal-target").focus(),p("Ingresa un monto objetivo","error");return}s?(f(d=>{const u=d.savingsGoals.find(v=>v.id===e);u&&Object.assign(u,{name:o,icon:c,targetAmount:r,color:l})}),p("Meta actualizada")):(f(d=>{d.savingsGoals.push({id:T(),name:o,icon:c,targetAmount:r,color:l,contributions:[]})}),p("Meta creada ✓")),i(),ee(t)}),n.querySelector("#goal-name").focus()})}function ua(e,t){const a=g().savingsGoals.find(i=>i.id===e);if(!a)return;const s=Ae(a),l=Math.max(0,a.targetAmount-s),n=new Date().toISOString().slice(0,10);x({title:`Aportar — ${a.icon||""} ${a.name}`,size:"sm"},(i,o)=>{i.innerHTML=`
      <p style="font-size:.875rem;color:var(--text-secondary);margin-bottom:var(--sp-2);">
        Progreso: <strong>${m(s)}</strong> de <strong>${m(a.targetAmount)}</strong>
        ${l>0?`· Faltan <strong>${m(l)}</strong>`:" · ¡Meta alcanzada!"}
      </p>
      <div class="field-group">
        <label class="field-label" for="contrib-amt">Monto del aporte</label>
        <div class="input-wrap-suffix">
          <input class="field-input" type="number" id="contrib-amt" min="0.01" step="0.01"
            placeholder="0.00" />
          <span class="input-suffix">${g().profile.currency.code}</span>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="contrib-note">Nota
          <span style="color:var(--text-muted);font-weight:400">(opcional)</span>
        </label>
        <input class="field-input" type="text" id="contrib-note" placeholder="Ej: Ahorro de junio…" />
      </div>
      <div class="field-group">
        <label class="field-label" for="contrib-date">Fecha</label>
        <input class="field-input" type="date" id="contrib-date" value="${n}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="contrib-cancel">Cancelar</button>
        <button class="btn btn-primary" id="contrib-save" style="background:${a.color}">Aportar</button>
      </div>
    `,i.querySelector("#contrib-cancel").addEventListener("click",o),i.querySelector("#contrib-save").addEventListener("click",()=>{const c=parseFloat(i.querySelector("#contrib-amt").value),r=i.querySelector("#contrib-note").value.trim(),d=i.querySelector("#contrib-date").value;if(!c||c<=0){i.querySelector("#contrib-amt").focus(),p("Ingresa un monto válido","error");return}if(!d){p("Selecciona una fecha","error");return}f(u=>{const v=u.savingsGoals.find(b=>b.id===e);v&&v.contributions.push({id:T(),amount:c,note:r,date:d})}),p("Aporte registrado ✓"),o(),ee(t)}),i.querySelector("#contrib-amt").focus()})}function ma(e,t,a){L({title:"Eliminar aporte",message:"¿Eliminar este aporte del historial?",confirmLabel:"Eliminar",danger:!0}).then(s=>{s&&(f(l=>{const n=l.savingsGoals.find(i=>i.id===e);n&&(n.contributions=n.contributions.filter(i=>i.id!==t))}),p("Aporte eliminado"),ee(a))})}function pa(e,t){const a=g().savingsGoals.find(s=>s.id===e);a&&L({title:"Eliminar meta",message:`¿Eliminar "<strong>${Z(a.name)}</strong>" y todos sus aportes (${(a.contributions||[]).length})?`,confirmLabel:"Eliminar",danger:!0}).then(s=>{s&&(f(l=>{l.savingsGoals=l.savingsGoals.filter(n=>n.id!==e)}),p("Meta eliminada"),ee(t))})}const va=()=>document.getElementById("panel-settings");function he(){const e=va();e.innerHTML="";const t=document.createElement("div");t.className="module-wrap",t.id="settings-wrap",e.appendChild(t),t.innerHTML=`
    <div class="module-header">
      <h1 class="module-title">Ajustes</h1>
      <p class="module-subtitle">Configura tu perfil y preferencias</p>
    </div>
    <div class="settings-sections" id="settings-sections">
      ${ba()}
      ${ga()}
      ${fa()}
      ${ya()}
      ${ha()}
      ${$a()}
    </div>
  `,Ea(t)}function ba(){const{name:e}=g().profile;return`
    <section class="card" id="sec-profile">
      <h2 class="settings-section-title">👤 Perfil</h2>
      <div class="settings-fields">
        <div class="field-group">
          <label class="field-label" for="profile-name">Tu nombre <span style="color:var(--text-muted);font-weight:400;">(opcional)</span></label>
          <input class="field-input" type="text" id="profile-name"
            placeholder="Ej: María García" value="${D(e)}" autocomplete="name" />
          <p class="field-hint">Aparece en el encabezado de la app.</p>
        </div>
      </div>
      <div class="field-actions"><button class="btn btn-primary btn-sm" id="btn-save-profile">Guardar</button></div>
    </section>`}function ga(){const{code:e}=g().profile.currency;return`
    <section class="card" id="sec-currency">
      <h2 class="settings-section-title">💱 Moneda</h2>
      <div class="settings-fields">
        <div class="field-group">
          <label class="field-label" for="currency-select">Moneda predeterminada</label>
          <select class="field-input field-select" id="currency-select">
            ${ce.map(t=>`
              <option value="${t.code}" ${t.code===e?"selected":""}>
                ${t.symbol} — ${t.name} (${t.code})
              </option>`).join("")}
          </select>
        </div>
      </div>
      <div class="field-actions"><button class="btn btn-primary btn-sm" id="btn-save-currency">Guardar</button></div>
    </section>`}function fa(){const{live:e,debts:t,save:a}=g().profile.distributionRule;return`
    <section class="card" id="sec-distribution">
      <h2 class="settings-section-title">📐 Regla de distribución</h2>
      <p class="settings-section-desc">
        Define cómo repartir tus ingresos entre necesidades, deudas y ahorro.
        Los tres valores deben sumar exactamente 100 %.
      </p>
      <div class="dist-inputs">
        <div class="field-group">
          <label class="field-label"><span class="dist-dot" style="background:var(--clr-primary)"></span>Vivir</label>
          <div class="input-wrap-suffix">
            <input class="field-input" type="number" id="dist-live"  min="0" max="100" value="${e}">
            <span class="input-suffix">%</span>
          </div>
        </div>
        <div class="field-group">
          <label class="field-label"><span class="dist-dot" style="background:var(--clr-warning)"></span>Deudas</label>
          <div class="input-wrap-suffix">
            <input class="field-input" type="number" id="dist-debts" min="0" max="100" value="${t}">
            <span class="input-suffix">%</span>
          </div>
        </div>
        <div class="field-group">
          <label class="field-label"><span class="dist-dot" style="background:var(--clr-success)"></span>Ahorrar</label>
          <div class="input-wrap-suffix">
            <input class="field-input" type="number" id="dist-save"  min="0" max="100" value="${a}">
            <span class="input-suffix">%</span>
          </div>
        </div>
      </div>
      <div class="dist-bar-wrap" style="margin-top:var(--sp-4);">
        <div class="dist-bar" id="dist-bar">
          <div class="dist-segment" id="dseg-live"  style="width:${e}%;background:var(--clr-primary)">${e>8?e+"%":""}</div>
          <div class="dist-segment" id="dseg-debts" style="width:${t}%;background:var(--clr-warning)">${t>8?t+"%":""}</div>
          <div class="dist-segment" id="dseg-save"  style="width:${a}%;background:var(--clr-success)">${a>8?a+"%":""}</div>
        </div>
        <div class="dist-legend">
          <span class="dist-legend-item"><span class="dist-dot" style="background:var(--clr-primary)"></span>Vivir</span>
          <span class="dist-legend-item"><span class="dist-dot" style="background:var(--clr-warning)"></span>Deudas</span>
          <span class="dist-legend-item"><span class="dist-dot" style="background:var(--clr-success)"></span>Ahorrar</span>
        </div>
        <p class="dist-sum ${e+t+a===100?"ok":"err"}" id="dist-sum">Total: ${e+t+a}%</p>
      </div>
      <div class="field-actions"><button class="btn btn-primary btn-sm" id="btn-save-dist">Guardar</button></div>
    </section>`}function ya(){return`
    <section class="card" id="sec-sources">
      <div class="settings-section-header">
        <h2 class="settings-section-title" style="margin-bottom:0">💰 Fuentes de ingreso</h2>
        <button class="btn btn-primary btn-sm" id="btn-add-source">+ Agregar</button>
      </div>
      <p class="settings-section-desc">
        Tipos de ingreso que puedes seleccionar al registrar ingresos (Sueldo, Freelance, Renta…).
      </p>
      <div id="sources-list">${De()}</div>
    </section>`}function De(){const e=g().incomeSourceTypes;return e.length?`<ul class="items-list">
    ${e.map(t=>`
      <li class="item-row" data-src-id="${t.id}">
        <div class="item-info">
          <span class="item-icon">💸</span>
          <span class="item-name">${D(t.name)}</span>
        </div>
        <div class="item-actions">
          <button class="btn-icon" title="Editar" data-edit-src="${t.id}">✏️</button>
          <button class="btn-icon btn-icon-danger" title="Eliminar" data-del-src="${t.id}">🗑️</button>
        </div>
      </li>`).join("")}
  </ul>`:`<p style="font-size:.875rem;color:var(--text-muted);text-align:center;padding:var(--sp-4) 0;">
      Aún no tienes fuentes. Agrega tu primera fuente de ingreso.
    </p>`}function ha(){return`
    <section class="card" id="sec-cats">
      <div class="settings-section-header">
        <h2 class="settings-section-title" style="margin-bottom:0">🏷️ Categorías de gasto</h2>
        <button class="btn btn-primary btn-sm" id="btn-add-cat">+ Agregar</button>
      </div>
      <p class="settings-section-desc">
        Organiza tus gastos. Las categorías vienen con valores por defecto razonables pero puedes editarlas.
      </p>
      <div id="cats-list">${Ne()}</div>
    </section>`}function Ne(){const e=g().expenseCategories;return e.length?`<ul class="items-list">
    ${e.map(t=>`
      <li class="item-row" data-cat-id="${t.id}">
        <div class="item-info">
          <span class="color-dot" style="background:${t.color}"></span>
          <span class="item-icon">${t.icon||"📦"}</span>
          <span class="item-name">${D(t.name)}</span>
          <span class="badge badge-muted" style="margin-left:auto;font-size:.7rem;">${t.type==="fixed"?"Fijo":"Variable"}</span>
        </div>
        <div class="item-actions">
          <button class="btn-icon" title="Editar" data-edit-cat="${t.id}">✏️</button>
          <button class="btn-icon btn-icon-danger" title="Eliminar" data-del-cat="${t.id}">🗑️</button>
        </div>
      </li>`).join("")}
  </ul>`:`<p style="font-size:.875rem;color:var(--text-muted);text-align:center;padding:var(--sp-4) 0;">
      No hay categorías. Agrega una para empezar.
    </p>`}function $a(){return`
    <section class="card" id="sec-data">
      <h2 class="settings-section-title">💾 Gestión de datos</h2>
      <div class="data-action-list">
        <div class="data-action-row">
          <div class="data-action-info">
            <p class="data-action-name">Exportar datos</p>
            <p class="data-action-desc">Descarga un archivo JSON con todos tus registros</p>
          </div>
          <button class="btn btn-outline btn-sm" id="btn-export">↓ Exportar</button>
        </div>
        <div class="data-action-row">
          <div class="data-action-info">
            <p class="data-action-name">Importar datos</p>
            <p class="data-action-desc">Restaura desde un archivo JSON exportado anteriormente</p>
          </div>
          <button class="btn btn-outline btn-sm" id="btn-import">↑ Importar</button>
          <input type="file" id="import-file-input" accept=".json" style="display:none">
        </div>
        <div class="data-action-row">
          <div class="data-action-info">
            <p class="data-action-name" style="color:var(--clr-danger)">Borrar todo</p>
            <p class="data-action-desc">Elimina todos los datos y reinicia la app desde cero</p>
          </div>
          <button class="btn btn-danger-outline btn-sm" id="btn-reset">🗑 Borrar todo</button>
        </div>
      </div>
    </section>`}function Ea(e){var t,a,s,l,n,i,o,c,r;(t=e.querySelector("#btn-save-profile"))==null||t.addEventListener("click",Sa),(a=e.querySelector("#btn-save-currency"))==null||a.addEventListener("click",xa),["dist-live","dist-debts","dist-save"].forEach(d=>{var u;(u=e.querySelector(`#${d}`))==null||u.addEventListener("input",wa)}),(s=e.querySelector("#btn-save-dist"))==null||s.addEventListener("click",La),(l=e.querySelector("#btn-add-source"))==null||l.addEventListener("click",()=>xe(null)),e.addEventListener("click",d=>{const u=d.target.closest("[data-edit-src]"),v=d.target.closest("[data-del-src]");u&&xe(u.dataset.editSrc),v&&ka(v.dataset.delSrc)}),(n=e.querySelector("#btn-add-cat"))==null||n.addEventListener("click",()=>we(null)),e.addEventListener("click",d=>{const u=d.target.closest("[data-edit-cat]"),v=d.target.closest("[data-del-cat]");u&&we(u.dataset.editCat),v&&Ma(v.dataset.delCat)}),(i=e.querySelector("#btn-export"))==null||i.addEventListener("click",qa),(o=e.querySelector("#btn-import"))==null||o.addEventListener("click",()=>e.querySelector("#import-file-input").click()),(c=e.querySelector("#import-file-input"))==null||c.addEventListener("change",Ca),(r=e.querySelector("#btn-reset"))==null||r.addEventListener("click",_a)}function Sa(){var t;const e=((t=document.getElementById("profile-name"))==null?void 0:t.value.trim())||"";f(a=>{a.profile.name=e}),Q(),p("Perfil guardado")}function xa(){var a;const e=(a=document.getElementById("currency-select"))==null?void 0:a.value,t=ce.find(s=>s.code===e);t&&(f(s=>{s.profile.currency={code:t.code,symbol:t.symbol,locale:t.locale}}),p("Moneda actualizada"))}function wa(){var i,o,c;const e=Number(((i=document.getElementById("dist-live"))==null?void 0:i.value)||0),t=Number(((o=document.getElementById("dist-debts"))==null?void 0:o.value)||0),a=Number(((c=document.getElementById("dist-save"))==null?void 0:c.value)||0),s=e+t+a,l=(r,d)=>{const u=document.getElementById(r);u&&(u.style.width=Math.max(0,d)+"%",u.textContent=d>8?d+"%":"")};l("dseg-live",e),l("dseg-debts",t),l("dseg-save",a);const n=document.getElementById("dist-sum");n&&(n.textContent=`Total: ${s}%`,n.className=`dist-sum ${s===100?"ok":"err"}`)}function La(){var s,l,n;const e=Number(((s=document.getElementById("dist-live"))==null?void 0:s.value)||0),t=Number(((l=document.getElementById("dist-debts"))==null?void 0:l.value)||0),a=Number(((n=document.getElementById("dist-save"))==null?void 0:n.value)||0);if(e+t+a!==100){p("Los porcentajes deben sumar exactamente 100 %","error");return}f(i=>{i.profile.distributionRule={live:e,debts:t,save:a}}),p("Regla de distribución guardada")}function xe(e){const t=e?g().incomeSourceTypes.find(s=>s.id===e):null,a=!!t;x({title:a?"Editar fuente":"Nueva fuente de ingreso"},(s,l)=>{s.innerHTML=`
      <div class="field-group">
        <label class="field-label" for="src-name">Nombre</label>
        <input class="field-input" type="text" id="src-name"
          placeholder="Ej: Sueldo, Freelance, Renta…"
          value="${D((t==null?void 0:t.name)||"")}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="src-cancel">Cancelar</button>
        <button class="btn btn-primary" id="src-save">${a?"Guardar cambios":"Agregar"}</button>
      </div>
    `;const n=s.querySelector("#src-name");n.focus(),s.querySelector("#src-cancel").addEventListener("click",l),s.querySelector("#src-save").addEventListener("click",()=>{const i=n.value.trim();if(!i){n.focus();return}a?(f(o=>{const c=o.incomeSourceTypes.findIndex(r=>r.id===e);c!==-1&&(o.incomeSourceTypes[c].name=i)}),p("Fuente actualizada")):(f(o=>{o.incomeSourceTypes.push({id:T(),name:i})}),p("Fuente agregada")),l(),Be()}),n.addEventListener("keydown",i=>{i.key==="Enter"&&s.querySelector("#src-save").click()})})}function ka(e){const t=g().incomeSourceTypes.find(a=>a.id===e);t&&L({title:"Eliminar fuente",message:`¿Eliminar "<strong>${D(t.name)}</strong>"?`,confirmLabel:"Eliminar",danger:!0}).then(a=>{a&&(f(s=>{s.incomeSourceTypes=s.incomeSourceTypes.filter(l=>l.id!==e)}),p("Fuente eliminada"),Be())})}function Be(){const e=document.getElementById("sources-list");e&&(e.innerHTML=De())}function we(e){const t=e?g().expenseCategories.find(l=>l.id===e):null,a=!!t;let s=(t==null?void 0:t.color)||W[0];x({title:a?"Editar categoría":"Nueva categoría"},(l,n)=>{l.innerHTML=`
      <div class="field-group">
        <label class="field-label" for="cat-name">Nombre</label>
        <input class="field-input" type="text" id="cat-name"
          placeholder="Ej: Vivienda, Salud, Ropa…"
          value="${D((t==null?void 0:t.name)||"")}" />
      </div>
      <div class="field-group">
        <label class="field-label" for="cat-icon">Ícono (emoji)</label>
        <input class="field-input" type="text" id="cat-icon"
          placeholder="📦" maxlength="4"
          value="${D((t==null?void 0:t.icon)||"")}" style="font-size:1.3rem;width:80px;" />
      </div>
      <div class="field-group">
        <label class="field-label">Color</label>
        <div class="color-grid" id="cat-color-grid">
          ${W.map(i=>`
            <button class="color-swatch${i===s?" selected":""}"
              style="background:${i}" data-color="${i}" title="${i}" type="button"></button>
          `).join("")}
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="cat-type">Tipo</label>
        <select class="field-input field-select" id="cat-type">
          <option value="fixed"    ${(t==null?void 0:t.type)==="fixed"?"selected":""}>Fijo</option>
          <option value="variable" ${!t||(t==null?void 0:t.type)==="variable"?"selected":""}>Variable</option>
          <option value="both"     ${(t==null?void 0:t.type)==="both"?"selected":""}>Ambos</option>
        </select>
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="cat-cancel">Cancelar</button>
        <button class="btn btn-primary" id="cat-save">${a?"Guardar cambios":"Agregar"}</button>
      </div>
    `,l.querySelector("#cat-color-grid").addEventListener("click",i=>{const o=i.target.closest(".color-swatch");o&&(s=o.dataset.color,l.querySelectorAll(".color-swatch").forEach(c=>c.classList.toggle("selected",c===o)))}),l.querySelector("#cat-cancel").addEventListener("click",n),l.querySelector("#cat-save").addEventListener("click",()=>{const i=l.querySelector("#cat-name").value.trim();if(!i){l.querySelector("#cat-name").focus();return}const o=l.querySelector("#cat-icon").value.trim()||"📦",c=l.querySelector("#cat-type").value;a?(f(r=>{const d=r.expenseCategories.find(u=>u.id===e);d&&Object.assign(d,{name:i,icon:o,color:s,type:c})}),p("Categoría actualizada")):(f(r=>{r.expenseCategories.push({id:T(),name:i,icon:o,color:s,type:c})}),p("Categoría agregada")),n(),ze()}),l.querySelector("#cat-name").focus()})}function Ma(e){const t=g().expenseCategories.find(a=>a.id===e);t&&L({title:"Eliminar categoría",message:`¿Eliminar "<strong>${D(t.name)}</strong>"?<br><span style="font-size:.85rem;color:var(--text-muted)">Los gastos con esta categoría quedarán sin categoría.</span>`,confirmLabel:"Eliminar",danger:!0}).then(a=>{a&&(f(s=>{s.expenseCategories=s.expenseCategories.filter(l=>l.id!==e)}),p("Categoría eliminada"),ze())})}function ze(){const e=document.getElementById("cats-list");e&&(e.innerHTML=Ne())}function qa(){const e=Ve(),t=new Blob([e],{type:"application/json"}),a=URL.createObjectURL(t),s=document.createElement("a"),l=new Date().toISOString().slice(0,10);s.href=a,s.download=`finanzas-backup-${l}.json`,s.click(),URL.revokeObjectURL(a),p("Datos exportados correctamente")}function Ca(e){var s;const t=(s=e.target.files)==null?void 0:s[0];if(!t)return;const a=new FileReader;a.onload=async l=>{if(!await L({title:"Importar datos",message:"Esto reemplazará <strong>todos</strong> tus datos actuales con el archivo seleccionado. ¿Continuar?",confirmLabel:"Importar",danger:!0})){e.target.value="";return}try{Ue(l.target.result),p("Datos importados correctamente"),he(),Q()}catch{p("El archivo no es válido o está dañado.","error")}e.target.value=""},a.readAsText(t)}async function _a(){await L({title:"Borrar todos los datos",message:"Se eliminarán <strong>todos</strong> tus registros: ingresos, gastos, deudas, negocios y más. Esta acción <strong>no se puede deshacer</strong>.",confirmLabel:"🗑 Borrar todo",danger:!0})&&(Ye(),p("Datos eliminados. La app fue reiniciada.","info"),he(),Q())}function D(e=""){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const Ia=new Set(["summary","savings","settings"]),pe=new Set;function Fe(e){switch(e){case"summary":ut();break;case"income":Et();break;case"expenses":Tt();break;case"debts":Nt();break;case"business":Zt();break;case"savings":ra();break;case"settings":he();break}}function Ta(e){(Ia.has(e)||!pe.has(e))&&(Fe(e),pe.add(e))}function Aa(){Re(Ta),Fe("summary"),pe.add("summary"),Q(),Je(()=>{Q(),Y("settings")})}Aa();
