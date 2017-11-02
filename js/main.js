        console.log("Script Working");
        window.fbAsyncInit = function() {
        FB.init({
            appId      : appId,
            xfbml      : true,
                version    : 'v2.8'
            });
            console.log('FB loaded');
            FB.AppEvents.logPageView();
            jQuery("#fbgallery_container").fbGallery({
                accessToken: accessToken,
                excludedAlbums: excludedAlbums,
                pageId: pageId
            });
        };
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));   