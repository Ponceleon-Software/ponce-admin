<?php

namespace Ponce_Admin\Solutions;

if (defined('SOLUTION_DEFINED')) die ('Solution');

abstract class Solution {

	/**
	 * Guarda el nombre de la tabla de soluciones
	 *
	 * @static
	 * @var string
	 */
	const TABLE_NAME = PONCE_ADMIN_SOLUTIONS_TABLE;

	/**
	 * El nombre de la solución
	 *
	 * @var string
	 */
	public $name;

	/**
	 * El valor actual en la base de datos de options para esta solución
	 *
	 * @var array
	 */
	public $options;

	/**
	 * El valor actual en la base de datos de is_active para esta solución
	 *
	 * @var boolean
	 */
	public $is_active;

	public function __construct($name){

		$this->name = $name;

		$this->data_from_db();

		if( $this->is_active  ){
			$this->do_solution();

			/**
			 * Acción que se ejecuta si la solución está activa, luego de que
			 * esta ha hecho los cambios correspondientes
			 */
			do_action("solution_{$name}_is_active");
		}

		add_filter('ponce_admin_solutions', [$this, 'add_to_ponce_admin']);

	}

	/**
	 * Llena options y is_active con los valores que tienen en la bd
	 *
	 * @return boolean True si los valores fueron incializados
	 * correctamente
	 */
	public function data_from_db (){

		global $wpdb;
		$table_name = self::TABLE_NAME;

		$query = $wpdb->prepare(
			"SELECT is_active, options FROM $table_name WHERE name = %s",
			$this->name
		);

		$row = $wpdb->get_row($query, ARRAY_A);

		if( is_null($row) ){
			$row = $this->default_config();

			$inserted = $wpdb->insert(
				$table_name, $row, array('%s','%s','%d','%s','%s')
			);

			if ($inserted == 0) return false;

		}

		$this->options = is_string($row['options'])
		  ? json_decode($row['options'], true)
		  : $row['options'];

		$this->is_active = $row['is_active'];

		return true;

	}

	/**
	 * Acción para el filtro que se encarga de añadir esta solución a
	 * ponce admin
	 */
	public function add_to_ponce_admin($solutions){
		$solutions[$this->name] = $this;
		return $solutions;
	}

	/**
	 * Cambia el valor de is_active en la base de datos al contrario del
	 * que es actualmente
	 *
	 * @return int|false La cantidad de registros afectados en la 
	 * base de datos o false si hubo un error
	 */
	public function toogle_is_active(){
		return $this->set_is_active( !$this->is_active );
	}

	/**
	 * Cambia el valor de is_active en la base de datos por uno
	 * especificado.
	 *
	 * @param boolean $is_active El nuevo valor para is_active
	 *
	 * @return int|false La cantidad de registros afectados en la 
	 * base de datos o false si hubo un error
	 */
	public function set_is_active($is_active){
		if($is_active === $this->is_active) return 0;

		global $wpdb;

		$result = $wpdb->update(self::TABLE_NAME, array('is_active' => $is_active), array( 'name' => $this->name ));

		if( is_int($result) && $result>0){
			$this->is_active = $is_active;
		}

  	return $result;
	}

	/**
	 * Obtiene la data actual de esta solución
	 *
	 * @return array Un array asociativo con la data actual de
	 * esta solución
	 */
	public function solution_data(){

		$default = $this->default_config();

		return array(
			'name' => $default['name'],
			'description' => $default['description'],
			'is_active' => $this->is_active,
			'options' => $this->options,
			'keywords' => $default['keywords']
		);

	}

	/**
	 * Actualiza el valor de options en la base de datos
	 *
	 * @param array $options_arr Un arreglo con los datos a poner en
	 * options indexados en pares llave => valor. Las llaves que no
	 * existan en el arreglo actual de opciones, no serán ingresadas
	 *
	 * @return int|false La cantidad de registros afectados en la base
	 * de datos o false si hubo un error
	 */
	public function update_options( $options_arr ){
		global $wpdb;

		$update_value = array_intersect_key($options_arr, $this->options);

		if ( count($update_value)==0 ) return false;

		$updated_string = json_encode($update_value);

		$registers = $wpdb->update(
			self::TABLE_NAME, 
			array( 'options' => $updated_string ),
			array( 'name' => $this->name ),
			array( '%s' ),
			array( '%s' )
		);

		if( $registers > 0 ){
			$this->options = $update_value;
		}

		return $registers;

	}

	/**
	 * Crea arreglo con los valores iniciales por defecto de la solución en 
	 * la base de datos
	 *
	 * @return array La data inicial por defecto de la solution
	 */
	public abstract function default_config();

	/**
	 * Función que se ejecuta si la solución está activa y contiene la
	 * funcionalidad principal de la solución
	 */
	public abstract function do_solution(); 

}

define('SOLUTION_DEFINED', true);