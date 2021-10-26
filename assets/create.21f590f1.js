import{o as a,c,a as r,d as M,z as L,p as F,u as H,g as w,w as d,b as t,f as n,B as V,j as z,O as T,h as b,i as j,F as D,e as v,P as B,k as O,t as Y,Q as P,r as U,N as Q,E as G,_ as J}from"./vendor.51bd39f7.js";import{a as K,b as W,d as X,u as Z,c as I,r as ee,s as ne,e as te,f as oe}from"./index.b883bb65.js";const ue={width:"1.2em",height:"1.2em",preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 24 24"},se=r("path",{d:"M10 11H7.101l.001-.009a4.956 4.956 0 0 1 .752-1.787a5.054 5.054 0 0 1 2.2-1.811c.302-.128.617-.226.938-.291a5.078 5.078 0 0 1 2.018 0a4.978 4.978 0 0 1 2.525 1.361l1.416-1.412a7.036 7.036 0 0 0-2.224-1.501a6.921 6.921 0 0 0-1.315-.408a7.079 7.079 0 0 0-2.819 0a6.94 6.94 0 0 0-1.316.409a7.04 7.04 0 0 0-3.08 2.534a6.978 6.978 0 0 0-1.054 2.505c-.028.135-.043.273-.063.41H2l4 4l4-4zm4 2h2.899l-.001.008a4.976 4.976 0 0 1-2.103 3.138a4.943 4.943 0 0 1-1.787.752a5.073 5.073 0 0 1-2.017 0a4.956 4.956 0 0 1-1.787-.752a5.072 5.072 0 0 1-.74-.61L7.05 16.95a7.032 7.032 0 0 0 2.225 1.5c.424.18.867.317 1.315.408a7.07 7.07 0 0 0 2.818 0a7.031 7.031 0 0 0 4.395-2.945a6.974 6.974 0 0 0 1.053-2.503c.027-.135.043-.273.063-.41H22l-4-4l-4 4z",fill:"currentColor"},null,-1),le=[se];function de(u,s){return a(),c("svg",ue,le)}var ae={name:"bx-bx-refresh",render:de};const ie={width:"1.2em",height:"1.2em",preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 24 24"},_e=r("path",{d:"M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z",fill:"currentColor"},null,-1),ce=r("path",{d:"M9 10h2v8H9zm4 0h2v8h-2z",fill:"currentColor"},null,-1),re=[_e,ce];function pe(u,s){return a(),c("svg",ie,re)}var S={name:"bx-bx-trash",render:pe};const he={width:"1.2em",height:"1.2em",preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 24 24"},me=r("path",{d:"M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z",fill:"currentColor"},null,-1),fe=[me];function ve(u,s){return a(),c("svg",he,fe)}var xe={name:"bx-bx-plus",render:ve};const ye=M({props:{node:{required:!0,type:Object},when:{required:!1,type:Boolean}},emits:["update:node"],setup(u,{emit:s}){const p=u,e=L(!1),$=F(()=>{var i;return((i=p.node)==null?void 0:i.creator)?[{label:"\u0412\u0430\u0440\u0438\u0430\u043D\u0442 \u043E\u0442\u0432\u0435\u0442\u0430",key:"option"}]:[{label:"\u0412\u0430\u0440\u0438\u0430\u043D\u0442 \u043E\u0442\u0432\u0435\u0442\u0430",key:"option"},{label:"\u0412\u043E\u043F\u0440\u043E\u0441",key:"node"}]}),l=H(p,"node",s),h=i=>{l.value.options&&(i==="option"?K(l.value,p.when):i==="node"&&W(l.value,p.when),e.value=!1)};return(i,o)=>{const f=xe,x=V,y=z,_=T;return a(),w(_,{trigger:"click",options:n($),onSelect:h},{default:d(()=>[t(y,{type:"primary",onClick:o[0]||(o[0]=k=>e.value=!0)},{icon:d(()=>[t(x,null,{default:d(()=>[t(f)]),_:1})]),_:1})]),_:1},8,["options"])}}}),be={key:0,class:"flex"},$e={class:"w-full"},ge=v(" \u0414\u0430 "),we=v(" \u041D\u0435\u0442 "),ke=M({props:{node:{required:!0,type:Object},option:{required:!0,type:Object}},emits:["update:option","delete:option","delete:node"],setup(u,{emit:s}){const e=H(u,"option",s);return($,l)=>{const h=z,i=B,o=S,f=V,x=O,y=q;return a(),c(D,null,[u.option.type==="option"?(a(),c("div",be,[r("div",$e,[t(x,null,{default:d(()=>[t(h,{dashed:"",type:n(e).when?"info":"default",onClick:l[0]||(l[0]=_=>n(e).when=!0)},{default:d(()=>[ge]),_:1},8,["type"]),t(h,{dashed:"",type:n(e).when?"default":"info",onClick:l[1]||(l[1]=_=>n(e).when=!1)},{default:d(()=>[we]),_:1},8,["type"]),t(i,{value:n(e).title,"onUpdate:value":l[2]||(l[2]=_=>n(e).title=_),type:"text",placeholder:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043E\u043F\u0446\u0438\u044E"},null,8,["value"]),t(h,{ghost:"",onClick:l[3]||(l[3]=_=>s("delete:option",u.option))},{icon:d(()=>[t(f,null,{default:d(()=>[t(o)]),_:1})]),_:1})]),_:1})])])):b("",!0),u.option.type==="node"?(a(),w(y,{key:1,node:n(e),"onUpdate:node":l[4]||(l[4]=_=>j(e)?e.value=_:null),parent:u.node,"onDelete:node":l[5]||(l[5]=_=>s("delete:node",n(e),u.node))},null,8,["node","parent"])):b("",!0)],64)}}});const Ce={class:"ec-node rounded-lg"},Me={key:0,class:"bg-gray-100 text-gray-700 font-bold px-4 py-1 select-none rounded-md grid place-items-center"},ze=v(" \u0414\u0430 "),De=v(" \u041D\u0435\u0442 "),Ee=r("div",{class:"flex justify-center"},[r("div",{class:"w-0.5 h-full bg-gray-200"})],-1),Ne={key:1,class:"space-y-2 mt-2 pb-4"},q=M({props:{node:{required:!0,type:Object},parent:{required:!1,type:Object,default:null},isFirst:{required:!1,type:Boolean}},emits:["update:node","delete:node"],setup(u,{emit:s}){const p=u,e=H(p,"node",s),$=F(()=>e.value.creator?`${e.value.creator}.${e.value.id}`:e.value.id),l=i=>{e.value.options=X(p.node,i)},h=(i,o)=>{s("delete:node",i,o)};return(i,o)=>{const f=z,x=B,y=S,_=V,k=ye,E=O,N=ke;return a(),c("div",Ce,[u.isFirst?(a(),c("div",Me,Y(n($)),1)):b("",!0),r("div",{class:P(["w-full",{"col-span-2":!u.isFirst}])},[t(E,null,{default:d(()=>[u.isFirst?b("",!0):(a(),c(D,{key:0},[t(f,{dashed:"",type:n(e).when?"info":"default",onClick:o[0]||(o[0]=m=>n(e).when=!0)},{default:d(()=>[ze]),_:1},8,["type"]),t(f,{dashed:"",type:n(e).when?"default":"info",onClick:o[1]||(o[1]=m=>n(e).when=!1)},{default:d(()=>[De]),_:1},8,["type"])],64)),t(x,{value:n(e).title,"onUpdate:value":o[2]||(o[2]=m=>n(e).title=m),type:"text",placeholder:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0432\u043E\u043F\u0440\u043E\u0441"},null,8,["value"]),t(f,{ghost:"",onClick:o[3]||(o[3]=m=>h(n(e),u.parent))},{icon:d(()=>[t(_,null,{default:d(()=>[t(y)]),_:1})]),_:1}),t(k,{node:n(e),"onUpdate:node":o[4]||(o[4]=m=>j(e)?e.value=m:null),when:!0},null,8,["node"])]),_:1})],2),Ee,n(e).options?(a(),c("div",Ne,[(a(!0),c(D,null,U(u.node.options,(m,g)=>(a(),w(N,{key:m._id,option:n(e).options[g],"onUpdate:option":C=>n(e).options[g]=C,node:u.node,"onDelete:option":l,"onDelete:node":h},null,8,["option","onUpdate:option","node"]))),128))])):b("",!0)])}}}),He={width:"1.2em",height:"1.2em",preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 24 24"},Ve=r("path",{d:"M5 21h14a2 2 0 0 0 2-2V8a1 1 0 0 0-.29-.71l-4-4A1 1 0 0 0 16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zm10-2H9v-5h6zM13 7h-2V5h2zM5 5h2v4h8V5h.59L19 8.41V19h-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5H5z",fill:"currentColor"},null,-1),Be=[Ve];function Fe(u,s){return a(),c("svg",He,Be)}var je={name:"bx-bx-save",render:Fe},A={};const Oe={class:"w-[980px] px-6 py-8"},Ue={class:"flex justify-between items-center"},Se=v(" \u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0441\u0445\u0435\u043C\u044B "),qe=v(" \u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C "),Ae={class:"mt-6"},Re={class:"mt-4"},Le={class:"flex space-x-4"},Te=v(" \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432\u043E\u043F\u0440\u043E\u0441 "),Ye=v("\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0441\u0445\u0435\u043C\u0443"),Pe=v(" \u0421\u043A\u0430\u0447\u0430\u0442\u044C \u0441\u0445\u0435\u043C\u0443 "),Qe=M({setup(u){const{schema:s}=Z(),p=(i,o)=>oe(i,o),e=()=>I(s.nodes),$=()=>ee(),l=()=>ne(),h=({file:i})=>te(i);return(i,o)=>{const f=J,x=Q,y=ae,_=z,k=B,E=q,N=G,m=je;return a(),c("div",Oe,[r("div",Ue,[t(x,{prefix:"bar",class:"mb-0"},{default:d(()=>[t(f,{type:"primary"},{default:d(()=>[Se]),_:1})]),_:1}),t(_,{dashed:"",onClick:$},{default:d(()=>[qe,t(y,{class:"ml-2"})]),_:1})]),r("div",Ae,[t(k,{value:n(s).name,"onUpdate:value":o[0]||(o[0]=g=>n(s).name=g),type:"text",placeholder:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",size:"large"},null,8,["value"]),r("div",Re,[(a(!0),c(D,null,U(n(s).nodes,(g,C)=>(a(),w(E,{key:g._id,node:n(s).nodes[C],"onUpdate:node":R=>n(s).nodes[C]=R,parent:null,"is-first":"","onDelete:node":p},null,8,["node","onUpdate:node"]))),128))]),r("div",Le,[t(_,{dashed:"",type:"info",onClick:e},{default:d(()=>[Te]),_:1}),n(s).nodes.length?b("",!0):(a(),w(N,{key:0,accept:"application/json","show-file-list":!1,"on-change":h},{default:d(()=>[t(_,{dashed:"",type:"default"},{default:d(()=>[Ye]),_:1})]),_:1}))]),n(s).nodes.length?(a(),w(_,{key:0,class:"mt-4",block:"",dashed:"",type:"success",onClick:l},{default:d(()=>[t(m),Pe]),_:1})):b("",!0)])])}}});typeof A=="function"&&A(Qe);export{Qe as default};