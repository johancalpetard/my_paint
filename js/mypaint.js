	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	var options = {
		'crayon': 0,
		'gomme': 0,
		'ligne': 0,
		'rect': 0,
		'cercle': 0,
	}


	/* [EVENEMENT] CHANGEMENT D'OPTION */
	$('input:radio[name=option]').change(function()
		{
		switchOption($(this).val());
		});

	/* [EVENEMENT] EDITION D'IMAGE */
	$('#open_img').change(openImg);

	/* [FONCTION] NOUVEAU FICHIER */
	function reset() {
		answer = confirm("Voulez-vous enregistrer les modifications apportées à ce fichier ?");
		if (answer) {
			saveImg();
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	/* [FONCTION] CHANGEMENT D'OPTION */
	function switchOption(option)
	{
		var color = $("#colorPicker").val();
		var outline_color = $("#outlinePicker").val();
		var epaisseur = $("#epaisseur").val();

		for (key in options) {
			options[key] = 0;
		}

		switch (option) {
			case "crayon":
				options['crayon'] = 1;
				crayon(color, epaisseur, 1, 1);
				break;

			case "gomme":
				options['gomme'] = 1;
				gomme(epaisseur, 20, 20);
				break;

			case "ligne":
				options['ligne'] = 1;
				ligne(color, epaisseur);
				break;

			case "rect":
				options['rect'] = 1;
				rect(color, outline_color, epaisseur, false);
				break;


			case "rect_fill":
				options['rect'] = 1;
				rect(color, outline_color, epaisseur, true);
				break;

			case "cercle":
				options['cercle'] = 1;
				cercle(color, outline_color, epaisseur, false);
				break;

			case "cercle_fill":
				options['cercle'] = 1;
				cercle(color, outline_color, epaisseur, true);
				break;
		}
	}

	/* CRAYON */
	function crayon(color, line_width, width, height) {
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		ctx.lineWidth = line_width;
		ctx.globalCompositeOperation = "source-over";

		canvas.onmousedown = function(e) {
			posX = e.offsetX;
			posY = e.offsetY;
			mousedown = true;
			ctx.fillRect(posX, posY, width, height);
			ctx.beginPath();
			ctx.lineTo(posX, posY);
			ctx.stroke();
		}
		$("#myCanvas").mousemove(function(e) {
			if (options['crayon'] == 1) {
				if (mousedown) {
					posX = e.offsetX;
					posY = e.offsetY;
					ctx.lineTo(posX, posY);
					ctx.stroke();
				}
			}

		});
		canvas.onmouseup = function(e) {
			mousedown = false;
			ctx.closePath();

		}
	}

	/* GOMME */
	function gomme(line_width, width, height) {
		ctx.lineWidth = line_width;
		ctx.globalCompositeOperation = "destination-out";

		canvas.onmousedown = function(e) {
			posX = e.offsetX;
			posY = e.offsetY;
			mousedown = true;
			ctx.beginPath();
			ctx.lineTo(posX, posY);
			ctx.stroke();
		}
		$("#myCanvas").mousemove(function(e) {
			if (options['gomme'] == 1) {
				if (mousedown) {
					posX = e.offsetX;
					posY = e.offsetY;
					ctx.lineTo(posX, posY);
					ctx.stroke();
				}
			}

		});
		canvas.onmouseup = function(e) {
			mousedown = false;
			ctx.closePath();
		}
	}

	/* LIGNE */
	function ligne(color, line_width) {
		ctx.strokeStyle = color;
		ctx.lineWidth = line_width;
			canvas.onmousedown = function(e) {
				if (options['ligne'] == 1) {
					posX = e.offsetX;
					posY = e.offsetY;

					ctx.beginPath();
					ctx.lineTo(posX, posY);
				}
			}
			canvas.onmouseup = function(e) {
				if (options['ligne'] == 1) {
					posX = e.offsetX;
					posY = e.offsetY;

					ctx.lineTo(posX, posY);
					ctx.stroke();
					ctx.closePath();
				}

			}
	}

	/* RECTANGLE */
	function rect(color, outline_color, line_width, fill = true) {
		ctx.fillStyle = color;
		ctx.strokeStyle = outline_color;
		ctx.lineWidth = line_width;
			canvas.onmousedown = function(e) {
				if (options['rect'] == 1) {
					// premier angle 
					pos1_x1 = e.offsetX;
					pos1_y1 = e.offsetY;
					ctx.beginPath();
				}
			}
			canvas.onmouseup = function(e) {
				if (options['rect'] == 1) {
					// angle opposé
					pos_x2 = e.offsetX - pos1_x1;
					pos_y2 = e.offsetY - pos1_y1;
					if (fill == true) {
						ctx.fillRect(pos1_x1, pos1_y1, pos_x2, pos_y2);
						ctx.strokeRect(pos1_x1, pos1_y1, pos_x2, pos_y2);
					} else {
						ctx.strokeRect(pos1_x1, pos1_y1, pos_x2, pos_y2);
						ctx.closePath();
					}
				}
			}
	}

	/* CERCLE */
	function cercle(color, outline_color, line_width, fill = true) {
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		ctx.lineWidth = line_width;
			canvas.onmousedown = function(e) {
				if (options['cercle'] == 1) {
					// premier angle 
					pos1_x1 = e.offsetX;
					pos1_y1 = e.offsetY;
					ctx.beginPath();
				}
			}
			canvas.onmouseup = function(e) {
				if (options['cercle'] == 1) {
					// angle opposé
					pos_x2 = e.offsetX - pos1_x1;
					//pos_y2 = e.offsetY - pos1_y1;
					ctx.arc(pos1_x1, pos1_y1, pos_x2, 0, 2 * Math.PI);
					if (fill == true) {
						ctx.strokeStyle = outline_color;
						ctx.fill();
					}
					ctx.stroke();
					ctx.closePath();
				}
			}
	}

	/* EDITION D'IMAGE */

	function openImg(e) {
		var reader = new FileReader();
		reader.onload = function(event) {
			var img = new Image();
			reset();
			img.onload = function() {
				ctx.drawImage(img, 0, 0);
			}
			img.src = event.target.result; //permet de changer dynamiquement une image.
		}
		reader.readAsDataURL(e.target.files[0]);

	}

	/* SAUVEGARDE D'IMAGE */
	function saveImg() {
		var link = document.getElementById('link');
		var img_name = prompt("Nommez votre image");
		if (img_name) {
			var extension = prompt("Choissisez l'extension (tapez 'jpeg' ou 'png')");
			if (extension) {
				if (extension == 'jpeg' || extension == 'png') {
					var img_name = img_name.split(' ').join('_');
					link.setAttribute('download', img_name + '.' + extension);
					if (extension == 'jpeg') {
						extension = 'jpg';
					}
					link.setAttribute('href', canvas.toDataURL("image/" + extension)); // convertit le contenu du canvas en données texte utilisable dans une image
					console.log(link);
					link.click();
				} else {
					alert('Extension incorrect');
					return false;
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	//BONUS//


	// Clear the canvas when button is clicked
function clear_canvas_width() {
    var s = document.getElementById("myCanvas");
    var w = s.width;
    s.width = 10;
    s.width = w;
}

//  var x = 200;
//  var y = 200;
//  var dx = 4;
//  var dy = 4;
// var radius = 30;
// function animate(){
// 	requestAnimationFrame(animate);
// 	ctx.clearRect(0,0,innerWidth,innerHeight);
// 	ctx.beginPath();
// 	ctx.arc(x,y,radius,0,Math.PI * 2,false);
// 	ctx.strokeStyle = 'blue';
// 	ctx.stroke();
	
	
// 	//if(x>innerWidth){ //defilement normal
// 		//dx = -dx;
// 	//}

// 	if (x + radius > innerWidth || x- radius < 0){
// 		dx = -dx;
// 	}

// 	if (y+ radius > innerHeight || y- radius < 0){
// 		dy = -dy;
// 	}
// 	x += dx;
// 	y +=dy;
// }
// animate();