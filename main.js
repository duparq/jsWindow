
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

  loadCss( "Window.css" );
  
  let w = new Window().setTitle("Window 1");
  
  w = new Window().setTitle("Console");
  w.divWork.id = "console";

  console.redirect(true);
}


loadScripts(["Window.js"], main);
