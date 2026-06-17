"use strict";(()=>{var e={};e.id=166,e.ids=[166],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},6579:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>g,patchFetch:()=>f,requestAsyncStorage:()=>E,routeModule:()=>c,serverHooks:()=>L,staticGenerationAsyncStorage:()=>m});var a={};r.r(a),r.d(a,{GET:()=>p,POST:()=>T});var n=r(9303),s=r(8716),o=r(670),i=r(5998),l=r(4304);let d=process.env.HF_TOKEN||"",u={"flux-schnell":"black-forest-labs/FLUX.1-schnell","flux-dev":"black-forest-labs/FLUX.1-dev","sd-xl":"stabilityai/stable-diffusion-xl-base-1.0","sd-3.5":"stabilityai/stable-diffusion-3.5-large"};async function T(e){try{let{prompt:t,model:r,type:a}=await e.json();if(!t)return Response.json({error:"prompt required"},{status:400});let n=u[r]||u["flux-schnell"],s=a||"image",o=(0,i.Z)(),T=(0,l.z)();T.prepare("INSERT INTO media_generations (id, prompt, model, type, status) VALUES (?, ?, ?, ?, ?)").run(o,t,n,s,"running");let p=null,c=null;try{if("image"===s){let e=await fetch(`https://api-inference.huggingface.co/models/${n}`,{method:"POST",headers:{Authorization:`Bearer ${d}`,"Content-Type":"application/json"},body:JSON.stringify({inputs:t})});if(!e.ok){let t=await e.text();throw Error(`HF API error (${e.status}): ${t}`)}if((e.headers.get("content-type")||"").includes("application/json")){let t=await e.json();c=Array.isArray(t)&&t[0]?.generated_text?`Model returned text, not image: ${t[0].generated_text.slice(0,200)}`:"Unexpected JSON response"}else{let t=await e.arrayBuffer(),r=Buffer.from(t).toString("base64");p=`data:image/png;base64,${r}`}}else c="Video generation not yet implemented via HF. Use local ComfyUI or Replicate."}catch(e){c=e.message}let E=p?"done":"error";return T.prepare("UPDATE media_generations SET status = ?, result_url = ?, error = ? WHERE id = ?").run(E,p,c,o),Response.json({id:o,prompt:t,model:n,type:s,status:E,result_url:p,error:c})}catch(e){return Response.json({error:e.message},{status:500})}}async function p(){try{let e=(0,l.z)().prepare("SELECT * FROM media_generations ORDER BY created_at DESC LIMIT 50").all();return Response.json(e)}catch(e){return Response.json({error:e.message},{status:500})}}let c=new n.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/media/route",pathname:"/api/media",filename:"route",bundlePath:"app/api/media/route"},resolvedPagePath:"/Users/micah/.hermes/kanban/workspaces/t_0673b3d4/ai-edge-studio/src/app/api/media/route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:E,staticGenerationAsyncStorage:m,serverHooks:L}=c,g="/api/media/route";function f(){return(0,o.patchFetch)({serverHooks:L,staticGenerationAsyncStorage:m})}},9303:(e,t,r)=>{e.exports=r(517)},5998:(e,t,r)=>{r.d(t,{Z:()=>d});let a=require("node:crypto");var n=r.n(a);let s={randomUUID:n().randomUUID},o=new Uint8Array(256),i=o.length,l=[];for(let e=0;e<256;++e)l.push((e+256).toString(16).slice(1));let d=function(e,t,r){if(s.randomUUID&&!t&&!e)return s.randomUUID();let a=(e=e||{}).random||(e.rng||function(){return i>o.length-16&&(n().randomFillSync(o),i=0),o.slice(i,i+=16)})();if(a[6]=15&a[6]|64,a[8]=63&a[8]|128,t){r=r||0;for(let e=0;e<16;++e)t[r+e]=a[e];return t}return function(e,t=0){return(l[e[t+0]]+l[e[t+1]]+l[e[t+2]]+l[e[t+3]]+"-"+l[e[t+4]]+l[e[t+5]]+"-"+l[e[t+6]]+l[e[t+7]]+"-"+l[e[t+8]]+l[e[t+9]]+"-"+l[e[t+10]]+l[e[t+11]]+l[e[t+12]]+l[e[t+13]]+l[e[t+14]]+l[e[t+15]]).toLowerCase()}(a)}},4304:(e,t,r)=>{r.d(t,{z:()=>d});let a=require("better-sqlite3");var n=r.n(a),s=r(5315),o=r.n(s);let i=o().join(process.cwd(),"data","studio.db"),l=null;function d(){if(!l){let e=r(2048),t=o().dirname(i);e.existsSync(t)||e.mkdirSync(t,{recursive:!0}),(l=new(n())(i)).pragma("journal_mode = WAL"),l.pragma("foreign_keys = ON"),function(e){e.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT 'New Chat',
      model TEXT NOT NULL DEFAULT 'llama.cpp',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, created_at);

    CREATE TABLE IF NOT EXISTS media_generations (
      id TEXT PRIMARY KEY,
      prompt TEXT NOT NULL,
      model TEXT NOT NULL DEFAULT 'black-forest-labs/FLUX.1-schnell',
      type TEXT NOT NULL DEFAULT 'image',
      status TEXT NOT NULL DEFAULT 'pending',
      result_url TEXT,
      error TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)}(l)}return l}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[948],()=>r(6579));module.exports=a})();