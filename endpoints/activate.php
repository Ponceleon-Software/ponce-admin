<?php

add_action( 'rest_api_init', function () {
  global $todb;
  foreach ($todb as $value) {
    $name = $value['name'];
    register_rest_route( 'ponceadmin/v2', $name, array(
      'methods' => 'GET',
      'callback' => function(){ hideTopbar($name); },
    ));
  }
  register_rest_route( 'ponceadmin/v2', 'topbar', array(
    'methods' => 'GET',
    'callback' => 'hideTopbar',
    ));
} );
function hideTopbar($name){
	global $wpdb;
	$table_name = $wpdb->prefix . 'ponce';
	$value = $wpdb->get_var( $wpdb->prepare(
    " SELECT is_active FROM $table_name WHERE name = '$name' "
	));
	$result=$wpdb->update($table_name, array('is_active' => !$value), array( 'name' => $name ));
	return $result;
}
?>