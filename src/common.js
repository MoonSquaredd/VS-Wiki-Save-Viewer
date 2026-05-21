// i kinda know what im doing

mw.loader.using(['oojs-ui-core','oojs-ui-widgets','jquery.tablesorter']).done(function(){
	$(function(){
		if (mw.config.get("wgPageName") == "User:Lovenus/Vampiredle") {
			mw.loader.load(mw.util.getUrl('User:Lovenus/vampiredle.js', {action: 'raw', ctype: 'text/javascript'}));
		} else if (mw.config.get("wgPageName") == "User:Lovenus/SaveWikifier") {
			mw.loader.load(mw.util.getUrl('User:Lovenus/save_reader.js', {action: 'raw', ctype: 'text/javascript'}));
		}
	});
});
