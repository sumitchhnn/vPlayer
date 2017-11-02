"use strict";
var vPlayer = vPlayer || {};
vPlayer = {
	vplayerConfig : {},
	container : {},
	vPlayerContainer : {},
	video : {},
	playerList: {},
	config : function (configuration) {
		for(var key in configuration) {
			vPlayer.vplayerConfig[key] = configuration[key];
		}
		vPlayer.appendVideoElement();
		if(vPlayer.vplayerConfig.playListEnabled){
			for(var key in configuration.playList) {
				vPlayer.playerList[key] = configuration.playList[key];
			}
			vPlayer.vPlayerList();
		}
		if(vPlayer.vplayerConfig.controls){
			vPlayer.vPlayersControls();
			vPlayer.initializeControls();
		}
	},
	appendVideoElement : function () {
		
		vPlayer.container = document.getElementById(vPlayer.vplayerConfig.elementClass);
		vPlayer.vPlayerContainer = document.createElement('div');
		vPlayer.vPlayerContainer.setAttribute('id' , 'vPlayer-container');
		
		vPlayer.video = document.createElement('video');
		var source = document.createElement('source');
		vPlayer.video.setAttribute('class' , 'videoPlayer');
		source.src = vPlayer.vplayerConfig.sourcePath + vPlayer.vplayerConfig.src;
		source.type = 'video/mp4';
		
		vPlayer.video.appendChild(source);
		vPlayer.vPlayerContainer.appendChild(vPlayer.video);
		vPlayer.container.appendChild(vPlayer.vPlayerContainer);
		vPlayer.video.play();
		vPlayer.video.addEventListener('onplaying', function () {
			pauseButton.classList.add('hide');
			playButton.classList.add('show');
		});
		vPlayer.video.addEventListener('click', vPlayer.playPauseToggle);
		vPlayer.video.addEventListener('ended', vPlayer.nextVideo);
	},
	vPlayerList : function () {
		var listContainer = document.createElement('div');
		var vPlayerList = document.createElement('ul');
		listContainer.appendChild(vPlayerList);
		listContainer.id = 'playerList';
		for(var listKey in vPlayer.playerList) {
			var list = document.createElement('li');
			var playListContainer = document.createElement('div');
			playListContainer.appendChild(document.createTextNode(vPlayer.playerList[listKey]));
			list.appendChild(playListContainer);
			list.addEventListener('click', vPlayer.playListEvent);
			vPlayerList.append(list);
		}
		document.getElementById('vPlayer-container').appendChild(listContainer);
	},
	vPlayersControls : function () {
		var controlsContainer = document.createElement('ul');
		controlsContainer.id = 'controls';
		vPlayer.vPlayerContainer.appendChild(controlsContainer);
		for(var i=0; i < 7; i++) {
			var controls = document.createElement('li');
			controls.id = 'controls' + i;
			controlsContainer.appendChild(controls);
		}
		var progressBar = document.createElement('progress');
		progressBar.id = 'progressBar';
		progressBar.classList.add('progressBar');
		progressBar.max = 100;
		controlsContainer.appendChild(progressBar);
		setInterval(vPlayer.updateProgressBar,1000);
		vPlayer.vPlayerContainer.onmouseover = vPlayer.showControls;
		vPlayer.vPlayerContainer.onmouseout = vPlayer.hideControls;
	},
	initializeControls : function () {
		document.getElementById('controls1').addEventListener('click', vPlayer.playPauseToggle);
		document.getElementById('controls3').addEventListener('click', vPlayer.playPauseToggle);
		document.getElementById('controls4').addEventListener('click', vPlayer.stopVideo);
		document.getElementById('controls2').addEventListener('click', vPlayer.nextVideo);
		document.getElementById('controls0').addEventListener('click', vPlayer.prevVideo);
		document.getElementById('controls5').addEventListener('click', vPlayer.zoomInOut);
		document.getElementById('controls6').addEventListener('click', vPlayer.zoomInOut);
		document.getElementById('progressBar').addEventListener('click',vPlayer.progressBarEvent);
	},
	stopVideo : function () {
		vPlayer.video.currentTime = vPlayer.video.duration + 1000;
		vPlayer.video.removeEventListener('ended', vPlayer.nextVideo);
		vPlayer.video.onended = vPlayer.stopEvents();
	},
	nextVideo : function () {
		if(vPlayer.video.currentTime !== 0 ) {
			var key = vPlayer.nextOperation();
			if(key !== undefined) {
				vPlayer.video.children[0].attributes[0].value = vPlayer.vplayerConfig.sourcePath + vPlayer.vplayerConfig.playList[key];
			}
			progressBar.value = vPlayer.video.currentTime;
			vPlayer.video.load();
			vPlayer.video.play();
		}
	},
	prevVideo : function () {
		if(vPlayer.video.currentTime !== 0) {
			var key = vPlayer.prevOperation();
			if(key !== undefined) {
				vPlayer.video.children[0].attributes[0].value = vPlayer.vplayerConfig.sourcePath + vPlayer.vplayerConfig.playList[key];
			}
			vPlayer.video.load();
			vPlayer.video.play();
		}
	},
	updateProgressBar : function () {
		var percentage = Math.floor((100 / vPlayer.video.duration) * vPlayer.video.currentTime);
		if (!isNaN(percentage)) {
			document.getElementById('progressBar').value = percentage;
			document.getElementById('progressBar').innerHTML = percentage + '% played';
		}
	},
	showControls : function () {
		if(!vPlayer.vPlayerContainer.classList.contains('zoomIn')) {
			document.getElementById('controls').style.marginTop =  '-30px';
		} else {
			document.getElementById('controls').style.marginTop =  '50vh';
		}
	},
	hideControls : function () {
		if(!vPlayer.vPlayerContainer.classList.contains('zoomIn')) {
			document.getElementById('controls').style.marginTop =  '29px';
		} else {
			document.getElementById('controls').style.marginTop =  '100vh';
		}
	},
	playPauseToggle : function() {
		var playButton = document.getElementById('controls3');
		var pauseButton = document.getElementById('controls1');
		var style = window.getComputedStyle(document.getElementById('controls3'));
		if(style.getPropertyValue('display') === 'none'){
			vPlayer.video.pause();
			playButton.classList = '';
			pauseButton.classList = '';
			pauseButton.classList.add('hide');
			playButton.classList.add('show');
		} else {
			vPlayer.video.play();
			vPlayer.video.removeEventListener('ended', vPlayer.nextVideo);
			pauseButton.classList.remove('hide');
			playButton.classList.remove('show');
		} 
	},
	zoomInOut : function () {
		var zoomIn = document.getElementById('controls5');
		var zoomOut = document.getElementById('controls6');
		var style = window.getComputedStyle(document.getElementById('controls6'));
		if(style.getPropertyValue('display') === 'none'){
			vPlayer.vPlayerContainer.classList.add('zoomIn');
			vPlayer.video.classList.add('zoomIn');
			zoomIn.classList.add('hide');
			zoomOut.classList.add('show');
		} else {
			vPlayer.vPlayerContainer.classList.remove('zoomIn');
			vPlayer.video.classList.remove('zoomIn');
			zoomIn.classList.remove('hide');
			zoomOut.classList.remove('show');
		}
	},
	stopEvents : function() {
		var playButton = document.getElementById('controls3');
		var pauseButton = document.getElementById('controls1');
		playButton.classList = '';
		pauseButton.classList = '';
		var style = window.getComputedStyle(document.getElementById('controls3'));
		if(style.getPropertyValue('display') === 'none'){
			pauseButton.classList.add('hide');
			playButton.classList.add('show');
		}
	},
	playListEvent : function () {
		var key ="";
		var playButton = document.getElementById('controls3');
		var pauseButton = document.getElementById('controls1');
		for(var list in vPlayer.vplayerConfig.playList) {
			if(vPlayer.vplayerConfig.playList[list] === this.children[0].innerText) {
				key = list;
			}
		}
		playButton.classList = '';
		pauseButton.classList = '';
		pauseButton.classList.add('show');
		playButton.classList.add('hide');
		vPlayer.video.children[0].attributes[0].value = vPlayer.vplayerConfig.sourcePath + vPlayer.vplayerConfig.playList[key];
		vPlayer.video.load();
		vPlayer.video.play();
	},
	nextOperation : function () {
		var currentKey = vPlayer.extractKey();
		var keys = Object.keys(vPlayer.vplayerConfig.playList);
		for(var i = 0; i < keys.length; i++ ) {
			if(keys[i] === currentKey) {
				if(i === keys.length - 1) {
					return keys[0];
				} else {
					return keys[i+1];
				}
			}
		}
		return null;
	},
	prevOperation : function () {
		var currentKey = vPlayer.extractKey();
		var keys = Object.keys(vPlayer.vplayerConfig.playList);
		for(var i = 0; i < keys.length; i++ ) {
			if(keys[i] === currentKey) {
				if(i === 0) {
					return keys[keys.length - 1];
				} else {
					return keys[i-1];
				}
			}
		}
		return null;
	},
	extractKey : function() {
		for(var list in vPlayer.vplayerConfig.playList) {
			if(vPlayer.vplayerConfig.sourcePath + vPlayer.vplayerConfig.playList[list] === vPlayer.video.children[0].attributes["0"].value) {
				return list;
			}
		}
		return null;
	},
	progressBarEvent : function(event) {
		var progressBar = document.getElementById('progressBar');
        var clickedValue = (event.offsetX / this.offsetWidth);
		vPlayer.video.currentTime = clickedValue * vPlayer.video.duration;
		progressBar.value = clickedValue/100;
	}
}; 