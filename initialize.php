<?php
include 'ponce_init_config.php';
global $todb;
$todb =$properties;
global $ponce_db_version;
$ponce_db_version = '1.0';

function ponce_install($networkwide) {
	global $wpdb;
	global $ponce_db_version;
	if (function_exists('is_multisite') && is_multisite()) {

		if ($networkwide) {
			$old_blog = $wpdb->blogid;
			$blogids = $wpdb->get_col("SELECT blog_id FROM $wpdb->blogs");
			foreach ($blogids as $blog_id) {
			    switch_to_blog($blog_id);

			    $table_name = $wpdb->prefix . 'ponce';
				$charset_collate = $wpdb->get_charset_collate();
				$sql = "CREATE TABLE IF NOT EXISTS $table_name (
				id mediumint(9) AUTO_INCREMENT PRIMARY KEY,
				name VARCHAR(25) NOT NULL UNIQUE,
				description VARCHAR(1000),
				is_active BIT NOT NULL,
				options VARCHAR(1000),
				keywords VARCHAR(1000)
				) $charset_collate;";
				require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
				dbDelta( $sql );
				add_option( 'ponce_db_version', $ponce_db_version );
			}
			switch_to_blog($old_blog);
            return;
		}
	}
	$table_name = $wpdb->prefix . 'ponce';
	$charset_collate = $wpdb->get_charset_collate();
	$sql = "CREATE TABLE IF NOT EXISTS $table_name (
	id mediumint(9) AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(25) NOT NULL UNIQUE,
	description VARCHAR(1000),
	is_active BIT NOT NULL,
	options VARCHAR(1000),
	keywords VARCHAR(1000)
	) $charset_collate;";
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta( $sql );
	add_option( 'ponce_db_version', $ponce_db_version );

}

function ponce_install_data($networkwide) {
	global $wpdb;
	global $todb;
	if (function_exists('is_multisite') && is_multisite()) {

			if ($networkwide) {
			$old_blog = $wpdb->blogid;
			$blogids = $wpdb->get_col("SELECT blog_id FROM $wpdb->blogs");
			foreach ($blogids as $blog_id) {
				switch_to_blog($blog_id);
				$table_name = $wpdb->prefix . 'ponce';
				$sql = '';
			 	foreach($todb as $g) {
					$keywordstoarr=implode("','", $g['keywords']);
			    if($sql != '') $sql.= ',';
				  if(!is_array($g['options'])){
						$sql .= $wpdb->prepare('(%s, %s, %d, %s, %s)', $g['name'], $g['description'], $g['is_active'], $g["options"], $keywordstoarr);
				  }
					else{
						$optionstoarr= json_encode( $g['options'] );
						$sql .= $wpdb->prepare('(%s, %s, %d, %s, %s)', $g['name'], $g['description'], $g['is_active'], $optionstoarr, $keywordstoarr);
					}
				}
				if($sql != '') {
				    $sql = "INSERT INTO $table_name (name,description,is_active,options,keywords) VALUES $sql
						ON DUPLICATE KEY UPDATE is_active = 0";
				}
				dbDelta( $sql );
			}
			switch_to_blog($old_blog);
            return;
		}
	}
	$table_name = $wpdb->prefix . 'ponce';
	$sql = '';
 	foreach($todb as $g) {
		$keywordstoarr=implode("','", $g['keywords']);
    if($sql != '') $sql.= ',';
	  if(!is_array($g['options'])){
			$sql .= $wpdb->prepare('(%s, %s, %d, %s, %s)', $g['name'], $g['description'], $g['is_active'], $g["options"], $keywordstoarr);
	  }
		else{
			$optionstoarr= json_encode( $g['options'] );
			$sql .= $wpdb->prepare('(%s, %s, %d, %s, %s)', $g['name'], $g['description'], $g['is_active'], $optionstoarr, $keywordstoarr);
		}
	}
	if($sql != '') {
	    $sql = "INSERT INTO $table_name (name,description,is_active,options,keywords) VALUES $sql
			ON DUPLICATE KEY UPDATE is_active = 0";
	}
	dbDelta( $sql );


}
?>