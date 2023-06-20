const express = require('express')
const moment = require('moment')

const app = express()
const port = 3000

app.use(express.json())

let equipment = []
let equipment_state = []
let orders = []
let equipment_assigned_orders = []
const createMockData = () => {
  equipment = [
    {
      id: 87645,
      location: 'BLL'
    },
    {
      id: 35473,
      location: 'BLL'
    },
    {
      id: 19374,
      location: 'BLL'
    },
    {
      id: 18566,
      location: 'BLL'
    }
  ]

  equipment.forEach((e, i) => {
    equipment_state.push({
      id: i,
      equipment_id: e.id,
      state: 'RED',
      updated_at: moment().toString()
    })
  });

  orders = [
    {
      id: 100,
      order_name: '2x4 red brick'
    },
    {
      id: 200,
      order_name: '2x2 yellow brick'
    },
    {
      id: 300,
      order_name: 'green baseplate'
    },
    {
      id: 400,
      order_name: 'grey baseplate'
    },
  ]

  // assign random order to each equipment
  equipment_state.forEach((e, i) => {
    equipment_assigned_orders.push({
      id: i,
      equipment_id: e.equipment_id,
      order: orders[Math.floor(Math.random() * 3)],
      created_at: moment().toString(),
      state: e.state
    })
  })
}

createMockData();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/equipment-state', (req, res) => {
  res.send(equipment_state)
})

// get equipment state
app.get('/equipment-state/:id', (req, res) => {
  res.send(equipment_assigned_orders.find(e => e.equipment_id = req.params.id))
})

// update equipment state
app.post('/equipment-state/:id', (req, res) => {
  // in the equipment state table
  index = equipment_state.findIndex(e => e.equipment_id = req.params.id)
  equipment_state[index].state = req.body.new_state

  // in the order table
  orderIndex = equipment_assigned_orders.findIndex(o => o.equipment_id = req.params.id)
  equipment_assigned_orders[index].state = req.body.new_state

  res.send(equipment_assigned_orders[index])
})

app.get('/order', (req, res) => {
  res.send(equipment_assigned_orders)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})