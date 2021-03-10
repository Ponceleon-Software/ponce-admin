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
  $name = 'ponceLogo';

  //Borrar imagen previa si existe
  $prevOptions = $wpdb->get_var( $wpdb->prepare(
    "SELECT options FROM $table_name WHERE name = '$name'"
	));
  $arr = explode(",", $prevOptions);
  $prevSrc = "";
  foreach ($arr as $val) {
    if(substr($val, 0, 4) == "src:"){
      $prevSrc = substr($val, 4);
    }
  }
  if($prevSrc!=""){
    unlink($prevSrc);
  }

  $file = $request->get_file_params()["image"];
  if(!(isset($file) && is_uploaded_file($file['tmp_name']))){
    $result=$wpdb->update(
      $table_name, 
      array('options' => 'src:,inAdmin:false,inLogin:false'), 
      array( 'name' => $name )
    );
    if($result>0){
      return true;
    }
  }else{
    $inAdmin = isset($request["inAdmin"]);
    $inLogin = isset($request["inLogin"]);
    
    $fileTmpPath = $file['tmp_name'];
    $fileName = $file['name'];
  
    $dest_path = $uploadsFolder . $fileName;
    if(!move_uploaded_file($fileTmpPath, $dest_path)){
      return false;
    }

    $result = $wpdb->update(
      $table_name,
      array('options' => "src:$dest_path,inAdmin:$inAdmin,inLogin:$inLogin"),
      array( 'name' => $name )
    );
    if($result>0){
      return true;
    }
  }
  
	return false;
}
?>