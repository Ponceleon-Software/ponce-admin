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
include 'settings/topbar.php';
include 'initialize.php';
include 'endpoints.php';

add_action( 'rest_api_init', function () {
  register_rest_route( 'ponceadmin/v2', 'settings', array(
    'methods' => 'GET',
    'callback' => 'getSettings',
    ));
} );

function getSettings(){
    
    global $wpdb;
    $setttings_array=[];
	$row = $wpdb->get_results( "SELECT * FROM wp_ponceadmin");

    foreach ( $row as $row ) 
    { 
    	$a=array(
    		'name'=>$row->name,
    		'is_active'=>$row->is_active,
    		'value'=>explode(',',$row->value),
    	);
    	array_push($setttings_array, $a);
    	
	}
	return ($setttings_array);
  
}

//enqueues

wp_enqueue_style('frame-css','/wp-content/plugins/Ponce-admin/style/frame.css');
wp_enqueue_script( 'main', '/wp-content/plugins/Ponce-admin/scripts/main.js', array(), null, true );    
register_activation_hook( __FILE__, 'ponceadmin_install' );
register_activation_hook( __FILE__, 'ponceadmin_install_data' );
?>