import {createChart, updateChart} from "./scatterplot.js"
const nn = ml5.neuralNetwork({ task: 'regression', debug: true })
const fmt = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })
let trainData
let testData

//HTML
const result = document.getElementById("result");
const saveBtn = document.getElementById("save");
const predictBtn = document.getElementById("predict");

predictBtn.addEventListener("click", () => makePrediction())
saveBtn.addEventListener("click", () => save())

function loadData() {
        Papa.parse("./data/mobilephones.csv", {
                download: true,
                header: true,
                dynamicTyping: true,
                complete: results => checkData(results.data)
        })
}loadData()

function checkData(data) {
        data.sort(() => (Math.random() - 0.5))
        trainData = data.slice(0, Math.floor(data.length * 0.8))
        testData = data.slice(Math.floor(data.length * 0.8) + 1)
        console.table(data)

        for (let phone of data) {
                nn.addData({ cpu: phone.cpu, memory: phone.memory, storage:phone.storage }, { price: phone.price })
        }

// normalize
        nn.normalizeData()

        const chartdata = data.map(phone => ({
                x: phone.cpu,
                y: phone.price,
        }))

        createChart(chartdata, "CPU", "Price")

        nn.train({ epochs: 50 }, () => finishedTraining())
}

async function finishedTraining(){
        console.log("Finished training!")
}

async function makePrediction() {
        let ramInput = document.getElementById('ram').value;
        let cpuInput = document.getElementById('cpu').value;
        let storageInput = document.getElementById('storage').value;

        const results = await nn.predict({ cpu:parseInt(cpuInput), memory:parseInt(ramInput), storage:parseInt(storageInput) })
        result.innerText = `Predicted price: ${fmt.format(results[0].price)}`
}

function save() {
        nn.save()
}