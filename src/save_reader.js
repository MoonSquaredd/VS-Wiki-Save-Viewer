let CHARACTERS = [];
let SKINS = {};
let STAGES = [];
let WEAPONS = [];
let MIRRORS = [
	{name:'Cygnus',id:'SILF_COUNTER'},
	{name:'Zhar_Ptytsia',id:'SILF2_COUNTER'},
	{name:'Red_Muscle',id:'GUNS_COUNTER'},
	{name:'Twice_Upon_a_Time',id:'GUNS2_COUNTER'},
	{name:'Flock_Destroyer',id:'GATTI_COUNTER'},
	{name:'Horse_Cartridge',id:'EX_AMMO1_COUNTER'},
	{name:'Levelin\'Eh',id:'SANTAJAVELINCOUNTER'},
	{name:'Silver_Sliver',id:'SHADOWSERVANT_COUNTER'},
	{name:'Party_Pooper',id:'PARTY_COUNTER'},
	{name:'Silver_Tongue',id:'C1_TONGUE1_COUNTER'},
	{name:'Prism_Damsel',id:'FB_PRISMCUTLASS_COUNTER'},
	{name:'Speculo_Raging_Fire',id:'TP_FIRE1_COUNTER'},
	{name:'Speculo_Ice_Fang',id:'TP_ICE1_COUNTER'},
	{name:'Speculo_Rock_Riot',id:'TP_EARTH1_COUNTER'},
	{name:'Speculo_Gale_Force',id:'TP_WIND1_COUNTER'},
	{name:'Speculo_Fulgur',id:'TP_ELEC1_COUNTER'},
	{name:'Speculo_Keremet_Bubbles',id:'TP_ACID1_COUNTER'},
	{name:'Speculo_Refectio',id:'TP_HOLY1_COUNTER'},
	{name:'Speculo_Hex',id:'TP_EVIL1_COUNTER'},
	{name:'Speculo_Globus',id:'TP_ENERGY1_COUNTER'},
	{name:'Speculo_Anura',id:'TP_FROG_COUNTER'}
];
let POWERUPS = [];
let ITEMS = [];
let PICKUPS = [];
let RELICS = [];
let ARCANAS = [];
let COLLECTION_IDS = [];
let COLLECTION_NAMES = [];
let ENEMIES = [];
let BESTIARY = [];

let old = false;
let saveData = {};
let stageData = {};
let ownedDlcs = ["Vampire Survivors"];
const cachebuster = 170326;
let powerups = {
	"POWER": 0,"ARMOR": 0,"MAXHEALTH": 0,"REGEN": 0,
	"COOLDOWN": 0,"AREA": 0,"SPEED": 0,"DURATION": 0,
	"AMOUNT": 0,"MOVESPEED": 0,"MAGNET": 0,"LUCK": 0,
	"GROWTH": 0,"GREED": 0,"CURSE": 0,"REVIVAL": 0,
	"PANDORA": 0,"CHARM": 0,"DEFANG": 0,"REROLL": 0,
	"SKIP": 0,"BANISH": 0,"RECYCLE": 0,"SEAL": 0,
	"SEAL2": 0,"SEAL3": 0,"SEAL4": 0
};

let stat_data = {
	'Max Health': {sign: false,percent: false,id:'MAXHEALTH',increment:1.1,eggvalent:'maxHp'},	
	Recovery: {sign: false,percent: false,id:'REGEN',increment:0.1,eggvalent:'regen'},
	Armor: {sign: true,percent: false,id:'ARMOR',increment:1,eggvalent:'armor'},
	'Move Speed': {sign: true,percent: true,id:'MOVESPEED',increment:5,eggvalent:'moveSpeed'},
	Might: {sign: true,percent: true,id:'POWER',increment:5,eggvalent:'power'},
	Speed: {sign: true,percent: true,id:'SPEED',increment:10,eggvalent:'speed'},
	Duration: {sign: true,percent: true,id:'DURATION',increment:15,eggvalent:'duration'},
	Area: {sign: true,percent: true,id:'AREA',increment:5,eggvalent:'area'},
	Cooldown: {sign: true,percent: true,id:'COOLDOWN',increment:-2.5,eggvalent:'cooldown'},
	Amount: {sign: true,percent: false,id:'AMOUNT',increment:1,eggvalent:'amount'},
	Revival: {sign: true,percent: false,id:'REVIVAL',increment:1,eggvalent:'revivals'},
	Magnet: {sign: true,percent: false,id:'MAGNET',increment:1.25,eggvalent:'magnet'},
	Luck: {sign: true,percent: true,id:'LUCK',increment:10,eggvalent:'luck'},
	Growth: {sign: true,percent: true,id:'GROWTH',increment:3,eggvalent:'growth'},
	Greed: {sign: true,percent: true,id:'GREED',increment:10,eggvalent:'greed'},
	Curse: {sign: true,percent: true,id:'CURSE',increment:10,eggvalent:'curse'},
	Reroll: {sign: true,percent: false,id:'REROLL',increment:2,eggvalent:'rerolls'},
	Skip: {sign: true,percent: false,id:'SKIP',increment:2,eggvalent:'skips'},
	Banish: {sign: true,percent: false,id:'BANISH',increment:2,eggvalent:'banish'},
};

mw.loader.using(['oojs-ui-core','oojs-ui-widgets','jquery.tablesorter']).done(function(){
	$(function(){
		async function populate_tables() {
			try {
				//Characters Query
				let data = await new mw.Api().get({
					action: 'bucket',
					query: "bucket('infobox_character').select('page_name','name','alias','release_date','release_timestamp','image','id','skin_id','dlc','order','starting_weapon','hidden_weapon','coffin_character','ignores_walls','stats_json','description','secret_character','unlocked_by','cost','is_default').orderBy('order','asc').limit(1000).run()",
				});
				if (data.bucket) {
					let i = 0;
					let LATODISOTTO = data.bucket.shift();
					data.bucket.push(LATODISOTTO);
					for (const character of data.bucket) {
						character.page_name = character.page_name.replaceAll(" ","_");
						character.stats_json = JSON.parse(character.stats_json);
						if (!SKINS[character.page_name]) {SKINS[character.page_name] = {}}
						SKINS[character.page_name][character.skin_id] = i;
						CHARACTERS.push(character);
						i++;
					}
					console.log(CHARACTERS);
				}
				//Stages Query
				const {bucket: stageData} = await new mw.Api().get({
					action: 'bucket',
					query: "bucket('infobox_stage').select('page_name','image','id','release_timestamp').where({'is_default',true},{'adventure_only',false}).orderBy('release_timestamp','asc').limit(100).run()",
				});
				for (const stage of stageData) {
					stage.page_name = stage.page_name.replaceAll(" ","_");
				}
				STAGES = stageData;
				console.log("Stage Data: ",STAGES);
				
				//Weapons Query
				const {bucket: weaponData} = await new mw.Api().get({
					action: 'bucket',
					query: "bucket('infobox_weapon').select('page_name','name','id').limit(1000).run()",
				});
				for (const weapon of weaponData) {
					weapon.page_name = weapon.page_name.replaceAll(" ","_");
					weapon.name = weapon.name.replaceAll(" ","_");
				}
				WEAPONS = weaponData;
				console.log("Weapon Data: ",WEAPONS);
				
				//Passives Query
				const {bucket: itemData} = await new mw.Api().get({
					action: 'bucket',
					query: "bucket('infobox_passive_item').select('name','id','release_timestamp').limit(500).run()",
				});
				for (const item of itemData) {
					item.name = item.name.replaceAll(" ","_");
				}
				ITEMS = itemData;
				console.log("Item Data: ",ITEMS);
				
				//Pickups Query
				const {bucket: pickupData} = await new mw.Api().get({
					action: 'bucket',
					query: "bucket('infobox_pickup').select('name','version_anchor','id','order','image').orderBy('order','asc').limit(500).run()",
				});
				for (const pickup of pickupData) {
					pickup.name = pickup.name.replaceAll(" ","_");
				}
				PICKUPS = pickupData;
				console.log("Pickup Data: ",PICKUPS);
				
				//Relics Query
				const {bucket: relicData} = await new mw.Api().get({
					action: 'bucket',
					query: "bucket('infobox_relic').select('page_name','id','release_timestamp').limit(200).run()",
				});
				for (const relic of relicData) {
					relic.page_name = relic.page_name.replaceAll(" ","_");
				}
				RELICS = relicData;
				console.log("Relic Data: ",RELICS);
				
				//Arcanas Query
				const {bucket: arcanaData} = await new mw.Api().get({
					action: 'bucket',
					query: "bucket('infobox_arcana').select('page_name','image','name','arcana_name','id','order','arcana_type').orderBy('order','asc').limit(50).run()",
				});
				let arcanas = arcanaData.filter((e) => e.arcana_type === "Arcana");
				let darkanas = arcanaData.filter((e) => e.arcana_type === "Darkana");
				for (const darkana of darkanas) {
					darkana.order += 22;
				}
				ARCANAS = arcanas.concat(darkanas);
				console.log("Arcana Data: ",ARCANAS);
				
				//thanks Cal1fornia for this as well
				const combined = [...WEAPONS, ...MIRRORS, ...ITEMS, ...PICKUPS, ...RELICS, ...ARCANAS];
				const {Default: collectionOrder} = await $.getJSON(mw.util.getUrl('Module:CollectionOrder/data', {action:'raw', 'ctype':'application/json'}));
				
				const collectionIds = collectionOrder.map((item) => {
					const found = combined.find((entry) => (entry.name && entry.name.replace('&#39;','\'') === item.replaceAll(" ","_")) || entry.page_name === item.replaceAll(" ","_") || entry.arcana_name === item);
					if (found && found.arcana_name) return found.order;
					if (!found || !found.id) return `---${item}---`;
					if (typeof found.id === 'string') return found.id;
					if (found.id instanceof Array) {
						if (found.id.length === 1) return found.id[0];
						return found.id[1];
					}
					return `${item} was not found, uh oh`;
				});
				COLLECTION_NAMES = collectionOrder;
				COLLECTION_IDS = collectionIds;
				console.log("Collection Data: ",COLLECTION_IDS,COLLECTION_NAMES);
				
				//Enemies Query
				const {bucket: enemyData} = await new mw.Api().get({
					action: 'bucket',
					query: "bucket('enemy_variant').select('page_name','name','image','sprites','id').limit(1000).run()",
				});
				ENEMIES = enemyData;
				console.log("Enemy Data: ",ENEMIES);
				const {bucket: bestiaryData} = await new mw.Api().get({
					action: 'bucket',
					query: "bucket('infobox_bestiary').select('page_name','name','image','bestiary_number').limit(1000).run()",
				});
				BESTIARY = bestiaryData;
				console.log("Bestiary Data: ",BESTIARY);
				
				//PowerUps Query
				const {bucket: powerupData} = await new mw.Api().get({
					action: 'bucket',
					query: "bucket('infobox_powerup').select('page_name','name','image','id','order','max_level').orderBy('order','asc').limit(1000).run()",
				});
				POWERUPS = powerupData;
				
			} catch(e) {
				console.error(e);
			}
		}
		
		function display_basic_info() {
			if (saveData.UnlockedStages.includes("MOONSPELL")) {
				ownedDlcs.push("Legacy of the Moonspell");
			}
			if (saveData.UnlockedStages.includes("FOSCARI")) {
				ownedDlcs.push("Tides of the Foscari");
			}
			if (saveData.UnlockedStages.includes("POLUS")) {
				ownedDlcs.push("Emergency Meeting");
			}
			if (saveData.UnlockedStages.includes("FB_GALUGA")) {
				ownedDlcs.push("Operation Guns");
			}
			if (saveData.UnlockedStages.includes("TP_CASTLE")) {
				ownedDlcs.push("Ode to Castlevania");
			}
			if (saveData.UnlockedStages.includes("EMERALD")) {
				ownedDlcs.push("Emerald Diorama");
			}
			if (saveData.UnlockedStages.includes("LEM_CHAMBER")) {
				ownedDlcs.push("Ante Chamber");
			}
			let last_played = new Date((saveData.saveDate||0) / 10000).toLocaleString();
			if ((saveData.saveDate||0 / 10000) < 1654743600) {old = true}
			$("#general_info").append(`<link ref="stylesheet" href="/w/User:Lovenus/common.css">`);
			$("#general_info").append(`<audio id="bg-music" autoplay loop><source src="/images/Audio-Dust_Elementals.ogg?18110" type="audio/ogg"></audio><br>`);
			document.getElementById("bg-music").volume = 0.2;
			$("#general_info").append(`<span><b>Last Time Played</b>: ${last_played}</span><br>`);
			$("#general_info").append(`<span><b>Total Time Survived</b>: ${format_time(saveData.LifetimeSurvived||0)}</span><br>`);
			$("#general_info").append(`<span><b>Total Coins</b>: ${(saveData.Coins||0).toLocaleString()}<img src="/images/Sprite-Gold_Coin.png" style="width:20px;height:20px;"/></span><br>`);
			$("#general_info").append(`<span><b>Lifetime Coins</b>: ${(saveData.LifetimeCoins||0).toLocaleString()}<img src="/images/Sprite-Gold_Coin.png" style="width:20px;height:20px;"/></span><br>`);
			$("#general_info").append(`<span><b>Lifetime Healing</b>: ${(saveData.LifetimeHeal||0).toFixed(1).toLocaleString()} <img src="/images/Sprite-Floor_Chicken.png" style="width:20px;height:20px;"/></span><br>`);
			$("#general_info").append(`<span><b>Top Carlo Cart Laps</b>: ${saveData.TopLapsCarlo||0}</span> | `);
			$("#general_info").append(`<span><b> Total Carlo Cart Laps</b>: ${saveData.TotalLapsCarlo||0}</span><br>`);
			$("#general_info").append(`<span><b>Top Hectic Highway Laps</b>: ${saveData.TopLapsHighway||0}</span> | `);
			$("#general_info").append(`<span><b> Total Hectic Highway Laps</b>: ${saveData.TotalLapsHighway||0}</span><br>`);
			$("#general_info").append(`<span><b>Longest Fever</b>: ${format_time(saveData.LongestFever||0)} <img src="/images/Sprite-Gilded_Clover.png" style="width:20px;height:20px;"/></span><br>`);
			$("#general_info").append(`<span><b>Highest Fever</b>: ${(saveData.HighestFever||0).toLocaleString()} <img src="/images/Sprite-Gilded_Clover.png" style="width:20px;height:20px;"/></span><br>`);
			$("#general_info").append(`<span id="dlcs"><b>Owned Dlcs</b>: <br></span>`);
			for (let dlc of ownedDlcs) {
				$("#dlcs").append(`<span>- ${dlc}</span><br>`);
			}
		}
		
		function get_stat_percentage(stat) {
			if (stat == 1 || stat == 0) {
				return 0;
			} else {
				return Math.round((-1+stat)*100);
			}
		}
		
		function get_stat_string(index,stat) {
			let output = "";
			let val = 0;
			let val2 = 0;
			let modified = false;
			let id = CHARACTERS[index].id;
			switch (stat) {
				case 'Max Health':
					val += CHARACTERS[index].stats_json[stat]||0;
					if (saveData.EggData != null && saveData.EggData[id]!=null) {
						val += (saveData.EggData[id].maxHp || 0);
					}
					val = val*(1.1**powerups.MAXHEALTH);
					if (val != (CHARACTERS[index].stats_json[stat]||0)) {
						modified = true;
					}
					val = Math.round(val);
					break;
				case 'Recovery':
					val += CHARACTERS[index].stats_json[stat]||0;
					if (saveData.EggData != null && saveData.EggData[id]!=null) {
						val += (saveData.EggData[id].regen || 0);
					}
					val += (powerups.REGEN*0.1);
					if (val != (CHARACTERS[index].stats_json[stat]||0)) {
						modified = true;
					}
					val = val.toFixed(2);
					break;
				case 'Cooldown':
					val += (CHARACTERS[index].stats_json[stat]||0);
					if (saveData.EggData != null && saveData.EggData[id]!=null) {
						if (val == 0){val = 1}
						val += (saveData.EggData[id][stat_data[stat].eggvalent] || 0);
					}
					if (val != (CHARACTERS[index].stats_json[stat]||0) || powerups.COOLDOWN != 0) {
						modified = true;
					}
					val = get_stat_percentage(val);
					val += (powerups[stat_data[stat].id]*stat_data[stat].increment);
					val = Math.round(val);
					break;
				case 'Magnet':
					val = 30;
					if (saveData.EggData != null && saveData.EggData[id]!=null) {
						val += (saveData.EggData[id][stat_data[stat].eggvalent] || 0);
						val2 += (saveData.EggData[id][stat_data[stat].eggvalent] || 0)*100;
					}
					val *= (1+(CHARACTERS[index].stats_json[stat]||0))*(1.25**powerups.MAGNET);
					val2 += ((CHARACTERS[index].stats_json[stat]||0)*100)+(25*powerups.MAGNET);
					if (val != 30*(1+(CHARACTERS[index].stats_json[stat]||0))) {
						modified = true;
					}
					val = Math.round(val);
					val2 = Math.floor(val2);
					break;
				default:
					if (stat_data[stat].percent == true) {
						val += CHARACTERS[index].stats_json[stat]||0;
						if (saveData.EggData != null && saveData.EggData[id]!=null) {
							if (val == 0){val = 1}
							val += (saveData.EggData[id][stat_data[stat].eggvalent] || 0);
						}
						if (val != (CHARACTERS[index].stats_json[stat]||0) || powerups[stat_data[stat].id] != 0) {
							modified = true;
						}
						val = get_stat_percentage(val);
						val += (powerups[stat_data[stat].id]*stat_data[stat].increment);
						if (stat == 'Might' || stat == 'Speed' || stat == 'Duration' || stat == 'Area') {
							val += (powerups.PANDORA*2);
						}
						val = Math.round(val);
					} else {
						val += CHARACTERS[index].stats_json[stat]||0;
						if (saveData.EggData != null && saveData.EggData[id]!=null) {
							val += (saveData.EggData[id][stat_data[stat].eggvalent] || 0);
						}
						val += (powerups[stat_data[stat].id]*(stat_data[stat].increment));
						if (val != (CHARACTERS[index].stats_json[stat]||0)) {
							modified = true;
						}
						val = Math.floor(val);
					}
					break;
			}
			if (stat_data[stat].sign == true && val > 0) {
				if (stat == 'Magnet' && val > 30) {
					output += "+";
				} else if (stat != 'Magnet') {
					output += "+";
				}
			}
			if (val == 0) {
				output += "-";
			} else if (stat == 'Magnet') {
				if (val == 30) {
					output += "-";
				} else {
					output += val2 + "% (" + val + ")";
				}
			} else {
				output += val.toString();
			}
			if (stat_data[stat].percent == true && val != 0) {
				output += "%";
			}
			if (modified) {
				output = `<span style="color:orange;">${output}</span>`;
			}
			return output;
		}
		
		function get_cost_string(index) {
			return `<br><b>Cost</b>: ${(Math.round(CHARACTERS[index].cost*(1+(0.1*(saveData.BoughtCharacters.length-1))))).toLocaleString()}<img src="/images/Sprite-Gold_Coin.png" style="width:20px;height:20px"/>`;
		}
		
		function fix_description(description) {
			if (description.includes("[[")) {
				let fixed = "";
				let hl = description.replaceAll("[[","<hyp>");
				hl = hl.replaceAll("]]","<hyp>");
				let hyperlink_split = hl.split("<hyp>");
				fixed += hyperlink_split[0];
				for (let i=1; i<hyperlink_split.length; i++) {
					console.log(hyperlink_split[i]);
					if (hyperlink_split[i].startsWith("File:")) {
						//fixed += (hyperlink_split[i].split(".")[0].slice(12));
						i+=1;
					} else if (hyperlink_split[i].includes("|")) {
						fixed += hyperlink_split[i].split("|")[1];
					} else {fixed += hyperlink_split[i]}
				}
				return fixed;
			} else {return description}
		}
		
		function change_skin(skin,trueIndex) {
			let index = SKINS[CHARACTERS[trueIndex].page_name][skin];
			$('#ci_weapons').html(`<span class="center-but-gaps" id="ci_weapons"></span>`);
			if (CHARACTERS[trueIndex].starting_weapon != null) {
				for (const weapon of CHARACTERS[trueIndex].starting_weapon) {
					$("#ci_weapons").append(`<img class="weapons" src="/images/Sprite-${weapon.replaceAll(" ","_")}.png" style="height:64px;"/>`);
				}
			}
			if (CHARACTERS[trueIndex].hidden_weapon != null) {
				for (const weapon of CHARACTERS[trueIndex].hidden_weapon) {
					$("#ci_weapons").append(`<img class="weapons" src="/images/Sprite-${weapon.replaceAll(" ","_")}.png" style="height:64px;"/>`);
				}
			}
			$("#ci_weapons").append("<br>");
			let source = CHARACTERS[index].image.replace('File:Select','/images/Animated').replace('.png','.gif').replaceAll(" ","_");
			if (skin == 'SKIN_EME_MUS') {
				source = '/images/Animated-Kugutsu_(Musashi).gif';
			} 
			switch (CHARACTERS[trueIndex].page_name) {
				case 'Peppino':
				case 'Megalo_Dracula':
				case 'Megalo_Death':
				case 'Megalo_Olrox':
					source = CHARACTERS[index].image.replace('File:Select','/images/Sprite').replaceAll(" ","_");
					break;
				case 'Chaos':
					source = `/images/Sprite-Chaos_(full).png`;
					break;
			}
			document.getElementById("char-sprite").src = `${source}?${cachebuster}`;
		}
		
		function get_ground(name,dlc) {
			let ground = "/images/Bestiary-Mad_Forest.png";
			switch (dlc) {
				case 'Vampire Survivors':
					switch (name) {
						case 'Arca_Ladonna':
						case 'Porta_Ladonna':
						case 'Lama_Ladonna':
						case 'Poe_Ratcho':
						case 'Yatta_Cavallo':
							ground = "/images/Bestiary-Inlaid_Library.png";
							break;
						case 'Suor_Clerici':
						case 'Dommario':
						case 'Krochi_Freetto':
						case 'Christine_Davain':
						case 'Bianca_Ramba':
							ground = "/images/Bestiary-Dairy_Plant.png";
							break;
						case 'Pugnala_Provola':
						case 'Giovanna_Grana':
						case 'Poppea_Pecorina':
						case 'Concetta_Caciotta':
						case 'O\'Sole_Meeo':
							ground = "/images/Bestiary-Gallo_Tower.png";
							break;
						case 'Sir_Ambrojoe':
						case 'Iguana_Gallo_Valletto':
						case 'Divano_Thelma':
						case 'Zi\'Assunta_Belpaese':
							ground = "/images/Bestiary-Cappella_Magna.png";
							break;
						case 'LATODISOTTO':
							ground = "/images/Bestiary-Room_1665.png";
							break;
					}
					break;
				case 'Legacy of the Moonspell':
					ground = "/images/Bestiary-Mt.Moonspell.png";
					break;
				case 'Tides of the Foscari':
					ground = "/images/Bestiary-Lake_Foscari.png";
					switch (name) {
						case 'Genevieve_Gruyère':
						case 'Je-Ne-Viv':
						case 'Rottin\'Ghoul':
							ground = "/images/Bestiary-Abyss_Foscari.png";
							break;
					}
					break;
				case 'Emergency Meeting':
					ground = "/images/Bestiary-Polus_Replica.png";
					break;
				case 'Operation Guns':
					ground = "/images/Bestiary-Hectic_Highway.png";
					break;
				case 'Ode to Castlevania':
					ground = "/images/Bestiary-Ode_to_Castlevania.png";
					break;
				case 'Emerald Diorama':
					ground = "/images/Bestiary-Emerald_Diorama.png";
					break;
				case 'Ante Chamber':
					ground = "/images/Bestiary-Ante_Chamber.png";
					break;
			}
			return ground;
		}
		
		function display_stage_data(charIndex,stageIndex) {
			$("#stage_data").html(`<div class="to-the-west-rows" width="100%"><a href="/w/${STAGES[stageIndex].page_name}"><img src="${STAGES[stageIndex].image.replace("File:","/images/").replaceAll(" ","_")}?${cachebuster}" height="140px;"/></a><div class="to-the-west" id="stage_info"></div></div>`);
			if (!stageData[CHARACTERS[charIndex].id] || !stageData[CHARACTERS[charIndex].id][STAGES[stageIndex].id]) {
				$("#stage_info").html(`<span><b>No Stage Data</b></span><br>`);
			}
			$("#stage_info").html(`<span><b>Completed Runs</b>: ${stageData[CHARACTERS[charIndex].id][STAGES[stageIndex].id].completedRuns}</span><br>`);
			$("#stage_info").append(`<span><b>Started Runs</b>: ${stageData[CHARACTERS[charIndex].id][STAGES[stageIndex].id].startedRuns}</span><br>`);
			$("#stage_info").append(`<span><b>Minutes Survived</b>: ${stageData[CHARACTERS[charIndex].id][STAGES[stageIndex].id].survivedMinutes}</span><br>`);
			$("#stage_info").append(`<span><b>Hyper Mode Beaten</b>: ${(stageData[CHARACTERS[charIndex].id][STAGES[stageIndex].id].hyperCompleted) ? '<img src="/images/Yes_check.svg"/>' : '<img src="/images/X_mark.svg"/>'}</span><br>`);
			$("#stage_info").append(`<span><b>Hurry Mode Beaten</b>: ${(stageData[CHARACTERS[charIndex].id][STAGES[stageIndex].id].hurryCompleted) ? '<img src="/images/Yes_check.svg"/>' : '<img src="/images/X_mark.svg"/>'}</span><br>`);
			$("#stage_info").append(`<span><b>Inverse Mode Beaten</b>: ${(stageData[CHARACTERS[charIndex].id][STAGES[stageIndex].id].inverseCompleted) ? '<img src="/images/Yes_check.svg"/>' : '<img src="/images/X_mark.svg"/>'}</span><br>`);
		}
		
		function display_char_info(index) {
			let spritename = CHARACTERS[index].image.replace('File:Select','/images/Animated').replaceAll(" ","_").replace(".png","");
			let id = CHARACTERS[index].id;
			let wid = 256;
			switch (CHARACTERS[index].page_name) {
				case 'Jonathan_Morris':
					spritename = "/images/Sprite-Jonathan_Morris_(Idle).png";
					break;
				case 'Chaos':
					spritename = "/images/Sprite-Chaos_(full).png";
					wid = 512;
					break;
				case 'Death_(character)':
					spritename = "/images/Animated-Death.gif";
					break;
				case 'Peppino':
					spritename = CHARACTERS[index].image.replace('File:Select','/images/Sprite').replaceAll(" ","_");
					break;
				case 'Megalo_Death':
				case 'Megalo_Olrox':
				case 'Megalo_Dracula':
					spritename = "/images/Sprite-" + CHARACTERS[index].page_name + ".png";
					wid = 512;
					break;
				case 'Megalo_Elizabeth_Bartley':
				case 'Malphas':
				case 'Galamoth':
					spritename += ".gif";
					wid = 512;
					break;
				default:
					spritename += ".gif";
			}
			let ground = get_ground(CHARACTERS[index].page_name,CHARACTERS[index].dlc);
			let spr_class;
			$("#character_name").html(`<h2 class="to-the-center">${CHARACTERS[index].page_name.replaceAll("_"," ")}</h2>`);
			$("#character_name").append(`<div><img class="to-the-center" style="max-width:1024px;" src="/images/Sprite-Experience_Bar.png?7870"><div class="level-text"><b>LV 1</b></div></div><br>`);
			$("#character_info").html(`<div class="to-the-center"><div class="to-the-west" id="ci_info" style="text-align:left;"></div><span class="for-the-sprite" id="ci_sprite"></span><div class="stage-listing" id="ci_stages"></div></div>`);
			$("#ci_info").html(`<div><a href="/w/${CHARACTERS[index].page_name}">Read this character's article!</a></div>`);
			if (saveData.OpenedCoffins != null && CHARACTERS[index].coffin_character != null) {
				let unl = saveData.UnlockedCharacters.includes(id);
				let owns = saveData.OpenedCoffins.includes(id);
				if (id == 'ANTONIO' || id == 'IMELDA' || id == 'PASQUALINA' || id == 'GENNARO') {
					if (id == 'ANTONIO') {
						saveData.BoughtCharacters.push(id);
						owns = true; //force antonio for older saves
					}
					saveData.UnlockedCharacters.push(id);
					unl = true; //force antonio.imelda,pasqualina and gennaro for older saves
				}
				if (id == 'TP_DRACULA') { //saved as bought character
					owns = saveData.BoughtCharacters.includes(id);
				}
				$("#ci_info").append(`<div><b>Unlocked</b>: ${(unl ? '<img src="/images/Yes_check.svg"/>' : '<img src="/images/X_mark.svg"/>')} | <b>Coffin Opened</b>: ${(owns ? '<img src="/images/Yes_check.svg"/>' : '<img src="/images/X_mark.svg"/>')}</div>`);
				spr_class = (owns ? "gimme-integers" : "gimme-hidden-integers");
			} else {
				let unl = saveData.UnlockedCharacters.includes(id);
				let owns = saveData.BoughtCharacters.includes(id);
				if (id == 'ANTONIO' || id == 'IMELDA' || id == 'PASQUALINA' || id == 'GENNARO') {
					if (id == 'ANTONIO') {
						saveData.BoughtCharacters.push(id);
						owns = true; //force antonio for older saves
					}
					saveData.UnlockedCharacters.push(id);
					unl = true; //force antonio,imelda,pasqualina and gennaro for older saves
				}
				if (id == 'SCOREJ') { //saved as coffin character
					owns = saveData.OpenedCoffins.includes(id);
				}
				$("#ci_info").append(`<div><b>Unlocked</b>: ${(unl ? '<img src="/images/Yes_check.svg"/>' : '<img src="/images/X_mark.svg"/>')} | <b>Bought</b>: ${(owns ? '<img src="/images/Yes_check.svg"/>' : `<img src="/images/X_mark.svg"/> ${get_cost_string(index)}`)}</div>`);
				spr_class = (owns ? "gimme-integers" : "gimme-hidden-integers");
			}
			if (saveData.CharacterEnemiesKilled != null) {
				$("#ci_info").append(`<div><b>Total Kills</b>: ${(saveData.CharacterEnemiesKilled[id] || 0).toLocaleString() || 0}</div>`);
			}
			if (saveData.CharacterSurvivedMinutes != null) {
				$("#ci_info").append(`<div><b>Minutes Survived</b>: ${saveData.CharacterSurvivedMinutes[id] || 0}</div>`);
			}
			$("#ci_info").append( //this looks horrid, changing later
				`<table>
					<tr><td><img src="/images/Sprite-Hollow_Heart.png" style="width:20px;height:20px;"/><b> Max Health</b></td><td style="text-align:right;">${get_stat_string(index,'Max Health')}</td></tr>
					<tr><td><img src="/images/Sprite-Pummarola.png" style="width:20px;height:20px;"/><b> Recovery</b></td><td style="text-align:right;">${get_stat_string(index,'Recovery')}</td></tr>
					<tr><td><img src="/images/Sprite-Armor.png" style="width:20px;height:20px;"/><b> Armor</b></td><td style="text-align:right;">${get_stat_string(index,'Armor')}</td></tr>
					<tr><td><img src="/images/Sprite-Wings.png" style="width:20px;height:20px;"/><b> Movement Speed</b></td><td style="text-align:right;">${get_stat_string(index,'Move Speed')}</td></tr>
					<tr><td><br></td></tr>
					<tr><td><img src="/images/Sprite-Spinach.png" style="width:20px;height:20px;"/><b> Might</b></td><td style="text-align:right;">${get_stat_string(index,'Might')}</td></tr>
					<tr><td><img src="/images/Sprite-Bracer.png" style="width:20px;height:20px;"/><b> Speed</b></td><td style="text-align:right;">${get_stat_string(index,'Speed')}</td></tr>
					<tr><td><img src="/images/Sprite-Spellbinder.png" style="width:20px;height:20px;"/><b> Duration</b></td><td style="text-align:right;">${get_stat_string(index,'Duration')}</td></tr>
					<tr><td><img src="/images/Sprite-Candelabrador.png" style="width:20px;height:20px;"/><b> Area</b></td><td style="text-align:right;">${get_stat_string(index,'Area')}</td></tr>
					<tr><td><br></td></tr>
					<tr><td><img src="/images/Sprite-Empty_Tome.png" style="width:20px;height:20px;"/><b> Cooldown</b></td><td style="text-align:right;">${get_stat_string(index,'Cooldown')}</td></tr>
					<tr><td><img src="/images/Sprite-Duplicator.png" style="width:20px;height:20px;"/><b> Amount</b></td><td style="text-align:right;">${get_stat_string(index,'Amount')}</td></tr>
					<tr><td><img src="/images/Sprite-Tirajisú.png" style="width:20px;height:20px;"/><b> Revival</b></td><td style="text-align:right;">${get_stat_string(index,'Revival')}</td></tr>
					<tr><td><img src="/images/Sprite-Attractorb.png" style="width:20px;height:20px;"/><b> Magnet</b></td><td style="text-align:right;">${get_stat_string(index,'Magnet')}</td></tr>
					<tr><td><br></td></tr>
					<tr><td><img src="/images/Sprite-Clover.png" style="width:20px;height:20px;"/><b> Luck</b></td><td style="text-align:right;">${get_stat_string(index,'Luck')}</td></tr>
					<tr><td><img src="/images/Sprite-Crown.png" style="width:20px;height:20px;"/><b> Growth</b></td><td style="text-align:right;">${get_stat_string(index,'Growth')}</td></tr>
					<tr><td><img src="/images/Sprite-Stone_Mask.png" style="width:20px;height:20px;"/><b> Greed</b></td><td style="text-align:right;">${get_stat_string(index,'Greed')}</td></tr>
					<tr><td><img src="/images/Sprite-Skull_O'Maniac.png" style="width:20px;height:20px;"/><b> Curse</b></td><td style="text-align:right;">${get_stat_string(index,'Curse')}</td></tr>
					<tr><td><br></td></tr>
					<tr><td><img src="/images/Sprite-Reroll.png" style="width:20px;height:20px;"/><b> Reroll</b></td><td style="text-align:right;">${get_stat_string(index,'Reroll')}</td></tr>
					<tr><td><img src="/images/Sprite-Skip.png" style="width:20px;height:20px;"/><b> Skip</b></td><td style="text-align:right;">${get_stat_string(index,'Skip')}</td></tr>
					<tr><td><img src="/images/Sprite-Banish.png" style="width:20px;height:20px;"/><b> Banish</b></td><td style="text-align:right;">${get_stat_string(index,'Banish')}</td></tr>
				</table>`
				);
			if (saveData.EggData != null) {
				$("#ci_info").append(`<div><img src="/images/Sprite-Golden_Egg.png" style="width:20px;height:20px;"/><b> Golden Eggs</b>: ${((saveData.EggData[id]!=null) ? saveData.EggData[id].total : 0).toLocaleString()}</div>`);
			}
			switch (id) {
				case 'TP_JONATHAN_AND_CHARLOTTE':
					$("#ci_sprite").html(`<span class="for-the-sprite"><img class="${spr_class}" src="/images/Animated-Charlotte_Aulin.gif?0413" style="width:${256/1.5}px;margin-top:0;margin-left:-192px;z-index:-1;"/>`);
					$("#ci_sprite").append(`<img class="${spr_class}" src="/images/Animated-Jonathan_Morris.gif?0413" style="width:${wid}px;margin-top:-192px;"/></span><br><span class="center-but-gaps" id="ci_weapons"></span><span class="for-the-sprite" id="ci_desc"></span><br>`);
					break;
				case 'TP_CHARLOTTE_AND_JONATHAN':
					$("#ci_sprite").html(`<span class="for-the-sprite"><img class="${spr_class}" src="/images/Animated-Jonathan_Morris.gif?0413" style="width:${256/1.5}px;margin-top:0;margin-left:-192px;z-index:-1;"/>`);
					$("#ci_sprite").append(`<img class="${spr_class}" src="/images/Animated-Charlotte_Aulin.gif?0413" style="width:${wid}px;margin-top:-192px;"/></span><br><span class="center-but-gaps" id="ci_weapons"></span><span class="for-the-sprite" id="ci_desc"></span><br>`);
					break;
				case 'TP_STELLA_AND_LORETTA':
					$("#ci_sprite").html(`<span class="for-the-sprite"><img class="${spr_class}" src="/images/Animated-Loretta_Lecarde.gif?04130" style="width:${256/1.5}px;margin-top:0;margin-left:-192px;z-index:-1;"/>`);
					$("#ci_sprite").append(`<img class="${spr_class}" src="/images/Animated-Stella_Lecarde.gif?0413" style="width:${wid}px;margin-top:-192px;"/></span><br><span class="center-but-gaps" id="ci_weapons"></span><span class="for-the-sprite" id="ci_desc"></span><br>`);
					break;
				case 'TP_LORETTA_AND_STELLA':
					$("#ci_sprite").html(`<span class="for-the-sprite"><img class="${spr_class}" src="/images/Animated-Stella_Lecarde.gif?0413" style="width:${256/1.5}px;margin-top:0;margin-left:-192px;z-index:-1;"/>`);
					$("#ci_sprite").append(`<img class="${spr_class}" src="/images/Animated-Loretta_Lecarde.gif?0413" style="width:${wid}px;margin-top:-192px;"/></span><br><span class="center-but-gaps" id="ci_weapons"></span><span class="for-the-sprite" id="ci_desc"></span><br>`);
					break;
				case 'TP_SLOGRA_AND_GAIBON':
					$("#ci_sprite").html(`<span class="for-the-sprite"><img class="${spr_class}" src="/images/Animated-Slogra_and_Gaibon_(Gaibon).gif?0413" style="width:${256}px;margin-top:0;margin-left:-192px;z-index:-1;"/>`);
					$("#ci_sprite").append(`<img class="${spr_class}" src="/images/Animated-Slogra_and_Gaibon.gif?0413" style="width:${wid}px;margin-top:-64px;"/></span><br><span class="center-but-gaps" id="ci_weapons"></span><span class="for-the-sprite" id="ci_desc"></span><br>`);
					break;
				case 'TP_FAKE_TRIO':
					$("#ci_sprite").html(`<span class="for-the-sprite"><img class="${spr_class}" src="/images/Animated-Fake_Grant.gif?0413" style="width:${256/1.75}px;margin-top:0;margin-left:-256px;z-index:-2;"/>`);
					$("#ci_sprite").append(`<span class="for-the-sprite"><img class="${spr_class}" src="/images/Animated-Fake_Sypha.gif?0413" style="width:${256/1.5}px;margin-top:-160px;margin-left:256px;z-index:-1;"/>`);
					$("#ci_sprite").append(`<img class="${spr_class}" src="/images/Animated-Fake_Trevor.gif?0413" style="width:${wid}px;margin-top:-224px;margin-left:0;"/></span><br><span class="center-but-gaps" id="ci_weapons"></span><span class="for-the-sprite" id="ci_desc"></span><br>`);
					break;
				default:
					$("#ci_sprite").html(`<span class="for-the-sprite"><img id="char-sprite" class="${spr_class}" src="${spritename}?${cachebuster}" style="width:${wid}px;"/></span><br><span><img class="ground" src="${ground}?${cachebuster}" /></span><br><span class="center-but-gaps" id="ci_weapons"></span><span class="for-the-sprite" id="ci_desc"></span><br><span class="griddy-skins" id="ci_skins"></span><br>`);
			}
			if (CHARACTERS[index].starting_weapon != null) {
				for (const weapon of CHARACTERS[index].starting_weapon) {
					$("#ci_weapons").append(`<img class="weapons" src="/images/Sprite-${weapon.replaceAll(" ","_")}.png" style="height:64px;"/>`);
				}
			}
			if (CHARACTERS[index].hidden_weapon != null) {
				for (const weapon of CHARACTERS[index].hidden_weapon) {
					$("#ci_weapons").append(`<img class="weapons" src="/images/Sprite-${weapon.replaceAll(" ","_")}.png" style="height:64px;"/>`);
				}
			}
			$("#ci_weapons").append("<br>");
			if (!saveData.UnlockedCharacters.includes(id)) {
				$("#ci_desc").html(`<span class="for-the-sprite"><b>${fix_description(CHARACTERS[index].unlocked_by||"")}</b></span><br><br>`);
			} else {$("#ci_desc").html(`<span class="for-the-sprite"><b>${fix_description(CHARACTERS[index].description||"")}</b></span><br><br>`)}
			
			if (saveData.UnlockedSkinsV2 && saveData.UnlockedSkinsV2[id] != null) {
				for (let i=0; i<saveData.UnlockedSkinsV2[id].length; i++) {
					let skin = saveData.UnlockedSkinsV2[id][i];
					if (skin == 'SKIN_TP_MARIA_5SB') {continue}
					let skindex = SKINS[CHARACTERS[index].page_name][skin];
					let source = CHARACTERS[skindex].image;
					if (source) {source = source.replace('File:','/images/').replaceAll(" ","_")}
					let button = new OO.ui.ButtonWidget({
						label: $(`<img class="griddy-skins" src="${source}?${cachebuster}" style="width:96px;margin-top:8px;"/>`),
						framed: false
					});
					if (skin.startsWith('SKIN_TP')) {
						if (skin == 'SKIN_TP_SOMA_DARKLORD' || id == 'TP_FAMILIARS' || id == 'TP_INNOCENT_DEVILS') {
							button.on('click', () => change_skin(skin,skindex));
						} else {
							button.on('click', () => change_skin('DEFAULT',skindex));
						}
					} else if (skin == 'SKIN_EME_B_KICK' || skin == 'SKIN_EME_SOLO_KICK' || skin == 'SKIN_EME_SELECT') {
						button.on('click', () => change_skin('DEFAULT',skindex));
					} else {
						button.on('click', () => change_skin(skin,skindex));
					}
					$("#ci_skins").append(button.$element);
				}
			} else {
				let source = CHARACTERS[index].image;
				if (source) {source = source.replace('File:','/images/').replaceAll(" ","_")}
				let button = new OO.ui.ButtonWidget({
					label: $(`<img class="griddy-skins" src="${source}?${cachebuster}" style="width:96px;margin-top:8px;"/>`),
					framed: false
				});
				button.on('click', () => change_skin('DEFAULT',index));
				$("#ci_skins").append(button.$element);
			}
			$("#ci_stages").html(`<div class="stage-listing"></div>`);
			
			//enabling this back after i make a way to lock bgm
			//if (CHARACTER_BGM[id] != null) {
			//	if (document.getElementById("bg-music").currentSrc != CHARACTER_BGM[id]){document.getElementById("bg-music").src = CHARACTER_BGM[id]}
			//}
			
			$("#stage_data").html('<div></div>');
			if (saveData.CharacterStageData[id] && !stageData[id]) {
				stageData[id] = {};
				for (let stage of saveData.CharacterStageData[id]) {
					stageData[id][stage.type] = {};
					stageData[id][stage.type].completedRuns = stage.complete;
					stageData[id][stage.type].startedRuns = stage.startedRun;
					stageData[id][stage.type].survivedMinutes = stage.survivedMinutes;
					stageData[id][stage.type].hyperCompleted = stage.hyper;
					stageData[id][stage.type].hurryCompleted = stage.hurry;
					stageData[id][stage.type].inverseCompleted = stage.inverse;
				}
			}
			
			if (saveData.StageCompletionLog == null) {
				return;
			}
			
			for (let i=0; i<STAGES.length; i++) {
				if (STAGES[i].page_name.endsWith("_(stage)")) {
					let sprname = STAGES[i].page_name.substring(0,STAGES[i].page_name.length-8);
					let button = new OO.ui.ButtonWidget({
						label: $(`<img src="/images/Stage-${sprname}.png?${cachebuster}" style="height:48px;"/>`),
						framed: false
					});
					button.on('click', () => display_stage_data(index,i));
					$("#ci_stages").append(button.$element);
				} else {
					let sprname = STAGES[i].page_name;
					let button = new OO.ui.ButtonWidget({
						label: $(`<img src="/images/Stage-${sprname}.png?${cachebuster}" style="height:48px;"/>`),
						framed: false
					});
					button.on('click', () => display_stage_data(index,i));
					$("#ci_stages").append(button.$element);
				}
				if (saveData.StageCompletionLog[id] != null) {
					$("#ci_stages").append(`${(saveData.StageCompletionLog[id].includes(STAGES[i].id) ? ' <img src="/images/Yes_check.svg" style="width:20px;height:20px;margin-left:-8px;"/>  ' : ' <img src="/images/X_mark.svg" style="width:20px;height:20px;margin-left:-8px;"/>  ')}`);
				} else {
					$("#ci_stages").append(` <img src="/images/X_mark.svg" style="width:20px;height:20px;margin-left:-8px;"/>  `);
				}
				if (i%2!=0) {
					$("#ci_stages").append("<br>");
				} else {
					continue;
				}
			}
		}
		
		function display_unlchar() {
			$("#unlocked_title").html(`<div class="to-the-center"><h2>Unlocked Characters</h2></div>`);
			$("#secrets_title").html(`<div class="to-the-center"><h2>Secrets</h2></div>`);
			for (let i=0; i<CHARACTERS.length; i++) {
				if (
					(saveData.UnlockedCharacters.includes(CHARACTERS[i].id)
					|| CHARACTERS[i].id == 'ANTONIO' || CHARACTERS[i].id == 'IMELDA' 
					|| CHARACTERS[i].id == 'PASQUALINA' || CHARACTERS[i].id == 'GENNARO')
					&& (CHARACTERS[i].is_default == "")) {
					let spritename = CHARACTERS[i].image.replace("File:","/images/").replaceAll(" ","_");
					if (saveData.SelectedSkinsV2 != null && saveData.SelectedSkinsV2[CHARACTERS[i].id] != null) {
						let skin = saveData.SelectedSkinsV2[CHARACTERS[i].id];
						let skindex = SKINS[CHARACTERS[i].page_name][skin];
						i = skindex;
						spritename = CHARACTERS[skindex].image.replace("File:","/images/").replaceAll(" ","_");
					}
					if (old) {
						let skindex = SKINS[CHARACTERS[i].page_name]['LEGACY'];
						if (skindex) {
							i = skindex;
							spritename = CHARACTERS[skindex].image.replace("File:","/images/").replaceAll(" ","_");
						}
					}
					let button = new OO.ui.ButtonWidget({
						label: $(`<img src="${spritename}?${cachebuster}" style="width:109px;height:109px;"/>`),
						framed: false
					});
					button.on('click', () => display_char_info(i));
					if (CHARACTERS[i].secret_character != null) {
						$("#secrettos").append(button.$element);
					} else {
						$("#unlocked_characters").append(button.$element);
					}
				} else if (CHARACTERS[i].is_default == "" && ownedDlcs.includes(CHARACTERS[i].dlc)) {
					let spritename = "/images/Select-Random.png";
					let button = new OO.ui.ButtonWidget({
						label: $(`<img src="${spritename}?${cachebuster}" style="width:109px;height:109px;opacity:50%;"/>`),
						framed: false
					});
					if (old) {
						let skindex = SKINS[CHARACTERS[i].page_name]['LEGACY'];
						if (skindex) {
							i = skindex;
						}
					}
					button.on('click', () => display_char_info(i));
					if (CHARACTERS[i].secret_character != null) {
						$("#secrettos").append(button.$element);
					} else {
						$("#unlocked_characters").append(button.$element);
					}
				}
			}
		}
		
		function display_powerups() {
			$("#powerups_title").html(`<div class="to-the-center"><h2>PowerUps</h2></div>`);
			
			for (let pwu in POWERUPS) {
				console.log(POWERUPS[pwu]);
				$("#pug").append(`<div id="pwu_${pwu}" class="v-align-center"></div>`);
				$(`#pwu_${pwu}`).html(`<span><b>${POWERUPS[pwu].name}</b></span><img src="${POWERUPS[pwu].image.replace("File:","/images/").replaceAll(" ","_")}" style="width:48px"/><span>${powerups[POWERUPS[pwu].id]}/${POWERUPS[pwu].max_level}</span>`);
			}
		}
		
		function display_collection() {
			$("#collection_title").html(`<div class="to-the-center"><h2>Collection</h2></div>`);
			for (let i=0; i<COLLECTION_IDS.length; i++) {
				if (saveData.CollectedWeapons.includes(COLLECTION_IDS[i])) {
					let spritename = "/images/Icon-" + COLLECTION_NAMES[i].replaceAll(" ","_").replaceAll(":","-");
					switch (COLLECTION_IDS[i]) {
						case 'C1_REPORT2':
							spritename = "/images/Icon-Emergency_Meeting_(weapon)";
							break;
						case 'TP_ENERGY2':
							spritename = "/images/Icon-Anima_of_Dracula";
							break;
					}
					spritename += ".png";
					let button = new OO.ui.ButtonWidget({
						label: $(`<img class="gimme-integers" src="${spritename}?${cachebuster}" style="width:53px;height:53px;"/>`),
						title: COLLECTION_NAMES[i],
						href: `/w/${COLLECTION_NAMES[i]}`,
						framed: false
					});
					//button.on('click', () => );
					$("#collection_info").append(button.$element);
				} else if (saveData.CollectedItems.includes(COLLECTION_IDS[i]) || saveData.PickupCount[COLLECTION_IDS[i]] != null) {
					let spritename = "/images/Icon-" + COLLECTION_NAMES[i].replaceAll(" ","_");
					spritename += ".png";
					let button = new OO.ui.ButtonWidget({
						label: $(`<img class="gimme-integers" src="${spritename}?${cachebuster}" style="width:53px;height:53px;"/>`),
						title: COLLECTION_NAMES[i],
						href: `/w/${COLLECTION_NAMES[i]}`,
						framed: false
					});
					//button.on('click', () => );
					$("#collection_info").append(button.$element);
				} else if (saveData.UnlockedArcanas != null && saveData.UnlockedArcanas.includes(COLLECTION_IDS[i])) {
					let spritename = "/images/Icon-" + COLLECTION_NAMES[i].replaceAll(" ","_");
					spritename += ".png";
					let button = new OO.ui.ButtonWidget({
						label: $(`<img class="gimme-integers" src="${spritename}?${cachebuster}" style="width:53px;height:53px;"/>`),
						title: COLLECTION_NAMES[i],
						href: `/w/${COLLECTION_NAMES[i]}`,
						framed: false
					});
					//button.on('click', () => );
					$("#collection_info").append(button.$element);
				}
			}
		}
		
		function display_pickups() {
			$("#pickups_title").html(`<div class="to-the-center"><h2>Pickup Data</h2></div>`);
			for (let i=0; i<PICKUPS.length; i++) {
				if (saveData.CollectedItems.includes(PICKUPS[i].id) || saveData.PickupCount[PICKUPS[i].id] != null) {
					if (PICKUPS[i].id == 'TREASURE') {
						let spritename;
						for (let j=0; j<3; j++) {
							switch(j) {
								case 0:
									spritename = "/images/Sprite-Treasure_Chest.png";
									$("#pickups").append(`<span><img src="${spritename}" style="width:20px;height:20px;"/>  <b>Treasure Chest</b>: ${(saveData.PickupCount.STATS_TREASURE_1||0).toLocaleString()} collected in total.</span><br>`);
									break;
								case 1:
									spritename = "/images/Sprite-Treasure_Chest_2.png";
									$("#pickups").append(`<span><img src="${spritename}" style="width:20px;height:20px;"/>  <b>Triple Chest</b>: ${(saveData.PickupCount.STATS_TREASURE_2||0).toLocaleString()} collected in total.</span><br>`);
									break;
								case 2:
									spritename = "/images/Sprite-Treasure_Chest_3.png";
									$("#pickups").append(`<span><img src="${spritename}" style="width:20px;height:20px;"/>  <b>Penta Chest</b>: ${(saveData.PickupCount.STATS_TREASURE_3||0).toLocaleString()} collected in total.</span><br>`);
									break;
							}
						}
					} else {
						let spritename = PICKUPS[i].image.replace('File:','/images/').replace('Icon','Sprite').replaceAll(" ","_");
						$("#pickups").append(`<span><img src="${spritename}" style="width:20px;height:20px;"/> <b>${(PICKUPS[i].version_anchor||PICKUPS[i].name).replaceAll("_"," ")}</b>: ${(saveData.PickupCount[PICKUPS[i].id]||0).toLocaleString()} collected in total.</span><br>`);
					}
				} else if ((PICKUPS[i].id == 'GEM') || (PICKUPS[i].id == 'COIN')) {
					let spritename = PICKUPS[i].image.replace('File:','/images/').replace('Icon','Sprite').replaceAll(" ","_");
					$("#pickups").append(`<span><img src="${spritename}" style="width:20px;height:20px;"/> <b>${PICKUPS[i].name.replaceAll("_"," ")}</b>: ${(saveData.PickupCount[PICKUPS[i].id]||0).toLocaleString()} collected in total.</span><br>`);
				}
			}
		}
		
		function display_arcanas() {
			if (saveData.UnlockedArcanas == null) {
				return;
			}
			$("#arcana_title").html(`<div class="to-the-center"><h2>Arcana</h2><br></div>`);
			$("#arcana").html(`<div class="to-the-center" id="mazzo"></div><div class="to-the-center" id="mazzo2"></div><div class="to-the-center" id="darka"></div><div class="to-the-center" id="darka2"></div>`);
			for (let i=0; i<ARCANAS.length; i++) {
				let spritename;
				let link = "";
				if (saveData.UnlockedArcanas.includes(ARCANAS[i].order)) {
					spritename = ARCANAS[i].image.replace("File:","/images/").replaceAll(" ","_");
					link = ARCANAS[i].page_name;
				} else {
					if (i < 22) {
						spritename = "/images/Sprite-Arcana_back.png";
					} else {spritename = "/images/Sprite-Darkana_back.png"}
				}
				let button = new OO.ui.ButtonWidget({
					label: $(`<img src="${spritename}?${cachebuster}" style="width:63px;height:90px;"/>`),
					href: `/w/${link}`,
					framed: false
				});
				if (i < 11) {
					$("#mazzo").append(button.$element);
				} else if (i < 22) {
					$("#mazzo2").append(button.$element);
				} else if (i < 33) {
					$("#darka").append(button.$element);
				} else {
					$("#darka2").append(button.$element);
				}
			}
		}
		
		function display_enemies() {
			if (saveData.KillCount == null) {
				return;
			}
			$("#bestiary_title").html(`<div class="to-the-center"><h2>Bestiary</h2><br></div>`);
			$("#bestiary_data").html(`<table id="bestiary_data_table" class="wikitable sortable" style="width:100%"><tr><th>Enemy</th><th data-sort-type="number">Kills</th></tr></table>`);
			let unified = {};
			for (let i=0; i<ENEMIES.length; i++) {
				if (!ENEMIES[i].id || unified[ENEMIES[i].id[0]]) continue;
				let spritename = "";
				for (let j=0; j<ENEMIES[i].id.length; j++) {
					if (saveData.KillCount[ENEMIES[i].id[j]] != null) {
						unified[ENEMIES[i].id[0]] = (unified[ENEMIES[i].id[0]]||0)+saveData.KillCount[ENEMIES[i].id[j]];
						if (ENEMIES[i].image || ENEMIES[i].sprites) spritename = (ENEMIES[i].image||ENEMIES[i].sprites[0]).replace("File:","/images/").replaceAll(" ","_");
					}
				}
				$("#bestiary_data_table").append(`<tr class="enemy-table"><td><img class="gimme-integers" src="${spritename}?${cachebuster}" style="height:128px"/>  <b>${ENEMIES[i].name}: </b></td><td>${(unified[ENEMIES[i].id[0]]||0).toLocaleString()} killed in total.</td></tr>`);
			}
			$("#bestiary_data_table").tablesorter({sortList: [{1: 'desc'}]});
		}
		
		function format_time(seconds) {
			let minutes = seconds / 60.0;
			let hours = minutes / 60.0;
			return ((seconds > 3600) ? (Math.floor(hours) + ":") : "") + ((seconds > 60) ? (Math.floor(minutes % 60) + ":") : "") + Math.floor(seconds % 60);
		}
		
		function refactor_stats() {
			for (let i=0; i<CHARACTERS.length; i++) {
				let newstats = {};
				for (let j=0; j<CHARACTERS[i].stats_json.length; j++) {
					newstats[CHARACTERS[i].stats_json[j].name] = CHARACTERS[i].stats_json[j].value;
				}
				CHARACTERS[i].stats_json = newstats;
			}
		}
		
		async function read_save(sd) {
			saveData = sd;
			await populate_tables();
			for (let i=0; i<saveData.BoughtPowerups.length; i++) {
				powerups[saveData.BoughtPowerups[i]] += 1;
			}
			refactor_stats();
			display_basic_info();
			display_unlchar();
			display_powerups();
			display_collection();
			display_pickups();
			display_arcanas();
			display_enemies();
		}
		
		// written by Californ1a
		function createFileInput() {
			const uploadSave = new OO.ui.SelectFileInputWidget({
				droppable: true,
			});
			const helpHTML = $('<div>').append(
				'<span>Load unlocks from save file.</span><br>',
				$('<ul>').append(
					'<li>Steam: <code>..\\<wbr>Steam\\<wbr>userdata\\<wbr>&lt;ID&gt;\\<wbr>1794680\\<wbr>remote\\</code></li>',
					'<li>Epic: <code>C:\\<wbr>Users\\<wbr>&lt;NAME&gt;\\<wbr>AppData\\<wbr>Roaming\\<wbr>Vampire_Survivors_EGS\\</code></li>'
				)
			);
		
			const form = new OO.ui.FieldsetLayout({
				classes: ['savedata-form'],
			});
			const formItem = new OO.ui.FieldLayout(uploadSave, {
				label: 'Autofill from save file: ',
				align: 'left',
				help: new OO.ui.HtmlSnippet(helpHTML),
			});
			form.addItems([formItem]);
		
			const invalidFile = function(msg) {
				msg = msg || 'Invalid SaveData file.';
				const widget = new OO.ui.MessageWidget({
					type: 'error',
					label: msg,
					inline: true,
				});
				formItem.setErrors([msg]);
				//mw.notify(widget.$element);
			};
		
			const uploadSaveChange = function(file) {
				//console.log('file', file);
				formItem.setErrors([]);
				if (!file) return;
				
		
				//console.log(file[0]);
				const reader = new FileReader();
				reader.onload = function() {
					try {
						// NOTE: Parsing SaveData removes '.0' floats, eg 123.0 -> 123
						const SaveData = JSON.parse(reader.result);
						console.log(SaveData);
		
						read_save(SaveData);
					} catch (error) {
						invalidFile('Failed to parse SaveData file.');
						mw.log(error);
					}
				};
				reader.readAsText(file[0]);
			};
			uploadSave.on('change', uploadSaveChange);
		
			return form;
		}
		
		const open_fd = createFileInput();
		
		$("#open_save").html(open_fd.$element);
	}());
});
