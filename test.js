const baseURL = 'https://transport.tallinn.ee/gps.txt'
const fetch = require('node-fetch');
const loeRidu = require('readline');

async function otsiBussiKoordinaadid(bussinumber) {
    try {
        const response = await fetch(baseURL);
        const text = await response.text();
        const liinid = text.trim().split('\n').filter(liin => liin.trim() && !liin.startsWith('-'));

        let leitud = false;
        for (let line of liinid) {
            const fields = line.split(',');
            if (fields.length < 4) continue;

            const Buss = fields[1].trim();
            if (Buss === bussinumber) {
                const lat = parseFloat(fields[2].trim());
                const lon = parseFloat(fields[3].trim());

                    console.log('Esimese selle numbriga leitud bussi hetke koordinaadid on ', + lat, lon);
                    leitud = true;
                    break;
            }
        }

        if (!leitud) {
            console.log(`Bussi ${bussinumber} koordinaate ei leitud.`);
        }
    } catch (error) {
        console.log('Viga:', error.message);
    }
}

const loetudRead = loeRidu.createInterface({
    input: process.stdin,
    output: process.stdout
});

loetudRead.question('Sisesta bussinumber: ', (bussinumber) => {
    otsiBussiKoordinaadid(bussinumber);
    loetudRead.close();
});