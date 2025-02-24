// script.js
document.addEventListener("DOMContentLoaded", () => {
  // 读取 JSON 数据
  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      const container = document.querySelector('.products'); // 获取 ul.products

      products.forEach(product => {

        const currencySymbol = localStorage.getItem('selectedCurrency') || "$"; // 默认货币符号为美元
        // 根据 currencySymbol 修改价格
        let modifiedPrice = product.price;
        if (currencySymbol === "£") {
            modifiedPrice = 89.99;
        }
        // 根据 JSON 数据生成 HTML
        const productHTML = `
          <li class="product-item wow fadeInUp product-item rows-space-30 col-bg-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-ts-6 style-01 post-30 product type-product status-publish has-post-thumbnail product_cat-light product_cat-bed product_cat-specials product_tag-light product_tag-table product_tag-sock last instock featured downloadable shipping-taxable purchasable product-type-simple"
              data-wow-duration="1s" data-wow-delay="0ms" data-wow="fadeInUp">
            <div class="product-inner tooltip-left">
              <div class="product-thumb">
                 <a class="thumb-link" href="single-product.html?product_id=${product.id}">
                  <img class="img-responsive" src="${product.images[0]}" alt="${product.name}" width="600" height="778">
                </a>
                <div class="flash">
                  <span class="onnew"><span class="text">New</span></span>
                </div>
                <a href="#" class="button yith-wcqv-button" data-product_id="24">Quick View</a>
                <div class="group-button">
                  <a href="#" class="button yith-wcqv-button">Quick View</a>
                  <div class="add-to-cart">
                    <a href="cart.html" class="button product_type_simple add_to_cart_button" data-product-id="${product.id}">Add to cart</a>
                  </div>
                </div>
              </div>
              <div class="product-info equal-elem">
                <h3 class="product-name product_title">
                  <a href="${product.product_url}">${product.name}</a>
                </h3>
                <div class="rating-wapper nostar">
                  <div class="star-rating">
                    <span style="width:${product.rating * 20}%">Rated <strong class="rating">${product.rating}</strong> out of 5</span>
                  </div>
                  <span class="review">(${product.reviews})</span>
                </div>
                <span class="price"><span class="rustrot-Price-amount amount"><span
                    class="rustrot-Price-currencySymbol">$</span>${modifiedPrice}</span></span>
                <div class="rustrot-product-details__short-description">
                  <p>${product.description}</p>
                  <ul>
                    ${product.details.map(detail => `<li>${detail}</li>`).join('')}
                  </ul>
                </div>
              </div>
              <div class="group-button">
                <div class="group-button-inner">
                  <a href="#" class="button yith-wcqv-button">Quick View</a>
                  <div class="add-to-cart">
                    <a href="#" class="button product_type_variable add_to_cart_button">Select options</a>
                  </div>
                </div>
              </div>
            </div>
          </li>
        `;
        // 添加到容器中
        container.innerHTML += productHTML;
      });

      // 获取所有的 "Add to cart" 按钮
      const addToCartButtons = document.querySelectorAll('.add_to_cart_button');
      // 为每个按钮添加点击事件监听器
      addToCartButtons.forEach(button => {
        button.addEventListener('click', function (event) {
          // 阻止默认跳转行为（如果你想要手动处理）
          event.preventDefault();
          // 获取当前按钮的产品 ID
          const productId = this.getAttribute('data-product-id');
          // 显示产品 ID 或者其他相关操作
          console.log('Product ID:', productId);
          // 从 LocalStorage 中获取当前的 Map（如果有）
          let cartMap = JSON.parse(localStorage.getItem('cartMap')) || {};
          console.log(cartMap);
          // 更新 Map 数据
          cartMap[productId] = 1;
          // 保存回 LocalStorage
          localStorage.setItem('cartMap', JSON.stringify(cartMap));
          // 跳转到购物车页面
          window.location.href = "cart.html"; // 跳转到 cart.html 页面
        });
      });

      // 加载另一个 JS 文件
      const script = document.createElement('script');
      script.src = 'assets/js/common.js'; // 替换为你的 JS 文件路径
      document.body.appendChild(script);
    })
    .catch(error => console.error('Error loading products:', error));
});

// 重载多个脚本
function reloadScripts(scriptUrls) {
  scriptUrls.forEach(url => {
    // 查找当前页面中已加载的同名脚本
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) {
      existingScript.parentNode.removeChild(existingScript); // 移除旧的 script 标签
    }

    // 创建并加载新的 script 标签
    const script = document.createElement('script');
    script.src = url;

    // 你可以根据需要为每个脚本设置事件监听器
    script.onload = function () {
      console.log(`Script loaded: ${url}`);
    };

    script.onerror = function () {
      console.error(`Error loading script: ${url}`);
    };

    document.body.appendChild(script); // 将新的 script 标签添加到 head 中
  });
}
