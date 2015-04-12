var selected = [];
var users = [];
var colourBoxes = {};

$(function() {
	$('#modal').modal({
		keyboard: false,
		backdrop: 'static'
	})
	var user;
	var socket = io();
	colours = {};
	socket.on("select", function(name, x, y) {
		selected[x][y] = name;
		var i = y * 5 + x + 1;
		$('#slot'+i).css('background', colours[name]);
		$('#slot'+i).unbind('click');
		if(name == user) {
			$("#slot"+i).click(select(i));
		}
	});
	socket.on("deselect", function(name, x, y) {
		selected[x][y] = "";
		var i = y * 5 + x + 1;
		$('#slot'+i).css('background', "");
		$('#slot'+i).click(select(i));
	});
	socket.on("init", function(c, a) {
		colour = colours[user];
		selected = a;
		colours = c;
		for (var i in c) {
			if (users.indexOf(i) == -1) {
				users.push(i);
				var row = document.createElement('div');
				row.className = 'row';
				var div = document.createElement('div');
				div.style.height = '30px';
				div.style.lineHeight = '30px';
				div.textContent=i;
				var cb = document.createElement('div');
				cb.className = 'colour';
				cb.style.background = c[i];
				colourBoxes[i] = cb;
				row.appendChild(div);
				div.appendChild(cb);
				document.getElementById('users').appendChild(row);
			}
		}
		colours[user] = colour;
		for (var x in a) {
			for (var y in a[x]) {
				var i = y * 5 + x * 1 + 1;
				if (a[x][y] == '') {
					$('#slot'+i).click(select(i));
				} else {
					if (a[x][y] == user) {
						$('#slot'+i).click(deselect(i));
					}
					$('#slot'+i).css('background', colours[a[x][y]]);
				}
			}
		}
	});
	socket.on('join', function(name) {
		if (users.indexOf(name) == -1) {
			users.push(name);
			var row = document.createElement('div');
			row.className = 'row';
			var div = document.createElement('div');
			div.style.height = '30px';
			div.style.lineHeight = '30px';
			div.textContent=name;
			var c = document.createElement('div');
			c.className = 'colour';
			colourBoxes[name] = c;
			row.appendChild(div);
			div.appendChild(c);
			document.getElementById('users').appendChild(row);
		}
	});
	socket.on("setcolour", function(name, colour) {
		colourBoxes[name].style.background = colour;
		colours[name] = colour;
		for (var x in selected) {
			for (var y in selected[x]) {
				var i = y * 5 + x * 1 + 1;
				if (selected[x][y] == name) {
					$('#slot'+i).css('background', colour);
				}				
			}
		}
	});
	function select(i) {
		return function() {
			$('#slot'+i).css('background', colours[user])
			var x = (i - 1) % 5;
			var y = ((i - 1) - x) / 5;
			selected[x][y] = user;
			socket.emit("select", user, x, y);
			$('#slot'+i).click(deselect(i));
		}
	}
	function deselect(i) {
		return function() {
			$('#slot'+i).css('background', "");
			var x = (i - 1) % 5;
			var y = ((i - 1) - x) / 5;
			selected[x][y] = "";
			socket.emit("deselect", user, x, y);
			$('#slot'+i).click(select(i));
		}
	}
	$("#submit").click(function() {
		var bad = false;
		if (!$("#name").val() || /^\s*$/.test($("#name").val())) {
			$("#name").parent().addClass("has-error");
			bad = true;
		} else {
			$("#name").parent().removeClass("has-error");
		}
		if (!$("#room").val() || /^\s*$/.test($("#room").val())) {
			$("#room").parent().addClass("has-error");
			bad = true;
		} else {
			$("#room").parent().removeClass("has-error");
		}
		if (!$.isNumeric($("#seed").val())) {
			$("#seed").parent().addClass("has-error");
			bad = true;
		} else {
			$("#seed").parent().removeClass("has-error");
		}
		if(!bad) {
			$("#modal").modal('hide');
			user = $("#name").val();
			users.push(user);
			var row = document.createElement('div');
			row.className = 'row';
			var div = document.createElement('div');
			div.style.height = '30px';
			div.style.lineHeight = '30px';
			div.textContent=user;
			var c = document.createElement('div');
			c.className = 'colour';
			c.style.background = $("#colour").val();
			colourBoxes[name] = c;
			row.appendChild(div);
			div.appendChild(c);
			document.getElementById('users').appendChild(row);
			socket.emit("join", user, $("#room").val());
			colours[user] = $("#colour").val();
			socket.emit("setcolour", user, $("#colour").val())
			var bingoOpts = {
				seed: $('#seed').val() * 1,
				mode: 'normal', 
				lang: 'name'
			};
			var bingoFunc = ootBingoGenerator;
			var bingoBoard = bingoFunc(bingoList, bingoOpts);
			for (i=1; i<=25; i++) {  
				$('#slot'+i).append(bingoBoard[i].name);
			}
		}
	});
});