(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{141:function(e,t,a){e.exports={header:"Controller_header__3vMNd"}},142:function(e,t,a){e.exports=a(306)},147:function(e,t,a){},306:function(e,t,a){"use strict";a.r(t);var n,c,r=a(1),l=a.n(r),s=a(33),u=a.n(s),i=(a(147),a(149),a(14)),o=a(309),m=a(304),d=a(303),_=a(307),E=a(302),f=a(301),p=a(11),b=a.n(p),S=a(18),T=a.n(S);!function(e){e.SET_URL="SET_URL",e.SET_PID="SET_PID",e.SET_MID="SET_MID",e.SET_MILESTONES="SET_MILESTONES",e.SET_CUSTOM_EID="SET_CUSTOM_EID",e.SET_CUSTOM_RID="SET_CUSTOM_RID",e.SET_CUSTOM_ATTRS="SET_CUSTOM_ATTRS",e.SET_BIZ_DAYS="SET_BIZ_DAYS",e.ADD_BIZ_DAY="ADD_BIZ_DAY",e.REMOVE_BIZ_DAY="REMOVE_BIZ_DAY",e.SET_TASKS="SET_TASKS",e.SET_TASK_STATUS="SET_TASK_STATUS",e.SET_CUSTOM_VALUE_MAP="SET_CUSTOM_VALUE_MAP",e.SET_REJECT_TASK_STATUS_IDS="SET_REJECT_TASK_STATUS_IDS",e.ADD_REJECT_TASK_STATUS_ID="ADD_REJECT_TASK_STATUS",e.REMOVE_REJECT_TASK_STATUS_ID="REMOVE_REJECT_TASK_STATUS",e.OPEN_CONTROLLER="OPEN_CONTROLLER",e.CLOSE_CONTROLLER="CLOSE_CONTROLLER",e.UPDATE_DATA="UPDATE_DATA"}(n||(n={})),function(e){e.URL="taiga_url",e.PID="taiga_pid",e.MID="taiga_mid",e.CUSTOM_EID="taiga_custom_eid",e.CUSTOM_RID="taiga_custom_rid",e.BIZ_DAYS="taiga_biz_days",e.REJECT_TASK_STATUS_IDS="reject_task_status_ids"}(c||(c={}));var O=function(e){return localStorage.getItem(e)||""},j=function(e,t){return t?O("".concat(t,"/").concat(e)):""},v=function(e,t){localStorage.setItem(e,t)},k=function(e,t,a){t&&v("".concat(t,"/").concat(e),a)},y=function(){var e=O(c.URL),t=O(c.PID),a=O(c.MID),n=j(c.CUSTOM_EID,t),r=j(c.CUSTOM_RID,t),l=j(c.BIZ_DAYS,a),s=b.a.compact(l.split(",")).sort(),u=b.a.compact(j(c.REJECT_TASK_STATUS_IDS,t).split(",")),i=!(e&&t&&a&&n&&r);return{url:e,pid:t,mid:a,custom_eid:n,custom_rid:r,custom_attrs:[],biz_days:s,milestones:[],tasks:[],task_status:[],custom_value_map:new WeakMap,reject_task_status_ids:u,updated_time:0,isOpen:i}},g=a(43),C=a(16),h=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:y(),t=arguments.length>1?arguments[1]:void 0;switch(t.type){case n.SET_URL:var a=t.payload.url;return v(c.URL,a),Object(C.a)({},e,{url:a});case n.SET_PID:var r=t.payload.pid;return v(c.PID,r),Object(C.a)({},e,{pid:r,mid:"",custom_eid:j(c.CUSTOM_EID,r),custom_rid:j(c.CUSTOM_RID,r),custom_attrs:[],milestones:[],custom_value_map:new WeakMap});case n.SET_MID:var l=t.payload.mid;return v(c.MID,l),Object(C.a)({},e,{mid:l,tasks:[],biz_days:b.a.compact(j(c.BIZ_DAYS,l).split(",")).sort()});case n.SET_MILESTONES:var s=t.payload.milestones;return Object(C.a)({},e,{milestones:s});case n.SET_CUSTOM_EID:var u=t.payload.custom_eid;return k(c.CUSTOM_EID,e.pid,u),Object(C.a)({},e,{custom_eid:u});case n.SET_CUSTOM_ATTRS:var i=t.payload.custom_attrs;return Object(C.a)({},e,{custom_attrs:i});case n.SET_CUSTOM_RID:var o=t.payload.custom_rid;return k(c.CUSTOM_RID,e.pid,o),Object(C.a)({},e,{custom_rid:o});case n.SET_BIZ_DAYS:var m=t.payload.biz_days;return k(c.BIZ_DAYS,e.mid,m.join(",")),Object(C.a)({},e,{biz_days:m});case n.ADD_BIZ_DAY:var d=t.payload.biz_day,_=b.a.chain(Object(g.a)(e.biz_days).concat([d])).uniq().sort().value();return k(c.BIZ_DAYS,e.mid,_.join(",")),Object(C.a)({},e,{biz_days:_});case n.REMOVE_BIZ_DAY:var E=t.payload.biz_day,f=b.a.reject(Object(g.a)(e.biz_days),function(e){return e===E});return k(c.BIZ_DAYS,e.mid,f.join(",")),Object(C.a)({},e,{biz_days:f});case n.SET_TASKS:var p=t.payload.tasks;return Object(C.a)({},e,{tasks:p});case n.SET_TASK_STATUS:var S=t.payload.task_status;return Object(C.a)({},e,{task_status:S});case n.SET_CUSTOM_VALUE_MAP:var T=t.payload.custom_value_map;return Object(C.a)({},e,{custom_value_map:T});case n.SET_REJECT_TASK_STATUS_IDS:var O=t.payload.reject_task_status_ids;return k(c.REJECT_TASK_STATUS_IDS,e.pid,O.join(",")),Object(C.a)({},e,{reject_task_status_ids:O});case n.ADD_REJECT_TASK_STATUS_ID:var h=t.payload.reject_task_status_id,D=b.a.chain(Object(g.a)(e.reject_task_status_ids).concat([h])).compact().uniq().value();return k(c.REJECT_TASK_STATUS_IDS,e.pid,D.join(",")),Object(C.a)({},e,{reject_task_status_ids:D});case n.REMOVE_REJECT_TASK_STATUS_ID:var A=t.payload.reject_task_status_id,I=b.a.reject(Object(g.a)(e.reject_task_status_ids),function(e){return e===A});return k(c.REJECT_TASK_STATUS_IDS,e.pid,I.join(",")),Object(C.a)({},e,{reject_task_status_ids:I});case n.OPEN_CONTROLLER:return Object(C.a)({},e,{isOpen:!0});case n.CLOSE_CONTROLLER:return Object(C.a)({},e,{isOpen:!1});case n.UPDATE_DATA:return Object(C.a)({},e,{updated_time:Date.now()});default:return e}},D=function(e){return"".concat(e.replace(/[\xa5\/]$/,""),"/api/v1")},A=y(),I=Object(r.createContext)({state:A,setUrl:function(e){},setPid:function(e){},setMid:function(e){},setMilestones:function(e){},setCustomEid:function(e){},setCustomRid:function(e){},setCustomAttrs:function(e){},setBizDays:function(e){},addBizDay:function(e){},removeBizDay:function(e){},setTasks:function(e){},setTaskStatus:function(e){},setCustomValueMap:function(e){},toggeRejectTaskStatus:function(e,t){},openController:function(){},closeController:function(){},updateData:function(){}}),M=function(e){var t=e.children,a=Object(r.useReducer)(h,A),c=Object(i.a)(a,2),s=c[0],u=c[1],o={state:s,setUrl:Object(r.useCallback)(function(e){u({type:n.SET_URL,payload:{url:e}})},[u]),setPid:Object(r.useCallback)(function(e){u({type:n.SET_PID,payload:{pid:e}})},[u]),setMid:Object(r.useCallback)(function(e){u({type:n.SET_MID,payload:{mid:e}})},[u]),setMilestones:Object(r.useCallback)(function(e){u({type:n.SET_MILESTONES,payload:{milestones:e}})},[u]),setCustomEid:Object(r.useCallback)(function(e){u({type:n.SET_CUSTOM_EID,payload:{custom_eid:e}})},[u]),setCustomRid:Object(r.useCallback)(function(e){u({type:n.SET_CUSTOM_RID,payload:{custom_rid:e}})},[u]),setCustomAttrs:Object(r.useCallback)(function(e){u({type:n.SET_CUSTOM_ATTRS,payload:{custom_attrs:e}})},[u]),setBizDays:Object(r.useCallback)(function(e){u({type:n.SET_BIZ_DAYS,payload:{biz_days:e}})},[u]),addBizDay:Object(r.useCallback)(function(e){u({type:n.ADD_BIZ_DAY,payload:{biz_day:e}})},[u]),removeBizDay:Object(r.useCallback)(function(e){u({type:n.REMOVE_BIZ_DAY,payload:{biz_day:e}})},[u]),setTasks:Object(r.useCallback)(function(e){u({type:n.SET_TASKS,payload:{tasks:e}})},[u]),setTaskStatus:Object(r.useCallback)(function(e){u({type:n.SET_TASK_STATUS,payload:{task_status:e}})},[u]),setCustomValueMap:Object(r.useCallback)(function(e){u({type:n.SET_CUSTOM_VALUE_MAP,payload:{custom_value_map:e}})},[u]),toggeRejectTaskStatus:Object(r.useCallback)(function(e,t){var a=t?n.ADD_REJECT_TASK_STATUS_ID:n.REMOVE_REJECT_TASK_STATUS_ID;u({type:a,payload:{reject_task_status_id:e}})},[u]),openController:Object(r.useCallback)(function(){u({type:n.OPEN_CONTROLLER})},[u]),closeController:Object(r.useCallback)(function(){u({type:n.CLOSE_CONTROLLER})},[u]),updateData:Object(r.useCallback)(function(){u({type:n.UPDATE_DATA})},[u])};return l.a.createElement(I.Provider,{value:o},t)},R=a(3),U=a.n(R),N=a(8),x=a(74),w=a.n(x),L=function(e,t){return-1===t?"":0===t?"Planning":"Day ".concat(t)},z=function(e,t){return t.find(function(t){return String(t.id)===e})},B=function(e){return{"text-danger":0===e,"text-info":6===e}},Y=function(e){var t=e.item,a=e.biz_days,n=e.idx;if(!t)return l.a.createElement("td",null,l.a.createElement("br",null));var c=Object(r.useContext)(I),s=c.addBizDay,u=c.removeBizDay,i=t.format("YYYY-MM-DD"),o=Object(r.useCallback)(function(e){var t=e.target.value;e.target.checked?s(t):u(t)},[s,u]),m=i===a[0],d="biz-day-".concat(i);return l.a.createElement(l.a.Fragment,null,l.a.createElement("td",{className:U()(B(n),{"table-info":m}),id:d},w.a.isWeekDay(t)?l.a.createElement(N.h,{check:!0,inline:!0},l.a.createElement(N.m,{check:!0},l.a.createElement(N.i,{onChange:o,disabled:w.a.isWeekendDay(t),value:i,type:"checkbox",checked:b.a.includes(a,i),className:"form-check-input"}),i)):l.a.createElement("span",null,i)),b.a.includes(a,i)?l.a.createElement(N.s,{target:d},function(e,t){var a=t.indexOf(e);return L(0,a)}(i,a)):null)},P=function(){var e=Object(r.useContext)(I),t=e.state,a=t.mid,n=t.milestones,c=t.biz_days,s=e.setBizDays,u=Object(r.useState)([]),o=Object(i.a)(u,2),m=o[0],d=o[1];if(Object(r.useEffect)(function(){var e=z(a,n);if(e){var t=function(e){var t=T()(e.estimated_start).local(),a=T()(e.estimated_finish).local().diff(t,"days");return b.a.times(a).map(function(e){return t.clone().add(e,"days")})}(e);d(t),c.length<=1&&s(t.filter(function(e){return w.a.isWeekDay(e)}).map(function(e){return e.format("YYYY-MM-DD")}))}},[a,n,c]),0===m.length)return null;var _=b.a.chunk(Object(g.a)(b.a.times(m[0].day(),function(){return null})).concat(Object(g.a)(m)),7);return l.a.createElement(N.c,null,l.a.createElement(N.e,null,"Business Days"),l.a.createElement(N.r,{bordered:!0},l.a.createElement("thead",null,l.a.createElement("tr",null,T.a.weekdays().map(function(e,t){return l.a.createElement("th",{key:t,className:U()("text-center",B(t))},e)}))),l.a.createElement("tbody",null,_.map(function(e,t){return l.a.createElement("tr",{key:t},e.map(function(e,t){return l.a.createElement(Y,{idx:t,key:t,item:e,biz_days:c})}))}))))},K=a(17),J=a.n(K),V=a(23),Z=a(25),F=a.n(Z),W=a(31),q=a(22),$=a(54),G=a.n($),H=["success","warning","info","danger"],Q=function(e){return b.a.groupBy(e,"assigned_to")},X=function(e,t,a){return e.has(t)?(n=b.a.get(e.get(t),"attributes_values.".concat(a),"0"),b.a.chain(n).replace(/[^0-9.+,]/g,"").replace(/[+]/g,",").split(",").compact().map(Number).sum().value()):0;var n},ee=function(e){var t=e.username,a=e.val,n=e.total,c=e.imgSrc;if(!a)return l.a.createElement(l.a.Fragment,null,l.a.createElement("td",null,l.a.createElement("img",{className:G.a.avator,src:c})," ",t),l.a.createElement("td",null));var r,s,u=(a-n)/n;return u<-.1?(r=q.e,s=""):u<=.1?(s="table-success",r=q.e):u<=.2?(s="table-warning",r=q.f):(s="table-danger",r=q.b),l.a.createElement(l.a.Fragment,null,l.a.createElement("td",{className:s},l.a.createElement(W.a,{className:"mx-1",icon:r}),l.a.createElement("img",{className:G.a.avator,src:c})," ",t),l.a.createElement("td",{className:U()(s,"text-right")},a))},te=function(e){var t=function(e,t){if(b.a.isNumber(e)&&b.a.isNumber(t)&&e>0){var a=Math.abs(e-t)/e;if(a<=.05)return["gold",3];if(a<=.1)return["silver",2];if(a<.2)return["bronze",1]}return[null,0]}(e.e,e.r),a=Object(i.a)(t,2),n=a[0],c=a[1];return n?l.a.createElement(l.a.Fragment,null,b.a.times(c).map(function(e){return l.a.createElement(W.a,{key:e,className:G.a[n],icon:q.g})})):null},ae=function(e){var t=e.item,a=e.sums,n=e.isPast,c=e.total,s=e.hpd,u=e.closedTasks,o=Object(r.useContext)(I).state,m=o.custom_value_map,d=o.custom_eid,_=o.reject_task_status_ids,E=o.task_status,f=Object(r.useState)(0),p=Object(i.a)(f,2),S=p[0],T=p[1],O=Object(r.useState)([]),j=Object(i.a)(O,2),v=j[0],k=j[1],y=Object(r.useCallback)(function(e){T(Number(e.target.value)||0)},[T]),g=b.a.get(a,"".concat(t.id,".e")),h=b.a.get(a,"".concat(t.id,".r")),D=S||c,A=String(D),M=t.photo||"http://i.pravatar.cc/80?u=".concat(Math.random());return Object(r.useEffect)(function(){var e=b.a.chain(E).filter(function(e){return e.is_closed}).reject(function(e){return b.a.includes(_,String(e.id))}).orderBy("id").reverse().map(function(e){return e.id}).value(),t=b.a.chain(u).groupBy("status").mapValues(function(e){return b.a.reduce(e,function(e,t){return e.status=t.status,e.total+=X(m,t,Number(d)),e.label=t.status_extra_info.name,e},{status:0,total:0,label:"",style:""})}).value(),a=b.a.orderBy(t,"status").reverse().map(function(t){return Object(C.a)({},t,{style:H[e.indexOf(t.status)]})});k(a)},[k,d,m,u,E,_]),l.a.createElement("tr",{key:t.id},c>0?l.a.createElement(l.a.Fragment,null,l.a.createElement(ee,{username:t.username,val:g,total:D,imgSrc:M}),l.a.createElement("td",{className:"text-right"},c),l.a.createElement("td",{className:G.a.custom_input_td},l.a.createElement(N.i,{bsSize:"sm",type:"number",className:"text-right",value:A,step:s,onChange:y}))):l.a.createElement(l.a.Fragment,null,l.a.createElement("td",null,l.a.createElement("img",{className:G.a.avator,src:M})," ",t.username),l.a.createElement("td",{className:"text-right"},g),l.a.createElement("td",{className:"text-right"},h),l.a.createElement("td",null,b.a.isNumber(g)&&l.a.createElement(N.q,{multi:!0},v.map(function(e,t){return l.a.createElement(N.q,{bar:!0,key:t,value:e.total,color:e.style,max:g},e.label)})))),n?l.a.createElement("td",null,l.a.createElement(te,{e:g,r:h})):null)},ne=function(e,t){return e.find(function(e){return e.id===t})},ce=function(){var e=Object(r.useContext)(I),t=e.state,a=t.url,n=t.pid,c=t.tasks,s=t.custom_value_map,u=t.custom_attrs,o=t.custom_eid,m=t.custom_rid,d=t.biz_days,_=e.updateData,E=Object(r.useState)([]),f=Object(i.a)(E,2),p=f[0],S=f[1],O=Object(r.useState)(0),j=Object(i.a)(O,2),v=j[0],k=j[1],y=Object(r.useState)(0),g=Object(i.a)(y,2),C=g[0],h=g[1],A=d.length-1;Object(r.useEffect)(function(){a&&n&&Object(V.a)(J.a.mark(function e(){var t,c;return J.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.a.get("".concat(D(a),"/projects/").concat(n));case 2:t=e.sent,c=t.data.members,S(c);case 5:case"end":return e.stop()}},e,this)}))()},[a,n,S]);var M=Object(r.useCallback)(function(e){k(Number(e.target.value)||0)},[k]),R=Object(r.useCallback)(function(e){e.preventDefault(),e.stopPropagation()},[]);Object(r.useEffect)(function(){h(v*A)},[v,A,h]);var U=function(e,t,a,n){var c=Number(a),r=Number(n);return b.a.mapValues(Q(e),function(e){return b.a.chain(e).map(function(e){return{e:X(t,e,c),r:X(t,e,r)}}).reduce(function(e,t){return{e:e.e+t.e,r:e.r+t.r}},{e:0,r:0}).value()})}(c,s,o,m),x=ne(u,Number(o)),w=ne(u,Number(m));if(!x||!w||d.length<=1)return null;var L=b.a.get(U,"null.e",0),z=C>0,B=!z&&T()().diff(T()(b.a.last(d)).local().endOf("days"))>0,Y=Q(function(e){return e.filter(function(e){return e.is_closed})}(c));return l.a.createElement(l.a.Fragment,null,l.a.createElement(N.p,{color:"light",light:!0},l.a.createElement(N.g,{inline:!0,className:"mr-auto",onSubmit:R},l.a.createElement(N.j,null,l.a.createElement(N.i,{type:"number",step:"0.5",placeholder:"hours / day",className:"text-right",onChange:M}),l.a.createElement(N.k,{addonType:"append"},l.a.createElement(N.l,null,l.a.createElement(W.a,{className:"mx-2",icon:q.i}),A," [days]",l.a.createElement(W.a,{className:"mx-2",icon:q.c})),C>0?l.a.createElement(l.a.Fragment,null,l.a.createElement(N.l,{className:"bg-white"},l.a.createElement("strong",null,C)),l.a.createElement(N.l,null,"hours / sprint")):null))),l.a.createElement(N.b,{onClick:_},l.a.createElement(W.a,{icon:q.h}))),l.a.createElement(N.r,{bordered:!0},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"Name"),l.a.createElement("th",null,x.name),z?l.a.createElement(l.a.Fragment,null,l.a.createElement("th",null,"Total")," ",l.a.createElement("th",null,"Custom")):l.a.createElement(l.a.Fragment,null,l.a.createElement("th",null,w.name),l.a.createElement("th",null,"Progress")),B?l.a.createElement("th",null,"Grade"):null)),l.a.createElement("tbody",null,p.map(function(e){return l.a.createElement(ae,{key:e.id,isPast:B,item:e,sums:U,total:C,hpd:v,closedTasks:Y[e.id]||[]})}),l.a.createElement("tr",{key:"null"},l.a.createElement("td",null,"unassigned"),l.a.createElement("td",{className:"text-right text-danger"},L),l.a.createElement("td",null),l.a.createElement("td",null),B||z?l.a.createElement("td",null):null))))},re=function(e,t,a){return b.a.chain(t).map(function(t){return X(e,t,Number(a))}).sum().value()},le=function(){var e=Object(r.useState)([]),t=Object(i.a)(e,2),a=t[0],n=t[1],c=Object(r.useContext)(I).state,s=c.tasks,u=c.biz_days,p=c.custom_value_map,b=c.custom_eid;return Object(r.useEffect)(function(){var e=u.length;if(e>0&&s.length>0&&b){var t=re(p,function(e,t){return e.filter(function(e){return T()(t).endOf("days").diff(T()(e.created_date))>0})}(s,u[0]),b),a=u.map(function(a,n){var c=L(0,n),r=t-t*n/(e-1);return T()().local().endOf("days").diff(T()(a))>0?{label:c,estimate:r,result:t-re(p,function(e,t){return e.filter(function(e){return!!e.finished_date&&T()(t).local().endOf("days").diff(T()(e.finished_date))>0})}(s,a),b),add:0===n?0:re(p,function(e,t){return e.filter(function(e){return T()(t).local().format("YYYY-MM-DD")===T()(e.created_date).local().format("YYYY-MM-DD")})}(s,a),b)}:{label:c,estimate:r}});n(a)}else n([])},[s,u,b,p,n]),0===a.length?null:l.a.createElement(N.c,null,l.a.createElement(N.e,null,"Burn down chart"),l.a.createElement(o.a,{data:a,width:800,height:400},l.a.createElement(m.a,null),l.a.createElement(d.a,{dataKey:"label"}),l.a.createElement(_.a,null),l.a.createElement(E.a,{dataKey:"result",fill:"#8884d8",stackId:"a"}),l.a.createElement(E.a,{dataKey:"add",fill:"#82ca9d",stackId:"a"}),l.a.createElement(f.a,{dataKey:"estimate"})))},se=function(){var e=Object(r.useContext)(I),t=e.state,a=t.url,n=t.pid,c=e.setPid,s=Object(r.useState)([]),u=Object(i.a)(s,2),o=u[0],m=u[1],d=Object(r.useCallback)(function(e){var t=e.target.value;t&&c(t)},[c]);return Object(r.useEffect)(function(){a&&Object(V.a)(J.a.mark(function e(){var t,n;return J.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.a.get("".concat(D(a),"/projects"));case 2:t=e.sent,n=t.data,m(n);case 5:case"end":return e.stop()}},e,this)}))()},[a,m]),l.a.createElement(N.j,{className:"col"},l.a.createElement(N.k,{addonType:"prepend"},"Project"),l.a.createElement(N.i,{value:n,type:"select",onChange:d},l.a.createElement("option",{value:""}," --- "),o.map(function(e){return l.a.createElement("option",{key:e.id,value:e.id},e.name)})))},ue=function(){var e=Object(r.useContext)(I),t=e.state,a=t.url,n=t.pid,c=t.mid,s=t.updated_time,u=t.reject_task_status_ids,o=e.setMid,m=e.setMilestones,d=e.setTasks,_=Object(r.useState)([]),E=Object(i.a)(_,2),f=E[0],p=E[1],S=Object(r.useCallback)(function(e){var t=e.target.value;t&&o(t)},[o,f]);return Object(r.useEffect)(function(){a&&n&&Object(V.a)(J.a.mark(function e(){var t,c;return J.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.a.get("".concat(D(a),"/milestones"),{params:{project:n}});case 2:t=e.sent,c=t.data,p(c),m(c);case 6:case"end":return e.stop()}},e,this)}))()},[a,n]),Object(r.useEffect)(function(){a&&c&&Object(V.a)(J.a.mark(function e(){var t,n,r;return J.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.a.get("".concat(D(a),"/tasks"),{headers:{"x-disable-pagination":!0},params:{milestone:c}});case 2:t=e.sent,n=t.data,r=n.filter(function(e){return!b.a.includes(u,String(e.status))}),d(r);case 6:case"end":return e.stop()}},e,this)}))()},[a,c,s,u]),l.a.createElement(N.j,{className:"col"},l.a.createElement(N.k,{addonType:"prepend"},"Sprint"),l.a.createElement(N.i,{type:"select",value:c,onChange:S},l.a.createElement("option",{value:""}," --- "),f.map(function(e){return l.a.createElement("option",{key:e.id,value:e.id},e.name)})))},ie=function(){var e=Object(r.useContext)(I),t=e.state,a=t.url,n=t.pid,c=t.custom_eid,s=t.custom_rid,u=t.tasks,o=e.setCustomEid,m=e.setCustomRid,d=e.setCustomAttrs,_=e.setCustomValueMap,E=Object(r.useState)([]),f=Object(i.a)(E,2),p=f[0],b=f[1],S=Object(r.useCallback)(function(e){var t=e.target.value;if(t)switch(e.target.name){case"eid":o(t);break;case"rid":m(t)}},[o,m]);return Object(r.useEffect)(function(){a&&n&&Object(V.a)(J.a.mark(function e(){var t,c;return J.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.a.get("".concat(D(a),"/task-custom-attributes"),{params:{project:n}});case 2:t=e.sent,c=t.data,b(c),d(c);case 6:case"end":return e.stop()}},e,this)}))()},[a,n,b,d]),Object(r.useEffect)(function(){a&&u.length&&c&&s&&Object(V.a)(J.a.mark(function e(){var t;return J.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=WeakMap,e.next=3,Promise.all(u.map(function(){var e=Object(V.a)(J.a.mark(function e(t){var n,c;return J.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.a.get("".concat(D(a),"/tasks/custom-attributes-values/").concat(t.id));case 2:return n=e.sent,c=n.data,e.abrupt("return",[t,c]);case 5:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()));case 3:e.t1=e.sent,t=new e.t0(e.t1),_(t);case 6:case"end":return e.stop()}},e,this)}))()},[a,u,c,s,_]),l.a.createElement("div",{className:"row"},l.a.createElement(N.j,{className:"col"},l.a.createElement(N.k,{addonType:"prepend"},"Estimate"),l.a.createElement(N.i,{value:c,name:"eid",type:"select",onChange:S},l.a.createElement("option",{value:""}," --- "),p.map(function(e){return l.a.createElement("option",{key:e.id,value:e.id},e.name)}))),l.a.createElement(N.j,{className:"col"},l.a.createElement(N.k,{addonType:"prepend"},"Result"),l.a.createElement(N.i,{value:s,name:"rid",type:"select",onChange:S},l.a.createElement("option",null," --- "),p.map(function(e){return l.a.createElement("option",{key:e.id,value:e.id},e.name)}))))},oe=function(e){var t=e.item,a=Object(r.useContext)(I),n=a.state.reject_task_status_ids,c=a.toggeRejectTaskStatus,s=Object(r.useCallback)(function(e){var t=e.target.value;c(String(t),!e.target.checked)},[c]);return l.a.createElement(N.h,{check:!0,inline:!0},l.a.createElement(N.m,{check:!0},l.a.createElement(N.i,{onChange:s,type:"checkbox",value:t.id,defaultChecked:!b.a.includes(n,String(t.id))}),t.name))},me=function(){var e=Object(r.useContext)(I),t=e.state,a=t.url,n=t.pid,c=e.setTaskStatus,s=Object(r.useState)([]),u=Object(i.a)(s,2),o=u[0],m=u[1];return Object(r.useEffect)(function(){a&&n&&Object(V.a)(J.a.mark(function e(){var t,r;return J.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.a.get("".concat(D(a),"/task-statuses"),{params:{project:n}});case 2:t=e.sent,r=t.data,m(r),c(r);case 6:case"end":return e.stop()}},e,this)}))()},[a,n]),0===o.length?null:l.a.createElement(N.c,null,l.a.createElement(N.e,null,"Task status"),l.a.createElement(N.d,null,o.map(function(e){return l.a.createElement(oe,{key:e.id,item:e})})))},de=a(141),_e=a.n(de),Ee=function(){var e=Object(r.useContext)(I),t=e.state,a=t.url,n=t.isOpen,c=t.mid,s=t.milestones,u=t.biz_days,o=e.setUrl,m=e.openController,d=e.closeController,_=Object(r.useState)(""),E=Object(i.a)(_,2),f=E[0],p=E[1],S=Object(r.useCallback)(function(e){p(e.target.value)},[p]),T=Object(r.useCallback)(function(e){f&&o(f),e.preventDefault()},[f,o]),O=Object(r.useCallback)(function(e){e.stopPropagation()},[]),j=n?90:void 0,v=Object(r.useCallback)(function(){n?d():m()},[m,d,n]),k=function(e,t,a){var n=z(t,a);return e&&n?"".concat(e,"/project/").concat(n.project_extra_info.slug,"/taskboard/").concat(n.slug):""}(a,c,s);return l.a.createElement(N.c,null,l.a.createElement(N.e,{className:U()(_e.a.header),onClick:v},l.a.createElement(W.a,{rotation:j,icon:q.a}),l.a.createElement(N.a,{color:"primary",pill:!0,className:"p-1 m-1"},l.a.createElement("span",null,function(e,t){return b.a.get(z(e,t),"name","")}(c,s))),l.a.createElement(N.a,{className:"p-1 m-1"},l.a.createElement("span",null,function(e){return e.length>1?"[".concat(b.a.head(e)," - ").concat(b.a.last(e),"]"):""}(u))),k?l.a.createElement("a",{target:"_blank",onClick:O,className:"float-right",href:k},l.a.createElement(W.a,{className:"mr-1",icon:q.d}),"Taskboard"):null),l.a.createElement(N.f,{isOpen:n},l.a.createElement(N.g,{onSubmit:T},l.a.createElement(N.j,null,l.a.createElement(N.k,{addonType:"prepend"},"URL"),l.a.createElement(N.i,{defaultValue:a,onChange:S,placeholder:"http://hostname:port"}),l.a.createElement(N.k,{addonType:"append"},l.a.createElement(N.b,null,"Set")))),l.a.createElement("div",{className:"row"},l.a.createElement(se,null),l.a.createElement(ue,null)),l.a.createElement(ie,null),l.a.createElement(P,null),l.a.createElement(me,null)))},fe=function(e){var t=e.url,a=e.item,n=a.project_extra_info.slug,c="".concat(t,"/project/").concat(n,"/task/").concat(a.ref);return l.a.createElement(N.o,{tag:"a",target:"_blank",href:c},l.a.createElement(W.a,{icon:q.d})," ",a.subject)},pe=function(){var e=Object(r.useContext)(I).state,t=e.url,a=e.tasks,n=e.custom_value_map,c=e.custom_eid,s=Object(r.useState)([]),u=Object(i.a)(s,2),o=u[0],m=u[1];return Object(r.useEffect)(function(){if(a.length>0&&c){var e=Number(c),t=a.filter(function(t){return 0===X(n,t,e)});a.length>t.length&&m(t)}},[a,n,c]),0===o.length?null:l.a.createElement(N.c,null,l.a.createElement(N.e,null,"Unset tasks"),l.a.createElement(N.n,null,o.map(function(e){return l.a.createElement(fe,{url:t,key:e.id,item:e})})))},be=function(){return l.a.createElement("div",{className:"container"},l.a.createElement(M,null,l.a.createElement(Ee,null),l.a.createElement(ce,null),l.a.createElement(pe,null),l.a.createElement(le,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));u.a.render(l.a.createElement(be,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},54:function(e,t,a){e.exports={gold:"UserTasks_gold__2_Oza",silver:"UserTasks_silver__FUnAn",bronze:"UserTasks_bronze__24R1R",custom_input_td:"UserTasks_custom_input_td__2MdyH",avator:"UserTasks_avator__3C5_y"}}},[[142,2,1]]]);
//# sourceMappingURL=main.576f9cbd.chunk.js.map