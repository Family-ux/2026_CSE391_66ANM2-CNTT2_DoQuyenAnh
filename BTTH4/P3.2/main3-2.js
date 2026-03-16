$(document).ready(function(){

let currentStep = 1;

function showStep(step){

    $(".step").hide();
    $("#step"+step).show();

    $("#step-number").text(step);

}
$("#next1").click(function(){

    showStep(2);

});

$("#back1").click(function(){

    showStep(1);

});

$("#next2").click(function(){

    const name = $("#fullname").val();
    const birthday = $("#birthday").val();
    const gender = $("input[name='gender']:checked").val();
    const email = $("#email").val();

    $("#cf-name").text(name);
    $("#cf-birthday").text(birthday);
    $("#cf-gender").text(gender);
    $("#cf-email").text(email);

    showStep(3);

});

$("#back2").click(function(){

    showStep(2);

});
});