
"use strict";


function trace ( msg=null )
{
  if ( msg == null )
    msg = "";
  else
    msg="("+msg+")";
  // console.log(new Error().stack.split('\n')[1].replace('@','	'));
  console.log(new Error().stack.split('\n')[1].split('@')[0]+msg);
}


console.cbSetup = function ( entry )
{
  entry.checked = (console.org_log != undefined);
};


console.cbChange = function ( entry )
{
  console.redirect(entry.checked);
};


//  Replace log and clear functions.
//
console.redirect = function ( v )
{
  if ( v==true ) {
    var c = document.getElementById("console");
    if ( !c ) {
      console.log("ERROR: no element with 'console' id.");
      return;
    }

    console.org_log = console.log ;
    console.log = function ( s ) {
      c.textContent += s+"\n" ;
      c.scrollTop = c.scrollHeight ;
    };

    console.org_clear = console.clear ;
    console.clear = function ( ) {
      document.getElementById("console").textContent="";
    };
  }
  else {
    if ( console.org_log )
      console.log = console.org_log ;
    console.org_log = undefined ;
    if ( console.org_clear )
      console.clear = console.org_clear ;
    console.org_clear = undefined ;
  }
};
