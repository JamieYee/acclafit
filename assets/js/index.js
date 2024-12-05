document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver(() => {
    if (document.querySelector('.slick-list.draggable')) {
      console.log('元素动态加载后存在');
    }
  });

  // 开始观察
  observer.observe(document.body, { childList: true, subtree: true });
  // 读取 JSON 数据
  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      //修改最低价格
      const lowestPrice = Math.min(...products.map(product => product.price));
      document.querySelectorAll('.price-value').forEach(element => {
            element.textContent = '$' + lowestPrice;
        });
      // document.getElementById('price-value').textContent = '$' + lowestPrice; // 更新价格
      //获取所有.response - product 容器
      const containers = document.querySelectorAll('.response-product');
      // 遍历每个容器
      containers.forEach((container, index) => {
        // 根据容器属性确定布局类型
        const layoutType = container.dataset.category; // 使用 data-category 属性来区分布局类型
        // 获取当前存在的 slick 容器
        // const slickList = container.querySelector('.slick-list.draggable');
        // const slickTrack = slickList.querySelector('.slick-track');
        // 获取原有的 slick 配置
        const slickConfig = JSON.parse(container.dataset.slick);
        const responsiveConfig = JSON.parse(container.dataset.responsive);
        // 设置 prevArrow 和 nextArrow 配置为图片或 HTML
        const prevArrow = '<span class="fa fa-angle-left prev slick-arrow slick-disabled" aria-disabled="true" style="display: block;"></span>';
        const nextArrow = '<span class="fa fa-angle-right next slick-arrow" style="display: block;" aria-disabled="false"></span>';

        // 将 prevArrow 和 nextArrow 添加到配置中
        slickConfig.prevArrow = prevArrow;
        slickConfig.nextArrow = nextArrow;

        // 先销毁现有的 slick 实例（如果存在）
        if ($(container).hasClass('slick-initialized')) {
          $(container).slick('unslick');
        }
        // 清空容器，避免重复插入
        container.innerHTML = '';
        // 遍历产品数据，为每种布局生成不同结构
        products.forEach(product => {
          if (product.category.includes(layoutType)) {
            renderProduct(product, layoutType, container)
          }
        });
        // 重新初始化 slick 轮播
        if (typeof $ !== 'undefined' && $.fn.slick) {
          $(container)
            .removeClass('slick-initialized slick-slider')
            .slick({
              ...slickConfig,
              responsive: responsiveConfig,
            });
        }
        console.log(`容器 ${index + 1} 处理完成`);
      });
      // 调用该方法，传入包含按钮的容器选择器
      setupAddToCartButtons();
      // 加载另一个 JS 文件
      const script = document.createElement('script');
      script.src = 'assets/js/common.js'; // 替换为你的 JS 文件路径
      document.body.appendChild(script);
    })
    .catch(error => console.error('Error fetching product data:', error));
});

function renderProduct(product, layoutType, container) {
  // 检查是否符合当前 layoutType 的分类
  if (product.category.includes(layoutType)) {
    const productItem = document.createElement('div');
    if (layoutType === 'new') {
      productItem.classList.add(
        'product-item', 'recent-product', 'style-01', 'rows-space-0', 'post-93', 'product', 'type-product', 'status-publish', 'has-post-thumbnail',
        'product_cat-light', 'product_cat-table', 'product_cat-new-arrivals', 'product_tag-table', 'product_tag-sock', 'first', 'instock', 'shipping-taxable',
        'purchasable', 'product-type-simple'
      );
      productItem.innerHTML = `
          <div class="product-inner tooltip-left">
            <div class="product-thumb">
              <a class="thumb-link" href="single-product.html?product_id=${product.id}" tabindex="0">
                <img class="img-responsive" src="${product.images[0]}" alt="${product.name}" width="270" height="350">
              </a>
              <div class="flash">
                <span class="onnew"><span class="text">New</span></span>
              </div>
              <div class="group-button">
                <div class="add-to-cart">
                  <a href="cart.html" class="button product_type_simple add_to_cart_button" data-product-id="${product.id}">Add to cart</a>
                </div>
              </div>
            </div>
            <div class="product-info equal-elem">
              <h3 class="product-name product_title">
                <a href="single-product.html?product_id=${product.id}" tabindex="0">${product.name}</a>
              </h3>
              <div class="rating-wapper nostar">
                <div class="star-rating">
                  <span style="width:0%">Rated <strong class="rating">${product.rating}</strong> out of 5</span>
                </div>
              </div>
              <span class="price">
                <span class="rustrot-Price-amount amount">
                  <span class="rustrot-Price-currencySymbol">$</span>${product.price}
                </span>
              </span>
            </div>
          </div> `;
    } else if (layoutType === 'best') {
      productItem.classList.add(
        'product-item', 'best-selling', 'style-06', 'rows-space-30', 'post-25', 'product', 'type-product',
        'status-publish', 'has-post-thumbnail', 'product_cat-light', 'product_cat-chair', 'product_cat-specials',
        'product_tag-light', 'product_tag-sock', 'first', 'instock', 'sale', 'featured', 'shipping-taxable', 'purchasable', 'product-type-simple'
      );
      productItem.innerHTML = `     <div class="product-inner" style="display: flex;align-items: center;">
                        <div class="product-thumb" >
                            <a class="thumb-link" href="single-product.html?product_id=${product.id}" tabindex="-1">
                                <img class="img-responsive" src="${product.images[0]}" alt="${product.name}" width="90" height="90">
                            </a>
                        </div>
                        <div class="product-info">
                            <h3 class="product-name product_title">
                                <a href="single-product.html?product_id=${product.id}" tabindex="-1">${product.name}</a>
                            </h3>
                            <div class="rating-wapper nostar">
                                <div class="star-rating"><span style="width:0%">Rated <strong
                                    class="rating">0</strong> out of 5</span></div>
                                <span class="review">(0)</span></div>
                            <span class="price"><span
                                class="rustrot-Price-amount amount"><span
                                class="rustrot-Price-currencySymbol">$</span>${product.price}</span>
                            </span>
                        </div>
                    </div> `;
    } else if (layoutType === 'sale') {
      productItem.classList.add(
        'product-item', 'best-selling', 'style-06', 'rows-space-30', 'post-25', 'product', 'type-product',
        'status-publish', 'has-post-thumbnail', 'product_cat-light', 'product_cat-chair', 'product_cat-specials',
        'product_tag-light', 'product_tag-sock', 'first', 'instock', 'sale', 'featured', 'shipping-taxable', 'purchasable', 'product-type-simple'
      );
      productItem.innerHTML = `
                   <div class="product-inner" style="display: flex;align-items: center;">
                                     <div class="product-thumb" >
                                         <a class="thumb-link" href="single-product.html?product_id=${product.id}" tabindex="-1">
                                             <img class="img-responsive" src="${product.images[0]}" alt="${product.name}" width="90" height="90">
                                         </a>
                                     </div>
                                     <div class="product-info">
                                         <h3 class="product-name product_title">
                                             <a href="single-product.html?product_id=${product.id}" tabindex="-1">${product.name}</a>
                                         </h3>
                                         <div class="rating-wapper nostar">
                                             <div class="star-rating"><span style="width:0%">Rated <strong
                                                 class="rating">0</strong> out of 5</span></div>
                                             <span class="review">(0)</span></div>
                                         <span class="price"><span
                                             class="rustrot-Price-amount amount"><span
                                             class="rustrot-Price-currencySymbol">£</span>${product.price}</span>
                                         </span>
                                     </div>
                                </div>`;
    }
    // 插入到指定的容器
    container.appendChild(productItem);
  }
}

function setupAddToCartButtons() {
  const buttons = document.querySelectorAll('.add_to_cart_button');
  // 为每个按钮绑定点击事件
  buttons.forEach(button => {
    button.addEventListener('click', function (event) {
      // 阻止默认行为，防止页面跳转
      event.preventDefault();
      // 获取产品的 ID
      const productId = button.getAttribute('data-product-id');
      console.log(productId)
      if (!productId) {
        console.error('Product ID not found for button:', button);
        return;
      }
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
}

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