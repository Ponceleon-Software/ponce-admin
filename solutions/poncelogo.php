<?php

add_action('admin_footer', 'logo_en_admin_menu');

/**
 * Añade el logo en el menu de admin si el usuario lo configuró
 */
function logo_en_admin_menu() {

  global $wpdb;
  $table_name = $wpdb->prefix . 'ponce';

  $options = $wpdb->get_var( $wpdb->prepare(
    " SELECT options FROM $table_name WHERE name = %s ", 'ponceLogo'
  ));
  $options = json_decode($options, true);

  if($options['inAdmin'] && $options['src']){
    $uploadsFolder = plugins_url( '/assets/img', __DIR__ );
    $src = $uploadsFolder . "/" . $options['src'];

    //Añado una constante al js que guarde la ruta de la imagen
    ?>
    <script type="text/javascript">
      var paLogoUser = `<?php echo $src; ?>`;
    </script>
    <?php
    
    //Añado el script que usa la ruta previamente añadida para mostrar la imagen
    wp_enqueue_script('logo_in_admin', plugins_url( '/js/enqueues/logoInAdmin.js', __DIR__),
    array(), "0", true);
  }
    
}



?>