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

if ( !function_exists('wp_get_current_user') ) {
    include(ABSPATH . "wp-includes/pluggable.php"); 
}

global $wpdb;

define('PONCE_ADMIN__FILE__', __FILE__);
define( 'PONCE_ADMIN_PATH', plugin_dir_path( PONCE_ADMIN__FILE__ ) );

if( !defined('PONCE_ADMIN_SOLUTIONS_TABLE') ){
  define('PONCE_ADMIN_SOLUTIONS_TABLE', $wpdb->prefix . 'ponce');
}

if( !defined('SOLUTION_DEFINED') ){
  require_once PONCE_ADMIN_PATH . 'solutions/solution.php';
}

require_once PONCE_ADMIN_PATH . 'php/solutions-manager.php';
require_once PONCE_ADMIN_PATH . 'php/plugin.php';


/*
include 'initialize.php';
include 'endpoints/topbar.php';
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
  $tablename=  $wpdb->prefix . 'ponce';
	$rows = $wpdb->get_results( "SELECT * FROM $tablename" );
	
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
  wp_enqueue_script( 'main', '/wp-content/plugins/ponce-admin/js/main.js', array(), null, true );
	wp_enqueue_style('frame-css','/wp-content/plugins/ponce-admin/style/frame.css');
}
register_activation_hook( __FILE__, 'ponce_install' );
register_activation_hook( __FILE__, 'ponce_install_data' );
?>*/