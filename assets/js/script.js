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

    // Nova função de Validação
    validateFields() {
        // Remove os espaços em branco dos valores atuais (.trim())
        const description = Form.description.value.trim();
        const amount = Form.amount.value.trim();
        const category = Form.category.value;

        // Se qualquer um dos campos estiver vazio, lança um erro
        if (description === "" || amount === "" || category === "") {
            throw new Error("Por favor, preencha todos os campos antes de salvar.");
        }
    },

    handleSave(event) {
        // 1. Desafio: Não deixar a página recarregar
        event.preventDefault();

        // Usamos o bloco try/catch para capturar o erro se a validação falhar
        try {
            // 2. Valida os campos antes de continuar
            Form.validateFields();

            // Transforma o input (ex: 10.50) em centavos inteiros (1050) para evitar bugs matemáticos do JS
            const amountInCents = Math.round(Number(Form.amount.value) * 100);

        // 3. Criar o objeto com os dados capturados
        const newTransaction = {
            description: Form.description.value,
            amount: amountInCents, // Salva o valor em centavos (ex: se digitou 60, salva 6000)
            category: Form.category.value,
            date: new Date().toLocaleDateString('pt-BR')
        };

        // 4. Salvar no array
        Transaction.add(newTransaction);

        // 5. Limpar o formulário para a próxima entrada
        event.target.reset();

        } catch (error) {
            // Se a validação falhar, vai mostrar um alerta com a mensagem do erro
            alert(error.message);
        }
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

// Listener dinâmico para dar feedback visual no input de valor (input vai mudar de cor)
Form.amount.addEventListener('input', (e) => {
    const value = Number(e.target.value);
    if (value < 0) {
        e.target.style.borderColor = 'var(--red)';
        e.target.style.color = 'var(--red)';
    } else if (value > 0) {
        e.target.style.borderColor = 'var(--green)';
        e.target.style.color = 'var(--green)';
    } else {
        e.target.style.borderColor = '#e2e8f0';
        e.target.style.color = 'inherit';
    }
});