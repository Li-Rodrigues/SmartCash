const Utils = {
    formatCurrency(value) {
        // 1. Identifica se o número é negativo para colocar o sinal de menos no texto
        const signal = Number(value) < 0 ? "-" : "";
        
        // 2. Pega o valor absoluto (transforma o número em positivo) e divide por 100
        let absoluteValue = Math.abs(Number(value)) / 100;

        // 3. Formata o "absoluteValue" (que já está corrigido) para moeda brasileira
        return signal + absoluteValue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }
};

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    // Ajuste 1: Agora recebe o index da transação
    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        DOM.transactionsContainer.appendChild(tr);
    },

    // Ajuste 2: Recebe o index e adiciona a tag <td> com o botão de remover
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";
        const amount = Utils.formatCurrency(transaction.amount);

        return `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="category">${transaction.category}</td>
            <td class="date">${transaction.date}</td>
            <td style="text-align: center; vertical-align: middle;">
                <!-- Ícone da lixeira  -->
                <i onclick="Transaction.remove(${index})" class="fa-solid fa-trash-can" style="cursor: pointer; color: #e92929; font-size: 1.1rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></i>
            </td>
        `;
    },

    // CÓDIGO NOVO (Corrigido e com o card dinâmico)
updateBalance() {
    // 1. Buscamos os valores que JÁ ESTÃO em centavos no script.js
    const income = Transaction.incomes();
    const expense = Transaction.expenses();
    const total = Transaction.total();

    // 2. Passamos direto para o Utils formatar
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(income);
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(expense);
    
    const totalDisplay = document.getElementById('totalDisplay');
    totalDisplay.innerHTML = Utils.formatCurrency(total);

    // 3. Dinamismo visual: Se o total for menor que 0 (negativo), muda a cor do card
    if (total < 0) {
        totalDisplay.parentElement.classList.add('negative');
    } else {
        totalDisplay.parentElement.classList.remove('negative');
    }
},

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    }
};