<?php

add_action( 'rest_api_init', function () {
  register_rest_route( 'ponceadmin/v2', 'logo', array(
    'methods' => 'POST',
    'callback' => 'setPonceLogo',
    ));
} );
function setPonceLogo(WP_REST_request $request){

  #region Definitions
  $uploadsFolder = str_replace("\\endpoints", "/assets/img/", __DIR__ );
  global $wpdb;
  $table_name = $wpdb->prefix . 'ponce';
  $name = 'ponceLogo';
  #endregion

  #region Borrar imagen previa si existe
  $prevOptions = $wpdb->get_var( $wpdb->prepare(
    "SELECT options FROM $table_name WHERE name = '$name'"
	));
  $arr = json_decode($prevOptions, true);
  if($arr['src']){
    unlink($arr['src']);
  }
  #endregion

  $file = $request->get_file_params()["image"];
  $src = '';
  $inAdmin = isset($request["inAdmin"]);
  $inLogin = isset($request["inLogin"]);
  if(isset($file) && is_uploaded_file($file['tmp_name'])){
    $fileTmpPath = $file['tmp_name'];
    $fileName = $file['name'];

    $dest_path = $uploadsFolder . $fileName;
    if(move_uploaded_file($fileTmpPath, $dest_path)){
      $src = $dest_path;
    }else{
      return false;
    }
  }
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