(this.webpackJsonp256console=this.webpackJsonp256console||[]).push([[0],[,,,,,,function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAFzAAABcwHEdCJ9AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAACFQTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3XBkVwAAAAp0Uk5TAAItYpOcoKLq/sUL4C8AAAB2SURBVChTvcoxEkAwEIXhhwsojDplSq3SNXSuoVRqdXqDPaVIYnej56/evPmAf6qM7LwDsnGSw+4lajoMg5kG9ERMLNGGlpg4QAuKlYkDZwMhAUBIBEwewIRBJAIiUSAQBQLRwBMNAtHAEw1ukgJHUuDIC3zcBaKKQ5toz/bXAAAAAElFTkSuQmCC"},,,function(e,t,a){e.exports=a(16)},,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t);var n,s=a(0),c=a.n(s),r=a(8),i=a.n(r),l=(a(14),a(5)),o=a(1),m=a(2),u=a(4),d=a(3),p=a(6),h=a.n(p);a(15);!function(e){e.SemesterManagement="Semester Management",e.HITManagement="HIT Management",e.PostHITManagement="Post HIT Management"}(n||(n={}));var A=function(e){Object(u.a)(a,e);var t=Object(d.a)(a);function a(e){var s;return Object(o.a)(this,a),(s=t.call(this,e)).rs=new Array(Object.keys(n).length).fill((function(){return c.a.createRef()}),0,Object.keys(n).length).map((function(e){return e()})),s.state={currentActive:{index:0,navLocation:n.SemesterManagement}},s}return Object(m.a)(a,[{key:"updateActive",value:function(e,t){var a,n,s=this.state.currentActive;s.index!==e&&(null===(a=this.rs[s.index].current)||void 0===a||a.classList.remove("active"),null===(n=this.rs[e].current)||void 0===n||n.classList.add("active"),this.setState({currentActive:{index:e,navLocation:t}}),this.props.onUpdateActive(t))}},{key:"render",value:function(){var e=this;return c.a.createElement("nav",{className:"header"},this.rs.map((function(t,a){var s=a,r=Object.values(n)[s];return c.a.createElement("button",{ref:t,key:s,className:e.props.startNavLocation===r?"active":"",onClick:function(){return e.updateActive(s,r)}},r)})))}}]),a}(c.a.Component),v=function(e){Object(u.a)(a,e);var t=Object(d.a)(a);function a(){return Object(o.a)(this,a),t.apply(this,arguments)}return Object(m.a)(a,[{key:"render",value:function(){var e=this;return c.a.createElement("div",{className:"closer"},c.a.createElement("h3",{className:"subsubtitle"},this.props.title),c.a.createElement("button",{className:"close",onClick:function(){return e.props.onClose(!e.props.open)}},this.props.open?c.a.createElement("img",{src:h.a,alt:"^",className:"flip"}):c.a.createElement("img",{alt:"^",src:h.a})))}}]),a}(c.a.Component),f=function(e){Object(u.a)(a,e);var t=Object(d.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).createDB=c.a.createRef(),n.validateDB=c.a.createRef(),n.deleteDB=c.a.createRef(),n.clearDB=c.a.createRef(),n.updateProjects=c.a.createRef(),n.state={createDBOpen:!1,validateDBOpen:!1,deleteDBOpen:!1,clearDBOpen:!1,updateProjectsOpen:!1},n}return Object(m.a)(a,[{key:"render",value:function(){var e=this;return c.a.createElement("div",{className:this.props.display?"page":"hide"},c.a.createElement("h1",{className:"title"},"Semester Management"),c.a.createElement("p",{className:"purpose"},"This page is for handling semester wide changes such as initializing the database, clearing out old data, or other long term maintenance tasks. These actions should only be needed at the beginning and end of each semester."),c.a.createElement("div",{className:"content"},c.a.createElement("div",{className:"actions"},c.a.createElement("h2",{className:"subtitle"},"Actions"),c.a.createElement("div",{className:"action"},c.a.createElement(v,{title:"Create Database",open:this.state.createDBOpen,onClose:function(t){return e.setState({createDBOpen:t})},ref:this.createDB}),c.a.createElement("div",{className:this.state.createDBOpen?"content":"hide"},c.a.createElement("p",{className:"description"},"Creates a DynamoDB database with no data. This only needs to happen if the database has been deleted. If the database has only been cleared do not use this."),c.a.createElement("button",{className:"act safe",title:"If you click this button, no negative consequences can happen except an error because the database already exists."},"Create"))),c.a.createElement("div",{className:"action"},c.a.createElement(v,{title:"Validate Database",open:this.state.validateDBOpen,onClose:function(t){return e.setState({validateDBOpen:t})},ref:this.validateDB}),c.a.createElement("div",{className:this.state.validateDBOpen?"content":"hide"},c.a.createElement("p",{className:"description"},"Validates that the database is running and accessible. If you are encountering database issues this is a good first place to start."),c.a.createElement("button",{className:"act safe",title:"This is a perfectly safe action to run at all times."},"Validate"))),c.a.createElement("div",{className:"action"},c.a.createElement(v,{title:"Delete Database",open:this.state.deleteDBOpen,onClose:function(t){return e.setState({deleteDBOpen:t})},ref:this.deleteDB}),c.a.createElement("div",{className:this.state.deleteDBOpen?"content":"hide"},c.a.createElement("p",{className:"description"},"Deletes the entire database from DynamoDB. This should only be used in testing or if migrating infrastructure and any important data is backed up already."),c.a.createElement("button",{className:"act danger",title:"This is an irreversible action. Make sure that you mean to do this before you click the button."},"Delete"))),c.a.createElement("div",{className:"action"},c.a.createElement(v,{title:"Clear Database",open:this.state.clearDBOpen,onClose:function(t){return e.setState({clearDBOpen:t})},ref:this.clearDB}),c.a.createElement("div",{className:this.state.clearDBOpen?"content":"hide"},c.a.createElement("p",{className:"description"},"Clears all data from the database. Run this once at the end of the semester to free up as much space as possible."),c.a.createElement("button",{className:"act danger",title:"This is an irreversible action. Make sure that you mean to do this before you click the button."},"Clear"))),c.a.createElement("div",{className:"action"},c.a.createElement(v,{title:"Update Projects",open:this.state.updateProjectsOpen,onClose:function(t){return e.setState({updateProjectsOpen:t})},ref:this.updateProjects}),c.a.createElement("div",{className:this.state.updateProjectsOpen?"content":"hide"},c.a.createElement("p",{className:"description"},"Updates the list of projects for the semester. These will be used throughout the app to populate drop down menus and other forms."),c.a.createElement("button",{className:"act safe",title:"If you make any mistakes uploading a new list of projects it can be easily fixed by uploading a new list of projects."},"Update")))),c.a.createElement("div",{className:"statuses"},c.a.createElement("h2",{className:"subtitle"},"Statuses"),c.a.createElement("div",{className:"status"},c.a.createElement("h3",null,"Database"),c.a.createElement("div",null,"Created - Validated on 10/21/20")),c.a.createElement("div",{className:"status"},c.a.createElement("h3",null,"Projects"),c.a.createElement("ul",null,c.a.createElement("li",null,c.a.createElement("div",null,"Information Foraging"),c.a.createElement("div",null,"Iteration 1")),c.a.createElement("li",null,c.a.createElement("div",null,"Cognitive Load"),c.a.createElement("div",null,"Iteration 0")),c.a.createElement("li",null,c.a.createElement("div",null,"Gender Mag"),c.a.createElement("div",null,"Iteration 0")))))))}}]),a}(c.a.Component),b=function(e){Object(u.a)(a,e);var t=Object(d.a)(a);function a(){return Object(o.a)(this,a),t.apply(this,arguments)}return Object(m.a)(a,[{key:"render",value:function(){return c.a.createElement("div",{className:this.props.display?"page":"hide"},"HIT Management")}}]),a}(c.a.Component),E=function(e){Object(u.a)(a,e);var t=Object(d.a)(a);function a(){return Object(o.a)(this,a),t.apply(this,arguments)}return Object(m.a)(a,[{key:"render",value:function(){return c.a.createElement("div",{className:this.props.display?"page":"hide"},"Post HIT Management")}}]),a}(c.a.Component),g=function(e){Object(u.a)(a,e);var t=Object(d.a)(a);function a(e){var s,r;return Object(o.a)(this,a),(r=t.call(this,e)).rs=(s={},Object(l.a)(s,n.SemesterManagement,c.a.createRef()),Object(l.a)(s,n.HITManagement,c.a.createRef()),Object(l.a)(s,n.PostHITManagement,c.a.createRef()),s),r.state={navLocation:n.SemesterManagement},r}return Object(m.a)(a,[{key:"render",value:function(){var e=this;return c.a.createElement("div",{className:"app"},c.a.createElement(A,{startNavLocation:this.state.navLocation,onUpdateActive:function(t){return e.setState({navLocation:t})}}),c.a.createElement(f,{display:this.state.navLocation===n.SemesterManagement}),c.a.createElement(b,{display:this.state.navLocation===n.HITManagement}),c.a.createElement(E,{display:this.state.navLocation===n.PostHITManagement}),c.a.createElement("div",{className:"footer"},c.a.createElement("div",{className:"attribution"},"Icons made by\xa0",c.a.createElement("a",{href:"https://www.flaticon.com/authors/google",title:"Google"},"Google"),"\xa0from\xa0",c.a.createElement("a",{href:"https://www.flaticon.com/",title:"Flaticon"},"www.flaticon.com"))))}}]),a}(c.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(g,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[9,1,2]]]);
//# sourceMappingURL=main.e482fd4e.chunk.js.map