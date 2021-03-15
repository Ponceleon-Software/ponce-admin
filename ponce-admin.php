<?php
/**
 * Plugin Name: Ponce Admin
 * Plugin URI: //
 * Description: Plugin panel administrativo.
 * Version: 1
 * Author: Ponceleón Software
 * Author URI: http://www.ponceleon.site
 */
//Endpoint settings//
defined('ABSPATH') or die("Bye bye");
include 'initialize.php';
include 'endpoints/activate.php';
include 'endpoints/poncelogo.php';
include 'solutions/topbar.php';
include 'solutions/poncelogo.php';

add_action( 'rest_api_init', function () {
  register_rest_route( 'ponceadmin/v2', 'settings', array(
    'methods' => 'GET',
    'callback' => 'getSettings',
    ));
} );

function getSettings(){
    
  global $wpdb;
	$rows = $wpdb->get_results( "SELECT * FROM wp_ponce" );
	
  foreach ( $rows as $row )
  {
		$row->options = json_decode( $row->options );	
	}
	return ($rows);
  
}

//enqueues
add_action("admin_enqueue_scripts", "dcms_insert_script_upload");

function dcms_insert_script_upload(){
	wp_enqueue_media();
  wp_enqueue_script( 'main', '/wp-content/plugins/Ponce-admin/js/main.js', array(), null, true );
	wp_enqueue_style('frame-css','/wp-content/plugins/Ponce-admin/style/frame.css');
}
register_activation_hook( __FILE__, 'ponce_install' );
register_activation_hook( __FILE__, 'ponce_install_data' );
?>