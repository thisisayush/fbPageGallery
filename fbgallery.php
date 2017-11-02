<?php
    /*
    Plugin Name: fbPageGallery: A responsive Facebook Page Gallery Plugin
    Plugin Url: https://github.com/friendsocial/fbgallery
    Description: Display Your Facebook Page Albums in Responsive Masonry Gallery
    Version: 1.2
    Author: Ayush Agarwal
    Author URI: http://thisisayush.com
    */
    wp_register_style('fbgallery_google_fonts','//fonts.googleapis.com/css?family=Cinzel');
    wp_register_style('fbgallery_css_main', plugins_url('fbgallery.css',__FILE__), array('fbgallery_google_fonts'));
    wp_register_style('font_awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_register_script('isotope_js', '//unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js', array(), true);
    wp_register_script('packery_js', plugins_url('js/packery-mode.pkgd.min.js',__FILE__), array(), true);
    /*wp_register_script('masonry_js', plugins_url('js/masonry.pkgd.min.js',__FILE__), array('jquery'));*/
wp_register_script('fbgallery_js_main', plugins_url('js/fbgallery.js',__FILE__), array('jquery',/*'masonry_js'*/ 'isotope_js', 'packery_js'), true);
    wp_register_script('fbgallery_initialization_script', plugins_url('js/main.js',__FILE__), array('fbgallery_js_main'), true);
    function fbgallery_loadGallery(){
        wp_enqueue_script('jquery');
        wp_enqueue_script('fbgallery_js_main');
        wp_enqueue_style('fbgallery_css_main');
        wp_enqueue_style('font_awesome');
        wp_enqueue_script('fbgallery_initialization_script');
?>
<!-- 
    <div id="lightbox" style="display:none">
        <div class="content">
            <span class="close-btn fa fa-stack fa-lg">
                <i class="fa fa-circle fa-inverse fa-stack-2x"></i>
                <i class="fa fa-close fa-stack-1x"></i>
            </span>
            <img data-loader = "<?php echo plugins_url('loader-image.gif', __FILE__); ?>" src="loader-image.gif" />
            <div class="description">
                <div style="display:inline-block;float:left;">
                    Lorem Ipsum <br> Album: bla bla bla
                </div>
                <div style="display: inline-block;float:right;padding:10px 0;">
                    <a title="View this on Facebook"><i class="fa fa-external-link fa-2x"></i></a>
                </div>            
            </div>
        </div>
    </div>
    -->
    <div id="fbgallery_container"></div>
    <script>
        var appId = "<?php echo get_option('fbgallery_appId');?>";
        var pageId="<?php echo get_option('fbgallery_pageId');?>";
        var excludedAlbums = [<?php echo get_option('fbgallery_excludedAlbums');?>];
        var accessToken = "<?php echo get_option('fbgallery_accessToken');?>";
    </script>
<?php
    }
    function fbgallery_activation(){
        add_option('fbgallery_appId','');
        add_option('fbgallery_accessToken', '');
        add_option('fbgallery_pageId', '');
        add_option('fbgallery_excludedAlbums', '');
    }
    register_activation_hook(__FILE__, 'fbgallery_activation');
    function fbgallery_register_settings(){
        register_setting('fbgallery_options', 'fbgallery_accessToken');
        register_setting('fbgallery_options', 'fbgallery_pageId');
        register_setting('fbgallery_options', 'fbgallery_appId');
        register_setting('fbgallery_options', 'fbgallery_excludedAlbums');
    }
    function fbgallery_callback(){

    }
    function fbgallery_register_options_page(){
        add_options_page('FbGallery Options', 'FbGallery', 'manage_options', 'fbgallery', 'fbgallery_options_page');
    }
    function fbgallery_options_page(){
?>
    <div>
    <?php screen_icon(); ?>
    <h2>fbGallery: A Responsive Facebook Albums Gallery</h2>
    <form method="post" action="options.php">
        <?php settings_fields('fbgallery_options'); ?>
        <h3>Options</h3>
        <table>
        <tr valign="top">
            <th scope="row"><label for="fbgallery_appId">App Id</label></th>
            <td><input class="form-control" name="fbgallery_appId" id="fbgallery_appId" value="<?php echo get_option('fbgallery_appId'); ?>"></td>
        </tr>
        <tr valign="top">
            <th scope="row"><label for="fbgallery_accessToken">Access Token</label></th>
            <td><input class="form-control" name="fbgallery_accessToken" id="fbgallery_accessToken" value="<?php echo get_option('fbgallery_accessToken'); ?>"></td>
        </tr>
        <tr valign="top">
            <th scope="row"><label for="fbgallery_pageId">Page Id</label></th>
            <td><input class="form-control" name="fbgallery_pageId" id="fbgallery_pageId" value="<?php echo get_option('fbgallery_pageId'); ?>"></td>
        </tr>
        <tr valign="top">
            <th scope="row"><label for="fbgallery_excludedAlbums">Excluded Album Ids (in single quotes, Seperated by Comma)</label></th>
            <td><input class="form-control" name="fbgallery_excludedAlbums" id="fbgallery_accessToken" value="<?php echo get_option('fbgallery_excludedAlbums'); ?>"> </td>
        </tr>
        <?php submit_button(); ?>
    </form>
<?php
    }
    add_action('admin_init', 'fbgallery_register_settings');
    add_action('admin_menu', 'fbgallery_register_options_page');
    add_shortcode('fbgallery', 'fbgallery_loadGallery');

?>