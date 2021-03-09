<?php

add_action( 'rest_api_init', function () {
  register_rest_route( 'ponceadmin/v2', 'logo', array(
    'methods' => 'POST',
    'callback' => 'setPonceLogo',
    ));
} );
function setPonceLogo(WP_REST_request $request){

  //Definitions
  $uploadsFolder = get_the_permalink() . "assets/img/";

  $file = $request->get_file_params()["image"];
  $fileTmpPath = $file['tmp_name'];
  $fileName = $file['name'];
  $fileSize = $file['size'];
  $fileType = $file['type'];
  $fileNameCmps = explode(".", $fileName);
  $fileExtension = strtolower(end($fileNameCmps));

  $dest_path = $uploadsFolder . $fileName;
  if(move_uploaded_file($fileTmpPath, $dest_path)){
    return true;
  }
	return false;
}
?>