const promClient = require('prom-client');
const fs = require('fs')

var RAM = async function getRam(num){
    const data = fs.readFileSync('/proc/meminfo', 'utf8');
    return Number(data.split("\n")[num].match(/(\d+)/)[0]);
    /*fs.readFileSync('/proc/meminfo', 'utf8' , (err, data) => {
        if (err) {
        console.error(err)
        return
        }
        var temp = Number(data.split("\n")[num].match(/(\d+)/)[0]);
        console.log(typeof(temp), Number(temp));        
        return Number(data.split("\n")[num].match(/(\d+)/)[0]);
    })*/
}

const gauge = (register) => {
    const total = new promClient.Gauge({
        name: 'mongo_total',
        help: 'ram total mongo',
        labelNames: ['code'],
        buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    });

    setInterval(() => {
        RAM(0).then(val=>total.set(val));
    }, 100);

    register.registerMetric(total);

    const libre = new promClient.Gauge({
        name: 'mongo_libre',
        help: 'ram libre mongo',
        labelNames: ['code'],
        buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    });

    setInterval(() => {
        RAM(1).then(val=>libre.set(val));
    }, 100);

    register.registerMetric(libre);

    const disponible = new promClient.Gauge({
        name: 'mongo_disponible',
        help: 'ram disponible mongo',
        labelNames: ['code'],
        buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
    });

    setInterval(() => {
        RAM(2).then(val=>disponible.set(val));
    }, 100);

    register.registerMetric(disponible);
};

module.exports = { gauge };