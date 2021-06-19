
//  A window is made of a DIV containing:
//    * a background TABLE that handles events for resizing
//    * divBar: title bar DIV
//    * divArea: work area DIV
//
class Window {

  //  Matrices for window move/resize
  //    [dx,dy]*[m] => [left,top,width,height]
  //
  static mSizeNW = [ 1, 1, -1, -1 ];
  static mSizeN  = [ 0, 1,  0, -1 ];
  static mSizeNE = [ 0, 1,  1, -1 ];
  static mSizeW  = [ 1, 0, -1,  0 ];
  static mSizeE  = [ 0, 0,  1,  0 ];
  static mSizeSW = [ 1, 0, -1,  1 ];
  static mSizeS  = [ 0, 0,  0,  1 ];
  static mSizeSE = [ 0, 0,  1,  1 ];
  static mMove   = [ 1, 1,  0,  0 ];

  static eatEvent ( ev ) {
    ev.stopPropagation();
    ev.preventDefault();
  }

  //  Create a new window, append its DIV to the document body
  //
  constructor ( props={} ) {
    const { left,
	    top,
	    width,
	    height,
	    title,
	  } = props;

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
    td.onpointerdown = this.opStart.bind(this, Window.mSizeNW);
    td = document.createElement("td"); tr.appendChild(td);
    td.classList = "sizer-n";
    td.onpointerdown = this.opStart.bind(this, Window.mSizeN);
    td = document.createElement("td"); tr.appendChild(td);
    td.classList = "sizer-ne";
    td.onpointerdown = this.opStart.bind(this, Window.mSizeNE);

    tr = document.createElement("tr"); table.appendChild(tr);
    td = document.createElement("td"); tr.appendChild(td);
    td.classList = "sizer-w";
    td.onpointerdown = this.opStart.bind(this, Window.mSizeW);
    td = document.createElement("td"); tr.appendChild(td);
    td = document.createElement("td"); tr.appendChild(td);
    td.classList = "sizer-e";
    td.onpointerdown = this.opStart.bind(this, Window.mSizeE);

    tr = document.createElement("tr"); table.appendChild(tr);
    td = document.createElement("td"); tr.appendChild(td);
    td.classList = "sizer-sw";
    td.onpointerdown = this.opStart.bind(this, Window.mSizeSW);
    td = document.createElement("td"); tr.appendChild(td);
    td.classList = "sizer-s";
    td.onpointerdown = this.opStart.bind(this, Window.mSizeS);
    td = document.createElement("td"); tr.appendChild(td);    
    td.classList = "sizer-se";
    td.onpointerdown = this.opStart.bind(this, Window.mSizeSE);
    
    this.div = document.createElement("div");
    this.div.classList = "window" ;
    this.divBar = document.createElement("div");
    this.divBar.classList = "bar" ;
    this.divBar.onpointerdown = this.opStart.bind(this, Window.mMove);
    this.divArea = document.createElement("div");
    this.divArea.classList = "area" ;
    this.div.appendChild( table );
    this.div.appendChild( this.divBar );
    this.div.appendChild( this.divArea );

    //  Place & size the window
    //
    this.centerX = ( left == undefined ) ;
    this.centerY = ( top == undefined ) ;

    if ( left   ) this.div.style.left   = left;
    if ( top    ) this.div.style.top    = top;
    if ( width  ) this.div.style.width  = width;
    if ( height ) this.div.style.height = height;
    if ( title  ) this.setTitleHTML(title);

    //  Use an observer to layout the window
    //
    this.observer = new ResizeObserver(this.layout.bind(this));
    this.observer.observe(this.div);

    document.body.appendChild(this.div);
  }

  //  Layout the window, size the area.
  //    Use CSS "box-sizing: border-box;" for 'div.window' to get outside box values
  //
  layout ( ) {
    let p = this.divBar.offsetTop ;	//  = padding
    let t = this.divArea.offsetTop ;	// t-p = bar height

    let h = this.div.offsetHeight - t - p ;
    let w = this.div.offsetWidth - 2*p ;

    trace("w="+w+", h="+h);

    this.divArea.style.height = h+"px" ;
    this.divArea.style.width = w+"px" ;

    if ( this.centerX ) {
      let w = this.div.offsetWidth;
      this.div.style.left = window.innerWidth/2-w/2+"px";
    }

    if ( this.centerY ) {
      let h = this.div.offsetHeight;
      this.div.style.top = window.innerHeight/2-h/2+"px";
    }
  }

  //  Start of operation.
  //    m: transform matrix
  //
  opStart ( m, ev ) {
    Window.eatEvent(ev);

    trace(ev.clientX+", "+ev.clientY);

    this.centerX = false ;
    this.centerY = false ;

    //  Put window on top
    //
    document.body.appendChild(this.div);

    this.left = this.div.offsetLeft ;
    this.top = this.div.offsetTop ;
    this.width = this.div.offsetWidth;
    this.height = this.div.offsetHeight;

    ev.target.onpointermove = this.opApply.bind(this,m);
    ev.target.onpointerup = this.opEnd.bind(this);
    ev.target.setPointerCapture(ev.pointerId);
  }

  //  Apply operation.
  //    The observer calls 'layout()' if the size changes.
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
    if ( dw ) { this.width  += dw ; this.div.style.width  = this.width+"px" ; }
    if ( dh ) { this.height += dh ; this.div.style.height = this.height+"px" ; }
  }

  //  End of operation
  //
  opEnd ( ev ) {
    Window.eatEvent(ev);
    trace();
    ev.target.onpointermove = null ;
    ev.target.releasePointerCapture(ev.pointerId);
  }

  setTitleHTML ( html ) {
    this.divBar.innerHTML = html ;
    return this;
  }

  setChild ( div ) {
    while ( this.divArea.firstChild )
      this.divArea.removeChild( this.div.firstChild ) ;
    this.divArea.appendChild(div);
    return this;
  }
}
