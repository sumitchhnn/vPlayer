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
		vPlayer.video.setAttribute('id' , 'videoPlayer');
		source.src = vPlayer.vplayerConfig.sourcePath + vPlayer.vplayerConfig.src;
		source.type = 'video/mp4';
		
		vPlayer.video.appendChild(source);
		vPlayer.vPlayerContainer.appendChild(vPlayer.video);
		vPlayer.container.appendChild(vPlayer.vPlayerContainer);
		vPlayer.video.play();
		vPlayer.video.addEventListener('onplaying', function () {
			pauseButton.classList.add('playPauseVideo');
			playButton.classList.add('playVideo');
		});
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
		for(var i=0; i< 5; i++) {
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
		document.getElementById('controls1').addEventListener('click', vPlayer.pauseVideo);
		document.getElementById('controls3').addEventListener('click', vPlayer.playVideo);
		document.getElementById('controls4').addEventListener('click', vPlayer.stopVideo);
		document.getElementById('controls2').addEventListener('click', vPlayer.nextVideo);
		document.getElementById('controls0').addEventListener('click', vPlayer.prevVideo);
		document.getElementById('progressBar').addEventListener('click',vPlayer.progressBarEvent);
	},
	pauseVideo : function () {
		vPlayer.video.pause();
		vPlayer.video.onpause = vPlayer.playPauseToggle();
	},
	playVideo : function () {
		vPlayer.video.play();
		vPlayer.video.onplay = vPlayer.playPauseToggle();
	},
	stopVideo : function () {
		vPlayer.video.currentTime = vPlayer.video.duration + 1000;
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
		document.getElementById('controls').style.marginTop =  '-30px';
	},
	hideControls : function () {
		document.getElementById('controls').style.marginTop =  '29px';
	},
	playPauseToggle : function() {
		var playButton = document.getElementById('controls3');
		var pauseButton = document.getElementById('controls1');
		var style = window.getComputedStyle(document.getElementById('controls3'));
		if(style.getPropertyValue('display') === 'none'){
			pauseButton.classList.add('playPauseVideo');
			playButton.classList.add('playVideo');
		} else {
			pauseButton.classList.remove('playPauseVideo');
			playButton.classList.remove('playVideo');
		} 
	},
	stopEvents : function() {
		var playButton = document.getElementById('controls3');
		var pauseButton = document.getElementById('controls1');
		var style = window.getComputedStyle(document.getElementById('controls3'));
		if(style.getPropertyValue('display') === 'none'){
			pauseButton.classList.add('playPauseVideo');
			playButton.classList.add('playVideo');
		}
	},
	playListEvent : function () {
		var key ="";
		for(var list in vPlayer.vplayerConfig.playList) {
			if(vPlayer.vplayerConfig.playList[list] === this.children[0].innerText) {
				key = list;
			}
		}
		vPlayer.video.children[0].attributes[0].value = vPlayer.vplayerConfig.sourcePath + vPlayer.vplayerConfig.playList[key];
		vPlayer.video.load();
		vPlayer.video.play();
	},
	nextOperation : function () {
		var currentKey = vPlayer.extractKey();
		var keys = Object.keys(vPlayer.vplayerConfig.playList);
		for(var i = 0; i < keys.length; i++ ) {
			if(keys[i] === currentKey) {
				return keys[i+1];
			}
		}
		return null;
	},
	prevOperation : function () {
		var currentKey = vPlayer.extractKey();
		var keys = Object.keys(vPlayer.vplayerConfig.playList);
		for(var i = 0; i < keys.length; i++ ) {
			if(keys[i] === currentKey) {
				return keys[i-1];
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