window.onload = function () {

	var lLrcSocket = new WebSocket("ws://" + location.hostname +":3001");

	/*var lActiveTouch = null;

	var lMouseAreaDom = document.getElementById('mouse_area');
	lMouseAreaDom.addEventListener('touchstart', function (aEvent) {
		if (lActiveTouch === null) {
			aEvent.preventDefault();
			lActiveTouch = aEvent.changedTouches[0];
		}
	}, false);
	lMouseAreaDom.addEventListener('touchend', function (aEvent) {
		if (aEvent.changedTouches[0].identifier === lActiveTouch.identifier) {
			lActiveTouch = null;
		}
	}, false);
	lMouseAreaDom.addEventListener('touchmove', function (aEvent) {
		if (aEvent.changedTouches[0].identifier === lActiveTouch.identifier) {
			var lDeltaX = parseInt((aEvent.changedTouches[0].clientX - lActiveTouch.clientX) * 3);
			var lDeltaY = parseInt((aEvent.changedTouches[0].clientY - lActiveTouch.clientY) * 3);
			lActiveTouch = aEvent.changedTouches[0];

			lLrcSocket.send(lDeltaX + ';' + lDeltaY);
		}
	}, false);*/

	var lTouchBox = new teTouchBox('mouse_area');
	lTouchBox.eTap = function () {
		var lCommand = {
			task: 'click'
		};

		lLrcSocket.send(JSON.stringify(lCommand));
	};

	lTouchBox.ePan = function (aFinger) {
		var lTotalDelta = aFinger.currPos.sub(aFinger.startPos).len();

		var lCommand = {
			task: 'mousemove',
			delta_x: aFinger.deltaPos.x * Math.round(1.0 + Math.abs(lTotalDelta) / 30),
			delta_y: aFinger.deltaPos.y * Math.round(1.0 + Math.abs(lTotalDelta) / 30)
		};

		lLrcSocket.send(JSON.stringify(lCommand));
	};

	var lLeftButtonDom = document.getElementById('mouse_left_button');
	var lLeftButtonTouchBox = new teTouchBox(lLeftButtonDom);
	lLeftButtonTouchBox.eTap = function () {
		var lCommand = {};
		if (lLeftButtonDom.classList.contains('selected')) {
			lLeftButtonDom.classList.remove('selected');
			lCommand.task = 'mouseup';
		} else {
			lLeftButtonDom.classList.add('selected');
			lCommand.task = 'mousedown';
		}
		lLrcSocket.send(JSON.stringify(lCommand));
	};



	//Keyboard initialization
	var lKeyList = document.querySelectorAll('.kb_key');
	var lKeyCount = lKeyList.length;
	var lKey;

	var nKeyDown = function (aEvent) {
		var lCommand = {};
		var lKeyDom = aEvent.target;
		var lKeyCode = lKeyDom.dataset.keyCode;

		if (lKeyCode) {
			lKeyDom.classList.add('down')

			lCommand.task = 'keydown';
			lCommand.key = lKeyCode;

			lLrcSocket.send(JSON.stringify(lCommand));
		}

		aEvent.preventDefault();
		aEvent.stopPropagation();
	};

	var nKeyUp = function (aEvent) {
		var lCommand = {};
		var lKeyDom = aEvent.target;
		var lKeyCode = lKeyDom.dataset.keyCode;

		if (lKeyCode) {
			lKeyDom.classList.remove('down')

			lCommand.task = 'keyup';
			lCommand.key = lKeyCode;

			lLrcSocket.send(JSON.stringify(lCommand));
		}

		aEvent.preventDefault();
		aEvent.stopPropagation();
	};

	for (var i = 0; i < lKeyCount; i++) {
		lKey = lKeyList[i];
		lKey.addEventListener("mousedown", nKeyDown, false);
		lKey.addEventListener("touchstart", nKeyDown, false);
		lKey.addEventListener("mouseup", nKeyUp, false);
		lKey.addEventListener("touchend", nKeyUp, false);
	}


	var lKeyboard = document.getElementById('keyboard');
	var lKeyboardToggle = document.getElementById('keyboard_toggle');
	var nKeyboardToggle = function (aEvent) {
		if (lKeyboardToggle.classList.contains('selected')) {
			lKeyboard.style.display = 'none';
			lKeyboardToggle.classList.remove('selected');
		} else {
			lKeyboard.style.display = 'block';
			lKeyboardToggle.classList.add('selected');
		}
	};

	lKeyboardToggle.addEventListener("click", nKeyboardToggle, false);
	//lKeyboardToggle.addEventListener("touchend", nKeyboardToggle, false);
};
