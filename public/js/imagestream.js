(function(){
	var el = document.getElementById('screen')
	var i = 0;
	setInterval(function() {
		console.log(el.style.backgroundImage)
		el.style.backgroundImage = ('url(/image.png?' + (i++) + ')')
	}, 100)
})()