<template>
  <div>
     <div class="col-lg-12 col-sm-13">
        <h4>Price Range</h4>
        <a class="filters" v-for="price in prices" @click.prevent="setFilter(price)"> {{ price }}</a>
        <span class="filters" @click.stop="clearFilter">Clear</span>
    </div>
        <div class="ui items" v-for="product in products.data" :key="product.id">
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
              <div class="description">{{ product.relationships.categories }}</div>
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
      prices: ['Under $25', '$25 to $50', '$51 to $100', 'Over $100'],
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
        var formattedPrice = product.price[0].amount
        console.log(formattedPrice)
        return formattedPrice || price
      } catch (e) {
        return price
      }
    },
    clearFilter () {
      this.filterApplied = []
    },
    setFilter (filter) {
      this.filterApplied = []
      if (this.filterApplied.indexOf(filter) > -1) {
        this.filterApplied.pop(filter)
      } else {
        this.filterApplied.push(filter)
      }
      console.log(this.filterApplied)
      // MoltinService.findByPrice(2499).then((response) => {
      //  this.products = response
      //  console.log(this.products)
      // })
      this.products = this.products.filter(m => m.price[0].amount === 2499)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
