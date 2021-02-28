<?php
/**
 * Plugin Name: Ponce Admin
 * Plugin URI: //
 * Description: Plugin panel administrativo.
 * Version: 1
 * Author: Ponceleón Software
 * Author URI: http://www.ponceleon.site
 */
//Endpoint prueba//
add_action( 'rest_api_init', function () {
  register_rest_route( 'ponceadmin/v2', 'prueba', array(
    'methods' => 'GET',
    'callback' => 'prueba',
 ) );
} );

function prueba(){
return 'yikes';
}
//Endpoint prueba//


wp_enqueue_style('frame-css','/wp-content/plugins/Ponce-admin/style/frame.css');
wp_enqueue_script( 'main', '/wp-content/plugins/Ponce-admin/scripts/main.js', array(), null, true );    


?>