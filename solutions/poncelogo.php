<?php

namespace Ponce_Admin\Solutions;

class Ponce_Logo extends Solution {

  const NAME = 'ponceLogo';

  public function __construct(){
    parent::__construct( self::NAME );
  }

  public function default_config(){
    return array(
      'name' => self::NAME,
      'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Cras vulputate consequat ',
      'is_active'=>false,
      'options' => json_encode(
        array(    
          "src" => "",
          "inAdmin" => false,
          "inLogin" => false,
        )
      ),
      'keywords'=>json_encode( array("logo", "imagen", "image") )
    );
  }

  public function do_solution(){

    if ( empty($this->options['src']) ) return;

    if( $this->options['inAdmin'] ){
      add_action('admin_footer', [$this, 'put_logo_in_admin']);
    }

    if( $this->options['inLogin'] ){
      add_action('login_enqueue_scripts', [$this, 'put_logo_in_login']);
    }

  }

  public function put_logo_in_admin(){

    $src = $this->options['src'];

    //Añado una constante al js que guarde la ruta de la imagen
    ?>
      <script type="text/javascript">
        var paLogoUser = `<?php echo $src; ?>`;
      </script>
      <style type="text/css">
        body.login div#login h1 a {
          background-image: url(<?php echo $src ?>);
        }

        #nsl-custom-login-form-main {
          display: none;
        }
      </style>
    <?php

    wp_enqueue_script(
      'logo_in_admin',
      plugins_url('/js/enqueues/logoInAdmin.js', PONCE_ADMIN__FILE__),
      array(),
      "0",
      true
    );

  }

  public function put_logo_in_login(){

    $src = $options['src'];

    ?>
      <style type="text/css">
        #login>h1>a {
          background-image: url(<?php echo $src; ?>);
        }

        #nsl-custom-login-form-main {
          display: none;
        }
      </style>
    <?php

  }

}

/*
add_action('admin_footer', 'logo_en_admin_menu');

/**
 * Añade el logo en el menu de admin si el usuario lo configuró
 *
function logo_en_admin_menu()
{

  global $wpdb;
  $table_name = $wpdb->prefix . 'ponce';

  $options = $wpdb->get_var($wpdb->prepare(
    " SELECT options FROM $table_name WHERE name = %s ",
    'ponceLogo'
  )); 

  $is_active = $wpdb->get_var($wpdb->prepare(
    " SELECT is_active FROM $table_name WHERE name = %s ",
    'ponceLogo'
  ));

  $is_active = json_decode($is_active, true);

  $options = json_decode($options, true);

  if ($is_active == 1 && $options['src'] && $options['inAdmin']) {
    $src = $options['src'];

    //Añado una constante al js que guarde la ruta de la imagen
?>
    <script type="text/javascript">
      var paLogoUser = `<?php echo $src; ?>`;
    </script>
    <?php
    ?>
    <style type="text/css">
      body.login div#login h1 a {
        background-image: url(<?php echo $src ?>);
      }

      #nsl-custom-login-form-main {
        display: none;
      }
    </style>
  <?php

    //Añado el script que usa la ruta previamente añadida para mostrar la imagen
    wp_enqueue_script(
      'logo_in_admin',
      plugins_url('/js/enqueues/logoInAdmin.js', __DIR__),
      array(),
      "0",
      true
    );
  }
}

/**
 * Agrega el logo en el login si el usuario lo configuró
 *
//Hook para la implementación de la imagen en el login
add_action('login_enqueue_scripts', 'my_login_logo_one');
function my_login_logo_one()
{
  global $wpdb;
  $table_name = $wpdb->prefix . 'ponce';

  $options = $wpdb->get_var($wpdb->prepare(
    " SELECT options FROM $table_name WHERE name = %s ",
    'ponceLogo'
  ));

  $options = json_decode($options, true);

  $is_active = $wpdb->get_var($wpdb->prepare(
    " SELECT is_active FROM $table_name WHERE name = %s ",
    'ponceLogo'
  ));

  $is_active = json_decode($is_active, true);

  if ($is_active == 1 && $options['inLogin']) {
    $src = $options['src'];

  ?>
    <style type="text/css">
      #login>h1>a {
        background-image: url(<?php echo $src; ?>);
      }

      #nsl-custom-login-form-main {
        display: none;
      }
    </style>
<?php
  }
}

?>*/