// script.js
document.addEventListener("DOMContentLoaded", () => {

  // 读取 JSON 数据
  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      // 获取所有 .response-product 容器
      const containers = document.querySelectorAll('.response-product');
      // 遍历每个容器
      containers.forEach(container => {
        // 根据容器属性确定布局类型
        const layoutType = container.dataset.category; // 使用 data-category 属性来区分布局类型
        console.log(layoutType)
        // 清空容器，避免重复插入
        container.innerHTML = '';
        // 遍历产品数据，为每种布局生成不同结构
        products.forEach(product => {
          if(product.category.includes(layoutType)){
            renderProduct(product,layoutType,container)
          }
        });
      });

    })
    .catch(error => console.error('Error fetching product data:', error));
});


function renderProduct(product, layoutType, container) {
  // 检查是否符合当前 layoutType 的分类
  if (product.category.includes(layoutType)) {
    const productItem = document.createElement('div');
    if (layoutType === 'new') {
      productItem.classList.add('product-item', 'recent-product', 'style-01', 'rows-space-0');
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
                  <span class="rustrot-Price-currencySymbol">£</span>${product.price}
                </span>
              </span>
            </div>
          </div> `;
    } else if (layoutType === 'best') {
      productItem.classList.add('product-item', 'on_sale', 'style-06', 'rows-space-30');
      productItem.innerHTML = `     <div class="product-inner">
                        <div class="product-thumb">
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
                    </div> `;
    } else if (layoutType === 'sale') {
      // 创建产品卡片的 HTML 结构
      productItem.classList.add('product-item', 'on_sale', 'style-06', 'rows-space-30');
      productItem.innerHTML = `
                   <div class="product-inner">
                                     <div class="product-thumb">
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
