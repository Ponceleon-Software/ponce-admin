<?php

namespace Ponce_Admin\Solutions;

if (defined('PONCE_LOGO_DEFINED')) die ('Ponce logo');

class Ponce_Logo extends Solution {

  const NAME = 'ponceLogo';

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

  private function __construct(){
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
      plugins_url('/enqueues/logoInAdmin.js', __FILE__),
      array(),
      "0",
      true
    );

  }

  public function put_logo_in_login(){

    $src = $this->options['src'];

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

Ponce_Logo::instance();

define( 'PONCE_LOGO_DEFINED', true );
