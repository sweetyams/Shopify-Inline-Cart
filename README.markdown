# Shopify Inline Cart

This is a git repository for the files and way to setup an inline cart in Shopify. If you have any questions, send me an email at willemjames@me.com

well documented on Shopify Forums:
http://forums.shopify.com/categories/2/posts/67681

_____________________________________________________________________________________________________________

## 1. An add to cart button:

This is pretty standard (style it however you want):
    <input type="submit" name="add" id="add-to-cart" value="Add to Cart" />
  
_____________________________________________________________________________________________________________

## 2. inline-cart.liquid

put the file inline-cart.liquid in your snippets folder.

This will be called from your theme.liquid file like this: 
    {% include 'inline-cart' %} 

The cart-top and cart-bottom divs allow for the space between top and bottom of cart. Style to your hearts content.


_____________________________________________________________________________________________________________

## 3. cart_tab.html

Because the cart updates information all over the place, you need some way of telling it where to find those things to update. I have a little cart tab that shows the count and also has a checkout button. add the snippet in the file cart_tab.html into theme.liquid

On my product page, I also have a message that pops up when you add an item to the cart, asking if you want to see the cart or checkout.

This is made possibly by a placeholder div that gets content written into it!

    <div id="add-to-cart-msg"></div>

_____________________________________________________________________________________________________________

## 4. inlineCart.js

Add jquery.inlineCart.js to your assets folder, for me called like this in theme.liquid:

    {{ 'monolitho.js' | asset_url | script_tag }} 


_____________________________________________________________________________________________________________

## 5 . jquery.hideIinlineCart.js

This does the fancy hide/show stuff for the inline cart. (note that you need jquery for this!)