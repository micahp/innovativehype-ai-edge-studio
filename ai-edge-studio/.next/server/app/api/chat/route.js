"use strict";(()=>{var e={};e.id=744,e.ids=[744],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},2667:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>p,patchFetch:()=>m,requestAsyncStorage:()=>u,routeModule:()=>l,serverHooks:()=>E,staticGenerationAsyncStorage:()=>T});var n={};r.r(n),r.d(n,{POST:()=>d});var a=r(9303),o=r(8716),s=r(670),i=r(6176);async function*c(e,t,r){let n=[{role:"system",content:"You are a helpful, creative, and knowledgeable AI assistant running locally on the user's machine. Be concise and direct."},...(0,i._U)(e).map(e=>({role:e.role,content:e.content})),{role:"user",content:t}],a=await fetch(`${r.endpoint}/v1/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:r.model,messages:n,temperature:r.temperature,max_tokens:r.max_tokens,stream:!0})});if(!a.ok){let e=await a.text();throw Error(`LLM API error (${a.status}): ${e}`)}let o=a.body?.getReader();if(!o)throw Error("No response body");let s=new TextDecoder,c="";for(;;){let{done:e,value:t}=await o.read();if(e)break;let r=(c+=s.decode(t,{stream:!0})).split("\n");for(let e of(c=r.pop()||"",r)){let t=e.trim();if(!t||!t.startsWith("data: "))continue;let r=t.slice(6);if("[DONE]"===r)return;try{let e=JSON.parse(r),t=e.choices?.[0]?.delta?.content;t&&(yield t)}catch{}}}}async function d(e){try{let{conversationId:t,message:n,config:a}=await e.json();if(!n)return Response.json({error:"message required"},{status:400});let o=t||(0,i.Xw)().id,s=a||{endpoint:process.env.LLM_ENDPOINT||"http://localhost:8080",model:process.env.LLM_MODEL||"gemma-2-2b-it",temperature:.7,max_tokens:2048};if((0,i.Hz)(o,"user",n),!t){let{updateConversationTitle:e}=await Promise.resolve().then(r.bind(r,6176)),t=n.slice(0,80)+(n.length>80?"...":"");e(o,t)}let d=new TextEncoder,l=new ReadableStream({async start(e){let t="";try{for await(let r of(e.enqueue(d.encode(`data: ${JSON.stringify({conversationId:o})}

`)),c(o,n,s)))t+=r,e.enqueue(d.encode(`data: ${JSON.stringify({token:r})}

`));(0,i.Hz)(o,"assistant",t),e.enqueue(d.encode("data: [DONE]\n\n")),e.close()}catch(r){t&&(0,i.Hz)(o,"assistant",t),e.enqueue(d.encode(`data: ${JSON.stringify({error:r.message})}

`)),e.close()}}});return new Response(l,{headers:{"Content-Type":"text/event-stream","Cache-Control":"no-cache",Connection:"keep-alive"}})}catch(e){return Response.json({error:e.message},{status:500})}}let l=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"/Users/micah/.hermes/kanban/workspaces/t_0673b3d4/ai-edge-studio/src/app/api/chat/route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:u,staticGenerationAsyncStorage:T,serverHooks:E}=l,p="/api/chat/route";function m(){return(0,s.patchFetch)({serverHooks:E,staticGenerationAsyncStorage:T})}},9303:(e,t,r)=>{e.exports=r(517)},5998:(e,t,r)=>{r.d(t,{Z:()=>d});let n=require("node:crypto");var a=r.n(n);let o={randomUUID:a().randomUUID},s=new Uint8Array(256),i=s.length,c=[];for(let e=0;e<256;++e)c.push((e+256).toString(16).slice(1));let d=function(e,t,r){if(o.randomUUID&&!t&&!e)return o.randomUUID();let n=(e=e||{}).random||(e.rng||function(){return i>s.length-16&&(a().randomFillSync(s),i=0),s.slice(i,i+=16)})();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,t){r=r||0;for(let e=0;e<16;++e)t[r+e]=n[e];return t}return function(e,t=0){return(c[e[t+0]]+c[e[t+1]]+c[e[t+2]]+c[e[t+3]]+"-"+c[e[t+4]]+c[e[t+5]]+"-"+c[e[t+6]]+c[e[t+7]]+"-"+c[e[t+8]]+c[e[t+9]]+"-"+c[e[t+10]]+c[e[t+11]]+c[e[t+12]]+c[e[t+13]]+c[e[t+14]]+c[e[t+15]]).toLowerCase()}(n)}},6176:(e,t,r)=>{r.d(t,{Gl:()=>i,Hz:()=>l,SJ:()=>d,Xw:()=>o,_U:()=>u,cc:()=>s,updateConversationTitle:()=>c});var n=r(5998),a=r(4304);function o(e,t){let r=(0,a.z)(),o=(0,n.Z)();return r.prepare("INSERT INTO conversations (id, title, model) VALUES (?, ?, ?)").run(o,e||"New Chat",t||"llama.cpp"),s(o)}function s(e){return(0,a.z)().prepare("SELECT * FROM conversations WHERE id = ?").get(e)}function i(){return(0,a.z)().prepare("SELECT * FROM conversations ORDER BY updated_at DESC").all()}function c(e,t){(0,a.z)().prepare("UPDATE conversations SET title = ?, updated_at = datetime('now') WHERE id = ?").run(t,e)}function d(e){(0,a.z)().prepare("DELETE FROM conversations WHERE id = ?").run(e)}function l(e,t,r){let o=(0,a.z)(),s=(0,n.Z)();return o.prepare("INSERT INTO messages (id, conversation_id, role, content) VALUES (?, ?, ?, ?)").run(s,e,t,r),o.prepare("UPDATE conversations SET updated_at = datetime('now') WHERE id = ?").run(e),{id:s,conversation_id:e,role:t,content:r,created_at:new Date().toISOString()}}function u(e){return(0,a.z)().prepare("SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC").all(e)}},4304:(e,t,r)=>{r.d(t,{z:()=>d});let n=require("better-sqlite3");var a=r.n(n),o=r(5315),s=r.n(o);let i=s().join(process.cwd(),"data","studio.db"),c=null;function d(){if(!c){let e=r(2048),t=s().dirname(i);e.existsSync(t)||e.mkdirSync(t,{recursive:!0}),(c=new(a())(i)).pragma("journal_mode = WAL"),c.pragma("foreign_keys = ON"),function(e){e.exec(`
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
  `)}(c)}return c}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[948],()=>r(2667));module.exports=n})();