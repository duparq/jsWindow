
//  A window is made of a DIV containing:
//    * a background TABLE that handles events for resizing
//    * divBar: title bar DIV
//    * divWork: work area DIV
//
class Window {

  //  Transform matrices
  //    [dx,dy]*[m] => [left,top,width,height]
  //
  static mSizeNW = [ 1, 1, -1, -1 ];
  static mSizeN  = [ 0, 1,  0, -1 ];
  static mSizeNE = [ 0, 1,  1, -1 ];
  static mSizeW  = [ 1, 1, -1,  0 ];
  static mSizeE  = [ 0, 0,  1,  0 ];
  static mSizeSW = [ 1, 0, -1,  1 ];
  static mSizeS  = [ 0, 0,  0,  1 ];
  static mSizeSE = [ 0, 0,  1,  1 ];
  static mMove   = [ 1, 1,  0,  0 ];

  static eatEvent ( ev ) {
    ev.stopPropagation();
    ev.preventDefault();
  }

  //  Create a new window and append it to the document body
  //
  constructor ( ) {
    trace();

    //  Create a table of 3x3 cells that will handle window transformation
    //
    let tr, td ;
    let table = document.createElement("table");
    table.style.position = "absolute";
    table.style.left = "0";
    table.style.top = "0";
    table.style.width = "100%";
    table.style.height = "100%";
    table.style.borderCollapse = "collapse";

    tr = document.createElement("tr"); table.appendChild(tr);
    td = document.createElement("td"); tr.appendChild(td);
    td.classList = "sizer-nw";
    td.addEventListener("mousedown", this.opStart.bind(this, Window.mSizeNW) );
    td = document.createElement("td"); tr.appendChild(td);
    td.classList = "sizer-n";
    td.addEventListener("mousedown", this.opStart.bind(this, Window.mSizeN) );
    td = document.createElement("td"); tr.appendChild(td);
    td.classList = "sizer-ne";
    td.addEventListener("mousedown", this.opStart.bind(this, Window.mSizeNE) );

    tr = document.createElement("tr"); table.appendChild(tr);
    td = document.createElement("td"); tr.appendChild(td);
    td.classList = "sizer-w";
    td.addEventListener("mousedown", this.opStart.bind(this, Window.mSizeW) );
    td = document.createElement("td"); tr.appendChild(td);
    td = document.createElement("td"); tr.appendChild(td);
    td.classList = "sizer-e";
    td.addEventListener("mousedown", this.opStart.bind(this, Window.mSizeE) );

    tr = document.createElement("tr"); table.appendChild(tr);
    td = document.createElement("td"); tr.appendChild(td);
    td.classList = "sizer-sw";
    td.addEventListener("mousedown", this.opStart.bind(this, Window.mSizeSW) );
    td = document.createElement("td"); tr.appendChild(td);
    td.classList = "sizer-s";
    td.addEventListener("mousedown", this.opStart.bind(this, Window.mSizeS) );
    td = document.createElement("td"); tr.appendChild(td);    
    td.classList = "sizer-se";
    td.addEventListener("mousedown", this.opStart.bind(this, Window.mSizeSE) );
    
    this.div = document.createElement("div");
    this.div.classList = "window" ;
    this.divBar = document.createElement("div");
    this.divBar.classList = "bar" ;
    this.divBar.addEventListener("mousedown", this.opStart.bind(this, Window.mMove) );
    this.divWork = document.createElement("div");
    this.divWork.classList = "workarea" ;
    this.div.appendChild( table );
    this.div.appendChild( this.divBar );
    this.div.appendChild( this.divWork );

    document.body.appendChild(this.div);
  }

  //  Start of operation
  //    m: transform matrix
  //
  opStart ( m, ev ) {
    trace(ev.clientX+", "+ev.clientY);
    Window.eatEvent(ev);

    //  Put window on top
    //
    document.body.appendChild(this.div);

    let cs = window.getComputedStyle(this.div) ;
    this.left = parseInt(cs.left) ;
    this.top = parseInt(cs.top) ;

    //  NOTE: compute inner width & height to get the same behavior with Firefox
    //  & Chrome since they handle scroller presence differently.
    //
    cs = window.getComputedStyle(this.divWork) ;
    this.width = this.divWork.offsetWidth - parseFloat(cs.paddingLeft)
      - parseFloat(cs.paddingRight) - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth);
    this.height = this.divWork.offsetHeight - parseFloat(cs.paddingTop)
      - parseFloat(cs.paddingBottom) - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth);

    //  Install a ground to catch all events
    //
    this.gnd = document.createElement("div");
    this.gnd.style.position = "absolute";
    this.gnd.style.left = "0";
    this.gnd.style.top = "0";
    this.gnd.style.width = "100%";
    this.gnd.style.height = "100%";
    this.gnd.addEventListener("mousemove", this.opApply.bind(this,m) );
    this.gnd.addEventListener("mouseup", this.opEnd.bind(this) );
    document.body.appendChild(this.gnd);
  }

  //  Apply operation
  //
  opApply ( [dx,dy,dw,dh], ev ) {
    Window.eatEvent(ev);

    //  Skip 'fake' movements
    //
    if ( ev.movementX == 0 && ev.movementY == 0 ) {
      trace("fake");
      return ;
    }

    dx = ev.movementX*dx ;
    dy = ev.movementY*dy ;
    dw = ev.movementX*dw ;
    dh = ev.movementY*dh ;

    trace(ev.movementX+","+ev.movementY+" => "+dx+" "+dy+" "+dw+" "+dh);

    if ( dx ) { this.left   += dx ; this.div.style.left = this.left+"px" ; }
    if ( dy ) { this.top    += dy ; this.div.style.top  = this.top+"px" ; }
    if ( dw ) { this.width  += dw ; this.divWork.style.width  = this.width+"px" ; }
    if ( dh ) { this.height += dh ; this.divWork.style.height = this.height+"px" ; }
  }

  //  End of operation: remove the ground.
  //
  opEnd ( ev ) {
    trace();
    Window.eatEvent(ev);
    document.body.removeChild(this.gnd);
    this.gnd = undefined ;
  }
}
