<?php

namespace Ponce_Admin\Solutions;

class Ponce_Top_Bar extends Solution {

	const NAME = 'ponceTopBar';

	public function __construct(){
    parent::__construct( self::NAME );
  }

  public function default_config(){
  	return array(
      'name' => self::NAME,
      'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Cras vulputate consequat ',
      'is_active'=>false,
      'options' => array(),
      'keywords'=> json_encode(
      	array("top bar", "barra superior", "admin bar")
      )
    );
  }

  public function do_solution(){

  add_filter( 'show_admin_bar', '__return_false' );
	add_action( 'admin_bar_menu', [$this, 'hide_admin_bar_nodes'], 200 );
	add_action( 'wp_head', [$this, 'hide_admin_bar'] );
	add_action( 'admin_head', [$this, 'hide_admin_bar'] );
	add_action( 'admin_head', [$this, 'hide_admin_bar_space'] );

  }

  public function hide_admin_bar_nodes(){

  	global $wp_admin_bar;   
		if ( !is_object( $wp_admin_bar ) ) return;

		$nodes = $wp_admin_bar->get_nodes();
		foreach( $nodes as $node )
		{
			if( !$node->parent || 'top-secondary' == $node->parent )
			{
				$wp_admin_bar->remove_menu( $node->id );
			}           
		}

  }

  public function hide_admin_bar(){
  	?>
			<style type="text/css">
				#wpadminbar {
				  display: none;
				}
		  </style>
		<?php 
  }

  function hide_admin_bar_space() { 
		?>
			<script>
			document.querySelector("html").className = "none";
			</script>
		<?php 
	}

}
/*

global $wpdb;
$tablename=$wpdb->prefix . 'ponce';
$name='ponceTopBar';
$value = $wpdb->get_var( $wpdb->prepare(" SELECT is_active FROM $tablename WHERE name = %s ",$name) );



function ocultar_nodos_admin_bar() 
	{
		global $wp_admin_bar;   
		if ( !is_object( $wp_admin_bar ) )
			return;

		$nodes = $wp_admin_bar->get_nodes();
		foreach( $nodes as $node )
		{
			if( !$node->parent || 'top-secondary' == $node->parent )
			{
				$wp_admin_bar->remove_menu( $node->id );
			}           
		}
		
	}

function ocultar_espacio_en_admin_bar() { 
	?>
	<script>
	document.querySelector("html").className = "none";
	</script>
	<?php 
}
function hide_admin_bar() { 
	?>
	<style type="text/css">

		#wpadminbar {
		  display: none;
		}
	  </style>
	<?php 
}


if ($value){
	add_filter( 'show_admin_bar', '__return_false' );
	add_action( 'admin_bar_menu', 'ocultar_nodos_admin_bar', 200 );
	add_action( 'wp_head', 'hide_admin_bar' );
	add_action( 'admin_head', 'hide_admin_bar' );
	add_action( 'admin_head', 'ocultar_espacio_en_admin_bar' );

}
?>*/