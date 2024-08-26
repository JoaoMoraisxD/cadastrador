const buttonInsert = document.getElementById('inserirProduto')
const url = 'http://localhost:3001/data'

buttonInsert.addEventListener('click', async () => {
    const token = localStorage.getItem('authToken');
    const nomeProdutoElements = document.getElementsByClassName("nomeProduto");
    const valorProdutoElements = document.getElementsByClassName("valorProduto");
    if (nomeProdutoElements[0].value.length > 0 && valorProdutoElements[0].value.length > 0) {
        const nomeProduto = nomeProdutoElements[0].value;
        const valorProduto = parseFloat(valorProdutoElements[0].value.replace(',', '.'));

        try{
            const response = await axios.post(url, 
                {
                    nomeProduto: nomeProduto,
                    valor: valorProduto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                }, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
        console.log(`Resposta do servidor ${response.data}`);
        Swal.fire({
            title: 'Sucesso',
            text: 'Produto Inserido com Sucesso',
            icon: 'success'
        });
        nomeProdutoElements[0].value = '';
        valorProdutoElements[0].value = '';
    } catch (error){
        console.error(`Erro ao enviar dados: ${error}`);
        alert('Ocorreu um erro ao enviar os dados.');
    }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algum campo não foi preenchido. \n Tente Novamente'
        });
    }

 
} );