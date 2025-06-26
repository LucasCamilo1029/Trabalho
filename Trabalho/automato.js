let afd = {
    nos: ['s0'],
    simbolos: [...Array(26)].map((_, idx) => String.fromCharCode(97 + idx)),
    rotas: {},
    origem: 's0',
    finais: []
};

let historicoPalavras = [];

function construirAfd() {
    const entrada = document.getElementById('inputText').value.toLowerCase().trim();
    const alfabeto = afd.simbolos;

    if (entrada === "") {
        document.getElementById('output').textContent = "Insira uma palavra válida.";
        return;
    }

    historicoPalavras.push(entrada);
    document.getElementById('palavraDigitadaOutput').textContent =
        `Palavras registradas: ${historicoPalavras.join(", ")}`;

    let atual = afd.origem;
    let contadorEstado = afd.nos.length;

    for (let c of entrada) {
        if (!alfabeto.includes(c)) {
            document.getElementById('output').textContent = `Caractere '${c}' fora do alfabeto permitido (a-z).`;
            return;
        }

        let destino;
        if (afd.rotas[atual] && afd.rotas[atual][c]) {
            destino = afd.rotas[atual][c];
        } else {
            destino = `s${contadorEstado}`;
            afd.nos.push(destino);
            contadorEstado++;

            if (!afd.rotas[atual]) afd.rotas[atual] = {};
            afd.rotas[atual][c] = destino;
        }

        atual = destino;
    }

    if (!afd.finais.includes(atual)) {
        afd.finais.push(atual);
    }

    desenharTabela();
    document.getElementById('inputText').value = "";
}

function desenharTabela() {
    const letras = afd.simbolos;

    let html = `<table class="table table-bordered">
                    <thead class="table-dark">
                        <tr><th>Estados</th>`;
    letras.forEach(letra => {
        html += `<th>${letra}</th>`;
    });
    html += `</tr></thead><tbody>`;

    afd.nos.forEach(estado => {
        let label = estado;
        if (estado === afd.origem) label = `→${estado}`;
        if (afd.finais.includes(estado)) label += "*";

        html += `<tr><td>${label}</td>`;
        letras.forEach(letra => {
            const destino = afd.rotas[estado]?.[letra] || '-';
            html += `<td id="${estado}-${letra}">${destino}</td>`;
        });
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    document.getElementById('tabelaAutomato').innerHTML = html;
}

function testarEntrada() {
    const palavra = document.getElementById('palavraVerificar').value.toLowerCase().trim();
    document.getElementById('palavraDigitadaOutput').textContent = `Testando palavra: "${palavra}"`;

    let atual = afd.origem;
    let aceita = true;

    limparDestaques();

    for (let c of palavra) {
        if (!afd.simbolos.includes(c)) {
            document.getElementById('verificacaoOutput').textContent = `Símbolo '${c}' não está no alfabeto permitido.`;
            return;
        }

        const destino = afd.rotas[atual]?.[c];
        const celula = document.getElementById(`${atual}-${c}`);

        if (celula) {
            if (destino && destino !== '-') {
                celula.classList.add('highlight-valid');
                atual = destino;
            } else {
                celula.classList.add('highlight-invalid');
                aceita = false;
                break;
            }
        } else {
            aceita = false;
            break;
        }
    }

    if (aceita && afd.finais.includes(atual)) {
        document.getElementById('verificacaoOutput').textContent = "Palavra aceita!";
    } else if (aceita) {
        document.getElementById('verificacaoOutput').textContent = "Palavra rejeitada: não termina em estado final.";
    } else {
        document.getElementById('verificacaoOutput').textContent = "Palavra rejeitada: transição inválida.";
    }
}

function limparDestaques() {
    afd.nos.forEach(estado => {
        afd.simbolos.forEach(letra => {
            const celula = document.getElementById(`${estado}-${letra}`);
            if (celula) {
                celula.classList.remove('highlight-valid', 'highlight-invalid');
            }
        });
    });
}

function mostrarCaminho() {
    const palavra = document.getElementById('palavraVerificar').value.toLowerCase().trim();
    let atual = afd.origem;
    let valida = true;

    limparDestaques();

    for (let c of palavra) {
        if (!afd.simbolos.includes(c)) {
            valida = false;
            break;
        }

        const destino = afd.rotas[atual]?.[c];
        const celula = document.getElementById(`${atual}-${c}`);

        if (celula) {
            if (destino && destino !== '-') {
                celula.classList.add('highlight-valid');
                atual = destino;
            } else {
                celula.classList.add('highlight-invalid');
                valida = false;
                break;
            }
        } else {
            valida = false;
            break;
        }
    }

    if (palavra.length === 0) {
        document.getElementById('verificacaoOutput').textContent = "";
        return;
    }

    if (valida && afd.finais.includes(atual)) {
        document.getElementById('verificacaoOutput').textContent = "Palavra aceita!";
    } else if (valida) {
        document.getElementById('verificacaoOutput').textContent = "Palavra rejeitada: não finaliza corretamente.";
    } else {
        document.getElementById('verificacaoOutput').textContent = "Palavra rejeitada: caminho inválido.";
    }
}