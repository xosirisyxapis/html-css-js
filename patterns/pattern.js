// funciones auxiliares
function degToRad(degrees) {
  return degrees * Math.PI / 180;
};

function random(range) {
  const num = (Math.random() - 0.5) * range;
  return num;
}

const backgroud_color = '#100703'
const stroke_color = '#fff'
const fill_color = '#000'

var x_speed = 1;

// Output de valores
var output_rot_value = document.getElementById("rot_value");
var output_size_value = document.getElementById("size_value");

// Parámetros de entrada
var rotation_param = 5;
output_rot_value.textContent = rotation_param;
var rot_slider = document.getElementById("rotation_slider");
rot_slider.oninput = function() {
	rotation_param = parseInt(this.value);
	output_rot_value.textContent = rotation_param;
}
var rot_align_checkbox = document.getElementById("rot_align");
var rotation_align = rot_align_checkbox.checked;
rot_align_checkbox.oninput = function() {
	rotation_align = rot_align_checkbox.checked;
}

var size_param = 1;
output_size_value.textContent = size_param * 10;
var size_slider = document.getElementById("size_slider");
size_slider.oninput = function() {
	size_param = parseInt(this.value) / 10;
	output_size_value.textContent = this.value;
}
var size_checkbox = document.getElementById("size_random");
var is_size_random = size_checkbox.checked;
size_slider.disabled = is_size_random;
if (is_size_random) {
	output_size_value.textContent = "Aleatorio";
}
size_checkbox.oninput = function() {
	is_size_random = this.checked;
	size_slider.disabled = is_size_random;
	if (is_size_random) {
		output_size_value.textContent = "Aleatorio";
	} else {
		output_size_value.textContent = size_param * 10;
	}
}

var radios = document.getElementsByName('type_param');
var type_param;
for (var i = 0, length = radios.length; i < length; i++) {
	if (radios[i].checked) {
		type_param = radios[i].value;
		break;
	}
}
function handleChangeRadio() {
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			type_param = radios[i].value;
			break;
		}
	}
}



class Rect {

   constructor(x, y, width, height, rot, scale, type) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.rot = rot;
      this.scale = scale;
      this.type = type;
   }

   draw() {
      	ctx.save();
      	ctx.translate(this.x, this.y);
		ctx.rotate(degToRad(this.rot));
		ctx.scale(this.scale, this.scale);
		ctx.fillStyle = fill_color;
		if (this.type === 'rect') {
			ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
			ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
		} else if (this.type === 'tri') {
			ctx.beginPath();
		    ctx.moveTo(-this.width,-this.width);
		    ctx.lineTo(-this.width,this.width);
		    ctx.lineTo(this.width,-this.width);
		    ctx.closePath();
		    ctx.fill();
		    ctx.stroke();
		} else if (this.type === 'circ') {
			ctx.beginPath();
			ctx.ellipse(0, 0, this.width, this.height / 2, 0, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
		}
		ctx.restore();
   }

   update() {
		this.x -= x_speed;
   }

}

var container = document.getElementById("canvascontainer");

const canvas = document.querySelector('.myCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = container.offsetWidth;
const height = canvas.height = 400;
const rows = 10;
const row_step = height / rows;
const cols = 27;
const col_step = width / cols + 2;

ctx.fillStyle = backgroud_color;
ctx.fillRect(0, 0, width, height);
ctx.strokeStyle = stroke_color;

var rects = [];
var pause = false;

let rect_width = 8;
let rect_height = 30;
let rot_init = 0;
// let rot_step = 5;
let scale_init = 1;

for (let i = 0; i < rows; i++) {
	if (i === 0) {
		continue;
	}
	let rotation = rot_init + i * 5;
	let scale = scale_init;
	let row = [];
	for (let j = 0; j < cols + 2; j++) {
		if (j === 0) {
			continue;
		}
		let x = col_step * j;
		let y = row_step * i;
		rotation += rotation_param;
		if (is_size_random) {
			scale += random(0.1);
		} else {
			scale = size_param;
		}
		if (scale < 0.5) {
			scale = 0.5;
		} else if (scale > 1.3) {
			scale = 1.3;
		}
		let rect = new Rect(x, y, rect_width, rect_height, rotation, scale, type_param);
		row.push(rect);
	}
	rects.push(row);
}

// Loop para animación
let new_col = Math.round(col_step / Math.abs(x_speed));
function loop() {
	if (pause) {
		requestAnimationFrame(loop);
		return;
	}
	if (rects[0][0].x < -50) {
		let is_align = rects[0][rects[0].length-1].rot == rects[1][rects[1].length-1].rot;
		let add_col_rotation = is_align && !rotation_align;
		let first_rot = rects[0][rects[0].length-1].rot;
		for (let i = 0; i < rects.length; i++) {
			rects[i].shift();
			rect_last = rects[i][rects[i].length-1];
			let x = rect_last.x + col_step;
			let y = rect_last.y;
			let rotation = rect_last.rot + rotation_param;
			if (add_col_rotation) {
				rotation += i * 5;
			}
			if (!is_align && rotation_align) {
				rotation = first_rot + rotation_param;
			}
			let scale;
			if (is_size_random) {
				scale = rect_last.scale + random(0.1);
			} else {
				scale = size_param;
			}
			if (scale < 0.5) {
				scale = 0.5;
			} else if (scale > 1.3) {
				scale = 1.3;
			}
			if (add_col_rotation) {

			}
			let rect = new Rect(x, y, rect_width, rect_height, rotation, scale, type_param);
			rects[i].push(rect)
		}
	}
	ctx.fillStyle = backgroud_color;
   	ctx.fillRect(0, 0, width, height);
	for (let i = 0; i < rects.length; i++) {
		for (let j = 0; j < rects[i].length; j++) {
			rects[i][j].draw();
			rects[i][j].update();
		}
	}
   	requestAnimationFrame(loop);
}
loop();

function action_pause() {
	if (!pause) {
		var div = document.getElementById("image-div");
		while (div.firstChild) {
	        div.removeChild(div.firstChild);
	    }
		var img = canvas.toDataURL("image/png");
		var elem = document.createElement("img");
		elem.setAttribute("src", img);
		div.append(elem);
		canvas.style.display = "none";
	} else {
		var div = document.getElementById("image-div");
		while (div.firstChild) {
	        div.removeChild(div.firstChild);
	    }
		canvas.style.display = "block";
	}
	pause = !pause;
}
