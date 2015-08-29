function bingosetup() {
	var bingoOpts = {
		seed: getUrlParameter('seed') || Math.ceil(999999 * Math.random()).toString(),
		mode: getUrlParameter('mode') || 'normal',
		lang: getUrlParameter('lang') || 'name'
	};
	
	var bingoFunc = ootBingoGenerator;
	var bad = false;
	var regexes = [ {regex: /\d(?: different)? unused keys in Gerudo Training Grounds/, count: 0},
					{regex: /\d Maps/, count: 0},
					{regex: /\d Compasses/, count: 0},
					{regex: /\d Hearts/, count: 0},
					{regex: /At least \d songs/, count: 0},
					{regex: /(?:3 Shields & 3 [^\s]+|3 [^\s]+ & 3 Shields)/, count: 0},
					{regex: /(?:3 Swords & 3 [^\s]+|3 [^\s]+ & 3 Swords)/, count: 0},
					{regex: /(?:3 Boots & 3 [^\s]+|3 [^\s]+ & 3 Boots)/, count: 0},
					{regex: /(?:All 5 Skulltulas in Shadow Temple|At least 4 Skulltulas in Shadow Temple)/, count: 0},
					{regex: /(?:All 5 Skulltulas in Water Temple|At least 3 Skulltulas in Water Temple)/, count: 0},
					{regex: /At least \d Magic Beans/, count: 0}
				];
	do {
		bad = false;
		for (var r of regexes) r.count = 0;
		bingoOpts.seed = Math.ceil(999999 * Math.random()).toString();
		var bingoBoard = bingoFunc(bingoList, bingoOpts);
		if(bingoBoard) {
			for (i=1; i<=25; i++) {
				for(var r of regexes) {
					if (r.regex.exec(bingoBoard[i].name) != null) {r.count++;console.log(r);}
					if (r.count > 1) bad = true;
					
				}
				for (j=1; j<=25; j++) {
					if (i == j) continue;
					if (bingoBoard[i].name == bingoBoard[j].name) {bad = true; console.log(bingoBoard[i]);}
				}
			}
		} else {
			bad = true;
		}
	} while(bad);
	console.log(bingoOpts.seed);
	$("#seed").text(bingoOpts.seed);
	$("#link").text("http://www.speedrunslive.com/tools/oot-bingo/?seed=" + bingoOpts.seed)
	$("#link").attr("href", "http://www.speedrunslive.com/tools/oot-bingo/?seed=" + bingoOpts.seed)
}

$(bingosetup);
