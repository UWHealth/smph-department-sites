# [smph-department-sites](//uwhealth.github.io/smph-department-sites)


## Recommended software ##

Although no software is strictly required, in order to compile files from within the `/_partials` folder, we recommend the following software.

** Command Line (preferred) **

Although the command line can be intimidating (and ugly), it allows us to set up a **completely free**, bare-bones local environment with a lot of power and configuration. [The process for all of this is surprisingly simple](docs/node-gulp/).

* [Node (v4)](nodejs.org/) and [Gulp JS](gulpjs.com/)

_[Read more about setting up Node and Gulp](docs/node-gulp/)_

** GUI Alternatives **

If you're not comfortable with or cannot set up Node and Gulp, there are GUI applications that do much of the same things. Although less configurable than Gulp, they are mostly set-and-forget.

* [CodeKit ](https://incident57.com/codekit/)(Mac Only; $32.00)
* [Prepros ](https://prepros.io/)(Windows and Mac; Free version available)

_Default configuration files are included in this project for both Codekit and Prepros_

#### Why compile? ####

Compiling your files from partials has the benefit of catering your project to your needs in one place and have those changes replicated over all of your files. For instance, in plain CSS, the margins and padding of items on a page is in many places and involves percentages and ratios. Sass can store this value in one place and do the math for us, so we only have to change one value and see instant results.

On the performance side of things, compiling your files means you can combine and compress them into a much smaller, single file. Instead of having jquery and all of your widgets called individually (which is quite slow), you can just call them all in a file that is compressed into a single, one-line piece of code. This is particularly important for users on a mobile phone where their connection is unstable or slow.

Finally, it's a matter of organization, maintainability, and keeping your code [DRY]("Don't repeat yourself"). Compiling your code means you can break it up into smaller, more-maintainable files, which has the added benefit of making patches much easier. If there is a new version or bug fix is released, it will be easier to merge into your version of the code because the change will likely be in fewer places and self-contained within smaller files.

## Project Structure ##

Within each folder that needs explanation is a more detailed README.

* `/` (root): The base folder of the project contains example html, configuration files, and this README.

* `/_partials`: Contains all un-processed files. In order to get css, js, and html files processed from this folder, you will need to use the recommended software.

  * `/_partials/images`: Uncompressed images. Gulp, CodeKit or Prepros will non-destructively compress these images before moving them to the `/images` folder.

  * `/_partials/js`: Uncompressed, modular javascript. Gulp, CodeKit or Prepros will combine, minify, and these files and move them to the `/javascript` folder.

  * `/_partials/kits`: Partial "html" files, written with the [kit "language"](https://incident57.com/codekit/help.html#kit). Files are formatted as components rather than full html, so they can be easily combined or ported over to a CMS. Gulp, CodeKit and Prepros will combine these files into html before moving them to the `/` (root) folder.
  [Read more about the kit files in this project](_partials/kits/)

  * `/_partials/scss`: [Sass](http://sass-lang.com/) files that compile to css and saved in `/style` folder. Gulp, Codekit, and Prepros can handle these files.
  [Read more about the Sass in this project](_partials/)

* `/files`: XML and JSON files for dropdown menus, banner widget and news ticker.

* `/images`: As you might expect, the images for this project.

* `/javascript`: Javascript files, including jQuery, dropdown menu, banner widget, news ticker, and a general javascript utility file that controls all various site behavior.

* `/style`: CSS and font files.

  * `/style/fonts`: Contains the (Oswald)[https://www.google.com/fonts/specimen/Oswald] font that is used throughout the site (notably in the navigation bar and pod headings). It's a condensed font for use in places that our default font (Verdana) won't comfortably fit.

## Javascript ##

It's important that you only include the javascript that you need for your particular site. But there are two important files needed for most sites: `utility.js` and `jquery-1.3.1.min.js`.

`utility.js` controls the behavior of the menu and search buttons on mobile, as well as the search box text (this is more or less a polyfill for the HTML5 placeholder attribute).

`jquery-1.3.1.min.js` is the jQuery library, and `utility.js` (as well as other optional files) require it. (Read more about jQuery)[https://jquery.com/].

To include these files on your pages, place them right before the closing `</body>` tag:

```html
<script src="javascript/jquery-1.3.1.min.js"></script>
<script src="javascript/utility.js"></script>
</body>
```

#### Homepage Banner Widget

**Required Files**

To implement the banner widget on your homepage you will need to make sure that the following JavaScript files are included on the page.  They can be found in the `/javascript` directory.

* `jquery-1.3.1.js`
* `jquery.bannerwidget.js`

They should be included using the standard `<script>` tag at the end of the `</body>` section of the page.

```html
<script src="javascript/jquery-1.3.1.min.js"></script>
<script src="javascript/jquery.bannerwidget.js"></script>
```

**Code**

The following snippet of JavaScript code will need to be placed after the code above. This piece of code initializes the banner widget.

```js
<script>
  // Banner Widget init Code

  var $bannerwidget = $('#bannerwidget');
  if($bannerwidget.length > 0) {
  	$bannerwidget.bannerwidget({
  		settingsFile:"files/home_widget.xml",
  		bannertext:"false"
  	})
  }

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

The image for each banner item should be 504px wide and 256px tall. This will ensure that the image fills the entire view port.  

---

#### News Ticker

**Required Files**

To implement the news ticker on your homepage you will need to make sure that the following JavaScript files are included on the page.  They can be found in the `/javascript` directory.

* `jquery-1.3.1.js`
* `jquery.bannerwidget.js`

They should be included using the standard `<script>` tag at the end of the `</body>` section of the page.

```html
<script src="javascript/jquery-1.3.1.min.js"></script>
<script src="javascript/jquery.bannerwidget.js"></script>
```

**Code**

The following snippet of JavaScript code will need to be placed after the code above. This piece of code initializes the banner widget.

```js
<script>
  // News Ticker init Code

  var $newsticker = $('#newsTickerContainer');
  if($newsticker.length > 0) {
    $.getJSON("files/news.json", function(data) {
      for (var i=0, dataLen = data.length; i < dataLen; i++){
        if (data[i].title) {
          $newsticker.append("<li class='newsTicker-item'><a href=" + data[i].pageUrl + ">" + data[i].title + "</a></li>");
        }
      }
      $newsticker.newsTicker();
    })
  }

</script>
```

**Configuration**

The news.json file, located in the `/files` directory, contains the news items and links that will rotate through on the news ticker.  Each ticker item is made up of two parts.

* title – the text that is displayed in the news ticker
* pageURL – the link (URL) for the title text

The following is an example of a news item in the .json file.

```json
{
  "title": "UW Psychiatrist: Parents Shouldn't be Afraid to Take Charge",
  "pageUrl": "test5.htm"
},
```

---

#### Dropdown Menus

**Required Files**

To implement dropdown menus on your pages you will need to make sure that the following JavaScript files are included on each page.  They can be found in the `/javascript` directory.

* jquery-1.3.1.js
* hoverIntent.js

They should be included using the standard `<script>` tag at the end of the `</body>` section of the page.

```html
<script src="javascript/jquery-1.3.1.min.js"></script>
<script src="javascript/hoverIntent.js"></script>
```

**Code**

The following snippet of JavaScript code will need to be placed at the bottom of the each page just above the closing `</body>` tag.  This piece of code initializes the dropdown menus.

```html
<script>
$(function(){
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

## Simple CSS Changes

Within the `/styles/main.css` file, you can change a couple things to make your site look a little more modern ([If you are using Sass, you can configure much more](_partials/scss/)).

* **Site width**: Under the `.wrapper` class is a `max-width` property. This controls the maximum width your site will grow to on larger screens. Without changing media-queries or column widths, you can comfortably increase this value up to `1000px`. The default is `840px`, which is consistent with the [SMPH site](http://med.wisc.edu).

* **Font size**: Under the `html` tag is a `font-size` property set in percentage (the value is determined by dividing your desired font-size by 16). Increasing this will proportionally increase the size of most elements on the page, as well as your default body copy. Without changing other values, you can comfortably increase this to `71%`. The default is `68.75%` (11px), which is consistent with the [SMPH site](http://med.wisc.edu).

_Strong recommendation: Increasing your site width should be accompanied by a font-size change. The wider your content is, the more letters it takes to fill that space, decreasing legibility_

