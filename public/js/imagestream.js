(function(){
	var el = document.getElementById('screen')
	var i = 0;
	var img = document.createElement('img');
	img.width = 1;
	img.height = 1;
	img.src = 'image.png'

	img.onload = function() {
		el.style.backgroundImage = 'url('+this.src+')'
	}

	el.appendChild(img)
	

	setInterval(function() {
		img.src = ('/image.png?' + (i++))
		//el.style.backgroundImage = ('url(/image.png?' + (i++) + ')')
	}, 500)
})()