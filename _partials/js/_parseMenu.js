// Dropdown menu code
;function dropDownMenu(navItems) {
	navItems = navItems || '#navBar .navItem'; //default

	var $element = $(navItems);
	var jEvent = ($.fn.on ? 'on' : 'live');

	$element.hoverIntent({
		interval: 50, // milliseconds delay before onMouseOver
		over: drops_show,
		timeout: 150, // milliseconds delay before onMouseOut
		out: drops_hide
	});

	//Focus events (used for accessibility)
	//determine if the item is an anchor or not, so we can select it
	var $element_anchor = $element.is('a') ? $element : $element.find('a:first-child');

	$element_anchor.focus(function() {
		drops_show.call($(this).parent(navItems)); //pass in the parent
	});

	$.ajax({
		type: "GET",
		url: "files/drop_menus.xml",
		dataType: "xml",
		success: parseMenu
	});

	var menuCounter = -1;

	function parseMenu(xml) {
		$(xml).find("menu").each(function(i) {

			var $this = $(this); //Micro optimization

			if ($this.find("item").text() != "empty") {
				$element.filter(":eq("+i+")")
					.addClass('with-js with-drop')
					.append("<div class='navDrop'></div>");
				menuCounter = menuCounter + 1
			}
			else {
				return true;
			}
			$this.find("item").each(function(j) {
				var label = $(this).find("label").text();
				var linky = $(this).find("link").text();
				$(".navDrop:eq("+menuCounter+")").append("<div><a href="+linky+">"+label+"</a></div>");
			});
		});
	}

	function drops_show(){ $(this).addClass('show').removeClass('with-js'); }
	function drops_hide(){ $(this).removeClass('show').addClass('with-js'); }
}
