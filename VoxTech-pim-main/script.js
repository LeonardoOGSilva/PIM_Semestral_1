// script.js
// Controla as interações de interface do VoxTech, incluindo carrossel, galeria,
// carrinho, frete, busca, tamanho de fonte, leitor de tela e seleção de pagamento.

// Aguarda o HTML carregar completamente antes de ligar os event handlers
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // LÓGICA DO CARROSSEL (HOME)
    // ==========================================
    const carouselSlide = document.querySelector('.carousel-slide');
    const carouselImages = document.querySelectorAll('.carousel-image');
    const prevBtn = document.querySelector('#prevBtn');
    const nextBtn = document.querySelector('#nextBtn');
    const dots = document.querySelectorAll('.dot');

    if (carouselSlide && carouselImages.length > 0) {
        let currentIndex = 0;
        const totalImages = carouselImages.length;

        function updateCarousel() {
            const displacement = -100 * currentIndex;
            carouselSlide.style.transform = `translateX(${displacement}%)`;
            
            dots.forEach(dot => dot.classList.remove('active'));
            if(dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        }

        function nextImage() {
            currentIndex++;
            if (currentIndex >= totalImages) currentIndex = 0;
            updateCarousel();
        }

        function prevImage() {
            currentIndex--;
            if (currentIndex < 0) currentIndex = totalImages - 1;
            updateCarousel();
        }

        nextBtn.addEventListener('click', nextImage);
        prevBtn.addEventListener('click', prevImage);
        setInterval(nextImage, 5000);
    }

    // ==========================================
    // LÓGICA DA GALERIA DE FOTOS (PRODUTO)
    // ==========================================
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(function(thumbnail) {
            thumbnail.addEventListener('click', function() {
                mainImage.src = this.src;
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // ==========================================
    // LÓGICA DE QUANTIDADE (CARRINHO)
    // ==========================================
    const btnMinus = document.getElementById('minus');
    const btnPlus = document.getElementById('plus');
    const qtyInput = document.getElementById('qty-input');

    if (btnMinus && btnPlus && qtyInput) {
        btnMinus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            if (val > 1) qtyInput.value = val - 1;
        });

        btnPlus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            qtyInput.value = val + 1;
        });
    }

    // ==========================================
    // LÓGICA DE CÁLCULO DE FRETE (VIACEP API)
    // ==========================================
    const btnFrete = document.querySelector('.shipping-search-btn') || document.querySelector('.btn-pesquisa-cep');
    const inputCep = document.querySelector('.cep-input') || document.querySelector('.shipping-bar input');
    const divResultado = document.querySelector('.frete-resultado');

    if (btnFrete && inputCep && divResultado) {
        btnFrete.addEventListener('click', () => {
            let cep = inputCep.value.replace(/\D/g, '');

            if (cep.length !== 8) {
                divResultado.style.display = 'block';
                divResultado.style.color = '#e63946'; 
                divResultado.innerHTML = '<i class="fas fa-exclamation-circle"></i> CEP inválido. Digite 8 números.';
                return;
            }

            divResultado.style.display = 'block';
            divResultado.style.color = 'var(--text-main)'; 
            divResultado.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculando frete...';

            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(dados => {
                    if (dados.erro) {
                        divResultado.style.color = '#e63946';
                        divResultado.innerHTML = '<i class="fas fa-times-circle"></i> CEP não encontrado.';
                    } else {
                        let valorFrete = dados.uf === 'SP' ? "R$ 12,90" : "R$ 25,90";
                        let prazo = dados.uf === 'SP' ? "1 a 2 dias úteis" : "5 a 7 dias úteis";

                        divResultado.style.color = '#4caf50'; 
                        divResultado.innerHTML = `
                            <strong>Frete para:</strong> ${dados.localidade} - ${dados.uf}<br>
                            <span style="color: var(--text-main); display: block; margin-top: 5px;">
                                <i class="fas fa-box"></i> Padrão: <strong>${valorFrete}</strong> (${prazo})
                            </span>
                        `;
                    }
                })
                .catch(() => {
                    divResultado.style.color = '#e63946';
                    divResultado.innerHTML = '<i class="fas fa-wifi"></i> Erro ao conectar. Tente novamente.';
                });
        });
    }

    // ==========================================
    // LÓGICA DA BARRA DE PESQUISA (API REAL)
    // ==========================================

    // A busca dinânica consulta a API de produtos e exibe sugestões enquanto o usuário digita
    const searchInputs = document.querySelectorAll('.search-bar input');

searchInputs.forEach(searchInput => {

    const searchContainer = searchInput.parentElement;

    const searchResults = document.createElement('div');

    searchResults.className = 'search-results';

    searchContainer.appendChild(searchResults);

    let bancoDeProdutos = [];

    // Buscar produtos da API
    async function carregarProdutos() {

        try {

            const resposta = await fetch('http://localhost:5132/api/Produtos');

            bancoDeProdutos = await resposta.json();

        } catch (erro) {

            console.log('Erro ao carregar produtos da API');
        }
    }

    carregarProdutos();

    searchInput.addEventListener('input', function() {

        const termoBusca = this.value.toLowerCase();

        searchResults.innerHTML = '';

        if (termoBusca.length > 0) {

            const resultadosEncontrados = bancoDeProdutos.filter(produto =>
                produto.nome.toLowerCase().includes(termoBusca)
            );

            if (resultadosEncontrados.length > 0) {

                searchResults.style.display = 'block';

                resultadosEncontrados.forEach(produto => {

                    const link = document.createElement('a');

                    // pode alterar depois para página dinâmica
                    link.href = `produto.html?id=${produto.id}`;;

                    link.textContent = produto.nome;

                    searchResults.appendChild(link);
                });

            } else {

                searchResults.style.display = 'block';

                const semResultado = document.createElement('a');

                semResultado.href = "#";

                semResultado.textContent = "Nenhum produto encontrado";

                semResultado.style.color = "var(--text-muted)";

                semResultado.style.pointerEvents = "none";

                searchResults.appendChild(semResultado);
            }

        } else {

            searchResults.style.display = 'none';
        }
    });

    document.addEventListener('click', function(event) {

        if (!searchContainer.contains(event.target)) {

            searchResults.style.display = 'none';
        }
    });
});
    // ==========================================
    // LÓGICA DE TAMANHO DE FONTE GLOBAL
    // ==========================================
    let tamanhoFonteAtual = localStorage.getItem('voxtech_fontSize') ? parseInt(localStorage.getItem('voxtech_fontSize')) : 100;
    // O segredo está aqui: usar documentElement em vez de body
    document.documentElement.style.fontSize = tamanhoFonteAtual + '%';
    
    const btnAumentar = document.getElementById('btn-aumentar-fonte');
    const btnDiminuir = document.getElementById('btn-diminuir-fonte');
    const btnNormal = document.getElementById('btn-normal-fonte');

    if (btnAumentar && btnDiminuir && btnNormal) {
        btnAumentar.addEventListener('click', () => {
            if (tamanhoFonteAtual < 150) {
                tamanhoFonteAtual += 10;
                document.documentElement.style.fontSize = tamanhoFonteAtual + '%';
                localStorage.setItem('voxtech_fontSize', tamanhoFonteAtual);
            }
        });

        btnDiminuir.addEventListener('click', () => {
            if (tamanhoFonteAtual > 80) {
                tamanhoFonteAtual -= 10;
                document.documentElement.style.fontSize = tamanhoFonteAtual + '%';
                localStorage.setItem('voxtech_fontSize', tamanhoFonteAtual);
            }
        });

        btnNormal.addEventListener('click', () => {
            tamanhoFonteAtual = 100;
            document.documentElement.style.fontSize = tamanhoFonteAtual + '%';
            localStorage.setItem('voxtech_fontSize', tamanhoFonteAtual);
        });
    }

    // ==========================================
    // LÓGICA DO LEITOR DE TELA GLOBAL INTELIGENTE (VOZ)
    // ==========================================
    
    // 1. Injetar Estilos CSS para o Botão Flutuante Dinâmico
    const styles = document.createElement('style');
    styles.innerHTML = `
        #voxtech-global-tts {
            position: fixed; bottom: 20px; left: 20px; z-index: 9999;
            height: 50px; width: 50px; /* Inicia como Círculo */
            background-color: var(--red-primary); color: white;
            border: none; border-radius: 25px;
            cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            display: flex; align-items: center; justify-content: flex-start;
            overflow: hidden; white-space: nowrap;
            transition: width 0.3s ease-in-out, background-color 0.3s, border-radius 0.3s;
            padding: 0; font-family: 'Inter', sans-serif;
        }
        /* Efeito Expandir (Pílula) no Hover ou quando falando */
        #voxtech-global-tts:hover, #voxtech-global-tts.speaking {
            width: 160px;
        }
        /* Estilo do Ícone */
        #voxtech-global-tts .tts-icon {
            font-size: 18px;
            min-width: 50px; /* Garante que o ícone fique centralizado no círculo inicial */
            display: flex; justify-content: center; align-items: center;
        }
        /* Estilo do Texto (Escondido inicialmente) */
        #voxtech-global-tts .tts-text {
            opacity: 0; width: 0;
            font-size: 14px; font-weight: bold;
            transition: opacity 0.2s 0.1s, width 0.3s;
        }
        /* Mostra o texto no Hover ou quando falando */
        #voxtech-global-tts:hover .tts-text, #voxtech-global-tts.speaking .tts-text {
            opacity: 1; width: auto; margin-right: 20px;
        }
        /* Cores no Hover */
        #voxtech-global-tts:hover { background-color: #c32b38; }
        /* Estado: Falando (Muda cor para destacar) */
        #voxtech-global-tts.speaking { background-color: #333; } 
    `;
    document.head.appendChild(styles);

    // 2. Criar Estrutura do Botão
    const btnLeitorGlobal = document.createElement('button');
    btnLeitorGlobal.id = 'voxtech-global-tts';
    // Estrutura interna: Ícone separado do Texto para animação
    btnLeitorGlobal.innerHTML = `
        <span class="tts-icon"><i class="fas fa-volume-up"></i></span>
        <span class="tts-text">Ouvir Página</span>
    `;
    document.body.appendChild(btnLeitorGlobal);

    let falando = false;
    const ttsText = btnLeitorGlobal.querySelector('.tts-text');
    const ttsIcon = btnLeitorGlobal.querySelector('.tts-icon i');

    // 3. Ação de Clique Inteligente
    btnLeitorGlobal.addEventListener('click', () => {
        
        if (falando) {
            // SE ESTIVER FALANDO -> PARAR
            window.speechSynthesis.cancel();
            resetarBotao();
        } else {
            // SE ESTIVER EM SILÊNCIO -> TENTAR LER

            // A. Verificar se há texto selecionado pelo usuário
            const textoSelecionado = window.getSelection().toString().trim();
            let textoParaLer = "";
            let ehSelecao = false;

            if (textoSelecionado) {
                // PRIORIDADE: Ler seleção
                textoParaLer = textoSelecionado;
                ehSelecao = true;
            } else {
                // FALLBACK: Ler conteúdo principal (<main>)
                const conteudoPrincipal = document.querySelector('main');
                if (conteudoPrincipal) {
                    textoParaLer = conteudoPrincipal.innerText;
                }
            }

            // B. Executar a leitura se houver texto
            if (textoParaLer) {
                const mensagem = new SpeechSynthesisUtterance(textoParaLer);
                mensagem.lang = 'pt-BR';
                mensagem.rate = 1.1; // Velocidade

                window.speechSynthesis.speak(mensagem);
                falando = true;

                // C. Feedback Visual do Botão
                btnLeitorGlobal.classList.add('speaking'); // Mantém expandido e muda cor
                ttsIcon.className = 'fas fa-stop'; // Ícone de Parar
                
                // Texto dinâmico
                if (ehSelecao) {
                    ttsText.innerText = 'Parar Seleção';
                } else {
                    ttsText.innerText = 'Parar Página';
                }

                // D. Resetar quando a fala terminar sozinha
                mensagem.onend = () => {
                    resetarBotao();
                };
            }
        }
    });

    // Função auxiliar para voltar o botão ao estado original
    function resetarBotao() {
        falando = false;
        btnLeitorGlobal.classList.remove('speaking');
        ttsIcon.className = 'fas fa-volume-up'; // Ícone original
        ttsText.innerText = 'Ouvir Página'; // Texto original
    }

});

// ==========================================
    // LÓGICA DE ABAS DO CHECKOUT (PAGAMENTO)
    // ==========================================
    const radiosPagamento = document.querySelectorAll('input[name="pagamento"]');
    const formCartao = document.getElementById('form-cartao');
    const formPix = document.getElementById('form-pix');

    if (radiosPagamento.length > 0 && formCartao && formPix) {
        radiosPagamento.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'cartao') {
                    formCartao.style.display = 'block';
                    formPix.style.display = 'none';
                } else if (e.target.value === 'pix') {
                    formCartao.style.display = 'none';
                    formPix.style.display = 'block';
                }
            });
        });
    }
// ==========================================
// CADASTRO
// ==========================================
// Valida senha e envia dados de cadastro para o backend

document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastro-form');

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;

            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem.');
                return;
            }

            const usuario = {
                nome: document.getElementById('nome').value,
                sobrenome: document.getElementById('sobrenome').value,
                cpf: document.getElementById('cpf').value,
                email: document.getElementById('email').value,
                senha: senha
            };

            console.log('Enviando usuário:', usuario);

            try {
                const resposta = await fetch('http://localhost:5132/api/Usuarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(usuario)
                });

                const retorno = await resposta.text();

                console.log('Status:', resposta.status);
                console.log('Resposta:', retorno);

                if (resposta.ok) {
                    alert('Cadastro realizado com sucesso!');
                    window.location.href = 'login.html';
                } else {
                    alert('Erro ao cadastrar: ' + retorno);
                }
            } catch (erro) {
                console.error('Erro no fetch:', erro);
                alert('Erro ao conectar com a API. Verifique se ela está rodando.');
            }
        });
    }
});

// ==========================================
// LOGIN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const btnLogin = document.getElementById('btn-login');

    if (btnLogin) {
        btnLogin.addEventListener('click', async () => {
            const login = {
                email: document.getElementById('email').value,
                senha: document.getElementById('senha').value
            };

            try {
                const resposta = await fetch('http://localhost:5132/api/Usuarios/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(login)
                });

                if (resposta.ok) {
                    const dados = await resposta.json();

                    localStorage.setItem('usuarioId', dados.usuario.id);
                    localStorage.setItem('usuarioNome', dados.usuario.nome);

                    alert('Login realizado!');
                    window.location.href = 'perfil.html';
                } else {
                    alert('Email ou senha inválidos.');
                }
            } catch (erro) {
                alert('Erro ao fazer login. Verifique se a API está rodando.');
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const paginaProduto = window.location.pathname.includes('produto.html');

    if (!paginaProduto) return;

    const parametros = new URLSearchParams(window.location.search);
    const idProduto = parametros.get('id');

    if (!idProduto) return;

    try {
        const resposta = await fetch(`http://localhost:5132/api/Produtos/${idProduto}`);
        const produto = await resposta.json();

        document.getElementById('produto-nome').innerText = produto.nome;
        document.getElementById('produto-descricao').innerText = produto.descricao;
        document.getElementById('produto-preco').innerText = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;

        const imagem = document.getElementById('main-product-image');

        if (produto.imagemUrl) {
            imagem.src = produto.imagemUrl;
            imagem.alt = produto.nome;
        }

    } catch (erro) {
        console.log('Erro ao carregar produto:', erro);
    }
});
// ==========================================
// PRODUTO DINÂMICO
// ==========================================

async function carregarProduto() {

    const params = new URLSearchParams(window.location.search);

    const id = params.get('id');

    if (!id) return;

    try {

        const resposta = await fetch(`http://localhost:5132/api/Produtos/${id}`);

        const produto = await resposta.json();

        // nome
        const nome = document.getElementById('produto-nome');

        if (nome) {
            nome.innerText = produto.nome;
        }

        // descrição
        const descricao = document.getElementById('produto-descricao');

        if (descricao) {
            descricao.innerText = produto.descricao;
        }

        // preço
        const preco = document.getElementById('produto-preco');

        if (preco) {

            preco.innerText =
                produto.preco.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });
        }

        // imagem principal
        const imagemPrincipal = document.getElementById('main-product-image');

        // miniaturas
        const thumbnails = document.querySelectorAll('.thumbnail');

        // imagens locais
        const imagens = {

            1: 'Imagens/SSD1TB.png',
            2: 'Imagens/PlacaMae.png',
            3: 'Imagens/MemoriaRAM.png',
            4: 'Imagens/HeadsetGamer.png',
            5: 'Imagens/MouseGamer.png',
            6: 'Imagens/TecladoMecanico.png',
            7: 'Imagens/KitReparo.png',
            8: 'Imagens/CadeiraGamer.png'
        };

        const imagemProduto = imagens[id];

        if (imagemPrincipal && imagemProduto) {

            imagemPrincipal.src = imagemProduto;
        }

        thumbnails.forEach(thumbnail => {

            thumbnail.src = imagemProduto;
        });

    } catch (erro) {

        console.log('Erro ao carregar produto');
    }
}

carregarProduto();

function filtrarCategoria(categoria) {
    const produtos = document.querySelectorAll('.produto-card');

    produtos.forEach(produto => {
        const nomeProduto = produto.querySelector('h3').innerText;

        const categorias = {
            'SSD 1TB NVMe M.2': 'Hardware',
            'Placa Mãe Gamer B550': 'Hardware',
            'Memória RAM 16GB (2x8)': 'Hardware',
            'Headset Gamer 7.1': 'Áudio',
            'Mouse Gamer Pro 16k DPI': 'Periféricos',
            'Teclado Mecânico Switch Red': 'Periféricos',
            'Kit de Ferramentas Manutenção': 'Periféricos',
            'Cadeira Gamer Ergonômica': 'Games'
        };

        if (categorias[nomeProduto] === categoria) {
            produto.style.display = 'block';
        } else {
            produto.style.display = 'none';
        }
    });
}