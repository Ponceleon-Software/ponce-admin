<?php

$properties = array(
        array(
            'name' => 'ponceTopBar',
            'is_active'=>false,
            'value' => 'valor'
           
        
        ),
        array(
            'name' => 'ponceLogo',
            'is_active'=>false,
            'value' =>array(		
    		"src" =>'false',
    		"inAdmin" =>'false',
    		"inLogin" =>'false',
    		)
           
        )
    );

$settings= json_encode($properties);

?>