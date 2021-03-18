<?php

add_action( 'rest_api_init', function () {
  register_rest_route( 'ponceadmin/v2', "/activate/(?P<name>.+)", array(
    'methods' => 'GET',
    'callback' => 'hideTopbar',
  ));
}
);
function hideTopbar($data){
  $name = $data->get_param('name');
  global $wpdb;
  $table_name = $wpdb->prefix . 'ponce';
  $value = $wpdb->get_var( $wpdb->prepare(
    " SELECT is_active FROM $table_name WHERE name = %s ",$name
  ));
  $result=$wpdb->update($table_name, array('is_active' => !$value), array( 'name' => $name ));
  return $result;
}
?>