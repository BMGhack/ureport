/**
 * Created by jeffr on 08-04-2018.
 * Initializations are on top
 * Main Method is at the Bottom
 * Used Bootstrap 4, Underscore JS, Jquery, Block UI
 */

url ="/uReport/api.php";
/**
 * Templates are on the index.html as text/scripts
 */
var stringTemplate = _.template($('#stringTemplate').html());
var numberTemplate = _.template($('#numberTemplate').html());
var datetimeTemplate = _.template($('#datetimeTemplate').html());
var textTemplate = _.template($('#textTemplate').html());
var singleValueListTemplate = _.template($('#singleValueListTemplate').html());
var multipleValueListTemplate = _.template($('#multipleValueListTemplate').html());
var marker;
/**
 * Gets Available services and groups it based on categories
 * @returns {{}}
 */

function loadServices() {
    console.log('loadServices');
    var serviceTemplate = '<li class="service list-group-item" id="service_<%=service_code%>" data="<%=data%>"><%=serviceName%></li>';
    var serviceTemplateCompiled = _.template(serviceTemplate);
    var groups = {};
    $.get(
        url+'?type=loadServices',
        function(data) {
            var obj = JSON.parse(data);
            var i;
            for(i = 0; i < obj.length;i++) {
                var li = {service_code:obj[i].service_code,serviceName:obj[i].service_name,data:encodeURIComponent(JSON.stringify(obj[i]))};
                if(typeof groups[obj[i].group]  == 'undefined') {
                    var tempArr = [];
                    var tempTemplateArr = [];
                    tempArr.push(obj[i]);
                    tempTemplateArr.push(serviceTemplateCompiled(li));
                    var group = {services:tempArr,html:tempTemplateArr};
                    groups[obj[i].group] = group;
                } else {
                    groups[obj[i].group].services.push(obj[i]);
                    groups[obj[i].group].html.push(serviceTemplateCompiled(li));
                }
            }
            renderGroups(groups);
            $("#categories-wrapper").inlinePopup({
                itemSelector: ".article",
                activeFirst: false
            })
        }
    );
    return groups;
}

/**
 * Renders the category tiles on the page
 * @param groups
 */
function renderGroups(groups) {

    var categoryTemplate = _.template($('#categoryTemplate').html());
    for(var key in groups) {
        console.log(key);
        $('#categories-wrapper').append(categoryTemplate({key:key,snippet:groups[key].html.join("")}));
    }
}

/**
 * Used for dynmaically create html inputs based on the service definitions
 * @param service
 * @returns {*}
 */
function renderServiceInput(service) {

    console.log(service.datatype);
    switch (service.datatype) {
        case 'string':
            var htmlStr =  stringTemplate({required:((service.required == true)?'required':''),code:service.code,description:service.description});
            return htmlStr;
        case 'number':
            var htmlStr =  numberTemplate({required:((service.required == true)?'required':''),code:service.code,description:service.description});
            return htmlStr;
        case 'datetime':
            var htmlStr =  datetimeTemplate({required:((service.required == true)?'required':''),code:service.code,description:service.description});
            return htmlStr;
        case 'singlevaluelist':
            var htmlStr =  singleValueListTemplate({required:((service.required == true)?'required':''),code:service.code,description:service.description,values:service.values});
            return htmlStr;
        case 'multivaluelist':
            var htmlStr =  multipleValueListTemplate({required:((service.required == true)?'required':''),code:service.code,description:service.description,values:service.values});
            return htmlStr;
        case 'text':
            var htmlStr =  textTemplate({required:((service.required == true)?'required':''),code:service.code,description:service.description});
            return htmlStr;
        default:
            console.warn('Invalid Datatype');
            return '';
    }
}

/**
 * Loads the Google map on form
 * @param position
 */
function loadMap(position) {
    console.log('test');
    console.log(position);
    var crosshairShape = {coords:[0,0,0,0],type:'rect'};
    var mapOptions = {
        center:new google.maps.LatLng(position.coords.latitude, position.coords.longitude), zoom:15,
        mapTypeId:google.maps.MapTypeId.ROADMAP,
        draggableCursor:'crosshair'
    };

    var map = new google.maps.Map(document.getElementById("gmap"),mapOptions);
    marker = new google.maps.Marker({
        map: map,
        icon: 'https://bloomington.in.gov/open311-proxy/js/cross-hairs.png',
        shape: crosshairShape
    });
    marker.bindTo('position', map, 'center');
}

/**
 * Main Function
 */
$(document).ready(function(){
    var groups = loadServices();
    var formTemplate = _.template($('#formTemplate').html());

    $('.container').on("click", "#map-button", function(){
        var geocoder = new google.maps.Geocoder;
        $('#lat').val(marker.getPosition().lat());
        $('#long').val(marker.getPosition().lng());
        var latlng = {lat: parseFloat(marker.getPosition().lat()), lng: parseFloat(marker.getPosition().lng())};
        console.log(latlng);
        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
                // console.log(results[0].formatted_address);
                $('#address_string').val(results[0].formatted_address);
            }
        });
    });
    $('.container').on("click", "li.service", function(event){

        var obj = JSON.parse(decodeURIComponent($(this).attr('data')));
        $.get(
            url+'?type=getServiceDefinition&service_code='+obj.service_code,
            function(servicesResponse) {
                console.log(servicesResponse);
                var services = JSON.parse(servicesResponse);

                var details = [];
                for(var i = 0;i<services.attributes.length;i++) {
                    details.push(renderServiceInput(services.attributes[i]));
                }
                $('.service').removeClass('active');
                $(event.target).addClass('active');
                $('.inlinepopup_content').find('.form-wrapper').empty();
                $('.inlinepopup_content').find('.form-wrapper').append(formTemplate({service_code:obj.service_code,service_name:obj.service_name,description:obj.description,details:details.join("")}));
                if (navigator.geolocation) {
                    console.log('Just');
                    navigator.geolocation.getCurrentPosition(loadMap,loadMap({coords:{latitude:39.14,longitude:-86.5}}));
                } else {
                    loadMap({coords:{latitude:39.1,longitude:-86.4}});
                }
                $('html, body').animate({
                    scrollTop: $("#request").offset().top
                }, 1000);

            }
        );
    });

    $('.container').on("click", "#formClose", function(){
        $('html, body').animate({
            scrollTop: $("#request").offset().top - 150
        }, 1000);
        $("#request").slideUp('slow',function () {
            $('.inlinepopup_content').find('.form-wrapper').empty();
            $('.inlinepopup_content').find('.form-wrapper').append('<p>Select a report to send to the City for action.</p>');
        });
    });
    $('.container').on("click", "#formSubmit", function(){
        console.log('Submit Form');

        $('.inlinepopup').block({message:'Please wait <i class="fas fa-spinner fa-spin"></i>',css:{border:'none'}});
        $('html, body').animate({
            scrollTop: $("#request").offset().top
        }, 1000);

        $.post( url+'?type=postRequest', $('form#request').serialize(), function(data) {
                var respose = JSON.parse(data)[0];
                console.log(respose);
                var message = "Your report regarding <strong>"+respose.service_name+"</strong> has been submitted successfully. Please have the ticket number <strong>"+respose.service_request_id+ "</strong> for follow-up."
                $("#request").slideUp(2000, function () {
                    $('.inlinepopup_content').find('.form-wrapper').empty();
                    $('.inlinepopup_content').find('.form-wrapper').append('<div class="alert alert-success" role="alert">'+message+'</div>');
                    $('.inlinepopup').unblock();
                });

            }
        );
    });
});
