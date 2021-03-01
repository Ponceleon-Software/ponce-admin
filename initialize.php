<?php
include 'settings.php';
global $todb;
$todb =$properties;
global $ponceadmin_db_version;
$ponceadmin_db_version = '1.0';

function ponceadmin_install() {
	global $wpdb;
	global $ponceadmin_db_version;
	$table_name = $wpdb->prefix . 'ponceadmin';
	$charset_collate = $wpdb->get_charset_collate();
	$sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		name tinytext NOT NULL,
		is_active BIT NOT NULL,
		value VARCHAR(1000),
		UNIQUE KEY id (id)
	) $charset_collate;";
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta( $sql );
	add_option( 'ponceadmin_db_version', $ponceadmin_db_version );
}

function ponceadmin_install_data() {
	global $wpdb;
	global $todb;
	$table_name = $wpdb->prefix . 'ponceadmin';
	$sql = '';
 	foreach($todb as $g) {
	    if($sql != '') $sql.= ',';
	    if(!is_array($g['value'])){
	    	$sql .= '("'. $g['name'] .'", "'. $g['is_active'].'", "'. $g['value'] .'")';
	    }
		else{
			$valuetoarr=implode("','", $g['value']);
			$sql .= '("'. $g['name'] .'", "'. $g['is_active'].'", "'. $valuetoarr .'")';
		}
	}
	if($sql != '') {
	    $sql = "INSERT INTO wp_ponceadmin (name,is_active,value) VALUES ". $sql;
	}

	dbDelta( $sql );
}
?>