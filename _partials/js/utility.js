
// Fill search box code.
function clearGoogle(){
	var q = document.getElementsByName("q")[0];
	if(q.value == "Search" && q.className=="googlite" ){
		q.className="goog";
		q.value = "";
	}
}
function fillGoogle(){
	var q = document.getElementsByName("q")[0];
	q.className="googlite";
	q.value="Search";
}
function checkGoogle(){
	var q = document.getElementsByName("q")[0];
	if(q.value == "" && q.className=="goog" ){
		fillGoogle();
	}else if(q.value == "Search" && q.className=="googlite" ){
		clearGoogle();
	}
}
function initSearch(){
	var q = document.getElementsByName("q")[0];
	q.onfocus=checkGoogle;
	q.onblur=checkGoogle;
	fillGoogle();
}

// Check for search box
function search(value) {
	if ((value == "Search" || value == "") || (value == "Enter Search Term" || value == "")) {
		return false;
	}
	else {
		return true;
	}
}

//Add script tag to page (usually used for scripts)

function loadScript(file, callback) {
    var _head = document.getElementsByTagName("head")[0];
    var _script = document.createElement('script');
    //Internet explorer
    _script.onreadystatechange = function() {
        if (this.readyState == 'complete') {
            callback();
        }
    }
	//Other browsers
    _script.onload = callback;
    _script.src = file;
    _head.appendChild(_script);
}


// Mobile menu toggles
$(function(){
    var
    $toggleBtns = $('.top-nav-button'),
    toggleTargets = [],
    toToggle;

    //Get the correct jQuery event handler
    var jEvent = ($.fn.on ? 'on' : 'live');

    //Focus the searchbox automatically when active
    $('#searchBox')[jEvent]('item:active', function(){
        $('#q').focus();
    });

    //Setting click handlers (called later)
    var setHandlers = function(i, toggleTargets) {
        $(this).click(function(e){
            e.preventDefault();
            //slide up and remove the class from the other toggle target indexes

            $(toggleTargets.join(',')).not(toggleTargets[i])
                .slideUp(150, function(){
                    //Remove redundant style attribute applied by slideup()
                    $(this).removeClass('active').attr('style','');
                }
            );

            //toggle the target with this same index
            $(toggleTargets[i]).slideToggle(
                {
                    duration: 150,
                    complete: function(){
                        //Remove redundant style attribute applied by slideup()
                        $(this).toggleClass('active').css('display','');

                        //Trigger custom event so we can focus the searchbox when necessary
                        if($(this).hasClass('active')){
                            $(this).trigger('item:active');
                        }
                    }
                }
            );

            //Check the aria-expaned state
            var ariaState = $(this).attr('aria-expanded');
            ariaState = (ariaState === 'true' ? 'false' : 'true');

            //Toggle the aria state of this and its sibling button(s)
            $(this).attr('aria-expanded', ariaState).siblings().attr('aria-expanded', 'false');

        });
    }

    //Run through the menu buttons and grab their "aria-controls" attribute values
    $toggleBtns.each(function(i){

        toToggle = $(this).attr('aria-controls');
        //convert values to IDs (just appending # where necessary)
        toToggle = '#'+toToggle;
        //Since aria-controls is space-separated, we need to add commas between values
        toToggle = toToggle.replace(' ', ',#');

        //Store targets in array
        toggleTargets[i] = toToggle;

        setHandlers.call(this, i, toggleTargets);
    });
});

// -->
