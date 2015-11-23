# smph-department-sites

## Homepage Banner Widget

**Required Files**

To implement the banner widget on your homepage you will need to make sure that the following JavaScript files are included on the page.  They can be found in the `/javascript` directory.

* `jquery-1.3.1.js`
* `jquery.bannerwidget.js`
* `jquery.ifixpng.js`

They should be included using the standard `<script>` tag in the `<head>` section of the page.

```html
<script language="javascript" type="text/javascript" src="javascript/jquery-1.3.1.min.js"></script>
<script language="javascript" type="text/javascript" src="javascript/jquery.bannerwidget.js"></script>
<script language="javascript" type="text/javascript" src="javascript/jquery.ifixpng.js"></script>
```

The following `.css` file will need to be included.  It can be found in the `/style` directory.

* home_widget.css

This file should be included using the `<link>` tag in the `<head>` section of the page.

`<link rel="stylesheet" href="style/home_widget.css" type="text/css" media="screen"/>`

**Code**

The following snippet of JavaScript code will need to be placed in the `<head>` section of the page.  This piece of code initializes the banner widget.

```js
<script type="text/javascript">
	//<![CDATA[
	$(document).ready(function(){
		// Home Page Widget Code
		$("#bannerwidget").bannerwidget({settingsFile:"files/home_widget.xml", bannertext:"false"
		});
		// End Home Page Widget Code
	});
	//]]>
</script>
```

**Configuration**

The home_widget.xml file, located in the `/files` directory, contains the text items, links and the image paths that will rotate through on the banner widget.  The banner widget can have a maximum of four items.  The numbered navigation boxes are auto generated depending on how many items are in the .xml file.  Each banner item is made up of five parts.

* text – the heading for the text
* type – type of banner item (all items will be of type ‘image’)
* file –  path to the photo that is displayed
* link – the link (URL) for the text (title + caption)
caption – the text copy for the item

The following is an example of a banner item in the .xml file.

```xml
<item>
    <text>Alumni Connection</text>
    <type>image</type>
    <file>images/bannerwidget/sample2.jpg</file>
    <link>/alumni/main/79</link>
    <caption>The Wisconsin Medical Alumni Association helps alumni connect through student initiatives, Quarterly magazine, events and programs.</caption>
</item>
```

**Images**

The image for each banner item should be 504px wide and 256px tall.  This will ensure that the image fills the entire view port.  

---

## News Ticker

**Required Files**

To implement the news ticker on your homepage you will need to make sure that the following JavaScript files are included on the page.  They can be found in the `/javascript` directory.

* jquery-1.3.1.js
* newsTicker.js

They should be included using the standard `<script>` tag in the `<head>` section of the page.

```html
<script language="javascript" type="text/javascript" src="javascript/jquery-1.3.1.min.js"></script>
<script language="javascript" type="text/javascript" src="javascript/newsTicker.js"></script>
```

**Code**

The following snippet of JavaScript code will need to be placed in the `<head>` section of the page. This piece of code initializes the news ticker.

```html
<script type="text/javascript">
//<![CDATA[
	$(document).ready(function(){
		// News Ticker Code
		$.getJSON("files/news.json", function(data) {
			for (var i=0; i < data.length; i++){
				if (data[i].title) {
					$('#newsTickerContainer').append("<li><a href=" + data[i].pageUrl + ">" + data[i].title + "</a></li>");
					$("#newsTickerContainer").newsTicker();
				}
			}
		});
		// End News Ticker Code
	});
//]]>
</script>
```

**Configuration**

The news.json file, located in the `/files` directory, contains the news items and links that will rotate through on the news ticker.  Each ticker item is made up of two parts.

* title – the text that is displayed in the news ticker
* pageURL – the link (URL) for the title text

The following is an example of a news item in the .json file.

```json
{
  "title":"UW Psychiatrist: Parents Shouldn't be Afraid to Take Charge",
  "pageUrl":"test5.htm"
},
```

---

# Dropdown Menus

**Required Files**

To implement dropdown menus on your pages you will need to make sure that the following JavaScript files are included on each page.  They can be found in the `/javascript` directory.

* jquery-1.3.1.js
* hoverIntent.js

They should be included using the standard <script> tag in the `<head>` section of the page.

```html
<script language="javascript" type="text/javascript" src="javascript/jquery-1.3.1.min.js"></script>
<script language="javascript" type="text/javascript" src="javascript/hoverIntent.js"></script>
```

**Code**

The following snippet of JavaScript code will need to be placed at the bottom of the each page just above the closing `</body>` tag.  This piece of code initializes the dropdown menus.

```html
<script language="javascript" type="text/javascript">
$(document).ready(function(){
	dropDownMenu();
});
</script>
```

**Configuration**

The `drop_menus.xml` file, located in the `/files` directory, contains the text items and links for the dropdown menus.  Each menu is made up of at least one item with two parts.

* item – an item in the menu
* label – the link text for an item
* link –  the link (URL) for an item

The following is an example of a menu in the .xml file.

```xml
<menu>
<item>
		<label>Menu Item 2 Link 1</label>
		<link>http://www.yahoo.com</link>
	</item>
	<item>
		<label>Menu Item 2 Link 2</label>
		<link>http://www.yahoo.com</link>
	</item>
	<item>
		<label>Menu Item 2 Link 3</label>
		<link>http://www.yahoo.com</link>
	</item>
</menu>
```

Each menu in the .xml file will line up with its associated main navigation (red bar) item.  The first menu in the .xml file will appear under the first main navigation item, the second menu in the .xml file will appear under the second main navigation item, etc.  If you DO NOT want a dropdown menu under a main navigation item you must add in an empty dropdown menu item in the .xml file.

```xml
<menu>
<item>empty</item>
</menu>
```

---

### What’s the difference between landing, destination and content pages?

**Landing page**: The purpose of a landing page is to help visitors easily find key sections of content within a Web site. These pages are generally link-heavy and do not have left-side navigation. They contain a graphical banner. A landing page may have elements such as right-side pods or promotional buttons that can be used to highlight new content or frequently accessed pages.

Example: http://www.med.wisc.edu/education/main/100


**Destination page**: A destination page is used to introduce major sections of content. It has left-side navigation that links to content pages within the section. A destination page has a graphical banner. It may have elements such as right-side pods or promotional buttons that can be used to highlight new content or frequently accessed pages.

Example: http://www.med.wisc.edu/education/md-mph/mdmph-program/1039


**Content page**: Clicking any of the left-side links on a destination page (except the “Home” link) will take visitors to a content page. A content page is a page of information within a destination. It maintains the left-side navigation found on the destination page, but does not have a graphical banner. It contains a text header that matches the name of the destination, which not only gives users a reference point for navigating through the site but also helps maintain consistency in design.

Example: http://www.med.wisc.edu/education/md-mph/year-1-of-medical-school/1040


##### A Note About Left Navigation

It’s important for usability to maintain consistent left-side navigation throughout a section of a Web site. Therefore, a general rule of thumb is that left navigation should only be used to link to the home page of a destination and its associated content pages. Left nav elements should not link directly to other destination or landing pages.

**Another Way to Look at It**

In the hierarchy of a Web site, a landing page contains the most broadly defined content, and a content page contains the most narrowly defined content. For example, pages on the Department of Surgery site might break down in the following way:

Home → Specialties (landing page) → General Surgery (destination page) → Research (content page within the General Surgery destination).
