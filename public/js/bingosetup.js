function bingosetup() {
	var playercount = getUrlParameter('teamsize') || 3
	var bingoOpts = {
		seed: getUrlParameter('seed') || Math.ceil(999999 * Math.random()).toString(),
		mode: getUrlParameter('mode') || 'normal',
		lang: getUrlParameter('lang') || 'name'
	};

	var bingoFunc = ootBingoGenerator;
	var bad = false;
	var regexes = [ { regex: /\d(?: different)? unused keys in Gerudo Training Grounds/, maxcount: 1, count: 0 },
					{ regex: /\d Maps/, maxcount: 1, count: 0 },
					{ regex: /\d Compasses/, maxcount: 1, count: 0 },
					{ regex: /\d Hearts/, maxcount: 1, count: 0 },
					{ regex: /\d+ [Ss]ongs/, maxcount: 1, count: 0 },
					{ regex: /(?:15 Different Skulltulas|Stone of Agony)/, maxcount: 1, count: 0 },
					{ regex: /(?:3 Shields & 3 [^\s]+|3 [^\s]+ & 3 Shields|3 Swords, Tunics, Boots, and Shields|Mirror Shield)/, maxcount: 1, count: 0 },
					{ regex: /(?:3 Swords & 3 [^\s]+|3 [^\s]+ & 3 Swords|3 Swords, Tunics, Boots, and Shields|Giant's Knife)/, maxcount: 1, count: 0 },
					{ regex: /(?:3 Boots|3 Boots & 3 [^\s]+|3 [^\s]+ & 3 Boots|3 Swords, Tunics, Boots, and Shields|Iron Boots)/, maxcount: 1, count: 0 },
					{ regex: /(?:3 Tunics|3 Tunics & 3 [^\s]+|3 [^\s]+ & 3 Tunics|3 Swords, Tunics, Boots, and Shields|Goron Tunic)/, maxcount: 1, count: 0 },
					{ regex: /(?:3 Tunics|3 Tunics & 3 [^\s]+|3 [^\s]+ & 3 Tunics|3 Swords, Tunics, Boots, and Shields|Zora Tunic)/, maxcount: 1, count: 0 },
					{ regex: /(?:All 5 Skulltulas in Shadow Temple|4 Skulltulas in Shadow Temple)/, maxcount: 1, count: 0 },
					{ regex: /(?:All 5 Skulltulas in Water Temple|3 Skulltulas in Water Temple|Defeat Dark Link|Longshot)/, maxcount: 1, count: 0 },
					{ regex: /\d Magic Beans/, maxcount: 1, count: 0 },
					{ regex: /(?:[^\s]+ Gauntlets|Goron Bracelet)/, maxcount: playercount, count: 0 },
					{ regex: /(?:Beat the Deku Tree|Defeat Queen Gohma)/, maxcount: 1, count: 0 },
					{ regex: /(?:Beat Dodongo's Cavern|Defeat King Dodongo)/, maxcount: 1, count: 0 },
					{ regex: /(?:Beat Jabu-Jabu's Belly|Defeat Barinade)/, maxcount: 1, count: 0 },
					{ regex: /(?:Beat the Forest Temple|Defeat Phantom Ganon)/, maxcount: 1, count: 0 },
					{ regex: /(?:Beat the Fire Temple|Defeat Volvagia)/, maxcount: 1, count: 0 },
					{ regex: /(?:Beat the Water Temple|Defeat Morpha)/, maxcount: 1, count: 0 },
					{ regex: /(?:Beat the Shadow Temple|Defeat Bongo-Bongo)/, maxcount: 1, count: 0 },
					{ regex: /(?:Beat the Spirit Temple|Defeat Twinrova|Mirror Shield|Defeat Nabooru-Knuckle)/, maxcount: 1, count: 0 },
					{ regex: /(?:Saria's Song|Goron Bracelet)/, maxcount: 1, count: 0 },
					{ regex: /(?:Saria's Song|Green Gauntlets)/, maxcount: 1, count: 0 },
					{ regex: /(?:Saria's Song|Both heart pieces in Lost Woods)/, maxcount: 1, count: 0 },
					{ regex: /(?:Din's Fire|Two Fairy Spells)/, maxcount: 1, count: 0 },
					{ regex: /(?:Farore's Wind|Two Fairy Spells)/, maxcount: 1, count: 0 },
					{ regex: /(?:Nayru's Love|Two Fairy Spells)/, maxcount: 1, count: 0 },
					{ regex: /(?:4 Unused Keys in Forest Temple|Obtain all 5 Small Keys in Forest Temple)/, maxcount: playercount, count: 0 },
					{ regex: /(?:4 Unused Keys in Forest Temple|Defeat Meg \(purple Poe\))/, maxcount: playercount, count: 0 },
					{ regex: /(?:4 Unused Keys in Forest Temple|Map & Compass in Forest Temple)/, maxcount: playercount, count: 0 },
					{ regex: /[^\s] Mask]/, maxcount: playercount, count: 0 },
					{ regex: /(?:Exactly 20 Deku Sticks|Exactly 30 Deku Sticks)/, maxcount: playercount, count: 0 },
					{ regex: /Quiver \(\d0\)/, maxcount: playercount, count: 0 },
					{ regex: /(?:Bullet Bag \(40\)|Fairy Slingshot)/, maxcount: 1, count: 0 },
					{ regex: /Bullet Bag \(\d0\)/, maxcount: playercount, count: 0 },
					{ regex: /(?:All 3 Elemental Arrows|Light Arrows)/, maxcount: 1, count: 0 },
					{ regex: /(?:All 3 Elemental Arrows|Fire Arrows)/, maxcount: 1, count: 0 },
					{ regex: /(?:All 3 Elemental Arrows|Ice Arrows)/, maxcount: 1, count: 0 },
					{ regex: /\d Lake Hylia Skulltulas/, maxcount: 1, count: 0 },
					{ regex: /(?:Giant's Wallet|500 Rupees)/, maxcount: 1, count: 0 },
				];
	do {
		bad = false;
		for (var r of regexes) r.count = 0;
		bingoOpts.seed = Math.ceil(999999 * Math.random()).toString();
		var bingoBoard = bingoFunc(bingoList.normal, bingoOpts);
		if(bingoBoard) {
			for (i=1; i<=25; i++) {
				for(var r of regexes) {
					if (r.regex.exec(bingoBoard[i].name) != null) { r.count++;}
					if (r.count > r.maxcount) bad = true;

				}
				for (j=1; j<=25; j++) {
					if (i == j) continue;
					if (bingoBoard[i].name == bingoBoard[j].name) { bad = true;}
				}
			}
		} else {
			bad = true;
		}
	} while(bad);
	console.log(regexes);
	$("#seed").text(bingoOpts.seed);
	$("#link").text("http://www.speedrunslive.com/tools/oot-bingo/?seed=" + bingoOpts.seed)
	$("#link").attr("href", "http://www.speedrunslive.com/tools/oot-bingo/?seed=" + bingoOpts.seed)
}

$(bingosetup);
