<?php
/**
 * Plugin Name: Ponce Admin
 * Plugin URI: //
 * Description: Plugin panel administrativo.
 * Version: 1
 * Author: Ponceleón Software
 * Author URI: http://www.ponceleon.site
 */


/*Pendientes: 
Hacer enqueue de styles:
  TailwindCSS (X):
  	Si se hace un enqueue de styles (los estilos se encadenan al head del wp), se mezclan los estilos encadenados con los propios de wp
  Frame.css(✓):
  	Un estilo propio del frame renderizado

Hacer enqueue de ejecución de script:
    -Renderizador del frame (✓)
*/
  

wp_enqueue_style('tailwind-css','https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css');

wp_enqueue_style('main-css','/wp-content/plugins/Ponce-admin/style/frame.css');

wp_enqueue_script( 'main', '/wp-content/plugins/Ponce-admin/scripts/main.js', array(), null, true );    
?>