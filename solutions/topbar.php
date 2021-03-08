<?php

global $wpdb;
$value = $wpdb->get_var( $wpdb->prepare(
    " SELECT is_active FROM {$wpdb->prefix}ponce WHERE name = 'ponceTopBar' "
) );



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
?>