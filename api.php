<?php
/**
 * Created by IntelliJ IDEA.
 * User: jeffr
 * Date: 08-04-2018
 * Time: 22:02
 */

if ($_GET['type'] == 'loadServices') {
    //print "loadServices";
    $url = 'https://bloomington.in.gov/crm-test/open311/v2/services.json?jurisdiction_id=bloomington.in.gov';
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
    $response = curl_exec($curl);
    if ($response === false) $response = curl_error($curl);
    //echo stripslashes($response);
    curl_close($curl);
    echo $response;
} else if ($_GET['type'] == 'getServiceDefinition') {
    $url = 'https://bloomington.in.gov/crm-test/open311/v2/services.json?jurisdiction_id=bloomington.in.gov';
    $url = 'https://bloomington.in.gov/crm-test/open311/v2/services/'.$_GET['service_code'].'.json?jurisdiction_id=city.gov';
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
    $response = curl_exec($curl);
    if ($response === false) $response = curl_error($curl);
    //echo stripslashes($response);
    curl_close($curl);
    echo $response;
} else if ($_GET['type'] == 'postRequest') {
    $url = 'https://bloomington.in.gov/crm-test/open311/v2/requests.json';
    $post_data = $_POST;
    $post_data['jurisdiction_id'] = "bloomington.in.gov";
    $post_data['api_key'] = "5ac8deb13c862";
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_TIMEOUT, 100);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($post_data));
    $response = curl_exec($curl);
    if ($response === false) $response = curl_error($curl);
    curl_close($curl);
    echo $response;
} else {
    print "Incorrect type";
}
