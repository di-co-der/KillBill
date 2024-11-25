class BillKillGraph{
    constructor(){
        this.adj = new Map();
    }
    addTransaction(person1, person2, amount){
       if(!this.adj.has(person1)){
            this.adj.set(person1, []);
       } 

       this.adj.get(person1).push([person2, amount]);
    }
    
    calculateBalances(){
        const balances = new Map();
        for(let [person, transactions] of this.adj){
            transactions.forEach(([otherPerson, amount]) => {
                if(!balances.has(person)) balances.set(person,0);
                if(!balances.has(otherPerson)) balances.set(otherPerson, 0);
            
                balances.set(person, balances.get(person) - amount)
                balances.set(otherPerson, balances.get(otherPerson) + amount)
                //person -> sub
                //otherPerson -> add
            });
        }
        return balances;
    }
    
    // balances : {
    //     r: -1500,
    //     s: 1400,
    //     m: 100
    // }

    getSettlements(){
        
        const settlements = [];
        const balances = this.calculateBalances();

        const payers = Array.from(balances).filter(([person, amount]) => amount< 0);
        const recievers = Array.from(balances).filter(([person, amount]) => amount > 0);

        payers.sort((a, b) => a[1] - b[1]);//ascending
        recievers.sort((a, b) => b[1] - a[1]);//descending

        while(payers.length > 0 && recievers.length > 0){

            const payer = payers[0];
            const reciever = recievers[0];
              
            const settlementAmount = Math.min(-payer[1], reciever[1])

            settlements.push(`${payer[0]} has to pay ${settlementAmount} to ${reciever[0]}`);

            payers[0][1] += settlementAmount;
            recievers[0][1] -= settlementAmount;
            
            if(payers[0][1] === 0){
                payers.shift();
            }

            if(recievers[0][1] === 0){
                recievers.shift();
            }
        }
        return settlements;
    }

    printAdj(){
        console.log(this.adj)
    }
}

const graph = new BillKillGraph();

// graph.addTransaction("rahul", "shubham", 1000);
// graph.addTransaction("rahul", "mohan", 500);
// graph.addTransaction("mohan", "shubham", 400);
graph.printAdj();

const finalSettlements = graph.getSettlements();

console.log(finalSettlements);

const payerInput = document.getElementById('payer')
const recieverInput = document.getElementById('reciever')
const amountInput = document.getElementById('amount')
const addTransactionButton = document.getElementById('add-transaction')
const transactionList = document.getElementById('transaction-list')
const settlementButton = document.getElementById("get-settlement");
const settlementList = document.getElementById("settlement-list");


addTransactionButton.addEventListener("click", ()=>{
    const payer = payerInput.value;
    const reciever = recieverInput.value;
    const amount = parseFloat(amountInput.value);

    if(payer && reciever && amount > 0 ){
    graph.addTransaction(payer, reciever, amount);

    const transactionItem = document.createElement('li');
    transactionItem.textContent = `${payer} owes ${reciever} : Rs.${amount}`
    transactionList.appendChild(transactionItem);

    payerInput.value = "";
    recieverInput.value = "";
    amountInput.value = "";
    }

})

settlementButton.addEventListener("click", () =>{
    const settlements = graph.getSettlements()

    settlements.forEach(settlement => {
        const settlementItem = document.createElement("li");
        settlementItem.textContent = settlement;
        settlementList.appendChild(settlementItem);
    })
})