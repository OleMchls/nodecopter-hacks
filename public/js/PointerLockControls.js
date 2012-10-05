var PointerLockControls = function ( socket ) {

	var scope = this;

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var mousemove = {x: 0, y: 0};

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		if (movementY || movementX) {
			mousemove.x += movementX;
			mousemove.y += movementY;
		}
	};

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true;
				break;
			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;
			case 32: // space
				socket.emit('animation', ['flipAhead', 1000] );
				break;
		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // a
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.enable = function (  ) {
		scope.enabled = true;
	};

	this.disable = function () {
		scope.enabled = false;
	}

	this.update = function ( ) {
		if ( scope.enabled === false ) return;

		socket.emit('movement', { directions: [ moveForward, moveRight, moveBackward, moveLeft], mouse: [mousemove.x, mousemove.y]});
		mousemove.x = 0;
		mousemove.y = 0;

	};

	this.enable = function() {
		scope.enabled = true;
	}

	this.disable = function() {
		scope.enabled = false;
	}

};
