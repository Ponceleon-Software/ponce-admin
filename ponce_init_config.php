<?php

$properties = array(
        array(
            'name' => 'ponceTopBar',
            'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Cras vulputate consequat ',
            'is_active'=>false,
            'options' => 'valor',
            'keywords'=>array("top bar", "barra superior", "admin bar")
                   
        ),
        array(
            'name' => 'ponceLogo',
            'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Cras vulputate consequat ',
            'is_active'=>false,
            'options' =>array(		
    		"src" => "",
    		"inAdmin" => false,
    		"inLogin" => false,
    		),
            'keywords'=>array("logo", "imagen", "image")
           
        )
    );

$settings= json_encode($properties);

?>