const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 4000
const data = require('./public/jsons/restaurant.json').results

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
// 加載static資源
app.use(express.static('public'))

app.get('/', (req, res) => {
  //index.hbs 定義傳入的data名稱
  res.render('index', { data })
})

app.get('/search', (req, res) => {
  const search = req.query.search?.trim()
  console.log(search)
  const filter = search
    ? data.filter((data) =>
        //some回傳是布林值 所以外層在加{}會讓filter函式錯誤沒有拿到值
        //=>錯誤
        // {<---這裡加大括號 Object.values(data).some((property) => {
        //     if (typeof property === 'string') {
        //       return property.toLowerCase().includes(search.toLowerCase())
        //     }
        //     return false
        //   })
        // }<---這裡加大括號)
        Object.values(data).some((property) => {
          if (typeof property === 'string') {
            return property.toLowerCase().includes(search.toLowerCase())
          }
          return false
        })
      )
    : data
  //把filter 給data傳入
  res.render('index', { data: filter, search })
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const restaurants = data.find((data) => data.id.toString() === id)
  console.log(restaurants)
  //把restaurants給 data傳入
  res.render('show', { data: restaurants })
})

app.listen(port, () => {
  console.log(`APP is running on http://127.0.0.1:${port}`)
})
