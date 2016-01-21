(function($){
	///////////////////////////
	//Plugin Variables.
	///////////////////////////
	var active,noborder,style;

	//////////////////////////////////////////////////////
	//This is the active div that moves
	//through the Navigation.
	//////////////////////////////////////////////////////
	var hoverdiv=$("<div/>").hide()
				.addClass("banner-item-hover")
				//.append($("<div class='holder'/>"))
				//.append($("<div class='banner-item-hover-img'/>"));

	//////////////////////////////////////////////////////
	//Main Function: $().banner({ ..settings.. })
	//////////////////////////////////////////////////////
	$.fn.bannerwidget=function(uopts){
		//We need options!
		if(typeof uopts=="undefined")
			return "This plugin requires User Settings.";

		return this.each(function() {
			if(typeof banner == "undefined") banner=new Banner();

			//Create Banner instance &
			//Extend the global banner object.
			var b=banner.init($(this)[0]);

			//Default options
			b.opts={imgdir:"smph/images/bannerwidget/"};
			$.extend(b.opts,uopts);

			b.settings=$.ajax({url:b.opts.settingsFile,
								 async:false,
								 dataType:"xml",
								 success:function(d){
									 parseSettings(d,b);
								 },
								 error:function(xhr,s){
								 }
							   });
			//If $.ajax() returns status of 404, stop here.
			if (b.settings.status=="404") return "Settings File Not Found";

			//Create the main banner element
			var img = $("<div/>").addClass("banner-display")
								 .append($("<div class='banner-img'>"));
								 //.append($("<div class='banner-caption'/>"));

			//Preaload the images.
			banner.preloadObjects(b,$(img).find(".banner-img"));

			//Build the banner.
			var nav = banner.buildNav(b);

			//Append banner to the source element.
			if((b.opts.navposition=="top")||(b.opts.navposition=="left"))
				$(this).append(nav).append(img);
			else
				$(this).append(img).append(nav);

			//Create the player & start
			b.player=new player(b.items,$(".banner-img"),b);
			b.player.play();
			return true;
		});
	};
	function Banner(){
		this.instances={};
		this.init=function(elm){
			this.instances[elm.id]={items:[],opts:{},id:elm.id,domelm:elm,hover:$(hoverdiv).clone()};
			return this.instances[elm.id];
		}
		//////////////////////////////////////////////////////
		//Check if item has a caption. If not, hide caption,
		//return blank string. Else, return string and show
		//caption.
		//
		//@param  int - item index
		//@param DomNode - the banner element
		//@return string - item caption
		//////////////////////////////////////////////////////
		this.hasCaption=function (ic,b){
			if(b.items[ic].caption!=""){
				var capt = "<div class='capt'><h1>"+b.items[ic].text+"</h1><a href='"+b.items[ic].link+"'>"+b.items[ic].caption+"&nbsp;&nbsp;<span>Read more</span></a></div>";
				$(b.domelm).find(".banner-caption").html(capt).ifixpng().show();
			}else{
				$(b.domelm).find(".banner-caption").html("").hide();
			}
		};

		//////////////////////////////////////////////////////
		//Makes the navigation item active by moving the
		//hover div and changing the image.
		//
		//@param ObjectNode - Source node of the event.
		//////////////////////////////////////////////////////
		this.itemevent=function (src,b){
			if(!$(src).hasClass("banner-nav-item"))
				src=$(src).parent();

			if(src!=active){
				var ic=$(src).data("bannerItemCount");

				///////////////////////////
				//Navigation Hover
				///////////////////////////
				if(b.opts.navdirection=="vertical"){
					var top=(src.length>0)?$(src).position().top:$(b.domelm).position().top;

					$(b.domelm).find(".banner-nav").prepend( $(b.hover).css("top",top).show() );
					$(b.hover).find(".banner-item-hover-img").ifixpng();
					$(b.domelm).find(".holder").css("width","40px").animate({"width":"230px"},150);
				} else {
					if(b.opts.eventType=="animate"){
						var left=(src.length>0)?$(src).position().left:$(b.domelm).position().left;

						$(b.domelm).find(".banner-nav").prepend( $(b.hover).css("left",left).show() );//.text((b.opts.bannertext=="true")?$(src).text():"");
						$(b.hover).find(".banner-item-hover-img");
						$(b.domelm).find(".holder").css("width","40px").animate({"width":"230px"},150);
					} else {
						//$(b.domelm).find(".banner-nav div[class*='-active']").each(function(){
						//	$(this).removeClass("item-"+$(this).data("bannerItemCount")+"-active");
						//});
						//$(src).addClass("item-"+ic+"-active");
						$(b.domelm).find(".banner-nav-item-wrapper div").each(function(){
							if($(this).hasClass("active")) $(this).removeClass("active");
						});
						$(src).addClass("active");

					}
				}

				///////////////////////////
				//Change Image
				///////////////////////////
				$(b.domelm).find("*[id^='object-']").not("*[id='object-"+ic+"']").hide();
			    //$(b.domelm).find("*[id='object-"+ic+"']").show();
				$(b.domelm).find(".img-active").each(function(){
					$(this).add($(this).children()).fadeOut(400,function(){ $(this).removeClass("img-active"); });
				});
			    $(b.domelm).find("#object-"+ic).each(function(){
					$(this).add($(this).children()).fadeIn(400,function(){
					if(this.nodeName=="A")
				 		$(this).addClass("img-active");
					 });
				});


				//Check for caption. Hides the box if there isn't text.
				if(b.opts.captions=="true") banner.hasCaption(ic,b);
				else $(b.domelm).find(".banner-caption").hide();

				//Give the user control
				b.player.stop();

				//Store Active Item
				active=src;
			}
		};
		//////////////////////////////////////////////////////
		//Preloads all of the objects into the specified node.
		//
		//@param jQuery  - banner object
		//@param jQuery  - node for insertion
		//////////////////////////////////////////////////////
		this.preloadObjects=function(b,n){
			for(var ic in b.items){
			  var obj;
			  if(b.items[ic].type=="video"){
				var h=b.items[ic].height;
				var w=b.items[ic].width;
				obj=$("<iframe/>").attr("width",w+"px").attr("height",h+"px")
								  .css({"margin-left":b.items[ic].x+"px",
									    "margin-top":b.items[ic].y+"px"})
								  .attr("scrolling","no").attr("src",b.items[ic].file)
								  .attr("frameborder",'0').attr("align","middle")
								  .attr("allowtransparency","true");
				obj=$("<div class='iframe-bg'/>")
					.css("background","url("+b.items[ic].background+") no-repeat 0 0")
					.attr("id","object-"+ic)
					.append(obj);
			  }else{
				$(b.domelm).find(".banner-img").css({"background":"url("+b.items[ic].file+")","padding-left":"0px"})
				$(b.domelm).find(".banner-display");
				var imgHtml;
				if(b.items[ic].image!=null)
					imgHtml=b.items[ic].image;
				else
					imgHtml=$("<img src='"+b.items[ic].file+"' />");

				if((typeof b.items[ic].link!="undefined")&&(b.items[ic].link!=""))
					obj=$("<a id='object-"+ic+"' href='"+b.items[ic].link+"'></a>").append(imgHtml);
				else
					obj=$(imgHtml).attr("id","object-"+ic);
			  }
			  n.append(obj);
			}
		};
		//////////////////////////////////////////////////////
		//Iterates through the banner.items and builds the
		//navigation list accordingly.
		//
	    //@param DomNode - the banner element
		//
		//@return ObjectNode
		//////////////////////////////////////////////////////
		this.buildNav=function (b){
			var n=$("<div/>").addClass("banner-nav")
							.append($("<div class='banner-caption'/>"));
			var j=$("<div/>").addClass("banner-nav-item-wrapper");
			$(n).append(j);
			for(var l in b.items){
				var i=$("<div/>").addClass("banner-nav-item")
								 .addClass("item-"+l)
								 .data("bannerItemCount",l)
								 .click(function(e){
								 	var src=(e.srcElement)?e.srcElement:e.target;
								 	if($(src).hasClass("banner-nav-item"))
								 		src=$(src).find(".banner-nav-item-text");
									banner.itemevent(src,b);
								 });
				//$(i).append( $("<span class='banner-nav-item-text'/>").html(b.items[l].text) );
				$(i).append( $("<span class='banner-nav-item-text'/>").html(parseInt(l)+1) );
				if(b.items[l].type=="video"){
					$(i).find("span").addClass("isMovie"); //css("background","transparent url(sites/smph/images/bannerwidget/mov_icon.png) center right no-repeat");
				}
				//$(n).append(i);
				$(j).append(i);
			}
			$(j).css({'width' : ((parseInt(l)+1)*57)+'px'});
			return n;
		};
	}
	//////////////////////////////////////////////////////
	//Callback function from the $.ajax request. Parses
	//the XmlDoc and loads the banner items in to the
	//object.
	//
	//@param XmlDoc - xml document returned by $.ajax()
	//@param DomNode - the banner element
	//////////////////////////////////////////////////////
	function parseSettings(d,b){
		b.items=[];
		$(d).find("item").each(function(){
			var it={};
			$(this).children().each(function(){
				it[$(this)[0].nodeName]=$($(this)[0]).text();
			});
			b.items.push(it);
		});
		$(d).find("settings > param").each(function(){
			b.opts[$(this).attr("name")]=$(this).text();
		});
	};
	//////////////////////////////////////////////////////
	//Player Class used for basic control of the banner
	//actions.  Can be expaned with controls.
	//
	//@param Array - contains all banner item objects
	//@param DomNode - the banner display element
	//@param DomNode - the banner element
	//////////////////////////////////////////////////////
	function player(l,d,b){
		var step=-1;
		var list=l;
		var playing;
		var display=d;

		///////////////////////////
		//Loops through at defined
		//interval until stop() is
		//called.
		///////////////////////////
		this.play=function(){
			if(step<list.length-1)step=step+1
			else step=0;

			banner.itemevent($(".item-"+step),b);
			playing=setTimeout("banner.instances."+b.id+".player.play()",b.opts.delay);
		};
		///////////////////////////
		//Stops the player.
		///////////////////////////
		this.stop=function(){
			clearTimeout(playing);
		};
	}
})(jQuery);
