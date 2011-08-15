var data, srcdata, width, height, srcheight, srcwidth;

onmessage = function(event) {
	//imageDataNew = event.data.imageDataNew;
		
	//this.img = img;
	this.src = event.data.imageData;
	/*this.dest = {
		width: event.data.width,
		height: Math.round(event.data.imageData.height * event.data.width / event.data.imageData.width)
	};
	this.dest.data = new Array(this.dest.width * this.dest.height * 3); */
	this.dest = event.data.imageDataNew
	this.lanczos = lanczosCreate(event.data.lobes);
	this.ratio = event.data.imageData.width / event.data.width;
	this.rcp_ratio = 2 / this.ratio;
	this.range2 = Math.ceil(this.ratio * event.data.lobes / 2);
	this.cacheLanc = {};
	this.center = {};
	this.icenter = {};

	data = self.dest.data;
	width = self.dest.width;
	height = Math.round(event.data.imageData.height * self.dest.width / event.data.imageData.width);
	srcdata = self.src.data;
	srcheight = event.data.imageData.height;
	srcwidth = event.data.imageData.width;
	srcdata = self.src.data;
	processOne(this, 0);
	
}


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


function processOne(self, u){
	self.center.x = (u + 0.5) * self.ratio;
	self.icenter.x = Math.floor(self.center.x);
	for (var v = 0; v < height; v++) {
		self.center.y = (v + 0.5) * self.ratio;
		self.icenter.y = Math.floor(self.center.y);
		var a, r, g, b;
		a = r = g = b = 0;
		for (var i = self.icenter.x - self.range2; i <= self.icenter.x + self.range2; i++) {
			if (i < 0 || i >= srcwidth) 
				continue;
			var f_x = Math.floor(1000 * Math.abs(i - self.center.x));
			if (!self.cacheLanc[f_x]) 
				self.cacheLanc[f_x] = {};
			for (var j = self.icenter.y - self.range2; j <= self.icenter.y + self.range2; j++) {
				if (j < 0 || j >= srcheight) 
					continue;
				var f_y = Math.floor(1000 * Math.abs(j - self.center.y));
				if (self.cacheLanc[f_x][f_y] == undefined) 
					self.cacheLanc[f_x][f_y] = self.lanczos(Math.sqrt(Math.pow(f_x * self.rcp_ratio, 2) + Math.pow(f_y * self.rcp_ratio, 2)) / 1000);
				weight = self.cacheLanc[f_x][f_y];
				if (weight > 0) {
					var idx = (j * srcwidth + i) * 4;
					a += weight;
					r += weight * srcdata[idx];
					g += weight * srcdata[idx + 1];
					b += weight * srcdata[idx + 2];
				}
			}
		}
		var idx = (v * width + u) * 4;
		data[idx] = r /a;
		data[idx + 1] = g/a;
		data[idx + 2] = b/a;
		data[idx + 4] = a;
		
	}

	if (++u < width) 
		processOne(self, u);
	else {
		self.dest.data = data;
		postMessage({
			'imageData':self.dest
		});
	}
}