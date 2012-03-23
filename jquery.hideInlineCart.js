$(document).ready(function() {

  // EVERYTHING FOR THE CART
  var overlay = $("#cart_slide");
  var cartContainer = $("#slideout_inner");

  function cartOpen() {
    cartContainer.fadeIn("slow");
    overlay.addClass("overlay");
  }

  function cartClose() {
   cartContainer.fadeOut("medium");
   overlay.removeClass("overlay");
  }

  $(".cart_tab").click(function () {
      cartOpen();
    });

  $("#add-to-cart-msg").click(function () {
      cartOpen();
    });

 $("#cart_close").click(function () {
      cartClose();
    });

  // CLOSES EVERYTHING
  overlay.click(function () {
      shareClose();
      cartClose()
    });
});