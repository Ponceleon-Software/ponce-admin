<?php

namespace Ponce_Admin\Solutions;

if (defined('PONCE_TOP_BAR_DEFINED')) die ('Top bar');

class Ponce_Top_Bar extends Solution {

	const NAME = 'ponceTopBar';

	/**
   * Guarda la instancia única del plugin
   * 
   * @static
   * @access private
   * 
   * @var Plugin
   */
  private static $instance = null;

  /**
   * Devuelve una instancia del plugin y se asegura de que solo pueda
   * existir una instancia
   * 
   * @static
   * 
   * @return Plugin Instancia de la clase
   */
  public static function instance() {
    if ( is_null( self::$instance ) ) {
      self::$instance = new self();
    }

    return self::$instance;
  }

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

Ponce_Top_Bar::instance();

define('PONCE_TOP_BAR_DEFINED', true);