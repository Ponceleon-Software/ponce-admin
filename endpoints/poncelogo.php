<?php

add_action( 'rest_api_init', function () {
  register_rest_route( 'ponceadmin/v2', 'logo', array(
    'methods' => 'POST',
    'callback' => 'setPonceLogo',
    ));
} );
function setPonceLogo(WP_REST_request $request){

  #region Definitions
  global $wpdb;
  $table_name = $wpdb->prefix . 'ponce';
  $name = 'ponceLogo';
  #endregion

  $src = '';
  if(isset($request["src"])){
    $src = $request["src"];
  }
  $inAdmin = isset($request["inAdmin"]);
  $inLogin = isset($request["inLogin"]);
  
  $options = array(
    "src" => $src,
    "inAdmin" => $inAdmin,
    "inLogin" => $inLogin
  );
  $result = $wpdb->update(
    $table_name,
    array('options' => json_encode($options)),
    array( 'name' => $name )
  );
  if($result>0){
    return true;
  }
  
	return false;
}
?>