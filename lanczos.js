var imageData, width, height, lobes, lanczos, ratio, range2, rcp_ratio, data, elem;

var cacheLanc = {};
var center = {};
var icenter = {};
var counter = 0;

onmessage = function(event) {
		
		imageData = event.data.imageData;
		width = event.data.width;
		height = imageData.height * width / imageData.width;
		lobes = event.data.lobes;
		elem = event.data.elem;
		
		lanczos = lanczosCreate(lobes);
		data = new Array(width * height * 3);
		ratio = imageData.width / width;
		rcp_ratio = 2 / ratio;
		range2 = Math.ceil(ratio * lobes / 2);
		
		processOne(0);
	
};


//returns a function that calculates lanczos weight
function lanczosCreate(lobes){
	return function(x){
		if (x > lobes) 
			return 0;
		x *= Math.PI;
		if (Math.abs(x) < 1e-16) 
			return 1
		var xx = x / lobes;
		return Math.sin(x) * Math.sin(xx) / x / xx;
	}
}



function processOne(u){
	center.x = (u + 0.5) * ratio;
	icenter.x = Math.floor(center.x);
	for (var v = 0; v < height; v++) {
		center.y = (v + 0.5) * ratio;
		icenter.y = Math.floor(center.y);
		var a, r, g, b;
		a = r = g = b = 0;
		for (var i = icenter.x - range2; i <= icenter.x + range2; i++) {
			if (i < 0 || i >= imageData.width) 
				continue;
			var f_x = Math.floor(1000 * Math.abs(i - center.x));
			if (!cacheLanc[f_x]) 
				cacheLanc[f_x] = {};
			for (var j = icenter.y - range2; j <= icenter.y + range2; j++) {
				if (j < 0 || j >= imageData.height) 
					continue;
				var f_y = Math.floor(1000 * Math.abs(j - center.y));
				if (cacheLanc[f_x][f_y] == undefined) 
					cacheLanc[f_x][f_y] = lanczos(Math.sqrt(Math.pow(f_x * rcp_ratio, 2) + Math.pow(f_y * rcp_ratio, 2)) / 1000);
				weightr = cacheLanc[f_x][f_y];
				if (weightr > 0) {
					var idx = (j * imageData.width + i) * 4;
					a += weightr;
					r += weightr * imageData.data[idx];
					g += weightr * imageData.data[idx + 1];
					b += weightr * imageData.data[idx + 2];
				}
			}
		}
		var idx = (v * width + u) * 3;
		data[idx] = r / a;
		data[idx + 1] = g / a;
		data[idx + 2] = b / a;
	}

	if (++u < width) 
		setTimeout(processOne, 0, u);
	else
		setTimeout(processTwo, 0);
};


function processTwo(){
	var idx, idx2;
	for (var i = 0; i < width; i++) {
		for (var j = 0; j < height; j++) {
			idx = (j * width + i) * 3;
			idx2 = (j * width + i) * 4;
			imageData.data[idx2] = data[idx];
			imageData.data[idx2 + 1] = data[idx + 1];
			imageData.data[idx2 + 2] = data[idx + 2];
		}
	}
	postMessage({
		'imageData':imageData, 'height':height, 'width':width
	});
}


