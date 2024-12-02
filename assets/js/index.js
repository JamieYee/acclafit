// script.js
document.addEventListener("DOMContentLoaded", () => {
  // 读取 JSON 数据
  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      const container = document.querySelector('.products'); // 获取 ul.products

      products.forEach(product => {
        // 创建产品卡片的 HTML 结构
        const productHTML = `
        <div class="product-item recent-product style-01 rows-space-0 post-93 product type-product status-publish has-post-thumbnail product_cat-light product_cat-table product_cat-new-arrivals product_tag-table product_tag-sock first instock shipping-taxable purchasable product-type-simple  ">
          <div class="product-inner tooltip-left">
            <div class="product-thumb">
              <a class="thumb-link" href="${product.link}" tabindex="-1">
                <img class="img-responsive" src="${product.images[0]}" alt="${product.name}" width="270" height="350">
              </a>
              ${product.new ? `<div class="flash"><span class="onnew"><span class="text">New</span></span></div>` : ''}
              <div class="group-button">
                <div class="yith-wcwl-add-to-wishlist">
                  <div class="yith-wcwl-add-button show">
                    <a href="wishlist.html" class="add_to_wishlist">Add to Wishlist</a>
                  </div>
                </div>
                <div class="rustrot product compare-button">
                  <a href="compare.html" class="compare button">Compare</a>
                </div>
                <a href="#" class="button yith-wcqv-button">Quick View</a>
                <div class="add-to-cart">
                  <a href="cart.html" class="button product_type_simple add_to_cart_button">Add to Cart</a>
                </div>
              </div>
            </div>
            <div class="product-info equal-elem">
              <h3 class="product-name product_title">
                <a href="${product.link}" tabindex="-1">${product.name}</a>
              </h3>
              <div class="rating-wapper">
                <div class="star-rating">
                  <span style="width:${(product.rating / 5) * 100}%">Rated 
                  <strong class="rating">${product.rating}</strong> out of 5</span>
                </div>
                <span class="review">(${product.reviews})</span>
              </div>
              <span class="price">${product.price}</span>
            </div>
          </div>
        </div>
      `;

        // 将生成的 HTML 插入到容器中
        container.innerHTML += productHTML;
        // 加载另一个 JS 文件
        const script = document.createElement('script');
        script.src = 'assets/js/jquery-1.12.4.min.js'; // 替换为你的 JS 文件路径
        document.body.appendChild(script);
      });
    })
    .catch(error => console.error('Error fetching product data:', error));

});
