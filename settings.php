<?php

$properties = array(
        array(
            'name' => 'ponceTopBar',
            'is_active'=>false,
            'options' => 'valor',
            'keywords'=>array("top bar", "barra superior", "admin bar")
                   
        ),
        array(
            'name' => 'ponceLogo',
            'is_active'=>false,
            'options' =>array(		
    		"src" =>'false',
    		"inAdmin" =>'false',
    		"inLogin" =>'false',
    		),
            'keywords'=>array("logo", "imagen", "image")
           
        )
    );

$settings= json_encode($properties);

?>