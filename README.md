# fbPageGallery: A responsive Facebook Page Gallery Wordpress Plugin

Tags: facebook, gallery, facebook gallery, facebook albums, facebook album gallery, facebook albums gallery

Display Images from your Facebook Page in a nice Masonry Grid with a lightbox using jQuery.

### Description
Display Images from your Facebook Page in a nice customizable Grid and a lightbox.

- Allow users to view photo on facebook using \"View on Facebook\" Button
- Album Headings redirects to Facebook Albums
- Fully Automated. Configure the Facebook App ID, Access Token, Page Id, and Excluded Albums List and include the shorcode [fbgallery] anywhere to show the gallery.
- Automatic resizes according to container.
- Responsive Grid Layout
- Non-WordPress Script Availaible
- Album-Wise Sorting 

### Settings

Following settings are availaible while calling the plugin:
- **accessToken:** (string)(required) Containing Facebook Access Token. You can use your | as your Access Token as only public data is being accessed.
- **pageId:** (string)(required) Containing the page id of facebook page you are accessing photos. Head to About Section of your page to know your Page ID.
- **excludedAlbums:** (Array of strings)(optional) Containing the array of Album Ids to ignore/exclude from showing in page. ```Format: '<ALBUM_ID_HERE>', '<ALBUM_ID_2_HERE>'```

### Installation Guide

- Upload the Plugin to your WordPress Plugins Directory
- Activate The plugin from Wordpress Plugin Menu
- Configure the required info in Settings -> fbGallery
- Include Shortcode ```[fbgallery]``` in any post/page to load the Gallery.

### Develeoper Installation Guide

#### Pre-requisites 
- WordPress Installation
- Languages: PHP, Wordpress Plugin Developement, jQuery, Facebook JS API 

#### Installation

##### Installing Plugin
- Upload the plugin to your WordPress Plugin Directory
- Install and Activate the Plugin

##### Create a Facebook App
- Goto [Facebook Degvelopers](https://developers.facebook.com) and create A New app
- Goto your app dashboard and copy the App ID, place this App ID in the ```Wordpress Settings -> FbGallery.```

##### Get the Page ID
- Create a Page and Upload Photos or use an exisiting page to test your script.
- You can Use ALiAS (PageId: 681600118668694) for testing purposes only.

##### Create an Access Token
- Goto [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- Select your ```Application```
- Click on ```Get Token``` and Select ```Get Page Access Tokem```
- Grant the Permissions Requested
- Copy the Access Token and Paste it in ```Wordpress Settings -> FbPageGallery```
##### Additional (Optional)
- Add Excluded Albums

#### Contribution Guidelines
- Create an issue or assign yourself to a issue before starting the work.
- Follow the Installation Instructions
- You can star/watch the repo for regular updates.

This Repository is a fork for the [FbGallery jQuery Plugin](https://github.com/thisisayush/fbgallery) Originally Authored by [Ayush Agarwal](https://github.com/thisisayush)

*Tip*: Use [BusinessX](https://wordpress.org/themes/businessx/) Theme with Full Width Layout for best Experience

Powered by [Letstream](https://www.theletstream.com)

