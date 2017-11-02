(function(jQuery){
/** Jquery Facebook Gallery Plugin
 * Author: Ayush Agarwal (Friendsocial Developer Network) (ayush@theletstream.com)
 * License: MIT License
 * 
 * Fetches Public Images from any Facebook Page and displays them in a beautiful grid gallery
 *  
 * Settings:
 *   pageID: Page ID whose albums to fetch
 *   excludedAlbums: Album ID's to be excluded
 *   accessToken: Acess Token of Facebook
 * 
 * Pre-Requistes:
 * Jquery
 * Font-Awesome (For Spinner Icon and Close Btn Icon)
 * Facebook Javscript SDK
 * 
 * Pending: MOve Fcebook Initialization inside the plugin
 */

/** Settings */
    var pageId, albums, excludedAlbums, accessToken, callTrigger, counter, counter2, container, loaderTemplate, loader, grid, callback;
    excludedAlbums = [];
    albums = [];
    counter = counter2 = 0;
    loaderTemplate  = '<div id="fbGalleryLoader"><div class="container"><div class="contentWrap"><div class="loaderContent"><i class="fa fa-spin fa-circle-o-notch"></i><br>Loading<p>Powered by <a href="https://github.com/friendsocial/fbgallery.github.io/" style="text-decoration:none">fbGallery</a></p></div></div></div></div>';
    jQuery.fn.extend({
        fbGallery: function(options){
            container = jQuery(this);
            var settings = jQuery.extend({
                accessToken: "",
                pageId: "",
                excludedAlbums: [],
                callback: function(){console.log("Albums Loaded!");}
            },options);
            accessToken = settings.accessToken;
            pageId = settings.pageId;
            excludedAlbums = settings.excludedAlbums;
            callback = settings.callback;
            if(typeof(pageId) == "undefined" || typeof(accessToken) == "undefined"){
                console.log("fbGallery: Access Token or Page Id Missing");
                return false;
            }
            loader = appendLoader(container);
            //loader = jQuery(container.find("#fbGalleryLoader"));
            // Initialize grid
            container.append(
                jQuery('<div>', {
                    "id":"fbGalleryContent"
                }).append(
                    jQuery("<div>", {
                        "class": "albums-container"
                    }).isotope({
                        itemSelector: ".album-box",
                        layoutMode: 'masonry',
                        masonry: {
                            gutter: 4,
                        }
                    }),
                    jQuery("<div>", {
                        "class": "photos-container"
                    }).append(
                        jQuery("<header>",{
                            "style": "color: rgba(255,255,255,0.7);"
                        }).append(
                            jQuery("<i>", {
                                "class": "fa fa-arrow-left fa-2x back-to-albums",
                                "style": "position:absolute; top: 0; left:0; color: rgba(255,255,255,0.7);",
                            }),
                            jQuery("<h3>",{
                                "style": "width: 80%; margin:auto; left:0; right:0; text-align:center; font-family: 'Cinzel'; color: rgba(255,255,255,0.7);",
                                "text": "Lorem Ipsum"
                            })
                        )
                    )
                )
            );
            grid = jQuery("#fbGalleryContent .photos-container");
            getAlbums();
            return this;
        }
    });
    function appendLoader(ele){
        var wrapper = ele.append(
            jQuery('<div>', {
                "id": "fbGalleryLoader"
            }).append(
                    jQuery("<div>", {
                        "class": "loaderContent"
                    }).append(
                        jQuery("<i>", {
                            "class": "fa fa-spin fa-circle-o-notch"
                        }),
                        jQuery("<h3>",{
                            "text": "Loading",
                            "style": "margin: 0"
                        }),
                        jQuery("<p>",{
                            "text": "Powered by "
                        }).append(
                            jQuery("<a>",{
                                "text": "fbGallery",
                                "href": "https://thisisayush.com/fbGallery",
                                "style": "text-decoration:none"
                            })
                        )
                    )
                )
            );
        return jQuery("#fbGalleryLoader");
    }
    function getAlbums(response = -1){
        /**
        *  This function is recursive and calls itself to traverse through all pages
        */
        if(response == -1){
            /** Exceute First Time */
            FB.api("/"+pageId+"/photos/uploaded",{access_token:accessToken},processResponse);
        }else{
            /** Move and Process Next Page **/
            FB.api(response.paging.next,processResponse);   
        }
        /** 
         * Process response
         * 
         * Adds all photos and given info to albums[] array
         * Triggers 'albumsLoaded' event when all photos have been loaded
         * 
        **/
        function processResponse(response){
            counter2 += response.data.length;   /** This counter is used to verify if all photos have been retreived**/
            for(var i=0;i<response.data.length;i++){
                v = response.data[i];
                /** Fetch Image Details */
                FB.api("/"+v.id+"?fields=images,link,album,name",{access_token:accessToken},function(response){
                   counter++;   /** This counter is used to verify if all photos have been retreived**/
                   var thumb = getThumb(response.images)
                   console.log("Adding "+ counter);
                   addToAlbum(response.album.id, response.album.name, response.id, response.name, response.images, thumb, response.link);
                   setInterval(function(){loader.fadeOut();},1000);
                });
            }
            if(typeof(response.paging.next) != "undefined"){
                /** Goto Next Page */
                getAlbums(response);
            }else{
                /** Recursed through all photos! 
                 * Time to check if all photo details have been retrieved
                **/
                callTrigger = setInterval(function(){
                    /** Set Interval to check every 1 second if all photos have been retrieved */
                    if(counter==counter2){      
                        clearInterval(callTrigger);     /** Stop The Interval **/  
                        callback();
                    }
                },1000);
            }
        }
    }
    function bindLightBox(){
        container.find(".imageBox a>img").click(function(e){
            e.preventDefault();
            var lightbox = container.find("#lightbox");
            console.log(lightbox.length);
            if(lightbox.length == 0){
                /*
                    <div id="lightbox" style="display:none">
                        <div class="content">
                            <span class="close-btn fa fa-stack fa-lg">
                                <i class="fa fa-circle fa-inverse fa-stack-2x"></i>
                                <i class="fa fa-close fa-stack-1x"></i>
                            </span>
                            <img data-loader = "<?php echo plugins_url('loader-image.gif', __FILE__); ?>" src="loader-image.gif" />
                            <div class="description">
                                <div style="display:inline-block;float:left;" class="caption">
                                    <h3></h3>
                                    <p></p>
                                </div>
                                <div style="display: inline-block;float:right;padding:10px 0;" class="external-link">
                                    <a title="View this on Facebook"><i class="fa fa-external-link fa-2x"></i></a>
                                </div>            
                            </div>
                        </div>
                    </div>
                */
                container.append(
                    jQuery("<div>", {
                        "id": "lightbox"
                    }).append(
                        jQuery("<div>", {
                            "class": "content"
                        }).append(
                            jQuery("<span>",{
                                "class": "close-btn fa fa-stack fa-lg"
                            }).append(
                                jQuery("<i>",{
                                    "class": "fa fa-circle fa-inverse fa-stack-2x"
                                }),
                                jQuery("<i>",{
                                    "class": "fa fa-close fa-stack-1x"
                                })
                            ),
                            jQuery("<img>",{}),
                            jQuery("<div>",{
                                "class": "description"
                            }).append(
                                jQuery("<div>",{
                                    "class": "caption"
                                }).append(
                                    jQuery("<h3>"),
                                    jQuery("<p>")
                                ),
                                jQuery("<div>", {
                                    "class": "external-link"
                                }).append(
                                    jQuery("<a>", {
                                        "title": "View on Facebook",
                                    }).append(
                                        jQuery("<i>",{
                                            "class": "fa fa-external-link fa-2x"
                                        })
                                    )
                                )
                            )
                        )
                    )
                );
                lightbox = jQuery("#lightbox");
            }
            
            var album = getAlbumName(jQuery(this).attr("data-album"));
            var caption = getPhotoCaption(jQuery(this).attr("id").replace("fbGallery_",""));
            var imgHeight = jQuery(this).attr("data-height");    //Get Original Image Height from attribute
            var imgWidth = jQuery(this).attr("data-width");  //Get Original Image Width from attribute
            var viewportWidth = jQuery(window).width() - 40;    //Padding/Margin of 10px pn both sides
            var viewportHeight = jQuery(window).height() - 40 - 50; //Padding/Marfgin of 10px on top and bottom. Additional 50 for description bar
            var style = {width: "", height: ""};
            var aspectRatio = imgWidth/imgHeight;
            var calcHeight = viewportWidth/aspectRatio;
            var calcWidth = viewportHeight*aspectRatio;
            if(calcHeight>viewportHeight){
                style.height = viewportHeight;
                style.width = viewportHeight*aspectRatio;
            }else{
                if(calcWidth>viewportWidth){
                    style.width = viewportWidth;
                    style.height = viewportWidth/aspectRatio;
                }else{
                    style.width = calcWidth;
                    style.height = calcHeight;
                }
            }
            
            lightbox.find(".content").css("width", style.width+'px');
            lightbox.find(".content").css('height',style.height+50+'px');
            lightbox.find("img").css('height',style.height-20+'px').css('width',style.width-20+'px').attr('src', jQuery(this).attr("data-source"));
            lightbox.find(".caption h3").html(caption);
            lightbox.find(".caption p").html(album);
            lightbox.show();
            
            lightbox.find(".close-btn").click(function(e){
                e.preventDefault();
                lightbox.hide();
                lightbox.find("img").attr('src', '');
            });
            jQuery(document).on("keydown", function(e){
                console.log(e.keyCode)
                if(e.keyCode == 27){
                    lightbox.hide();
                    lightbox.find("img").attr("src", "");
                    jQuery(document).off("keydown");
                }
            });
        });
    }
    function addToAlbum(albumId, albumName, photoId, caption, images, thumb, url){
        var flag = 0;
        var photo = {
            id : photoId,
            caption: caption,
            image: {
                width: images[0].width,
                height: images[0].height,
                source: images[0].source
            },
            thumb: thumb,
            url: url
        };
        //var thumb = getThumb();
        jQuery.each(albums,function(i,v){
            if(v.id == albumId){
                var len = 0;
                jQuery.each(v.photos,function(i,v){
                    len++;
                });
                albums[i].photos[len] = photo;
                flag = 1;
                updateAlbumCounter(i);
            }
        });
        if(!flag){
            var index = albums.length;
            albums[index] = {
                id : albumId,
                name : albumName,
                photos: {
                    0 : photo
                }
            };
            createAlbumBox(index);
        }
    }

    function createAlbumBox(index){
        var albumContainer = jQuery("#fbGalleryContent").find(".albums-container");
        var albumBox = jQuery("<div>", {
            "class": "album-box",
            "id": "fbGallery_album_"+albums[index].id,
        }).css('background-image', "url('"+albums[index].photos[0].thumb.source+"')").append(
            //jQuery("<img>", {
            //    "src": albums[index].photos[0].thumb.source
            //}),
            jQuery("<div>").append(
                jQuery("<span>", {
                    "class": "album-name",
                    "text": albums[index].name
                }),
                jQuery("<a>", {
                    "class": "view-album",
                    "href": "#",
                    "text": "View Photos"
                })
            ),
            jQuery("<span>", {
                "class": "counter",
                "text": "0"
            })
        );
        albumContainer.isotope('insert', albumBox);
        jQuery('#fbGallery_album_'+albums[index].id).click(function(e){
            e.preventDefault();
            loadAlbum(albums[index].id);
        });
    }
    function updateAlbumCounter(index){
        var albumBox = jQuery("#fbGallery_album_"+albums[index].id).find(".counter");
        var value = parseInt(albumBox.html());
        albumBox.html(value+1);
    }
    function getAlbumName(albumId){
        var albumName = "Unknown";
        jQuery.each(albums, function(i,v){
            if(v.id == albumId){
                albumName =  v.name;
                return;
            }
        });
        return albumName;
    }
    function getPhotoCaption(photoId){
        var caption = "Unknown";
        jQuery.each(albums, function(i,v){
            var flag = 0;
            jQuery.each(v.photos, function(j,k){
                if(k.id == photoId){
                    caption =  v.caption;
                    flag = 1;
                    return;
                }
            });
            if(flag)
                return;
        });
        return caption;
    }
    function getThumb(images){
        var image = images[0];
        var thumb = {
            width : image.width,
            height : image.height,
            source : image.source
        };
        var index = 0;
        jQuery.each(images,function(i,v){
            if(v.width<thumb.width){
                thumb.width = v.width;
                index = i;
            }
        });
        var index2 = 0;
        thumb.width = image.width;
        jQuery.each(images,function(i,v){
            if(v.width<thumb.width && i!=index){
                thumb.width = v.width;
                thumb.height = v.height;
                thumb.source = v.source;
            }
        });
        return thumb;
    }
    function loadAlbum(id){
        var albumContainer = jQuery("#fbGallery_album_"+id+"_photos");
        if(albumContainer.length == 0){
            jQuery.each(albums, function(i,v){
                if(v.id == id){
                    container.find(".photos-container header h3").html(v.name);
                    container.find(".photos-container").append(
                        jQuery("<div>",{
                            "id": "fbGallery_album_"+id+"_photos"
                        }).isotope({
                            itemSelector: '.imageBox',
                            layoutMode: 'packery',
                            packery: {
                                gutter: 4
                            }
                        })
                    );
                    albumContainer = jQuery("#fbGallery_album_"+id+"_photos");
                    jQuery.each(v.photos, function(key,value){
                        var box = jQuery('<div>',{
                            "class": 'imageBox fbGallery_album_'+v.id,
                            //"style": "height: "+value.thumb.height+'px;  width: '+value.thumb.width+'px'
                        }).append(
                            jQuery('<a>',{
                                "href": "#fbgallery-"+value.id
                            }).append(
                                jQuery("<img>",{
                                    "data-url": value.url,
                                    "data-source": value.image.source,
                                    "data-width": value.image.width,
                                    "data-height": value.image.height,
                                    "data-album": v.id,
                                    "id": "fbGallery_"+ value.id,
                                    "src": value.thumb.source,
                                    //"src": "",
                                    //"class": "lazyload",
                                }).on("load", function(){console.log("Fired");jQuery(this).parents(".imageBox").show();albumContainer.isotope('layout');})
                            )
                        );
                        albumContainer.isotope('insert', box);
                        box.hide();
                        //albumContainer.isotope('insert', box);
                        /*
                        jQuery(document).scroll(function(){
                            $this = jQuery("#fbGallery_"+value.id);
                            if( jQuery(this).scrollTop() >= ($this.offset().top-100) && $this.attr('src') == ''){
                                console.log($this.attr("id"));
                                $this.attr("src", $this.attr("data-source"));
                                $this.on("load", function(){$this.fadeIn();});
                            }
                        });*/
                    });
                    container.find(".photos-container div.active").removeClass("active");
                    albumContainer.addClass("active");
                    showPhotosContainer();
                    //albumContainer.isotope('layout');
                    //lazyload();
                    bindLightBox(); 
                    /*
                    jQuery(".imageBox").each(function(e){
                        var $this = jQuery(this).find("img");
                        jQuery(document).scroll(function(){
                            if( jQuery(this).scrollTop() >= ($this.offset().top-100) && $this.attr('src') == ''){
                                console.log($this.attr("id"));
                                $this.attr("src", $this.attr("data-source"));
                                $this.on("load", function(){$this.fadeIn();});
                            }
                        });
                    });
                    */
                    return;
                }
            });
        }else{
            container.find(".photos-container div.active").removeClass("active");
            albumContainer.addClass("active");
            showPhotosContainer();
            albumContainer.isotope('layout');
        }
    }
    function showPhotosContainer(){
        jQuery("#fbGalleryContent .albums-container").css("transform", "scale(0.05)").fadeOut();
        jQuery("#fbGalleryContent .photos-container").show();//.css("transform","translateY(0px)").css("opacity","1");
        //setTimeout(function(){jQuery("#fbGalleryContent .albums-container").hide();}, 1000);
        jQuery(".back-to-albums").click(function(e){
            e.preventDefault();
            hidePhotosContainer();
        });
    }
    function hidePhotosContainer(){
        jQuery("#fbGalleryContent .photos-container").hide();//css("transform", "translateY(50px)").css("opacity","0");
        //setTimeout(function(){jQuery("#fbGalleryContent .photos-container").hide()},500);
        jQuery("#fbGalleryContent .albums-container").show().css("transform", "scale(1)").isotope('layout');
    }
})(jQuery);

/*!
 * Lazy Load - JavaScript plugin for lazy loading images
 *
 * Copyright (c) 2007-2017 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   https://appelsiini.net/projects/lazyload
 *
 * Version: 2.0.0-beta.2
 *
 */

(function (root, factory) {
    if (typeof exports === "object") {
        module.exports = factory(root);
    } else if (typeof define === "function" && define.amd) {
        define([], factory(root));
    } else {
        root.LazyLoad = factory(root);
    }
}) (typeof global !== "undefined" ? global : this.window || this.global, function (root) {

    "use strict";

    const defaults = {
        src: "data-src",
        srcset: "data-srcset",
        selector: ".lazyload"
    };

    /**
    * Merge two or more objects. Returns a new object.
    * @private
    * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
    * @param {Object}   objects  The objects to merge together
    * @returns {Object}          Merged values of defaults and options
    */
    const extend = function ()  {

        let extended = {};
        let deep = false;
        let i = 0;
        let length = arguments.length;

        /* Check if a deep merge */
        if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
            deep = arguments[0];
            i++;
        }

        /* Merge the object into the extended object */
        let merge = function (obj) {
            for (let prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    /* If deep merge and property is an object, merge properties */
                    if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        /* Loop through each object and conduct a merge */
        for (; i < length; i++) {
            let obj = arguments[i];
            merge(obj);
        }

        return extended;
    };

    function LazyLoad(images, options) {
        this.settings = extend(defaults, options || {});
        this.images = images || document.querySelectorAll(this.settings.selector);
        this.observer = null;
        this.init();
    }

    LazyLoad.prototype = {
        init: function() {

            /* Without observers load everything and bail out early. */
            if (!root.IntersectionObserver) {
                this.loadImages();
                return;
            }

            let self = this;
            let observerConfig = {
                root: null,
                rootMargin: "0px",
                threshold: [0]
            };

            this.observer = new IntersectionObserver(function(entries) {
                entries.forEach(function (entry) {
                    if (entry.intersectionRatio > 0) {
                        self.observer.unobserve(entry.target);
                        let src = entry.target.getAttribute(self.settings.src);
                        let srcset = entry.target.getAttribute(self.settings.srcset);
                        if ("img" === entry.target.tagName.toLowerCase()) {
                            if (src) {
                                entry.target.src = src;
                            }
                            if (srcset) {
                                entry.target.srcset = srcset;
                            }
                        } else {
                            entry.target.style.backgroundImage = "url(" + src + ")";
                        }
                    }
                });
            }, observerConfig);

            this.images.forEach(function (image) {
                self.observer.observe(image);
            });
        },

        loadAndDestroy: function () {
            if (!this.settings) { return; }
            this.loadImages();
            this.destroy();
        },

        loadImages: function () {
            if (!this.settings) { return; }

            let self = this;
            this.images.forEach(function (image) {
                let src = image.getAttribute(self.settings.src);
                let srcset = image.getAttribute(self.settings.srcset);
                if ("img" === image.tagName.toLowerCase()) {
                    if (src) {
                        image.src = src;
                    }
                    if (srcset) {
                        image.srcset = srcset;
                    }
                } else {
                    image.style.backgroundImage = "url(" + src + ")";
                }
            });
        },

        destroy: function () {
            if (!this.settings) { return; }
            this.observer.disconnect();
            this.settings = null;
        }
    };

    root.lazyload = function(images, options) {
        return new LazyLoad(images, options);
    };

    if (root.jQuery) {
        const $ = root.jQuery;
        $.fn.lazyload = function (options) {
            options = options || {};
            options.attribute = options.attribute || "data-src";
            new LazyLoad($.makeArray(this), options);
            return this;
        };
    }

    return LazyLoad;
});