var PointerLockControls = function ( socket ) {

	var scope = this;

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		if (movementY && movementX) {
			socket.emit('mousemove': { x: movementX, y: movementY });
		}
	};

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				socket.emit('movement', { directions: [ {forward: true} ] });
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				socket.emit('movement', { directions: [ {left: true} ] });
				moveLeft = true;
				break;
			case 40: // down
			case 83: // s
				socket.emit('movement', { directions: [ {backward: true} ] });
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				socket.emit('movement', { directions: [ {right: true} ] });
				moveRight = true;
				break;
			case 32: // space
				socket
				break;
		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				socket.emit('movement', { directions: [ {forward: false} ] });
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				socket.emit('movement', { directions: [ {left: false} ] });
				moveLeft = false;
				break;

			case 40: // down
			case 83: // a
				socket.emit('movement', { directions: [ {backward: false} ] });
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				socket.emit('movement', { directions: [ {'right': false} ]  });
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.update = function ( delta ) {

		if ( scope.enabled === false ) return;

		delta *= 0.1;

		velocity.x += ( - velocity.x ) * 0.08 * delta;
		velocity.z += ( - velocity.z ) * 0.08 * delta;

		velocity.y -= 0.25 * delta;

		if ( moveForward ) velocity.z -= 0.12 * delta;
		if ( moveBackward ) velocity.z += 0.12 * delta;

		if ( moveLeft ) velocity.x -= 0.12 * delta;
		if ( moveRight ) velocity.x += 0.12 * delta;

		if ( isOnObject === true ) {

			velocity.y = Math.max( 0, velocity.y );

		}

		if ( yawObject.position.y < 10 ) {

			velocity.y = 0;
		}

	};

};
