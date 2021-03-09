<?php

add_action( 'rest_api_init', function () {
  register_rest_route( 'ponceadmin/v2', 'logo', array(
    'methods' => 'POST',
    'callback' => 'setPonceLogo',
    ));
} );
function setPonceLogo(WP_REST_request $request){

  //Definitions
  $uploadsFolder = str_replace("\\endpoints", "/assets/img/", __DIR__ );
  global $wpdb;
  $table_name = $wpdb->prefix . 'ponce';

  $file = $request->get_file_params()["image"];
  if(isset($file) && is_uploaded_file($file['tmp_name'])){
    $fileTmpPath = $file['tmp_name'];
    $fileName = $file['name'];
  
    $dest_path = $uploadsFolder . $fileName;
    if(!move_uploaded_file($fileTmpPath, $dest_path)){
      return false;
    }
  }else{
    $result=$wpdb->update(
      $table_name, 
      array('options' => 'src:,inAdmin:false,inLogin:false'), 
      array( 'name' => 'ponceLogo' )
    );
    if($result>0){
      return true;
    }
  }
  
	return true;
}
?>