
"use strict";


function loadCss ( name )
{
  if (!document.getElementById(name))
  {
    let link   = document.createElement('link');
    link.id    = name;
    link.rel   = 'stylesheet';
    link.type  = 'text/css';
    link.href  = name;
    link.media = 'all';
    document.head.appendChild(link);
  }
}


//    M a i n
//
function main ( )
{
  console.clear();

  loadCss( "Console.css" );
  loadCss( "Window.css" );
  
  let w = new Window( { title:"<b>Console</b>",
			left:"100px",
			top:"100px",
			width:"600px",
			height:"300px" } );

  let d = document.createElement("div");
  d.id = "console";
  w.setChild(d);

  console.redirect(d);
  
  new Window( { title:"Window 1" } );
}


loadScripts(["Console.js",
	     "Window.js"], main);
