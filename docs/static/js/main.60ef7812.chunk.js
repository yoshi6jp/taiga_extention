(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{140:function(e,t,a){e.exports=a(302)},145:function(e,t,a){},302:function(e,t,a){"use strict";a.r(t);var n,c,r=a(1),u=a.n(r),s=a(30),l=a.n(s),i=(a(145),a(147),a(15)),o=a(305),m=a(299),d=a(298),f=a(303),_=a(297),p=a(296),E=a(14),b=a.n(E),O=a(23),S=a.n(O);!function(e){e.SET_URL="SET_URL",e.SET_PID="SET_PID",e.SET_MID="SET_MID",e.SET_MILESTONES="SET_MILESTONES",e.SET_CUSTOM_EID="SET_CUSTOM_EID",e.SET_CUSTOM_RID="SET_CUSTOM_RID",e.SET_CUSTOM_ATTRS="SET_CUSTOM_ATTRS",e.SET_BIZ_DAYS="SET_BIZ_DAYS",e.ADD_BIZ_DAY="ADD_BIZ_DAY",e.REMOVE_BIZ_DAY="REMOVE_BIZ_DAY",e.SET_TASKS="SET_TASKS",e.SET_CUSTOM_VALUE_MAP="SET_CUSTOM_VALUE_MAP",e.UPDATE_DATA="UPDATE_DATA"}(n||(n={})),function(e){e.URL="taiga_url",e.PID="taiga_pid",e.MID="taiga_mid",e.CUSTOM_EID="taiga_custom_eid",e.CUSTOM_RID="taiga_custom_rid",e.BIZ_DAYS="taiga_biz_days"}(c||(c={}));var v=function(e){return localStorage.getItem(e)||""},y=function(e,t){return t?v("".concat(t,"/").concat(e)):""},T=function(e,t){localStorage.setItem(e,t)},j=function(e,t,a){t&&T("".concat(t,"/").concat(e),a)},D=function(){var e=v(c.URL),t=v(c.PID),a=v(c.MID),n=y(c.CUSTOM_EID,t),r=y(c.CUSTOM_RID,t),u=y(c.BIZ_DAYS,a);return{url:e,pid:t,mid:a,custom_eid:n,custom_rid:r,custom_attrs:[],biz_days:b.a.compact(u.split(",")).sort(),milestones:[],tasks:[],custom_value_map:new WeakMap,updated_time:0}},h=a(89),g=a(20),k=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:D(),t=arguments.length>1?arguments[1]:void 0;switch(t.type){case n.SET_URL:var a=t.payload.url;return T(c.URL,a),Object(g.a)({},e,{url:a});case n.SET_PID:var r=t.payload.pid;return T(c.PID,r),Object(g.a)({},e,{pid:r,mid:"",custom_eid:y(c.CUSTOM_EID,r),custom_rid:y(c.CUSTOM_RID,r),custom_attrs:[],milestones:[],custom_value_map:new WeakMap});case n.SET_MID:var u=t.payload.mid;return T(c.MID,u),Object(g.a)({},e,{mid:u,tasks:[],biz_days:b.a.compact(y(c.BIZ_DAYS,u).split(",")).sort()});case n.SET_MILESTONES:var s=t.payload.milestones;return Object(g.a)({},e,{milestones:s});case n.SET_CUSTOM_EID:var l=t.payload.custom_eid;return j(c.CUSTOM_EID,e.pid,l),Object(g.a)({},e,{custom_eid:l});case n.SET_CUSTOM_ATTRS:var i=t.payload.custom_attrs;return Object(g.a)({},e,{custom_attrs:i});case n.SET_CUSTOM_RID:var o=t.payload.custom_rid;return j(c.CUSTOM_RID,e.pid,o),Object(g.a)({},e,{custom_rid:o});case n.SET_BIZ_DAYS:var m=t.payload.biz_days;return j(c.BIZ_DAYS,e.mid,m.join(",")),Object(g.a)({},e,{biz_days:m});case n.ADD_BIZ_DAY:var d=t.payload.biz_day,f=b.a.chain(Object(h.a)(e.biz_days).concat([d])).uniq().sort().value();return j(c.BIZ_DAYS,e.mid,f.join(",")),Object(g.a)({},e,{biz_days:f});case n.REMOVE_BIZ_DAY:var _=t.payload.biz_day,p=b.a.reject(Object(h.a)(e.biz_days),function(e){return e===_});return j(c.BIZ_DAYS,e.mid,p.join(",")),Object(g.a)({},e,{biz_days:p});case n.SET_TASKS:var E=t.payload.tasks;return Object(g.a)({},e,{tasks:E});case n.SET_CUSTOM_VALUE_MAP:var O=t.payload.custom_value_map;return Object(g.a)({},e,{custom_value_map:O});case n.UPDATE_DATA:return Object(g.a)({},e,{updated_time:Date.now()});default:return e}},C=function(e){return"".concat(e.replace(/[\xa5\/]$/,""),"/api/v1")},M=D(),I=Object(r.createContext)({state:M,setUrl:function(e){},setPid:function(e){},setMid:function(e){},setMilestones:function(e){},setCustomEid:function(e){},setCustomRid:function(e){},setCustomAttrs:function(e){},setBizDays:function(e){},addBizDay:function(e){},removeBizDay:function(e){},setTasks:function(e){},setCustomValueMap:function(e){},updateData:function(){}}),A=function(e){var t=e.children,a=Object(r.useReducer)(k,M),c=Object(i.a)(a,2),s=c[0],l=c[1],o={state:s,setUrl:Object(r.useCallback)(function(e){l({type:n.SET_URL,payload:{url:e}})},[l]),setPid:Object(r.useCallback)(function(e){l({type:n.SET_PID,payload:{pid:e}})},[l]),setMid:Object(r.useCallback)(function(e){l({type:n.SET_MID,payload:{mid:e}})},[l]),setMilestones:Object(r.useCallback)(function(e){l({type:n.SET_MILESTONES,payload:{milestones:e}})},[l]),setCustomEid:Object(r.useCallback)(function(e){l({type:n.SET_CUSTOM_EID,payload:{custom_eid:e}})},[l]),setCustomRid:Object(r.useCallback)(function(e){l({type:n.SET_CUSTOM_RID,payload:{custom_rid:e}})},[l]),setCustomAttrs:Object(r.useCallback)(function(e){l({type:n.SET_CUSTOM_ATTRS,payload:{custom_attrs:e}})},[l]),setBizDays:Object(r.useCallback)(function(e){l({type:n.SET_BIZ_DAYS,payload:{biz_days:e}})},[l]),addBizDay:Object(r.useCallback)(function(e){l({type:n.ADD_BIZ_DAY,payload:{biz_day:e}})},[l]),removeBizDay:Object(r.useCallback)(function(e){l({type:n.REMOVE_BIZ_DAY,payload:{biz_day:e}})},[l]),setTasks:Object(r.useCallback)(function(e){l({type:n.SET_TASKS,payload:{tasks:e}})},[l]),setCustomValueMap:Object(r.useCallback)(function(e){l({type:n.SET_CUSTOM_VALUE_MAP,payload:{custom_value_map:e}})},[l]),updateData:Object(r.useCallback)(function(){l({type:n.UPDATE_DATA})},[l])};return u.a.createElement(I.Provider,{value:o},t)},U=a(16),w=a.n(U),Y=a(26),x=a(31),B=a.n(x),R=a(11),z=a(127),N=a(128),P=function(e,t,a){return e.has(t)?Number(b.a.get(e.get(t),"attributes_values.".concat(a),"0").replace(/[^0-9.]/g,"")):0},Z=function(e,t,a,n){var c=Number(a),r=Number(n);return b.a.mapValues(function(e){return b.a.groupBy(e,"assigned_to")}(e),function(e){return b.a.chain(e).map(function(e){return{e:P(t,e,c),r:P(t,e,r)}}).reduce(function(e,t){return{e:e.e+t.e,r:e.r+t.r}},{e:0,r:0}).value()})},L=function(e,t){return e.find(function(e){return e.id===t})},V=function(){var e=Object(r.useContext)(I),t=e.state,a=t.url,n=t.pid,c=t.tasks,s=t.custom_value_map,l=t.custom_attrs,o=t.custom_eid,m=t.custom_rid,d=e.updateData,f=Object(r.useState)([]),_=Object(i.a)(f,2),p=_[0],E=_[1];Object(r.useEffect)(function(){a&&n&&Object(Y.a)(w.a.mark(function e(){var t,c;return w.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,B.a.get("".concat(C(a),"/projects/").concat(n));case 2:t=e.sent,c=t.data.members,E(c);case 5:case"end":return e.stop()}},e,this)}))()},[a,n,E]);var O=Z(c,s,o,m),S=L(l,Number(o)),v=L(l,Number(m));if(!S||!v)return null;var y=b.a.get(O,"null.e",0);return u.a.createElement(u.a.Fragment,null,u.a.createElement("div",{className:"text-right"},u.a.createElement(R.a,{onClick:d},u.a.createElement(z.a,{icon:N.a}))),u.a.createElement(R.k,{bordered:!0},u.a.createElement("thead",null,u.a.createElement("tr",null,u.a.createElement("th",null,"Name"),u.a.createElement("th",null,S.name),u.a.createElement("th",null,v.name))),u.a.createElement("tbody",null,p.map(function(e){return u.a.createElement("tr",{key:e.id},u.a.createElement("td",null,e.username),u.a.createElement("td",{className:"text-right"},b.a.get(O,"".concat(e.id,".e"))),u.a.createElement("td",{className:"text-right"},b.a.get(O,"".concat(e.id,".r"))))}),u.a.createElement("tr",{key:"null"},u.a.createElement("td",null,"unassigned"),u.a.createElement("td",{className:"text-right text-danger"},y),u.a.createElement("td",null)))))},K=function(e,t,a){return b.a.chain(t).map(function(t){return P(e,t,Number(a))}).sum().value()},W=function(){var e=Object(r.useState)([]),t=Object(i.a)(e,2),a=t[0],n=t[1],c=Object(r.useContext)(I).state,s=c.tasks,l=c.biz_days,E=c.custom_value_map,b=c.custom_eid;return Object(r.useEffect)(function(){var e=l.length;if(e>0&&s.length>0&&b){var t=K(E,function(e,t){return e.filter(function(e){return S()(t).endOf("days").diff(S()(e.created_date))>0})}(s,l[0]),b),a=l.map(function(a,n){var c="day ".concat(n+1),r=t-t*n/(e-1);return S()().diff(S()(a),"days")>=0?{label:c,estimate:r,result:t-K(E,function(e,t){return e.filter(function(e){return!!e.finished_date&&S()(t).diff(S()(e.finished_date))>0})}(s,a),b),add:0===n?0:K(E,function(e,t){return e.filter(function(e){return S()(t).local().format("YYYY-MM-DD")===S()(e.created_date).local().format("YYYY-MM-DD")})}(s,a),b)}:{label:c,estimate:r}});n(a)}else n([])},[s,l,b,E,n]),0===a.length?null:u.a.createElement(R.b,null,u.a.createElement(R.c,null,"Burn down chart"),u.a.createElement(o.a,{data:a,width:800,height:400},u.a.createElement(m.a,null),u.a.createElement(d.a,{dataKey:"label"}),u.a.createElement(f.a,null),u.a.createElement(_.a,{dataKey:"result",fill:"#8884d8",stackId:"a"}),u.a.createElement(_.a,{dataKey:"add",fill:"#82ca9d",stackId:"a"}),u.a.createElement(p.a,{dataKey:"estimate"})))},F=function(){var e=Object(r.useContext)(I),t=e.state,a=t.url,n=t.pid,c=e.setPid,s=Object(r.useState)([]),l=Object(i.a)(s,2),o=l[0],m=l[1],d=Object(r.useCallback)(function(e){var t=e.target.value;t&&c(t)},[c]);return Object(r.useEffect)(function(){a&&Object(Y.a)(w.a.mark(function e(){var t,n;return w.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,B.a.get("".concat(C(a),"/projects"));case 2:t=e.sent,n=t.data,m(n);case 5:case"end":return e.stop()}},e,this)}))()},[a,m]),u.a.createElement(R.f,{className:"col"},u.a.createElement(R.g,{addonType:"prepend"},"Project"),u.a.createElement(R.e,{value:n,type:"select",onChange:d},u.a.createElement("option",{value:""}," --- "),o.map(function(e){return u.a.createElement("option",{key:e.id,value:e.id},e.name)})))},J=function(){var e=Object(r.useContext)(I),t=e.state,a=t.url,n=t.pid,c=t.mid,s=t.updated_time,l=e.setMid,o=e.setMilestones,m=e.setTasks,d=Object(r.useState)([]),f=Object(i.a)(d,2),_=f[0],p=f[1],E=Object(r.useCallback)(function(e){var t=e.target.value;t&&l(t)},[l,_]);return Object(r.useEffect)(function(){a&&n&&Object(Y.a)(w.a.mark(function e(){var t,c;return w.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,B.a.get("".concat(C(a),"/milestones"),{params:{project:n}});case 2:t=e.sent,c=t.data,p(c),o(c);case 6:case"end":return e.stop()}},e,this)}))()},[a,n]),Object(r.useEffect)(function(){a&&c&&Object(Y.a)(w.a.mark(function e(){var t,n;return w.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,B.a.get("".concat(C(a),"/tasks"),{headers:{"x-disable-pagination":!0},params:{milestone:c}});case 2:t=e.sent,n=t.data,m(n);case 5:case"end":return e.stop()}},e,this)}))()},[a,c,s]),u.a.createElement(R.f,{className:"col"},u.a.createElement(R.g,{addonType:"prepend"},"Sprint"),u.a.createElement(R.e,{type:"select",value:c,onChange:E},u.a.createElement("option",{value:""}," --- "),_.map(function(e){return u.a.createElement("option",{key:e.id,value:e.id},e.name)})))},$=function(){var e=Object(r.useContext)(I),t=e.state,a=t.url,n=t.pid,c=t.custom_eid,s=t.custom_rid,l=t.tasks,o=e.setCustomEid,m=e.setCustomRid,d=e.setCustomAttrs,f=e.setCustomValueMap,_=Object(r.useState)([]),p=Object(i.a)(_,2),E=p[0],b=p[1],O=Object(r.useCallback)(function(e){var t=e.target.value;if(t)switch(e.target.name){case"eid":o(t);break;case"rid":m(t)}},[o,m]);return Object(r.useEffect)(function(){a&&n&&Object(Y.a)(w.a.mark(function e(){var t,c;return w.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,B.a.get("".concat(C(a),"/task-custom-attributes"),{params:{project:n}});case 2:t=e.sent,c=t.data,b(c),d(c);case 6:case"end":return e.stop()}},e,this)}))()},[a,n,b,d]),Object(r.useEffect)(function(){a&&l.length&&c&&s&&Object(Y.a)(w.a.mark(function e(){var t;return w.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=WeakMap,e.next=3,Promise.all(l.map(function(){var e=Object(Y.a)(w.a.mark(function e(t){var n,c;return w.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,B.a.get("".concat(C(a),"/tasks/custom-attributes-values/").concat(t.id));case 2:return n=e.sent,c=n.data,e.abrupt("return",[t,c]);case 5:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()));case 3:e.t1=e.sent,t=new e.t0(e.t1),f(t);case 6:case"end":return e.stop()}},e,this)}))()},[a,l,c,s,f]),u.a.createElement("div",{className:"row"},u.a.createElement(R.f,{className:"col"},u.a.createElement(R.g,{addonType:"prepend"},"Estimate"),u.a.createElement(R.e,{value:c,name:"eid",type:"select",onChange:O},u.a.createElement("option",{value:""}," --- "),E.map(function(e){return u.a.createElement("option",{key:e.id,value:e.id},e.name)}))),u.a.createElement(R.f,{className:"col"},u.a.createElement(R.g,{addonType:"prepend"},"Result"),u.a.createElement(R.e,{value:s,name:"rid",type:"select",onChange:O},u.a.createElement("option",null," --- "),E.map(function(e){return u.a.createElement("option",{key:e.id,value:e.id},e.name)}))))},q=a(88),G=a.n(q),H=function(e){var t=e.item,a=e.biz_days,n=Object(r.useContext)(I),c=n.addBizDay,s=n.removeBizDay,l=t.format("YYYY-MM-DD"),i=Object(r.useCallback)(function(e){var t=e.target.value;e.target.checked?c(t):s(t)},[c,s]);return u.a.createElement("div",{className:"form-check form-check-inline"},u.a.createElement(R.e,{onChange:i,disabled:G.a.isWeekendDay(t),id:l,value:l,type:"checkbox",defaultChecked:b.a.includes(a,l),className:"form-check-input"}),u.a.createElement(R.h,{className:"form-check-label",for:l},l))},Q=function(){var e=Object(r.useContext)(I),t=e.state,a=t.mid,n=t.milestones,c=t.biz_days,s=e.setBizDays,l=Object(r.useState)([]),o=Object(i.a)(l,2),m=o[0],d=o[1];return Object(r.useEffect)(function(){var e=function(e,t){return t.find(function(t){return String(t.id)===e})}(a,n);if(e){var t=function(e){var t=S()(e.estimated_start).local(),a=S()(e.estimated_finish).local().diff(t,"days");return b.a.times(a).map(function(e){return t.clone().add(e,"days")})}(e);d(t),c.length<=1&&s(t.filter(function(e){return G.a.isWeekDay(e)}).map(function(e){return e.format("YYYY-MM-DD")}))}},[a,n,c]),0===m.length?null:u.a.createElement(u.a.Fragment,null,m.map(function(e){return u.a.createElement(H,{key:e.toString(),item:e,biz_days:c})}))},X=function(){var e=Object(r.useContext)(I),t=e.state,a=e.setUrl,n=Object(r.useState)(""),c=Object(i.a)(n,2),s=c[0],l=c[1],o=Object(r.useCallback)(function(e){l(e.target.value)},[l]),m=Object(r.useCallback)(function(e){s&&a(s),e.preventDefault()},[s,a]);return u.a.createElement(R.d,{onSubmit:m},u.a.createElement(R.f,null,u.a.createElement(R.g,{addonType:"prepend"},"URL"),u.a.createElement(R.e,{defaultValue:t.url,onChange:o,placeholder:"http://hostname:port"}),u.a.createElement(R.g,{addonType:"append"},u.a.createElement(R.a,null,"Set"))),u.a.createElement("div",{className:"row"},u.a.createElement(F,null),u.a.createElement(J,null)),u.a.createElement($,null),u.a.createElement(Q,null))},ee=function(e){var t=e.url,a=e.item,n=a.project_extra_info.slug,c="".concat(t,"/project/").concat(n,"/task/").concat(a.ref);return u.a.createElement(R.j,{tag:"a",target:"_blank",href:c},a.subject)},te=function(){var e=Object(r.useContext)(I).state,t=e.url,a=e.tasks,n=e.custom_value_map,c=e.custom_eid,s=Object(r.useState)([]),l=Object(i.a)(s,2),o=l[0],m=l[1];return Object(r.useEffect)(function(){if(a.length>0&&c){var e=Number(c),t=a.filter(function(t){return 0===P(n,t,e)});a.length>t.length&&m(t)}},[a,n,c]),0===o.length?null:u.a.createElement(R.b,null,u.a.createElement(R.c,null,"Unsetting tasks"),u.a.createElement(R.i,null,o.map(function(e){return u.a.createElement(ee,{url:t,key:e.id,item:e})})))},ae=function(){return u.a.createElement("div",{className:"container"},u.a.createElement(A,null,u.a.createElement(X,null),u.a.createElement(V,null),u.a.createElement(te,null),u.a.createElement(W,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(u.a.createElement(ae,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[140,2,1]]]);
//# sourceMappingURL=main.60ef7812.chunk.js.map