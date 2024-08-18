const urlDelete ='http://localhost:3001/delete';
const buttonDelete = document.getElementById('deletarProduto');


buttonDelete.addEventListener('click', async () => {
    
    const nomeProdutoElements = document.getElementsByClassName('nomeProdutoForDelete');
    console.log(nomeProdutoElements[0].value);
    if (nomeProdutoElements[0].value.length > 0) {
        const nomeProduto = nomeProdutoElements[0].value;

        try{
            const response = await axios.delete(urlDelete, {
           data: {nomeProduto: nomeProduto}
        });
        console.log(`Resposta do servidor ${response.data}`);
        Swal.fire({
            title: 'Sucesso',
            text: 'Produto deletado com sucesso',
            icon: 'success'
        });
        nomeProdutoElements[0].value = '';

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

 
} )