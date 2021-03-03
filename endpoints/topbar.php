<?php

add_action( 'rest_api_init', function () {
  register_rest_route( 'ponceadmin/v2', 'topbar', array(
    'methods' => 'GET',
    'callback' => 'hideTopbar',
    ));
} );
function hideTopbar(){
	global $wpdb;
	$value = $wpdb->get_var( $wpdb->prepare(
    " SELECT is_active FROM {$wpdb->prefix}ponce WHERE name = 'ponceTopBar' "
	) );
	$table_name = $wpdb->prefix . 'ponce';
	$result=$wpdb->update($table_name, array('is_active' => !$value), array( 'name' =>'ponceTopBar' ));
	return $result;
}
?>