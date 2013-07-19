/*
 * MONOLITHO CUSTOM OVERLAY CART
 * Developed by Willem Shepherd, 2012 for Monolitho, a Shopify Theme 
 * tread lightly, this code is fragile!
 */

$('#add-to-cart').bind( 'click', addToCart );

function addToCart(e){
  if (typeof e !== 'undefined') e.preventDefault();
  
  var id        = $(this).parents('form').find('[name="id"]').val();
  var quantity  = $(this).parents('form').find('[name="quantity"]').val() || 1;

  $.ajax({ 
    type: 'POST',
    url: '/cart/add.js',
    async: false, 
    cache: false, 
    data: 'quantity=' + quantity + '&id=' + id,
    dataType: 'json',
    error: addToCartFail,
    success: updateCartaddNote,
    cache: false 
  });
}

function updateCartaddNote(note, callback) {
  $.ajax({ 
    type: 'POST',
    url: '/cart/update.js',
    data: 'note=' + attributeToString(note),
    dataType: 'json',
    success: thisGetUpdatedCart,
    error: function(XMLHttpRequest, textStatus) {
    Shopify.onError(XMLHttpRequest, textStatus);
    }
  });

  // add alert when item added to cart.
  $('#add-to-cart-msg').html('<h4>Item added to cart! <br /><a title="view cart"><span>View cart and checkout &raquo;</span></a></h4>').fadeIn();  
}

//REMOVING AN ITEM (the X after an item)
function removecartitem(id) {
  var cart_line_item = (id);

  $.ajax({ 
    type: 'POST',
    url: '/cart/change.js',
    data:  'quantity=0&line='+cart_line_item,
    async: false, 
    cache: false, 
    dataType: 'json',
    success: thisGetUpdatedCart,
    error: addToCartFail
  });

  // add alert when item added to cart.
  // add alert when item removed.
  $('#remove-from-cart-msg').html('Item removed from cart!').fadeIn();   
}

function addToCartFail(jqXHR, textStatus, errorThrown){
  var response = $.parseJSON(jqXHR.responseText);
  // console.error('PROBLEM ADDING TO CART!', response.description);  
  $('#add-to-cart-msg').addClass('error').text(response.description);
}

// Get the cart associated with the cart-info div (id)
function thisGetUpdatedCart(cart) {
  changeUpdatedCart(cart, 'cart-info');   
}

// Do all the fancy stuff.
function changeUpdatedCart(cart, cart_summary_id, cart_count_id) {
  if ((typeof cart_summary_id) === 'string') {
    var cart_summary = ('#' + cart_summary_id);
    if (cart_summary.length) {  
      // Empty Entire cart-info div so that the we are not creating 2 carts/duplicate info.
      $(cart_summary).empty();      
      
      // Add a table and Tbody to attach stuff to.
      $("<table class=addedcart><tbody id='updating_cart'></tbody></table>").appendTo(cart_summary);
    
      $.each(cart, function(key, value) {

        if (key === 'items') {
          var uc = $('#' + cart_summary_id + ' #updating_cart');
              
          // Creates the entire table using the new item information that has been updated!
          // If you want to add a column, test it in inline-cart.liquid FIRST, then write it into the line below

          if (value.length) {
            $.each(value, function(i, item) {           
            var getitem_price = (item.price);
            var monetizeitemprice = Shopify.formatMoney(getitem_price, '${{amount}}')

            //finds image, creates url, cartfinalimage used instead of item.image later in the table
            var imageurl = (item.image);
            var varsize = ('small');
            var matches = imageurl.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
            var cartfinalimage =  (matches[1] + '_' + varsize + '.' + matches[2]);
            var line_item = i+1;

            $("<tr id='product-" + item.id + "' class='"+item.handle + " item'><td id='invisible' class='cart_amount'> <input class='text' type='text' size='4' name='updates"+line_item+"' id='updates_"+line_item+"' value='"+ item.quantity +"' onfocus='this.select();' class='replace' /> </td><td class='cart_image'><a href='"+ item.url +"'><img class='cartimage' src='"+ cartfinalimage +"'  alt='"+ item.title +"' /></a></td><td class='cart_title'> <a href='"+item.url +"'>"+ item.title +"</a></td><td class='cart_itemprice'><span class='quantity'>"+ item.quantity +"</span> x "+ monetizeitemprice +"</td><td class ='cart_remove'><a onClick='removecartitem("+ line_item +"); return false;'>remove</a></td></tr>").appendTo(uc);


            });
          } else {
            //Returns error if something went wrong.
            $('<li><em>The cart is empty.</em></li>');
          }
        } else {
          //This stuff is the extra informaton that is grabbed from items.
          //remove the comment tags to see what it does!
          /*  $('<dt>' + key + '</dt><dd>' + value + '</dd>').appendTo(cart_summary); */
        }
      });     
    }
  }

  // Update Cart Total Money in Cart and converts it to money format   
  var $cartTotalAmoutFooter = $('.cart_total span:first');
  var getTotalPrice = (cart.total_price);
  var monetizeTotalPrice = Shopify.formatMoney(getTotalPrice, '${{amount}}')

  switch(cart.total_price){
    default:
      $cartTotalAmoutFooter.text (monetizeTotalPrice);
    break;
  }

  // Update Cart Total Count in Cart Title and Side Tab
  var $cartLinkText = $('.cart-link .icon:first');
  var $carttopTotal = $('#cart-title .items:first');

  if (cart.item_count === 0) { 
    $carttopTotal.html('0 items'); 
    $cartLinkText.html('0 items'); 
  } else if (cart.item_count === 1) {
    $carttopTotal.html('1 item');
    $cartLinkText.html('1 item'); 
  } else {
    $carttopTotal.html(cart.item_count+' items');
    $cartLinkText.html(cart.item_count+' items');
  }  
  // Hides he pluralizer (item/items) in the inline carts title
  $('.itemshide').hide();
}
