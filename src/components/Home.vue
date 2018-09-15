<template>
  <div>
    <div class="col-lg-12 col-sm-13">
      <h4>Price Range:</h4>
      <a class="filters" @click.prevent="setFilter(0,2500)" style="cursor:pointer"> Under £25 </a> |
      <a class="filters"  @click.prevent="setFilter(2501,5000)" style="cursor:pointer"> £25 to £50 </a> |
      <a class="filters"  @click.prevent="setFilter(5001,10000)" style="cursor:pointer"> £51 to £100 </a> |
      <a class="filters"  @click.prevent="setFilter(10000, 1000000)" style="cursor:pointer"> Over £100 </a> |
      <span class="filters" @click.prevent="setFilter(0, 1000000)" style="cursor:pointer">All</span>
    </div>
      <div class="col-lg-12 col-sm-13">
      <h4>Stock Availability:</h4>
      <a class="filters" @click.prevent="setFilterByStock('in-stock')" style="cursor:pointer"> In Stock</a> |
      <a class="filters"  @click.prevent="setFilterByStock('out-stock')" style="cursor:pointer"> Out Stock </a> |
      <span class="filters" @click.prevent="setFilterByStock('all')" style="cursor:pointer">All</span>
    </div>
    
    <div class="ui items" v-for="product in this.products.data" :key="product.id">
      <div class="item">
        <router-link :to="'/products/' + product.slug" class="ui small image">
          <img :src="getProductThumb(product)" alt="">
        </router-link>
        <div class="content">
          <router-link :to="'/products/' + product.slug" class="header">
            {{ product.name }}
          </router-link>
          <div class="meta">{{ getProductPrice(product) }}</div>
          <div class="description">{{ product.sku }}</div>
          <div class="description">{{ product.meta.stock.availability}} ({{product.meta.stock.level}})</div>
          <div class="description">{{ getCategoryName(product) }}</div>
          <div class="description">{{ product.unit_price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import MoltinService from '../services/moltin.js'
  
  export default {
    name: 'home',
    data () {
      return {
        products: {},
        tempProducts:{},
        prices: ['Under £25', '£25 to £50', '£51 to £100', 'Over £100'],
        filterApplied: [],
        highprice: 300
      }
    },
    beforeMount () {
      MoltinService.getHomepageProducts().then((response) => {
        this.products = response
        console.log(this.products + this.products.length)
      })
    },
    methods: {
      getProductThumb: function (product) {
        console.log(product)
        var placeholder = 'https://placeholdit.imgix.net/~text?txtsize=69&txt=824%C3%971050&w=824&h=1050'
        try {
          var fileId = product.relationships.files.data[1].id
          console.log(fileId)
          var imgSrc = 'https://s3-eu-west-1.amazonaws.com/bkt-svc-files-cmty-api-moltin-com/ef4e860a-1d01-4e5c-a6a8-427cfa48a668/' + fileId + '.jpg'
          return imgSrc || placeholder
        } catch (e) {
          return placeholder
        }
      },
      getProductPrice: function (product) {
        var price = ''
        try {
          var formattedPrice = product.meta.display_price.with_tax.formatted
          console.log(formattedPrice)
          return formattedPrice || price
        } catch (e) {
          return price
        }
      },
      clearFilter () {
        this.filterApplied = []
      },
      setFilter (firstRange, lastRange) { 
        MoltinService.getHomepageProducts().then((response) => {
          this.tempProducts = response
          console.log(this.products + this.products.length)
        })
        console.log(Object.keys(this.tempProducts ).length +  " tempPro");
        if(Object.keys(this.tempProducts ).length!= 0 ){
          this.products = this.tempProducts
        }
        var items  = this.products;
	      var list = [];
        console.log(items)
				var result = Object.keys(items.data).map(function(key) {
          try{
            console.log(items.data[key].meta + " " + key)
        		if (items.data[key].meta.display_price.with_tax.amount >= firstRange && items.data[key].meta.display_price.with_tax.amount <= lastRange) list.push(items.data[key])
          } catch(e){

          }
    			});   
          this.products.data = list 			
    			console.log(this.products.data)
      },
      setFilterByStock (stockAvailability) {
        MoltinService.getHomepageProducts().then((response) => {
          this.tempProducts = response
          console.log(this.products + this.products.length)
        })
        console.log(Object.keys(this.tempProducts ).length +  " tempPro");
        if(Object.keys(this.tempProducts ).length!= 0 ){
          this.products = this.tempProducts
        }
        var items  = this.products;
	      var list = [];
        console.log(items)
				var result = Object.keys(items.data).map(function(key) {
          try{
            console.log(items.data[key].meta + " " + key)
            if (stockAvailability === 'all') {
              list.push(items.data[key])
            }
        		else if (items.data[key].meta.stock.availability === stockAvailability) list.push(items.data[key])
          } catch(e){

          }
    			});   
          this.products.data = list 			
    			console.log(this.products.data)
      },
      getCategoryName (product) {
        var category = ''
        try {
          var categories = {};
          console.log(product.relationships.categories.data[0].id)
          MoltinService.getCategoryById(product.relationships.categories.data[0].id).then((response) => {
          this.categories = response
          console.log(this.categories.data.name)
        })
          return this.categories.data.name || category
        } catch (e) {
          return category
        }
      }
      
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
