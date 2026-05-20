const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";
        value = String(value).replace(/\D/g, "");
        value = Number(value) / 100;

        return signal + value.toLocaleString("pt-BR", {
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
        const amount = Utils.formatCurrency(transaction.amount * 100);

        return `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="category">${transaction.category}</td>
            <td class="date">${transaction.date}</td>
            <td style="text-align: center;">
            <td style="text-align: center; vertical-align: middle;">
                <!-- Ícone da lixeira  -->
                <i onclick="Transaction.remove(${index})" class="fa-solid fa-trash-can" style="cursor: pointer; color: #e92929; font-size: 1.1rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></i>
            </td>
        `;
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes() * 100);
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses() * 100);
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total() * 100);
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    }
};