<?php
include 'settings.php';
global $todb;
$todb =$properties;
global $ponce_db_version;
$ponce_db_version = '1.0';

function ponce_install() {
	global $wpdb;
	global $ponce_db_version;
	$table_name = $wpdb->prefix . 'ponce';
	$charset_collate = $wpdb->get_charset_collate();
	$sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		name tinytext NOT NULL,
		description VARCHAR(1000),
		is_active BIT NOT NULL,
		options VARCHAR(1000),
		keywords VARCHAR(1000),
		UNIQUE KEY id (id)
	) $charset_collate;";
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta( $sql );
	add_option( 'ponce_db_version', $ponce_db_version );
}

function ponce_install_data() {
	global $wpdb;
	global $todb;
	$table_name = $wpdb->prefix . 'ponce';
	$sql = '';
 	foreach($todb as $g) {
		$keywordstoarr=implode("','", $g['keywords']);
	    if($sql != '') $sql.= ',';
	    if(!is_array($g['options'])){
	    	$sql .= '("'. $g['name'] .'", "'. $g['description'].'", "'. $g['is_active'].'", "'. $g['options'] .'", "'. $keywordstoarr .'")';
	    }
		else{
			$optionstoarr= str_replace('=', ':', http_build_query( $g['options'], null, ','));
			$sql .= '("'. $g['name'] .'", "'. $g['description'].'", "'. $g['is_active'].'", "'. $optionstoarr .'", "'. $keywordstoarr .'")';
		}
	}
	if($sql != '') {
	    $sql = "INSERT INTO wp_ponce (name,description,is_active,options,keywords) VALUES ". $sql;
	}
	dbDelta( $sql );
}
?>