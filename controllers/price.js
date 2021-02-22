const priceRouter = require('express').Router()
const {auth} = require('../utils/middleware')
const puppeteer =  require('puppeteer'); 
const fs = require('fs-extra'); 
const hbs = require('handlebars'); 
const path = require('path'); 
const moment = require('moment');
const _ = require('lodash');

const complie = async function (tempName, data) {
  
  const filePath = path.join(process.cwd(), 'templates', `${tempName}.hbs`); 
  const html = await fs.readFile(filePath, 'utf-8'); 
  console.log(html);  
  return hbs.compile(html)(data)
}; 

hbs.registerHelper('dataFormat', (value, format) => {
  return moment(value).format(format);  
});   


priceRouter.get('/', auth, async (req, res, next) => {
  res.json({ success : 'GET Price'})
}); 

priceRouter.post('/', async (req, res, next) => {
  try {

    /* Body {
      priceDate: '2021-02-11',
      minPrice: '5',
      startPrice: '5',
      distance: '5',
      duration: '5',
      zone: '5',
      city: 'Helsinki',
      street: 'Myllykallionrinne 2D26',
      index: '',
      phone: '0443463077',
      phoneOpenOurs: '10-20',
      email: 'santari33@gmail.com',
      emailOpenOurs: '10-20',
      luggage: false,
      additional: { group: '5', services: [ 'specialLuggage', 'animal' ] }
    } */

    const browser = await puppeteer.launch({args: ['--no-sandbox']}); 
    const page = await browser.newPage(); 
    const priceObject = req.body; 

    if (_.isEmpty(req.body)){
      return res.status(400).json({ "error" : "JSON object is empty"}); 
    }
    
    console.log(priceObject); 
    const content = await complie('priceListYellow', priceObject); 
    await page.setContent(content); 
    await page.emulateMediaType('screen'); 
    await page.pdf({
      path : 'mypdf.pdf', 
      format : 'A4', 
      printBackground : true 
    })
    console.log('done')
    await browser.close() 
    
    res.json({ success : 'POST price 3'})
  } catch (err){
    console.log(err)
  }
})

priceRouter.put('/', async (req, res, next) => {
  res.json({ success : 'PUT Price'})
})
priceRouter.delete('/', async (req, res, next) => {
  res.json({ success : 'DELETE Price'})
})


module.exports = priceRouter
