const nn = ml5.neuralNetwork({ task: 'regression', debug: true })
nn.load('./model/model.json', modelLoaded)
const fmt = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })


//HTML
const result = document.getElementById("result");
const predictBtn = document.getElementById("predict");
result.innerText = `...`

predictBtn.addEventListener("click", () => makePrediction())

function modelLoaded() {
    console.log('done')
    result.innerText = `Ready to predict`
}

async function makePrediction() {
    console.log('making prediciton')
    let ramInput = document.getElementById('ram').value;
    let cpuInput = document.getElementById('cpu').value;
    let storageInput = document.getElementById('storage').value;

    const results = await nn.predict({ cpu:parseInt(cpuInput), memory:parseInt(ramInput), storage:parseInt(storageInput) })
    result.innerText = `I think the price is ${fmt.format(results[0].price)} `
}