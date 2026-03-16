function showError(id, message) {
    $(`#${id}`).addClass('invalid').removeClass('valid');
    $(`#${id}-error`).text(message);
}

function clearError(id) {
    $(`#${id}`).removeClass('invalid').addClass('valid');
    $(`#${id}-error`).text("");
}
function validateFullname() {
    const val = $("#fullname").val().trim();
    const regex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (val === "") { showError("fullname", "Không được để trống"); return false; }
    if (val.length < 3) { showError("fullname", "Phải từ 3 ký tự trở lên"); return false; }
    if (!regex.test(val)) { showError("fullname", "Chỉ chứa chữ cái và khoảng trắng"); return false; }
    clearError("fullname");
    return true;
}

function validateEmail() {
    const val = $("#email").val().trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) { showError("email", "Email không đúng định dạng"); return false; }
    clearError("email");
    return true;
}

function validatePassword() {
    const val = $("#password").val();
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regex.test(val)) {
        showError("password", "Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số");
        return false;
    }
    clearError("password");
    return true;
}

function validateConfirm() {
    if ($("#confirmPassword").val() !== $("#password").val()) {
        showError("confirmPassword", "Mật khẩu không khớp");
        return false;
    }
    clearError("confirmPassword");
    return true;
}
$(document).ready(function() {
    
    $("#fullname").blur(validateFullname);
    $("#email").blur(validateEmail);
    $("#password").blur(validatePassword);
    $("#confirmPassword").blur(validateConfirm);

    
    $("input").on("input", function() {
        const id = $(this).attr("id");
        if (id) clearError(id);
    });

    
    $("#registerForm").submit(function(e) {
        e.preventDefault();

     
        const isNameValid = validateFullname();
        const isEmailValid = validateEmail();
        const isPassValid = validatePassword();
        const isConfirmValid = validateConfirm();
        
      
        const isGenderValid = $('input[name="gender"]:checked').length > 0;
        if (!isGenderValid) $("#gender-error").text("Vui lòng chọn giới tính");
        
        const isTermsValid = $("#terms").is(":checked");
        if (!isTermsValid) $("#terms-error").text("Bạn cần đồng ý điều khoản");

       
        if (isNameValid && isEmailValid && isPassValid && isConfirmValid && isGenderValid && isTermsValid) {
            $("#registerForm").hide();
            $("#successMsg").html(`<h3>Đăng ký thành công! 🎉</h3><p>Chào mừng ${$("#fullname").val()}</p>`).show();
        }
    });
    $("#password").on("input", checkPasswordStrength);
    $("#fullname").on("input", function(){

    const length = $(this).val().length;

    $("#fullname-count").text(length + "/50");

    if(length > 50){
        $("#fullname-count").css("color","red");
    }else{
        $("#fullname-count").css("color","black");
    }

});
});
function checkPasswordStrength(){

    const pass = $("#password").val();
    let strength = 0;

    if(pass.length >= 6) strength++;
    if(/[A-Z]/.test(pass)) strength++;
    if(/[0-9]/.test(pass)) strength++;
    if(/[^A-Za-z0-9]/.test(pass)) strength++;

    if(strength <= 1){
        $("#strength-bar").css("width","30%").css("background","red");
        $("#strength-text").text("Yếu");
    }
    else if(strength <= 3){
        $("#strength-bar").css("width","60%").css("background","orange");
        $("#strength-text").text("Trung bình");
    }
    else{
        $("#strength-bar").css("width","100%").css("background","green");
        $("#strength-text").text("Mạnh");
    }
}