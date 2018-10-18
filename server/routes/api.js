import express from 'express'
import { getTransactionById } from '../services/watcher'
const router = express.Router()
router.get('/transactions', (req, res) => {
  res.send(true)
})

router.get('/transaction/:id', async (req, res) => {
  try {
    const result = await getTransactionById(req.params.id)
    res.send(result.data)
  } catch (error) {
    console.log(error)
    res.status(500).send('Something is wrong internally.')
  }
})

router.get('/block', (req, res) => {
  res.send(true)
})

router.get('/blocks', (req, res) => {
  res.send(true)
})

router.get('/utxo', (req, res) => {
  res.send(true)
})

router.get('/utxos', (req, res) => {
  res.send(true)
})

export default router
