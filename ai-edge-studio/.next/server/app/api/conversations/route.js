"use strict";(()=>{var e={};e.id=3,e.ids=[3],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},1751:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>L,patchFetch:()=>m,requestAsyncStorage:()=>c,routeModule:()=>d,serverHooks:()=>l,staticGenerationAsyncStorage:()=>p});var n={};r.r(n),r.d(n,{DELETE:()=>E,GET:()=>u,PATCH:()=>T});var s=r(9303),o=r(8716),a=r(670),i=r(6176);async function u(e){try{let{searchParams:t}=new URL(e.url),r=t.get("id");if(r){let e=(0,i.cc)(r);if(!e)return Response.json({error:"Not found"},{status:404});let t=(0,i._U)(r);return Response.json({...e,messages:t})}let n=(0,i.Gl)();return Response.json(n)}catch(e){return Response.json({error:e.message},{status:500})}}async function T(e){try{let{id:t,title:r}=await e.json();if(!t)return Response.json({error:"id required"},{status:400});return(0,i.updateConversationTitle)(t,r),Response.json({success:!0})}catch(e){return Response.json({error:e.message},{status:500})}}async function E(e){try{let{searchParams:t}=new URL(e.url),r=t.get("id");if(!r)return Response.json({error:"id required"},{status:400});return(0,i.SJ)(r),Response.json({success:!0})}catch(e){return Response.json({error:e.message},{status:500})}}let d=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/conversations/route",pathname:"/api/conversations",filename:"route",bundlePath:"app/api/conversations/route"},resolvedPagePath:"/Users/micah/.hermes/kanban/workspaces/t_0673b3d4/ai-edge-studio/src/app/api/conversations/route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:c,staticGenerationAsyncStorage:p,serverHooks:l}=d,L="/api/conversations/route";function m(){return(0,a.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:p})}},9303:(e,t,r)=>{e.exports=r(517)},5998:(e,t,r)=>{r.d(t,{Z:()=>T});let n=require("node:crypto");var s=r.n(n);let o={randomUUID:s().randomUUID},a=new Uint8Array(256),i=a.length,u=[];for(let e=0;e<256;++e)u.push((e+256).toString(16).slice(1));let T=function(e,t,r){if(o.randomUUID&&!t&&!e)return o.randomUUID();let n=(e=e||{}).random||(e.rng||function(){return i>a.length-16&&(s().randomFillSync(a),i=0),a.slice(i,i+=16)})();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,t){r=r||0;for(let e=0;e<16;++e)t[r+e]=n[e];return t}return function(e,t=0){return(u[e[t+0]]+u[e[t+1]]+u[e[t+2]]+u[e[t+3]]+"-"+u[e[t+4]]+u[e[t+5]]+"-"+u[e[t+6]]+u[e[t+7]]+"-"+u[e[t+8]]+u[e[t+9]]+"-"+u[e[t+10]]+u[e[t+11]]+u[e[t+12]]+u[e[t+13]]+u[e[t+14]]+u[e[t+15]]).toLowerCase()}(n)}},6176:(e,t,r)=>{r.d(t,{Gl:()=>i,Hz:()=>E,SJ:()=>T,Xw:()=>o,_U:()=>d,cc:()=>a,updateConversationTitle:()=>u});var n=r(5998),s=r(4304);function o(e,t){let r=(0,s.z)(),o=(0,n.Z)();return r.prepare("INSERT INTO conversations (id, title, model) VALUES (?, ?, ?)").run(o,e||"New Chat",t||"llama.cpp"),a(o)}function a(e){return(0,s.z)().prepare("SELECT * FROM conversations WHERE id = ?").get(e)}function i(){return(0,s.z)().prepare("SELECT * FROM conversations ORDER BY updated_at DESC").all()}function u(e,t){(0,s.z)().prepare("UPDATE conversations SET title = ?, updated_at = datetime('now') WHERE id = ?").run(t,e)}function T(e){(0,s.z)().prepare("DELETE FROM conversations WHERE id = ?").run(e)}function E(e,t,r){let o=(0,s.z)(),a=(0,n.Z)();return o.prepare("INSERT INTO messages (id, conversation_id, role, content) VALUES (?, ?, ?, ?)").run(a,e,t,r),o.prepare("UPDATE conversations SET updated_at = datetime('now') WHERE id = ?").run(e),{id:a,conversation_id:e,role:t,content:r,created_at:new Date().toISOString()}}function d(e){return(0,s.z)().prepare("SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC").all(e)}},4304:(e,t,r)=>{r.d(t,{z:()=>T});let n=require("better-sqlite3");var s=r.n(n),o=r(5315),a=r.n(o);let i=a().join(process.cwd(),"data","studio.db"),u=null;function T(){if(!u){let e=r(2048),t=a().dirname(i);e.existsSync(t)||e.mkdirSync(t,{recursive:!0}),(u=new(s())(i)).pragma("journal_mode = WAL"),u.pragma("foreign_keys = ON"),function(e){e.exec(`
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
  `)}(u)}return u}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[948],()=>r(1751));module.exports=n})();