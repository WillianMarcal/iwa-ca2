import express from 'express'
import connectDB from './config/db.js'
import  Product from './models/productModel.js'
import dotenv from 'dotenv'
import cors from 'cors'
import {products} from './data/products.js'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url'


dotenv.config()

connectDB()

const app = express()

app.use(express.json())

app.use(cors())


app.get('/api/products', async (req, res) => {
  const products = await Product.find({})

  res.json(products)
})

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

app.post('/api/products', async (req, res)=>{
  // products.push(req.body)
  const product = new Product(
    {
    name: req.body.name,
    price: req.body.price,
    // _id: req.body._id,
    image: req.body.image,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    numReviews: 0,
    description: req.body.description,
  }
  )

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

app.delete('/api/products/:id', async (req, res)=>{
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})


const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '/frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}


const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
)
