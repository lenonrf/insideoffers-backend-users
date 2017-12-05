<?php

 
    function sendLead($nome, $email, $celular, $offerID){

        $arr_lead = array(
            'email' => $email,
            'firstname' => $nome,
            'cellphone' => $celular
        );

        $arr_ret = array(
            'status' => false,
            'message' => 'Invalid response from API. Please try again later. If the problem persists, please contact suporte@beeleads.com.br',
            'details' => array()
        );

        $arr_lead = array_map("urlencode", $arr_lead);

        /* Generate Token */
        $token = sha1("#be32016" . http_build_query($arr_lead));

        /* Prepare data and build URL */
        $data = http_build_query(array('field' => $arr_lead));
        $url = "https://hive.bldstools.com/api.php/v1/lead/?token={$token}&affiliate_id=2754&offer_id={$offerID}&{$data}";

        return $url;


    }




