
"use strict";


function trace ( msg=null )
{
  msg = msg || "";

  let s = new Error().stack ;
  if ( s.startsWith("trace@file") ) {	// Firefox
    var line = s.split('\n')[1];
    let fields = line.split('@')
    var fun = fields[0];
  }
  else if ( s.startsWith("Error") ) {	// Chrome
    var line = s.split('\n')[2];
    var fun = line.split(' ')[5] ;
  }
  else {
    var fun = s ;
  }

  console.log(fun+": "+msg);
}


//  Replace log and clear functions.
//
console.redirect = function ( v )
{
  if ( v ) {
    console.org_log = console.log ;
    console.log = function ( s ) {
      v.textContent += s+"\n" ;
      v.scrollTop = v.scrollHeight ;
    };

    console.org_clear = console.clear ;
    console.clear = function ( ) {
      v.textContent="";
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
