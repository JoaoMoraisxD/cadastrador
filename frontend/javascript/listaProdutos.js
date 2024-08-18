const listButton = document.getElementById('listButton');
const url = 'http://localhost:3001/listaProdutos';


listButton.addEventListener('click', async () => {

    try{
        const response = await axios.get(url);
        const data = response.data;
        console.log(data.data)
        exibirDados(data.data);

        if(data.data == 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Sua lista está vazia.'
            });
        }else {
            Swal.fire({
                title: 'Sucesso',
                text: 'Produtos buscados com sucesso',
                icon: 'success'
            });
        }
        
    }catch(error){
        console.error(`Erro ao enviar dados: ${error}`)
    }
});

function exibirDados (dados) {
    const produtos = document.getElementsByClassName('produtos')[0];

    produtos.innerHTML = '';

    dados.forEach(item => {
        const produtoDiv = document.createElement('div');
        produtoDiv.className = 'produto-item';

        const nomeElemento = document.createElement('h3');
        nomeElemento.textContent = `Nome: ${item.nomeproduto}`;
        produtoDiv.appendChild(nomeElemento);

        const valorElemento = document.createElement('p');
        valorElemento.textContent = `Valor: ${item.valor}`;
        produtoDiv.appendChild(valorElemento);

        produtos.appendChild(produtoDiv)
    });
}