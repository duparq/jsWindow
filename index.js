
"use strict";

//  Load scripts[] one after the other in the specified order.
//  Call fn after the last script is loaded.
//
function loadScripts ( scripts, fn )
{
  let src = scripts.shift();
  if ( src !== undefined ) {
    let script = document.createElement("script");
    script.src = src ;
    script.onload = ()=>{ loadScripts(scripts,fn); }
    document.head.appendChild(script);
  }
  else
    if ( fn ) fn();
}


//  Load all application scripts.
//  Start application after the last script is loaded.
//
window.addEventListener("load", function() {
  loadScripts(["main.js"]);
} );
