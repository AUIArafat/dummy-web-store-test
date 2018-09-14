import { gateway as MoltinGateway } from '@moltin/sdk'

const Moltin = MoltinGateway({
  client_id: 'OU4YzqRrGL0nQU24jnCMswdXSLQH2wsR2qrFjquZYB',
  client_secret: 'f6UR0No979Eqrqv797qvrUlzeV7t4C8WJixvxg4RRr'
})

export default {

  getHomepageProducts () {
    console.log(Moltin.Products.Filter({}).All())
    return Moltin.Products.Filter({}).All()
  },

  findBySlug (slug) {
    return Moltin.Products.Filter({
      eq: {
        slug: slug
      }
    }).With(['main_image', 'brands']).Limit(1).All()
  },

  findByPrice (price) {
    console.log(Moltin.Products.Filter({}).All())
    return Moltin.Products.Filter({
      eq: {
        'price[0].amount': '2499'
      }
    }).All()
  },

  getCart () {
    return Moltin.Cart.Items()
  },

  addToCart (productId, qty) {
    return Moltin.Cart.AddProduct(productId, qty)
  },

  removeFromCart (itemId) {
    return Moltin.Cart.RemoveItem(itemId)
  },

  checkout (checkoutData) {
    return Moltin.Cart.Checkout(checkoutData)
  },

  pay (orderId, paymentData) {
    return Moltin.Orders.Payment(orderId, paymentData)
  }

}
