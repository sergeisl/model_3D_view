/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.FirstPersonControls = function ( object, domElement ) {

	this.object = object;
	this.target = new THREE.Vector3( 0, 0, 0 );

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.movementSpeed = 1.0;
	this.lookSpeed = 0.005;

	this.lookVertical = true;
	this.autoForward = false;
	// this.invertVertical = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.mouseMoveFlag = false;
  this.mouseButton0PressState = false;
  this.mouseXRel = 0;
  this.mouseYRel = 0;
  this.moveMode = 0; // 0 - rotate, 1 - move
  this.minAngle = -1.57;
  this.maxAngle = 1.57;

  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.angle = 0.6;
  this.direction = Math.PI;
  this.directiony = Math.PI;
  this.distance = 5;
   

	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.freeze = false;

	this.mouseDragOn = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', -1 );

	}

	//

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};

	this.onMouseDown = function ( event ) {

		 if (event.button == 0) {
      this.mouseButton0PressState = true;
    }

	};

	this.onMouseUp = function ( event ) {

		 if (event.button == 0) {
      this.mouseButton0PressState = false;
      if (this.mouseMoveFlag == false) {
        // кнопка была нажата но мыш не двигалась, будем считать это кликом по объекту
        console.log("click");
      } else {
        this.mouseMoveFlag = false;
      }
    }

	};

	this.onMouseMove = function ( event ) {

    var br = event.target.getBoundingClientRect();
    mx = event.clientX - br.left;
    my = event.clientY - br.top;
    this.mouseXRel = mx - this.mouseX;
    this.mouseYRel = my - this.mouseY;
    this.mouseX = mx;
    this.mouseY = my;
    if (this.mouseButton0PressState == true) {
      this.mouseMoveFlag = true;
      if (this.moveMode == 0) {
        this.angle = this.angle + this.mouseYRel * 0.01;
        if (this.angle > this.maxAngle) {
          this.angle = this.maxAngle;
        } else if (this.angle < this.minAngle) {
          this.angle = this.minAngle;
        }
        this.direction += this.mouseXRel * 0.01;
        this.directiony += this.mouseYRel * 0.01;
        
		var dir = this.direction + Math.PI;
		var diry = this.directiony + Math.PI;
    var zA = Math.cos(this.angle);
    var vx = - zA * Math.sin(dir);
    var vy = Math.sin(this.angle)
    var vz = zA * Math.cos(dir);
    this.object.position.set(vx  + this.x, vy + this.y, vz  + this.z);
    this.object.lookAt(new THREE.Vector3(this.x, this.y, this.z));
    this.object.updateProjectionMatrix();

      } else {
        // корректируем вектор смещения относительно направления камеры
        // чтобы двигалось относительно экрана а не относительно мировых координат
        var directionCos = Math.cos(this.direction);
        var directionSin = Math.sin(this.direction);
        var vx = this.mouseXRel * directionCos - this.mouseYRel * directionSin;
        var vz = this.mouseXRel * directionSin + this.mouseYRel * directionCos;
        this.x -= vx * 0.01;
        this.z -= vz * 0.01;    
		var dir = this.direction + Math.PI;
		var diry = this.directiony + Math.PI;
    var zA = Math.cos(this.angle);
    var vx = - zA * Math.sin(diry);
    var vy = Math.sin(this.angle) 
    var vz = zA * Math.cos(dir);
    this.object.position.set(vx  + this.x, vy  + this.y, vz + this.z);
    this.object.lookAt(new THREE.Vector3(this.x, this.y, this.z));
    this.object.updateProjectionMatrix();

      }

    
    }

	};

	this.onKeyDown = function ( event ) {

		event.preventDefault();

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;

			case 81: /*Q*/ this.freeze = !this.freeze; break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;

		}

	};

	this.update = function( delta ) {

		if ( this.freeze ) {

			return;

		}

		if ( this.heightSpeed ) {

			var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
			var heightDelta = y - this.heightMin;

			this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

		} else {

			this.autoSpeedFactor = 0.0;

		}

		var actualMoveSpeed = delta * this.movementSpeed;
		position = this.object.position;
		if ( this.moveForward || ( this.autoForward && !this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
		if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

		if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
		if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

		if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
		if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

	if ( this.moveForward || this.moveBackward || this.moveLeft  || this.moveRight ) {
 
  this.x = position.x;
  this.y = position.y;
  this.z = position.z; 
  
  }
	};


	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
	this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
	this.domElement.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );
	this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
	this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.handleResize();

};
