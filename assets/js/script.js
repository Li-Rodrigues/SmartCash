// Persistência (STORAGE)
const TransactionStorage = {
    // Busca os dados salvos. Se não houver nada, retorna um array vazio []
    get() {
        return JSON.parse(localStorage.getItem("smartcash:transactions")) || [];
    },

    // Transforma o array em texto e salva no navegador
    set(transactions) {
        localStorage.setItem("smartcash:transactions", JSON.stringify(transactions));
    }
};

// Objeto que armazena as transações (Estado da aplicação)
const Transaction = {
    all: TransactionStorage.get(), // Modificação 1 - o array começa com o que está guardado no Storage

    add(transaction) {
        Transaction.all.push(transaction);
        App.reload();
    },

    // NOVA FUNÇÃO: Função de Remoção
    remove(index) {
        // Remove um (1) item a partir da posição 'index'
        Transaction.all.splice(index, 1);
        
        // Recarrega o App para redesenhar a tabela e atualizar os saldos
        App.reload();
    },    

    incomes() {
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) income += transaction.amount;
        });
        return income;
    },

    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) expense += transaction.amount;
        });
        return expense;
    },

    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
};

// Objeto que cuida do formulário
const Form = {
    description: document.querySelector('#description'),
    amount: document.querySelector('#amount'),
    category: document.querySelector('#category'),

    handleSave(event) {
        // 1. Desafio: Não deixar a página recarregar
        event.preventDefault();

        // 2. Criar o objeto com os dados capturados
        const newTransaction = {
            description: Form.description.value,
            amount: Number (Form.amount.value),
            category: Form.category.value,
            date: new Date().toLocaleDateString('pt-BR')
        };

        // 3. Salvar no array
        Transaction.add(newTransaction);

        // 4. Limpar o formulário para a próxima entrada
        event.target.reset();
    }
};

const App = {
    init() {
        // Modificação 3 - Veio o index aqui também - DOM saber a linha 
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index);
        });

        DOM.updateBalance();

        // Modificação 4 - Toda vez que o App inicia ou atualiza, precisará atualizar o Storage
        TransactionStorage.set(Transaction.all);
    },
    reload() {
        DOM.clearTransactions();
        App.init();
    }
};

// Escutar o evento de 'submit' (enviar) do formulário
document.querySelector('#form').addEventListener('submit', Form.handleSave);
App.init();