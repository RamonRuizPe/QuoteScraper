const cheerio = require('cheerio')
const request = require('request-promise')
const fs = require('fs-extra');
const { write } = require('fs');

const writeStream = fs.createWriteStream("quotes.csv");
writeStream.write('sep=|\n')


async function init(){
    const $ = await request({
        uri: 'http://quotes.toscrape.com/',
        transform: body => cheerio.load(body)
    })
    // console.log($)
    const websiteTitle = $('title');
    // console.log(websiteTitle.html());

    const websiteHeading = $('h1');
    // console.log(websiteHeading.text().trim())

    const quote = $('.quote').find('a');
    // console.log(quote.html())

    const third_quote = $('.quote').next().next();
    //console.log(third_quote.html())

    const containerClass = $('.row .col-md-8').parent().next(); //Se puede usar children
    // console.log(containerClass.html())

    /*const quotes = $('.quote span.text').each((i, el) =>{
        // console.log(i, $(el).html());
        const quote_text = $(el).text()
        const quote = quote_text.replace(/(^\“|\”$)/g,"");
        console.log(i, quote);
    })*/
    //console.log(quotes.html());
    writeStream.write('Quote|Author|Tags\n')
    $('.quote').each((i,el) => {
        const text = $(el).find('span.text').text().replace(/(^\“|\”$)/g,"")
        const author = $(el).find('span small.author').text()
        const tags = []
        const tag = $(el).find('.tags a.tag').each((i, el) => tags.push($(el).text()))
        // console.log(tags.join(','))
        writeStream.write(`${text}|${author}|${tags}\n`)
    })
}

init()

