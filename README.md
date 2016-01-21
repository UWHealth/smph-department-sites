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

* `/files`: XML and JSON files for the dropdown menu, banner widget and news ticker.

* `/images`: As you might expect, the images for this project.

* `/javascript`: Javascript files, including jQuery, dropdown menu, banner widget, news ticker, and a general javascript utility file that controls all various site behavior.

* `/style`: CSS and font files.

  * `/style/fonts`: Contains the (Oswald)[https://www.google.com/fonts/specimen/Oswald] font that is used throughout the site (notably in the navigation bar and pod headings). It's a condensed font for use in places that our default font (Verdana) won't comfortably fit.

## Javascript ##

It's important that you only include the javascript that you need for your particular site. But there are two important files needed for most sites: `utility.min.js` and `jquery-2.2.0.min.js`.

* `utility.js` controls the behavior of the menu and search buttons on mobile, as well as the search box text (this is more or less a polyfill for the HTML5 placeholder attribute).

* `jquery-2.2.0.min.js` is the jQuery library, and `utility.js` (as well as other optional files) require it. (Read more about jQuery)[https://jquery.com/].

  * `jquery-1.12.0.min.js` is an optional version of jQuery that has compatibility with Internet Explorer 8 and below. Include only where necessary.


To include these files on your pages, place them right before the closing `</body>` tag:

```html
<script src="javascript/jquery-2.2.0.min.js"></script>
<script src="javascript/utility.min.js"></script>
</body>
```

_Note: All Javascript files have a version without the .min suffix. These should only be used during development since their file sizes are significantly larger than their `.min` versions._

#### Script Loading

The `utility.js` file has a simple `loadScript` function that will dynamically add script tags to your html and run a callback function once the file has been loaded. This is the preferred way of loading scripts since you can limit their whether they load based on the needs of the page.

**Required Files**

* `jquery-2.2.0.min.js`
* `utility.min.js`

**Example of dynamic script loading**

```js
<script>
  //Check for existence of a widget
  var $module = $('.widget');
  //Only do the following if the widget exists
  if ($widget.length > 0) {     
    //loadScript function
    loadScript(

      //first argument, the script path    
      'javascript/module.js',

      //second argument, function to execute after script has loaded
      function() {
        //...initialization code for widget here
      }
    )
  }
</script>
```



#### Homepage Banner Widget

**Required Files**

To implement the banner widget on your homepage you will need to make sure that the following JavaScript files are included on the page.  They can be found in the `/javascript` directory.

* `jquery-2.2.0.min.js`
* `utility.min.js`
* `jquery.bannerwidget.min.js`

They should be included using the standard `<script>` tag at the end of the `</body>` section of the page.

```html
<script src="javascript/jquery-2.2.0.min.js"></script>
<script src="javascript/utility.min.js"></script>
```

**Code**

The following snippet of JavaScript code will need to be placed after the code above. This piece of code initializes the banner widget.

```js
<script>
  // Banner Widget init Code

  var $bannerwidget = $('#bannerwidget');
  if($bannerwidget.length > 0) {
    loadScript('javascript/jquery.bannerwidget.min.js',
      function() {
        $bannerwidget.bannerwidget({
          settingsFile:"files/home_widget.xml",
          bannertext:"false"
        });
      }
    )
  }

</script>
```

**Configuration**

The home_widget.xml file, located in the `/files` directory, contains the text items, links and the image paths that will rotate through on the banner widget.  The banner widget can have a maximum of four items.  The numbered navigation boxes are auto generated depending on how many items are in the .xml file.  Each banner item is made up of five parts.

* `text` – the heading for the text
* `type` – type of banner item (all items will be of type ‘image’)
* `file` –  path to the photo that is displayed
* `link` – the link (URL) for the text (title + caption)
* `caption` – the text copy for the item

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

* `jquery-2.2.0.min.js`
* `utility.min.js`
* `newsTicker.min.js`

They should be included using the standard `<script>` tag at the end of the `</body>` section of the page.

```html
<script src="javascript/jquery-2.2.0.min.js"></script>
<script src="javascript/utility.min.js"></script>
```

**Code**

The following snippet of JavaScript code will need to be placed after the code above. This piece of code initializes the banner widget.

```js
<script>
  // News Ticker init Code

  var $newsticker = $('#newsTickerContainer');

  if($newsticker.length > 0) {
    loadScript('javascript/newsTicker.min.js',
      function(){
        $.getJSON("files/news.json", function(data) {
          for (var i=0, dataLen = data.length; i < dataLen; i++){
            if (data[i].title) {
              $newsticker.append("<li class='newsTicker-item'><a href=" + data[i].pageUrl + ">" + data[i].title + "</a></li>");
            }
          }
          $newsticker.newsTicker();
        })
      }
    )
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
}
```

_Note: Proper JSON formatting is required. Use a [validator](https://jsonformatter.curiousconcept.com/) if you are unsure._

---

#### Dropdown Menus

**Required Files**

To implement dropdown menus on your pages you will need to make sure that the following JavaScript files are included on each page.  They can be found in the `/javascript` directory.

* `jquery-2.2.0.min.js`
* `hoverIntent.min.js`

They should be included using the standard `<script>` tag at the end of the `</body>` section of the page.

```html
<script src="javascript/jquery-2.2.0.min.js"></script>
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

* **Site width**: Under the `.wrapper` class is a `max-width` property. This controls the maximum width your site will grow to on larger screens. Without changing media-queries or column widths, you can comfortably increase this value up to `1000px`. The default is `940px`, which is slightly larger than the [SMPH site](http://med.wisc.edu).

* **Font size**: Under the `html` tag is a `font-size` property set in percentage (the value is determined by dividing your desired font-size by 16). Increasing this will proportionally increase the size of most elements on the page, as well as your default body copy. Without changing other values, you can comfortably increase this to `76.5%`. The default is `75%` (12px), which is slightly larger than the [SMPH site](http://med.wisc.edu).

  * **Line Height**: Under the `body` tag is the line-height that is inherited by majority of the typography on the templates. As you increase your font size, it is recommended that you also increase the line-height. This value is a unitless multiple of the whatever font-size it's accompanying. The default is `1.25` (15px with a 12px font-size).

  * _Strong recommendation: Increasing your site width should be accompanied by a font-size and line-height change. The wider your content is, the more characters it takes to fill that space, which decreases general readability. An ideal line length is 40-70 characters._

* **Background Color**: Under the `body` tag, there is a `background` set with a color and image. All background patterns are transparent `png`s that will lay on top of whatever color you set. The default is `#c7ab4c`, which is consistent with the [SMPH site](http://med.wisc.edu).

  * **Background pattern**: Within the `/images/backgrounds` folder are three patterns that are recommended for the background of your department sites. The image can be changed in the same place as the background color.

## Logo

The logo on the top of the page (the partial file can be found at `/_partials/kits/components/header/_logo.kit`) is made up of text and an image of the UW crest. This was done for two reasons:

* Scalability: Text can change size independent of width. Unlike an image that scales all at once. Text can also break lines where necessary.

* Consistency and size: Rather than having an image that can be output with the wrong color profile, all sites' "red" will be the same.  File size is also a much smaller, since we are only loading the crest.

**Issues**

Using markup isn't without its share of issues though. Here are some possible problems and how to resolve them.

* **Font**: Friz Quadrata is the standard font for UW department logos. Unfortunately, this font is not free and the University does not have a University-wide license for web use.

  * **Resolution**: The default font used in the templates is Palatino, which doesn't have all the quirks of Friz, but has similar characteristics. The advantage to this solution is price and load time. Palatino and its fallback fonts are available on 99% of computers, so it will load instantly.

    * _Alternatively, you could [purchase a license for Friz Quadrata](https://umark.wisc.edu/brand/print/typography.php)._

* **Height**: Some departments have really long names that require two lines of text. This will cause the text of your logo to overlap with the top of the utility navigation.

  * **Resolution**: Under`.logo-type`, change the `font-size` to `.85em` and change `top` of `.logo` to `.13em`.


## Navigation

With a responsive site, you have to consider the user experience on desktops and mobile. Because of this, web architecture has gone from "narrow and deep" to "wide and shallow". Which is to say, rather than having many layers of navigation, it's preferable to have most of your content living at the top level of your site. This is largely because sub-navigation (dropdown menus and left navigation) are confusing and distract from the content of the site itself.

**What to do with sub navigation**

**_Ideally_, get rid of it.** Think of simpler ways to present your content, and take advantage of the web's inherent nature: infinite height. While it may go against your instincts to create "tall" pages with a lot of content, as long as you break up your content with clear headings and imagery, your users won't mind scrolling — scrolling is one of the lowest-effort actions a user can take. For a clear example of this concept, take a look at [Wikipedia](http://www.wikipedia.com), where an article about the entirety of human evolution can be contained on a single page, with references to other pages for more detail.

If you can't eliminate sub navigation entirely (likely the case), at least minimize it to two-layers where possible. Those secondary layers, would should be as minimal as possible. The templates will place your left navigation at the top of the page on mobile, just before your content. Think of it as a table of contents for that particular section, but also realize that these links will get in the way of why your user came to the page in the first place.

_Note that dropdown menus will only work on desktop-sized views, so your top links should go to some kind of landing page with content and links to their child pages._

## Page headers, banners, and hierarchy

The title of your section will sit just below the navigation bar. It can come in 3 forms, a simple text header (`.pageHeader`), a banner (`.banner`), and a short banner (`.banner-short`).

* **Text Header**: Used for pages beneath larger sections, and for pages with only a little bit of content.

  * Example: `contact.html`

* **Banner**: Used for "destination" pages. Typically save these for sections that are linked from the main navigation bar. These are high-impact, but also take a lot of vertical space. Use sparingly.

  * Example: `destination.html`
  * _A dark and light version is available. Be consistent with your use._

* **Short Banner**: Used on pages with higher importance and a fairly large amount of content. Typically, these pages do not have sub-navigation.

  * Example: `faculty.html`
  * _A dark and light version is available. Be consistent with your use._
