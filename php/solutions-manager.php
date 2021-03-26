<?php

namespace Ponce_Admin;

use Ponce_Admin\Solutions\Ponce_Logo;
use Ponce_Admin\Solutions\Ponce_Top_Bar;

class Solutions_Manager{

	/**
	 * Arreglo que contiene todas las soluciones
	 *
	 * @var array
	 */
	public $array_solutions;

	public function __construct() {
		$this->array_solutions = array(
			Ponce_Logo::NAME => new Ponce_Logo(),
			Ponce_Top_Bar::NAME => new Ponce_Top_Bar()
		);

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