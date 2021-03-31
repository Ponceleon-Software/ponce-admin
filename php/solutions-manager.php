<?php

namespace Ponce_Admin\Solutions;

function ponce_defined_constant( $folder_name ){
	$name_floor = str_replace("-", "_", $folder_name);
	$name_upper = strtoupper($name_floor);
	return $name_upper . '_DEFINED';
}

$dir_solutions = PONCE_ADMIN_PATH . "solutions";
$files_in_dir = scandir($dir_solutions);

foreach ($files_in_dir as $name) {
	$solution_dir_name = $dir_solutions . DIRECTORY_SEPARATOR . $name;
	if ( !in_array($name,array(".","..")) && is_dir($solution_dir_name)){
		$php_file_name = $solution_dir_name . DIRECTORY_SEPARATOR . $name . '.php';
		$constant_name = ponce_defined_constant($name);
    if(file_exists($php_file_name) && !defined($constant_name)){
    	require_once( $php_file_name );
    }
  }
}

class Solutions_Manager{

	/**
	 * Arreglo que contiene todas las soluciones
	 *
	 * @var array
	 */
	public $array_solutions;

	public function __construct() {

		/**
		 * Filtro para llenar el array de soluciones
		 */
		$array_solutions_by_filter = apply_filters('ponce_admin_solutions', array());

		$this->array_solutions = array_filter($array_solutions_by_filter, function($a){ return $a instanceof Solution; });

		add_action( 'rest_api_init', [$this, 'init_solutions_rest_api'] );
	}

	/**
	 * Inicializa los endpoints relacionados a la lectura y modificación
	 * de las soluciones
	 */
	public function init_solutions_rest_api(){

	  register_rest_route( 'ponceadmin/v2', 'settings', array(
	    'methods' => 'GET',
	    'callback' => [$this, 'all_solutions_data'],
	    )
		);

		register_rest_route( 
			'ponceadmin/v2', 
			"/activate/(?P<name>.+)", 
			array(
		    'methods' => 'GET',
		    'callback' => [$this, 'switch_active_solution'],
	  	)
	  );

	  register_rest_route( 
			'ponceadmin/v2', 
			"/options/(?P<name>.+)", 
			array(
		    'methods' => 'POST',
		    'callback' => [$this, 'update_options_solution'],
	  	)
	  );

	}

	/**
	 * Función que permite obtener la data actual de todas las soluciones
	 *
	 * @return array La data actual de todas las soluciones en un array 
	 * iterativo
	 */
	public function all_solutions_data(){

		$solutions_it = array();

		foreach ($this->array_solutions as $solution) {
			array_push($solutions_it, $solution->solution_data());
		}

		return $solutions_it;

	}

	/**
	 * Se encarga de modificar el valor de is_active para la solución
	 * especificada en el url de una llamada a la rest api /activate
	 *
	 * @return int|boolean La cantidad de registros de la bd cambiados
	 * o false si hubo un error
	 */
	public function switch_active_solution( $request ){

		$solution_name = $request->get_param('name');

		if( !array_key_exists($solution_name, $this->array_solutions) ){
			//ToDo lanzar error 400
			return false;
		}

		$solution = $this->array_solutions[ $solution_name ];

		return $solution->toogle_is_active();

	}

	/**
	 * Función que actualiza las opciones en una solución según un
	 * llamado a la rest api
	 *
	 * @param WP_Rest_Request El request de la rest api
	 *
	 * @return int|boolean El número de cambios en la tabla o false si
	 * ocurrió un error
	 */
	public function update_options_solution( $request ){
		$solution_name = $request->get_param('name');
		$params = $request->get_params();

		if( !array_key_exists($solution_name, $this->array_solutions) ){
			//ToDo lanzar error 400
			return false;
		}

		$solution = $this->array_solutions[ $solution_name ];

		return $solution->update_options( $params );
	}

}