<?php

namespace Ponce_Admin;

/**
 * Clase principal del plugin que inicializa toda la funcionalidad
 * del mismo
 */
class Plugin {

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

	/**
	 * El objeto que se encarga de todo lo relacionado al manejo de
	 * las soluciones
	 *
	 * @var Solutions_Manager
	 */
	public $solutions_manager;

  /**
	 * Constructor del plugin.
	 *
	 * Inicializa el plugin.
	 *
	 * @access private
	 */
	private function __construct() {

		register_activation_hook(PONCE_ADMIN__FILE__, [$this, 'init_db']);

		$this->solutions_manager = new Solutions_Manager();

		add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts_iframe']);

	}

	/**
	 * Inicializa la tabla de soluciones en la base de datos
	 *
	 * @param $networkwide Relacionado al uso del plugin en mu
	 */
	public function init_db( $networkwide ){

		global $wpdb;
		if (function_exists('is_multisite') && is_multisite()) {

			if ( $networkwide ) {
				$old_blog = $wpdb->blogid;
				$blogids = $wpdb->get_col("SELECT blog_id FROM $wpdb->blogs");
				foreach ($blogids as $blog_id) {
				  switch_to_blog($blog_id);

				  $table_name = PONCE_ADMIN_SOLUTIONS_TABLE;
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
				}
				switch_to_blog($old_blog);
	        return;
			}
		}
		$table_name = PONCE_ADMIN_SOLUTIONS_TABLE;
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

	}

	public function enqueue_scripts_iframe(){
		wp_enqueue_media();
	  wp_enqueue_script( 'ponce-demos-main', '/wp-content/plugins/ponce-admin/js/main.js', array(), null, true );
		wp_enqueue_style('frame-css','/wp-content/plugins/ponce-admin/style/frame.css');
	}

}

Plugin::instance();